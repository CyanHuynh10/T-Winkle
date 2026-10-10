SET NOCOUNT ON;
CREATE TABLE #Expected(email varchar(100) COLLATE DATABASE_DEFAULT PRIMARY KEY,role_name varchar(30),slug varchar(100));
INSERT #Expected VALUES
('district1@twinkle.com','ROLE_MANAGER','q1'),('district3@twinkle.com','ROLE_MANAGER','q3'),
('district5@twinkle.com','ROLE_MANAGER','q5'),('district7@twinkle.com','ROLE_MANAGER','q7'),
('thuduc@twinkle.com','ROLE_MANAGER','thu-duc'),('binhthanh@twinkle.com','ROLE_MANAGER','binh-thanh'),
('admin@twinkle.com','ROLE_ADMIN',NULL),('support1@twinkle.com','ROLE_SUPPORT',NULL),
('24110064@student.hcmute.edu.vn','ROLE_USER',NULL);
IF (SELECT COUNT(*) FROM USERS)<>9 OR EXISTS(SELECT 1 FROM USERS u WHERE u.is_enabled<>1 OR NOT EXISTS(SELECT 1 FROM #Expected e WHERE e.email COLLATE Latin1_General_100_BIN2=u.email COLLATE Latin1_General_100_BIN2))
 OR EXISTS(SELECT 1 FROM #Expected e WHERE (SELECT COUNT(*) FROM USER_ROLES WHERE user_email=e.email)<>1 OR NOT EXISTS(SELECT 1 FROM USER_ROLES ur JOIN ROLES r ON r.id=ur.role_id WHERE ur.user_email=e.email AND r.name=e.role_name))
 OR (SELECT COUNT(*) FROM ROLES)<>4 OR EXISTS(SELECT 1 FROM ROLES WHERE name NOT IN('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN','ROLE_SUPPORT'))
 THROW 51520,'Final account/role/active gate failed',1;
IF EXISTS(SELECT 1 FROM #Expected e WHERE slug IS NOT NULL AND (SELECT COUNT(*) FROM STORES WHERE manager_email=e.email AND slug=e.slug)<>1)
 OR (SELECT COUNT(*) FROM STORES)<>6 OR (SELECT COUNT(*) FROM PRODUCTS)<>45
 OR (SELECT COUNT(*) FROM PRODUCT_VARIANTS)<>474 OR (SELECT COUNT(*) FROM STORE_INVENTORY)<>1422
 THROW 51521,'Store assignment/master count gate failed',1;
IF EXISTS(SELECT 1 FROM USERS WHERE password_hash='123456') THROW 51522,'Plaintext credential found',1;
SELECT u.email,u.is_enabled,r.name FROM USERS u JOIN USER_ROLES ur ON ur.user_email=u.email JOIN ROLES r ON r.id=ur.role_id ORDER BY u.email;
SELECT r.name,COUNT(*) members FROM ROLES r JOIN USER_ROLES ur ON ur.role_id=r.id GROUP BY r.name;
SELECT store_id,slug,name,manager_email,status FROM STORES ORDER BY store_id;
SELECT user_email,store_id,active FROM STORE_STAFF_ASSIGNMENTS ORDER BY user_email,store_id;
SELECT 'Stores' entity,COUNT(*) total FROM STORES UNION ALL SELECT 'Products',COUNT(*) FROM PRODUCTS
 UNION ALL SELECT 'Variants',COUNT(*) FROM PRODUCT_VARIANTS UNION ALL SELECT 'Inventory',COUNT(*) FROM STORE_INVENTORY
 UNION ALL SELECT 'Orders',COUNT(*) FROM ORDERS UNION ALL SELECT 'Support conversations',COUNT(*) FROM SUPPORT_CONVERSATIONS;
CREATE TABLE #Markers(value varchar(100));
INSERT #Markers VALUES('TWFINALFIX'),('TWADMINTEST'),('TWMGRDEMO'),('TWPOSTFIX'),('@test.invalid'),('@twinkle.test'),('user1@twinkle.com'),('user2@twinkle.com');
CREATE TABLE #Residue(table_name sysname,column_name sysname,row_count bigint);
DECLARE @scanTable sysname,@scanColumn sysname,@scanSql nvarchar(max);
DECLARE scan CURSOR LOCAL FAST_FORWARD FOR SELECT t.name,c.name FROM sys.tables t JOIN sys.columns c ON c.object_id=t.object_id WHERE TYPE_NAME(c.system_type_id) IN('varchar','nvarchar','char','nchar','text','ntext');
OPEN scan;FETCH NEXT FROM scan INTO @scanTable,@scanColumn;
WHILE @@FETCH_STATUS=0 BEGIN
 SET @scanSql=N'INSERT #Residue SELECT @t,@c,COUNT_BIG(*) FROM dbo.'+QUOTENAME(@scanTable)+N' t WHERE EXISTS(SELECT 1 FROM #Markers m WHERE CHARINDEX(m.value,CONVERT(nvarchar(max),t.'+QUOTENAME(@scanColumn)+N'))>0);';
 EXEC sp_executesql @scanSql,N'@t sysname,@c sysname',@scanTable,@scanColumn;
 FETCH NEXT FROM scan INTO @scanTable,@scanColumn;
END;CLOSE scan;DEALLOCATE scan;
SELECT 'Text columns scanned',COUNT(*),'Synthetic/removed-email residue',SUM(row_count) FROM #Residue;
IF EXISTS(SELECT 1 FROM #Residue WHERE row_count>0) BEGIN SELECT * FROM #Residue WHERE row_count>0;THROW 51523,'Synthetic or obsolete email residue remains',1;END;
:r tools/integration/account-integrity.sql
PRINT 'FINAL NINE-ACCOUNT DATABASE AUDIT PASS';
