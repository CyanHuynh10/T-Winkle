SET NOCOUNT ON;
SELECT t.name AS table_name,c.name AS column_name,ty.name AS data_type,c.max_length,c.is_nullable FROM sys.tables t JOIN sys.columns c ON c.object_id=t.object_id JOIN sys.types ty ON ty.user_type_id=c.user_type_id ORDER BY t.name,c.column_id;
SELECT name,definition FROM sys.check_constraints;
SELECT fk.name,OBJECT_NAME(fk.parent_object_id) AS child,OBJECT_NAME(fk.referenced_object_id) AS parent,fk.delete_referential_action_desc FROM sys.foreign_keys fk;
SELECT name FROM ROLES;
