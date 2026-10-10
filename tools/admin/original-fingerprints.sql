SET NOCOUNT ON;
CREATE TABLE #Scopes(table_name SYSNAME,predicate NVARCHAR(MAX));
INSERT #Scopes SELECT name,N'1=0' FROM sys.tables;
CREATE TABLE #Preserved(table_name SYSNAME PRIMARY KEY,original_count BIGINT,original_hash VARCHAR(64));
DECLARE @snapTable SYSNAME,@snapPredicate NVARCHAR(MAX),@snapOrder NVARCHAR(MAX),@snapSql NVARCHAR(MAX);
DECLARE snap CURSOR LOCAL FAST_FORWARD FOR SELECT table_name,predicate FROM #Scopes ORDER BY table_name;
OPEN snap; FETCH NEXT FROM snap INTO @snapTable,@snapPredicate;
WHILE @@FETCH_STATUS=0 BEGIN
 SELECT @snapOrder=STRING_AGG(CONVERT(NVARCHAR(MAX),N't.'+QUOTENAME(c.name)),N',') WITHIN GROUP(ORDER BY ic.key_ordinal)
 FROM sys.indexes i JOIN sys.index_columns ic ON ic.object_id=i.object_id AND ic.index_id=i.index_id JOIN sys.columns c ON c.object_id=ic.object_id AND c.column_id=ic.column_id
 WHERE i.object_id=OBJECT_ID('dbo.'+@snapTable) AND i.is_primary_key=1;
 IF @snapOrder IS NULL SELECT @snapOrder=STRING_AGG(CONVERT(NVARCHAR(MAX),N't.'+QUOTENAME(name)),N',') WITHIN GROUP(ORDER BY column_id) FROM sys.columns WHERE object_id=OBJECT_ID('dbo.'+@snapTable);
 SET @snapSql=N'INSERT #Preserved SELECT @t,(SELECT COUNT_BIG(*) FROM dbo.'+QUOTENAME(@snapTable)+N' t  WHERE CASE WHEN ('+@snapPredicate+N') THEN 1 ELSE 0 END=0),CONVERT(VARCHAR(64),HASHBYTES(''SHA2_256'',(SELECT t.* FROM dbo.'+QUOTENAME(@snapTable)+N' t WHERE CASE WHEN ('+@snapPredicate+N') THEN 1 ELSE 0 END=0 ORDER BY '+@snapOrder+N' FOR JSON PATH,INCLUDE_NULL_VALUES)),2);';
 EXEC sp_executesql @snapSql,N'@t SYSNAME',@snapTable;
 FETCH NEXT FROM snap INTO @snapTable,@snapPredicate;
END; CLOSE snap; DEALLOCATE snap;
SELECT * FROM #Preserved ORDER BY table_name;
