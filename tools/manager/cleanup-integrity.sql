SET NOCOUNT ON;
SELECT 'Untrusted/disabled FK',COUNT(*) FROM sys.foreign_keys WHERE is_disabled=1 OR is_not_trusted=1;
SELECT 'Untrusted/disabled CHECK',COUNT(*) FROM sys.check_constraints WHERE is_disabled=1 OR is_not_trusted=1;
SELECT 'Manager tables',COUNT(*) FROM sys.tables WHERE name IN('STORE_STATUS_HISTORY','CATALOG_CHANGE_REQUESTS','INVENTORY_RESTOCK_REQUESTS','SUPPORT_CONVERSATION_READ_STATE','ORDER_STORE_FULFILLMENTS');
SELECT 'reorder_level',COUNT(*) FROM sys.columns WHERE object_id=OBJECT_ID('dbo.STORE_INVENTORY') AND name='reorder_level';
CREATE TABLE #Orphans(constraint_name SYSNAME,orphan_count BIGINT);
DECLARE @fk SYSNAME,@child SYSNAME,@parent SYSNAME,@join NVARCHAR(MAX),@nonnull NVARCHAR(MAX),@q NVARCHAR(MAX);
DECLARE refs CURSOR LOCAL FAST_FORWARD FOR
SELECT f.name,OBJECT_NAME(f.parent_object_id),OBJECT_NAME(f.referenced_object_id),
STRING_AGG(CONVERT(NVARCHAR(MAX),N'c.'+QUOTENAME(pc.name)+N'=p.'+QUOTENAME(rc.name)),N' AND '),
STRING_AGG(CONVERT(NVARCHAR(MAX),N'c.'+QUOTENAME(pc.name)+N' IS NOT NULL'),N' AND ')
FROM sys.foreign_keys f JOIN sys.foreign_key_columns k ON k.constraint_object_id=f.object_id
JOIN sys.columns pc ON pc.object_id=k.parent_object_id AND pc.column_id=k.parent_column_id
JOIN sys.columns rc ON rc.object_id=k.referenced_object_id AND rc.column_id=k.referenced_column_id
GROUP BY f.name,f.parent_object_id,f.referenced_object_id;
OPEN refs;FETCH NEXT FROM refs INTO @fk,@child,@parent,@join,@nonnull;
WHILE @@FETCH_STATUS=0 BEGIN
SET @q=N'INSERT #Orphans SELECT @f,COUNT_BIG(*) FROM dbo.'+QUOTENAME(@child)+N' c WHERE '+@nonnull+N' AND NOT EXISTS(SELECT 1 FROM dbo.'+QUOTENAME(@parent)+N' p WHERE '+@join+N');';
EXEC sp_executesql @q,N'@f SYSNAME',@fk;
FETCH NEXT FROM refs INTO @fk,@child,@parent,@join,@nonnull;END;CLOSE refs;DEALLOCATE refs;
SELECT 'FK checks',COUNT(*),'Total orphans',SUM(orphan_count) FROM #Orphans;
IF EXISTS(SELECT 1 FROM #Orphans WHERE orphan_count<>0) THROW 51210,'Orphan rows detected.',1;
DBCC CHECKCONSTRAINTS WITH ALL_CONSTRAINTS;
CREATE TABLE #Duplicates(index_name SYSNAME,duplicate_groups BIGINT);
DECLARE @tn SYSNAME,@idx SYSNAME,@cols NVARCHAR(MAX),@filter NVARCHAR(MAX);
DECLARE uq CURSOR LOCAL FAST_FORWARD FOR
SELECT t.name,i.name,STRING_AGG(CONVERT(NVARCHAR(MAX),QUOTENAME(c.name)),N',') WITHIN GROUP(ORDER BY ic.key_ordinal),COALESCE(i.filter_definition,N'1=1')
FROM sys.tables t JOIN sys.indexes i ON i.object_id=t.object_id AND i.is_unique=1 JOIN sys.index_columns ic ON ic.object_id=i.object_id AND ic.index_id=i.index_id AND ic.key_ordinal>0 JOIN sys.columns c ON c.object_id=ic.object_id AND c.column_id=ic.column_id GROUP BY t.name,i.name,i.filter_definition;
OPEN uq;FETCH NEXT FROM uq INTO @tn,@idx,@cols,@filter;
WHILE @@FETCH_STATUS=0 BEGIN
SET @q=N'INSERT #Duplicates SELECT @i,COUNT_BIG(*) FROM(SELECT '+@cols+N' FROM dbo.'+QUOTENAME(@tn)+N' WHERE '+@filter+N' GROUP BY '+@cols+N' HAVING COUNT_BIG(*)>1)d;';
EXEC sp_executesql @q,N'@i SYSNAME',@idx;
FETCH NEXT FROM uq INTO @tn,@idx,@cols,@filter;END;CLOSE uq;DEALLOCATE uq;
SELECT 'Unique index checks',COUNT(*),'Duplicate groups',SUM(duplicate_groups) FROM #Duplicates;
IF EXISTS(SELECT 1 FROM #Duplicates WHERE duplicate_groups<>0) THROW 51211,'Duplicate corruption detected.',1;
