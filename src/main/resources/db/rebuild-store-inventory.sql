-- Development-only rebuild, explicitly requested for T_Winkle. No order/cart snapshots are rewritten.
SET NOCOUNT ON;
SET XACT_ABORT ON;
IF DB_NAME() <> 'T_Winkle' THROW 51000, 'Expected T_Winkle development database.', 1;
IF NOT EXISTS(SELECT 1 FROM dbo.STORES) OR NOT EXISTS(SELECT 1 FROM dbo.PRODUCT_VARIANTS WHERE status='ACTIVE')
    THROW 51001, 'Stores and active variants are required.', 1;
BEGIN TRY
 BEGIN TRANSACTION;
 -- Hold the inventory lock through backup/replacement, preventing checkout interleaving.
 DECLARE @locked bigint = (SELECT COUNT_BIG(*) FROM dbo.STORE_INVENTORY WITH(TABLOCKX,HOLDLOCK));
 DECLARE @backup sysname = 'STORE_INVENTORY_BACKUP_' + CONVERT(char(8),GETDATE(),112) + '_' + REPLACE(CONVERT(char(12),GETDATE(),114),':','');
 IF OBJECT_ID('dbo.'+@backup) IS NOT NULL THROW 51002, 'Backup name collision; retry.', 1;
 DECLARE @backupSql nvarchar(max) = N'SELECT * INTO dbo.'+QUOTENAME(@backup)+N' FROM dbo.STORE_INVENTORY;';
 EXEC sys.sp_executesql @backupSql;
 CREATE TABLE #target(store_id int NOT NULL,variant_id bigint NOT NULL,quantity int NOT NULL,PRIMARY KEY(store_id,variant_id));
 ;WITH stores AS (
   SELECT store_id,ROW_NUMBER() OVER(ORDER BY store_id)-1 idx,COUNT(*) OVER() total FROM dbo.STORES
 ), variants AS (
   SELECT v.id,ROW_NUMBER() OVER(PARTITION BY v.product_id ORDER BY v.id)-1 idx,v.product_id
   FROM dbo.PRODUCT_VARIANTS v JOIN dbo.PRODUCTS p ON p.id=v.product_id
   WHERE v.status='ACTIVE' AND p.status='ACTIVE'
 )
 INSERT #target
 SELECT s.store_id,v.id,CONVERT(int,(v.id*7+s.store_id*11)%26)
 FROM stores s CROSS JOIN variants v
 WHERE (v.idx+s.idx+v.product_id)%s.total < CASE WHEN s.total=1 THEN 1 ELSE (s.total+1)/2 END;
 -- Preserve every active cart pair, including inactive product/variant rows, without changing the cart.
 ;WITH pairs AS (
   SELECT ci.store_id,ci.variant_id,MAX(ci.quantity) required
   FROM dbo.CART_ITEMS ci JOIN dbo.CARTS c ON c.id=ci.cart_id
   WHERE c.status='ACTIVE' GROUP BY ci.store_id,ci.variant_id
 )
 MERGE #target AS t USING pairs AS c ON t.store_id=c.store_id AND t.variant_id=c.variant_id
 WHEN MATCHED AND t.quantity<c.required THEN UPDATE SET quantity=c.required
 WHEN NOT MATCHED THEN INSERT(store_id,variant_id,quantity) VALUES(c.store_id,c.variant_id,c.required);
 IF EXISTS(SELECT 1 FROM dbo.PRODUCT_VARIANTS v JOIN dbo.PRODUCTS p ON p.id=v.product_id WHERE v.status='ACTIVE' AND p.status='ACTIVE' AND NOT EXISTS(SELECT 1 FROM #target t WHERE t.variant_id=v.id))
   THROW 51003, 'Uncovered active variant.', 1;
 DELETE FROM dbo.STORE_INVENTORY;
 INSERT dbo.STORE_INVENTORY(store_id,variant_id,quantity,updated_at)
 SELECT store_id,variant_id,quantity,SYSDATETIME() FROM #target;
 IF EXISTS(SELECT 1 FROM dbo.CART_ITEMS ci JOIN dbo.CARTS c ON c.id=ci.cart_id WHERE c.status='ACTIVE' AND NOT EXISTS(SELECT 1 FROM dbo.STORE_INVENTORY si WHERE si.store_id=ci.store_id AND si.variant_id=ci.variant_id AND si.quantity>=ci.quantity))
   THROW 51004, 'Active cart compatibility failed.', 1;
 SELECT @backup backup_table,@locked before_rows,COUNT(*) after_rows FROM dbo.STORE_INVENTORY;
 SELECT store_id,COUNT(*) inventory_rows,COUNT(DISTINCT v.product_id) products,
   SUM(CASE WHEN quantity=0 THEN 1 ELSE 0 END) zero_stock,
   SUM(CASE WHEN quantity BETWEEN 1 AND 5 THEN 1 ELSE 0 END) low_stock,
   SUM(CASE WHEN quantity>5 THEN 1 ELSE 0 END) available
 FROM dbo.STORE_INVENTORY si JOIN dbo.PRODUCT_VARIANTS v ON v.id=si.variant_id GROUP BY store_id ORDER BY store_id;
 COMMIT;
END TRY
BEGIN CATCH
 IF @@TRANCOUNT>0 ROLLBACK;
 THROW;
END CATCH;
