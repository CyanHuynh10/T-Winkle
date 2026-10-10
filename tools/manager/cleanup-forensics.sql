SET NOCOUNT ON;
-- Read-only full table inventory, actual keys, FK graph, and non-secret candidate roots.
DECLARE @q NVARCHAR(MAX)=N'';
SELECT @q+=N'SELECT '+QUOTENAME(s.name+'.'+t.name,'''')+N' AS table_name,COUNT_BIG(*) AS total_rows FROM '+QUOTENAME(s.name)+'.'+QUOTENAME(t.name)+N';'+CHAR(10)
FROM sys.tables t JOIN sys.schemas s ON s.schema_id=t.schema_id ORDER BY t.name;
EXEC sp_executesql @q;
SELECT t.name table_name,c.name column_name,ty.name data_type,c.max_length,c.is_nullable FROM sys.tables t JOIN sys.columns c ON c.object_id=t.object_id JOIN sys.types ty ON ty.user_type_id=c.user_type_id ORDER BY t.name,c.column_id;
SELECT t.name table_name,c.name key_column,i.name key_name,i.is_primary_key,i.is_unique FROM sys.tables t JOIN sys.indexes i ON i.object_id=t.object_id JOIN sys.index_columns ic ON ic.object_id=i.object_id AND ic.index_id=i.index_id JOIN sys.columns c ON c.object_id=ic.object_id AND c.column_id=ic.column_id WHERE i.is_primary_key=1 OR i.is_unique=1 ORDER BY t.name,i.name,ic.key_ordinal;
SELECT f.name,OBJECT_NAME(f.parent_object_id) child_table,pc.name child_column,OBJECT_NAME(f.referenced_object_id) parent_table,rc.name parent_column,f.delete_referential_action_desc,f.is_disabled,f.is_not_trusted FROM sys.foreign_keys f JOIN sys.foreign_key_columns k ON k.constraint_object_id=f.object_id JOIN sys.columns pc ON pc.object_id=k.parent_object_id AND pc.column_id=k.parent_column_id JOIN sys.columns rc ON rc.object_id=k.referenced_object_id AND rc.column_id=k.referenced_column_id ORDER BY parent_table,child_table,f.name,k.constraint_column_id;
SELECT email,username,full_name,is_enabled FROM USERS ORDER BY email;
SELECT store_id,slug,name,manager_email,status FROM STORES ORDER BY store_id;
SELECT id,slug,name FROM BRANDS ORDER BY id;
SELECT id,slug,name FROM CATEGORIES ORDER BY id;
SELECT id,slug,name FROM PRODUCTS ORDER BY id;
SELECT id,order_code,user_email,status FROM ORDERS ORDER BY id;
SELECT id,name FROM PROMOTIONS ORDER BY id;
SELECT id,code FROM COUPONS ORDER BY id;
SELECT id,name,source_reference FROM SIZE_CHARTS ORDER BY id;
SELECT id,user_email,store_id,source,status FROM SUPPORT_CONVERSATIONS ORDER BY id;
SELECT SERVERPROPERTY('InstanceDefaultBackupPath') AS default_backup_path;
