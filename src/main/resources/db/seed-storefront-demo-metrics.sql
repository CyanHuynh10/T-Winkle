-- Idempotent, development-only, recognizable DEMO-SI records. Existing real orders are untouched.
SET NOCOUNT ON;
SET XACT_ABORT ON;
IF DB_NAME() <> 'T_Winkle' THROW 51100, 'Expected T_Winkle development database.', 1;
BEGIN TRY
 BEGIN TRANSACTION;
 DECLARE @batch int=0;
 WHILE @batch<4
 BEGIN
  DECLARE @email varchar(100)=CONCAT('demo-si-',@batch,'@twinkle.test');
  IF NOT EXISTS(SELECT 1 FROM dbo.USERS WHERE email=@email)
    INSERT dbo.USERS(email,username,full_name,phone,password_hash,is_enabled)
    SELECT @email,CONCAT('DEMO-SI-',@batch),CONCAT(N'Khách demo ',@batch+1),'0900000000',password_hash,0 FROM dbo.USERS WHERE email='user3@twinkle.com';
  IF NOT EXISTS(SELECT 1 FROM dbo.USERS WHERE email=@email) THROW 51101, 'Missing development password fixture.', 1;
  SET @batch+=1;
 END;
 ;WITH matrix AS (
  SELECT v.id variant_id,v.product_id,v.size,v.color,p.name,p.base_price+v.price_adjustment unit_price,
    ROW_NUMBER() OVER(PARTITION BY v.product_id ORDER BY v.id)-1 rn
  FROM dbo.PRODUCT_VARIANTS v JOIN dbo.PRODUCTS p ON p.id=v.product_id WHERE v.status='ACTIVE' AND p.status='ACTIVE'
 )
 SELECT m.*,CONVERT(int,m.rn%4) batch,
   CONVERT(int,1+(m.product_id*3+m.variant_id*7)%12) quantity,
   (SELECT MIN(store_id) FROM dbo.STORE_INVENTORY si WHERE si.variant_id=m.variant_id) store_id
 INTO #items FROM matrix m;
 IF EXISTS(SELECT 1 FROM #items WHERE store_id IS NULL) THROW 51102, 'Rebuild inventory first.', 1;
 SELECT DISTINCT product_id,batch,CONCAT('DEMO-SI-',product_id,'-',batch) code,
   DATEADD(day,-(10+(product_id*7+batch*3)%110),CAST('2026-10-04T10:00:00' AS datetime2)) placed
 INTO #orders FROM #items;
 CREATE TABLE #newOrders(id bigint PRIMARY KEY,order_code varchar(50));
 INSERT dbo.ORDERS(order_code,user_email,status,recipient_name,recipient_phone,shipping_address_line,shipping_ward,shipping_district,shipping_city,payment_method,subtotal,product_discount,shipping_fee,coupon_discount,total,created_at,updated_at)
 OUTPUT inserted.id,inserted.order_code INTO #newOrders
 SELECT d.code,CONCAT('demo-si-',d.batch,'@twinkle.test'),N'Đã giao',N'Khách demo','0900000000',N'Địa chỉ demo',N'Phường 1',N'Quận 1',N'TP. Hồ Chí Minh','COD',0,0,30000,0,30000,d.placed,DATEADD(day,3,d.placed)
 FROM #orders d WHERE NOT EXISTS(SELECT 1 FROM dbo.ORDERS o WITH(UPDLOCK,HOLDLOCK) WHERE o.order_code=d.code);
 INSERT dbo.ORDER_ITEMS(order_id,product_id,store_id,variant_id,product_name,variant_name,image_url,quantity,unit_price,discount_amount,line_total)
 SELECT o.id,i.product_id,i.store_id,i.variant_id,i.name,CONCAT(i.size,N' - ',i.color),
   (SELECT TOP(1) image_url FROM dbo.PRODUCT_IMAGES WHERE product_id=i.product_id ORDER BY is_primary DESC,sort_order,id),
   i.quantity,i.unit_price,0,i.quantity*i.unit_price
 FROM #items i JOIN #newOrders o ON o.order_code=CONCAT('DEMO-SI-',i.product_id,'-',i.batch);
 UPDATE o SET subtotal=t.subtotal,total=t.subtotal+o.shipping_fee
 FROM dbo.ORDERS o JOIN #newOrders n ON n.id=o.id
 CROSS APPLY(SELECT SUM(line_total) subtotal FROM dbo.ORDER_ITEMS WHERE order_id=o.id)t;
 INSERT dbo.PAYMENTS(order_id,method,status,transaction_ref,amount,paid_at,created_at)
 SELECT o.id,'COD','PAID',NULL,o.total,DATEADD(day,3,o.created_at),o.created_at FROM dbo.ORDERS o JOIN #newOrders n ON n.id=o.id;
 INSERT dbo.ORDER_STATUS_HISTORY(order_id,status,note,created_at)
 SELECT o.id,s.status,N'DEMO-SI: dữ liệu giao hàng mẫu',DATEADD(day,s.offset_days,o.created_at)
 FROM dbo.ORDERS o JOIN #newOrders n ON n.id=o.id
 CROSS JOIN(VALUES(N'Chờ xác nhận',0),(N'Đã xác nhận',1),(N'Đã giao',3))s(status,offset_days);
 INSERT dbo.REVIEWS(order_id,order_item_id,user_email,product_id,rating,comment,status,created_at,updated_at)
 SELECT o.id,i.id,o.user_email,i.product_id,
  CASE WHEN (i.product_id*7+CONVERT(int,RIGHT(o.order_code,1))*11)%20=0 THEN 1
       WHEN (i.product_id*7+CONVERT(int,RIGHT(o.order_code,1))*11)%20=1 THEN 2
       WHEN (i.product_id*7+CONVERT(int,RIGHT(o.order_code,1))*11)%20<4 THEN 3
       WHEN (i.product_id*7+CONVERT(int,RIGHT(o.order_code,1))*11)%20<11 THEN 4 ELSE 5 END,
  N'DEMO-SI: đánh giá mẫu từ đơn hàng đã giao','APPROVED',DATEADD(day,4,o.created_at),DATEADD(day,4,o.created_at)
 FROM dbo.ORDERS o JOIN dbo.ORDER_ITEMS i ON i.id=(SELECT MIN(id) FROM dbo.ORDER_ITEMS WHERE order_id=o.id)
 WHERE o.order_code LIKE 'DEMO-SI-%' AND NOT EXISTS(SELECT 1 FROM dbo.REVIEWS r WITH(UPDLOCK,HOLDLOCK) WHERE r.user_email=o.user_email AND r.product_id=i.product_id);
 SELECT 'DEMO-SI' prefix,COUNT(*) orders FROM dbo.ORDERS WHERE order_code LIKE 'DEMO-SI-%';
 SELECT COUNT(*) reviews FROM dbo.REVIEWS WHERE comment LIKE N'DEMO-SI:%';
 COMMIT;
END TRY
BEGIN CATCH
 IF @@TRANCOUNT>0 ROLLBACK;
 THROW;
END CATCH;
