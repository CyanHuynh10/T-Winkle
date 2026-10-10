SET NOCOUNT ON;
SELECT 'Untrusted/disabled FK',COUNT(*) FROM sys.foreign_keys WHERE is_disabled=1 OR is_not_trusted=1;
SELECT 'Untrusted/disabled CHECK',COUNT(*) FROM sys.check_constraints WHERE is_disabled=1 OR is_not_trusted=1;
IF EXISTS(SELECT 1 FROM sys.foreign_keys WHERE is_disabled=1 OR is_not_trusted=1)
 OR EXISTS(SELECT 1 FROM sys.check_constraints WHERE is_disabled=1 OR is_not_trusted=1)
 THROW 51510,'Constraints disabled or untrusted',1;
SELECT 'Manager tables',COUNT(*) FROM sys.tables WHERE name IN('STORE_STATUS_HISTORY','CATALOG_CHANGE_REQUESTS','INVENTORY_RESTOCK_REQUESTS','SUPPORT_CONVERSATION_READ_STATE','ORDER_STORE_FULFILLMENTS');
SELECT 'reorder_level',COUNT(*) FROM sys.columns WHERE object_id=OBJECT_ID('dbo.STORE_INVENTORY') AND name='reorder_level';
CREATE TABLE #Orphans(constraint_name SYSNAME,orphan_count BIGINT);
DECLARE @integrity_fk SYSNAME,@integrity_child SYSNAME,@integrity_parent SYSNAME,@integrity_join NVARCHAR(MAX),@integrity_nonnull NVARCHAR(MAX),@integrity_q NVARCHAR(MAX);
DECLARE refs CURSOR LOCAL FAST_FORWARD FOR
SELECT f.name,OBJECT_NAME(f.parent_object_id),OBJECT_NAME(f.referenced_object_id),
STRING_AGG(CONVERT(NVARCHAR(MAX),N'c.'+QUOTENAME(pc.name)+N'=p.'+QUOTENAME(rc.name)),N' AND '),
STRING_AGG(CONVERT(NVARCHAR(MAX),N'c.'+QUOTENAME(pc.name)+N' IS NOT NULL'),N' AND ')
FROM sys.foreign_keys f JOIN sys.foreign_key_columns k ON k.constraint_object_id=f.object_id
JOIN sys.columns pc ON pc.object_id=k.parent_object_id AND pc.column_id=k.parent_column_id
JOIN sys.columns rc ON rc.object_id=k.referenced_object_id AND rc.column_id=k.referenced_column_id
GROUP BY f.name,f.parent_object_id,f.referenced_object_id;
OPEN refs;FETCH NEXT FROM refs INTO @integrity_fk,@integrity_child,@integrity_parent,@integrity_join,@integrity_nonnull;
WHILE @@FETCH_STATUS=0 BEGIN
SET @integrity_q=N'INSERT #Orphans SELECT @integrity_f,COUNT_BIG(*) FROM dbo.'+QUOTENAME(@integrity_child)+N' c WHERE '+@integrity_nonnull+N' AND NOT EXISTS(SELECT 1 FROM dbo.'+QUOTENAME(@integrity_parent)+N' p WHERE '+@integrity_join+N');';
EXEC sp_executesql @integrity_q,N'@integrity_f SYSNAME',@integrity_fk;
FETCH NEXT FROM refs INTO @integrity_fk,@integrity_child,@integrity_parent,@integrity_join,@integrity_nonnull;END;CLOSE refs;DEALLOCATE refs;
SELECT 'FK checks',COUNT(*),'Total orphans',SUM(orphan_count) FROM #Orphans;
IF EXISTS(SELECT 1 FROM #Orphans WHERE orphan_count<>0) THROW 51210,'Orphan rows detected.',1;
CREATE TABLE #CheckViolations([Table] nvarchar(512),[Constraint] nvarchar(512),[Where] nvarchar(max));
INSERT #CheckViolations EXEC('DBCC CHECKCONSTRAINTS WITH ALL_CONSTRAINTS, NO_INFOMSGS');
SELECT 'CHECK violations',COUNT(*) FROM #CheckViolations;
IF EXISTS(SELECT 1 FROM #CheckViolations) THROW 51511,'CHECK constraint violation',1;
CREATE TABLE #Duplicates(index_name SYSNAME,duplicate_groups BIGINT);
DECLARE @integrity_tn SYSNAME,@integrity_idx SYSNAME,@integrity_cols NVARCHAR(MAX),@integrity_filter NVARCHAR(MAX);
DECLARE uq CURSOR LOCAL FAST_FORWARD FOR
SELECT t.name,i.name,STRING_AGG(CONVERT(NVARCHAR(MAX),QUOTENAME(c.name)),N',') WITHIN GROUP(ORDER BY ic.key_ordinal),COALESCE(i.filter_definition,N'1=1')
FROM sys.tables t JOIN sys.indexes i ON i.object_id=t.object_id AND i.is_unique=1 JOIN sys.index_columns ic ON ic.object_id=i.object_id AND ic.index_id=i.index_id AND ic.key_ordinal>0 JOIN sys.columns c ON c.object_id=ic.object_id AND c.column_id=ic.column_id GROUP BY t.name,i.name,i.filter_definition;
OPEN uq;FETCH NEXT FROM uq INTO @integrity_tn,@integrity_idx,@integrity_cols,@integrity_filter;
WHILE @@FETCH_STATUS=0 BEGIN
SET @integrity_q=N'INSERT #Duplicates SELECT @integrity_i,COUNT_BIG(*) FROM(SELECT '+@integrity_cols+N' FROM dbo.'+QUOTENAME(@integrity_tn)+N' WHERE '+@integrity_filter+N' GROUP BY '+@integrity_cols+N' HAVING COUNT_BIG(*)>1)d;';
EXEC sp_executesql @integrity_q,N'@integrity_i SYSNAME',@integrity_idx;
FETCH NEXT FROM uq INTO @integrity_tn,@integrity_idx,@integrity_cols,@integrity_filter;END;CLOSE uq;DEALLOCATE uq;
SELECT 'Unique index checks',COUNT(*),'Duplicate groups',SUM(duplicate_groups) FROM #Duplicates;
IF EXISTS(SELECT 1 FROM #Duplicates WHERE duplicate_groups<>0) THROW 51211,'Duplicate corruption detected.',1;
