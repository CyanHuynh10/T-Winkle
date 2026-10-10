-- Apply after chat, manager and admin migrations. Recovery backup is mandatory.
SET NOCOUNT ON;
SET XACT_ABORT ON;
SET QUOTED_IDENTIFIER ON;
SET ANSI_NULLS ON;
SET ANSI_PADDING ON;
SET ANSI_WARNINGS ON;
SET CONCAT_NULL_YIELDS_NULL ON;
SET ARITHABORT ON;
SET NUMERIC_ROUNDABORT OFF;
BEGIN TRANSACTION;

-- Exact seeded sample roots identified by user, business code, method and earlier audit.
DECLARE @samples TABLE(id bigint PRIMARY KEY,code varchar(50),method varchar(20));
INSERT @samples VALUES(2,'TW202609230002','VNPAY'),(3,'TW202609200003','MOMO'),(5,'TW202609150005','VNPAY');
IF EXISTS(SELECT 1 FROM ORDERS o JOIN @samples s ON s.id=o.id WHERE o.order_code<>s.code OR o.payment_method<>s.method OR o.user_email<>'user1@twinkle.com')
 THROW 51300,'Sample identity mismatch; no cleanup performed',1;
IF EXISTS(SELECT 1 FROM SUPPORT_CONVERSATIONS c JOIN @samples s ON s.id=c.order_id)
 THROW 51301,'Sample has support history requiring separate classification',1;
IF EXISTS(SELECT 1 FROM ADMIN_AUDIT_LOG a JOIN PAYMENTS p ON a.entity_type='PAYMENTS' AND a.entity_id=CONVERT(nvarchar(100),p.id) JOIN @samples s ON s.id=p.order_id)
 THROW 51302,'Sample has payment audit history requiring separate classification',1;
SELECT o.status AS old_status,COUNT(*) AS count FROM ORDERS o JOIN @samples s ON s.id=o.id GROUP BY o.status;
DELETE v FROM PAYMENT_VERIFICATIONS v JOIN PAYMENTS p ON p.id=v.payment_id JOIN @samples s ON s.id=p.order_id;
DELETE r FROM REVIEWS r JOIN @samples s ON s.id=r.order_id;
DELETE c FROM COUPON_USAGES c JOIN @samples s ON s.id=c.order_id;
DELETE c FROM ORDER_CANCELLATIONS c JOIN @samples s ON s.id=c.order_id;
DELETE h FROM ORDER_STATUS_HISTORY h JOIN @samples s ON s.id=h.order_id;
DELETE f FROM ORDER_STORE_FULFILLMENTS f JOIN @samples s ON s.id=f.order_id;
DELETE i FROM ORDER_ITEMS i JOIN @samples s ON s.id=i.order_id;
DELETE p FROM PAYMENTS p JOIN @samples s ON s.id=p.order_id;
DELETE o FROM ORDERS o JOIN @samples s ON s.id=o.id;
IF EXISTS(SELECT 1 FROM ORDERS WHERE payment_method NOT IN('COD','BANKING')) OR EXISTS(SELECT 1 FROM PAYMENTS WHERE method NOT IN('COD','BANKING'))
 THROW 51303,'Unsupported retained historical method requires review',1;

-- Preserve existing delivery snapshots. Historical orders predate pickup support.
IF COL_LENGTH('dbo.ORDERS','fulfillment_mode') IS NULL
 EXEC('ALTER TABLE dbo.ORDERS ADD fulfillment_mode varchar(20) NOT NULL CONSTRAINT DF_ORDER_MODE DEFAULT ''DELIVERY'' WITH VALUES');
IF NOT EXISTS(SELECT 1 FROM sys.check_constraints WHERE name='CK_ORDER_MODE')
 EXEC('ALTER TABLE dbo.ORDERS WITH CHECK ADD CONSTRAINT CK_ORDER_MODE CHECK(fulfillment_mode IN(''PICKUP'',''DELIVERY''))');
IF EXISTS(SELECT 1 FROM sys.check_constraints WHERE name='CK_ORDERS_STATUS') ALTER TABLE dbo.ORDERS DROP CONSTRAINT CK_ORDERS_STATUS;
IF EXISTS(SELECT 1 FROM sys.check_constraints WHERE name='CK_ORDER_STATUS_HISTORY_STATUS') ALTER TABLE dbo.ORDER_STATUS_HISTORY DROP CONSTRAINT CK_ORDER_STATUS_HISTORY_STATUS;
IF EXISTS(SELECT 1 FROM sys.check_constraints WHERE name='CK_MANAGER_FULFILLMENT_STATUS') ALTER TABLE dbo.ORDER_STORE_FULFILLMENTS DROP CONSTRAINT CK_MANAGER_FULFILLMENT_STATUS;
ALTER TABLE dbo.ORDERS ALTER COLUMN status nvarchar(50) NOT NULL;
ALTER TABLE dbo.ORDER_STATUS_HISTORY ALTER COLUMN status nvarchar(50) NOT NULL;
ALTER TABLE dbo.ORDER_STORE_FULFILLMENTS ALTER COLUMN status nvarchar(50) NOT NULL;
SELECT N'Chờ xác nhận' AS old_status,N'Chờ xác nhận đơn hàng' AS new_status,COUNT(*) AS count FROM ORDERS WHERE status=N'Chờ xác nhận';
UPDATE ORDERS SET status=N'Chờ xác nhận đơn hàng' WHERE status=N'Chờ xác nhận';
UPDATE ORDER_STORE_FULFILLMENTS SET status=N'Chờ xác nhận đơn hàng' WHERE status=N'Chờ xác nhận';
UPDATE ORDER_STATUS_HISTORY SET status=N'Chờ xác nhận đơn hàng' WHERE status=N'Chờ xác nhận';
ALTER TABLE dbo.ORDERS WITH CHECK ADD CONSTRAINT CK_ORDERS_STATUS CHECK(status IN(N'Chờ xác nhận đơn hàng',N'Đã xác nhận',N'Đang chuẩn bị đơn hàng',N'Đơn hàng đã sẵn sàng',N'Đang giao',N'Đã giao',N'Đã hủy'));
ALTER TABLE dbo.ORDER_STATUS_HISTORY WITH CHECK ADD CONSTRAINT CK_ORDER_STATUS_HISTORY_STATUS CHECK(status IN(N'Chờ xác nhận đơn hàng',N'Đã xác nhận',N'Đang chuẩn bị đơn hàng',N'Đơn hàng đã sẵn sàng',N'Đang giao',N'Đã giao',N'Đã hủy'));
ALTER TABLE dbo.ORDER_STORE_FULFILLMENTS WITH CHECK ADD CONSTRAINT CK_MANAGER_FULFILLMENT_STATUS CHECK(status IN(N'Chờ xác nhận đơn hàng',N'Đã xác nhận',N'Đang chuẩn bị đơn hàng',N'Đơn hàng đã sẵn sàng',N'Đang giao',N'Đã giao',N'Đã hủy'));
DECLARE @oldDefault sysname=(SELECT d.name FROM sys.default_constraints d JOIN sys.columns c ON c.default_object_id=d.object_id WHERE c.object_id=OBJECT_ID('dbo.ORDERS') AND c.name='status');
IF @oldDefault IS NOT NULL EXEC('ALTER TABLE dbo.ORDERS DROP CONSTRAINT '+@oldDefault);
ALTER TABLE dbo.ORDERS ADD CONSTRAINT DF_ORDER_STATUS_FINAL DEFAULT N'Chờ xác nhận đơn hàng' FOR status;
IF EXISTS(SELECT 1 FROM sys.check_constraints WHERE name='CK_PAYMENTS_METHOD') ALTER TABLE dbo.PAYMENTS DROP CONSTRAINT CK_PAYMENTS_METHOD;
IF EXISTS(SELECT 1 FROM sys.check_constraints WHERE name='CK_ORDERS_PAYMENT_METHOD') ALTER TABLE dbo.ORDERS DROP CONSTRAINT CK_ORDERS_PAYMENT_METHOD;
ALTER TABLE dbo.PAYMENTS WITH CHECK ADD CONSTRAINT CK_PAYMENTS_METHOD CHECK(method IN('COD','BANKING'));
ALTER TABLE dbo.ORDERS WITH CHECK ADD CONSTRAINT CK_ORDERS_PAYMENT_METHOD CHECK(payment_method IN('COD','BANKING'));

IF OBJECT_ID('dbo.PAYMENT_REFUNDS','U') IS NULL
 CREATE TABLE dbo.PAYMENT_REFUNDS(
  id bigint IDENTITY PRIMARY KEY,payment_id bigint NOT NULL UNIQUE REFERENCES dbo.PAYMENTS(id),order_id bigint NOT NULL REFERENCES dbo.ORDERS(id),
  amount decimal(18,2) NOT NULL,status varchar(20) NOT NULL,reason nvarchar(500) NOT NULL,requested_at datetime2 NOT NULL DEFAULT SYSDATETIME(),
  processed_by varchar(100) NULL REFERENCES dbo.USERS(email),processed_at datetime2 NULL,transaction_reference nvarchar(150) NULL,note nvarchar(500) NULL,
  created_at datetime2 NOT NULL DEFAULT SYSDATETIME(),updated_at datetime2 NOT NULL DEFAULT SYSDATETIME(),
  CONSTRAINT CK_REFUND_STATUS CHECK(status IN('PENDING','COMPLETED','FAILED')),
  CONSTRAINT CK_REFUND_AMOUNT CHECK(amount>0),CONSTRAINT CK_REFUND_COMPLETION CHECK(status<>'COMPLETED' OR (processed_by IS NOT NULL AND processed_at IS NOT NULL)));

-- Extend existing OTP purpose whitelist; retain hashed, account-bound one-time records.
DECLARE @otpChecks nvarchar(max)='';
SELECT @otpChecks=@otpChecks+'ALTER TABLE dbo.OTP_VERIFICATIONS DROP CONSTRAINT '+QUOTENAME(name)+';' FROM sys.check_constraints WHERE parent_object_id=OBJECT_ID('dbo.OTP_VERIFICATIONS') AND definition LIKE '%type%';
IF @otpChecks<>'' EXEC(@otpChecks);
ALTER TABLE dbo.OTP_VERIFICATIONS WITH CHECK ADD CONSTRAINT CK_OTP_TYPE_FINAL CHECK(type IN('REGISTER','FORGOT_PASSWORD','CHANGE_PASSWORD'));

-- Retired-role memberships go first. Preserve every history-bound account.
DECLARE @retiredRole varchar(30)='ROLE_'+'SHIPPER';
DELETE ur FROM USER_ROLES ur JOIN ROLES r ON r.id=ur.role_id WHERE r.name=@retiredRole;
DELETE ROLES WHERE name=@retiredRole;
-- The old startup seeder recreated this exact synthetic account during baseline tests.
IF EXISTS(SELECT 1 FROM USERS WHERE email='shipper1@twinkle.com' AND username='shipper1') BEGIN
 DECLARE @referenced bit=0,@fkSql nvarchar(max)='';
 SELECT @fkSql=@fkSql+'IF EXISTS(SELECT 1 FROM '+QUOTENAME(OBJECT_SCHEMA_NAME(f.parent_object_id))+'.'+QUOTENAME(OBJECT_NAME(f.parent_object_id))+' WHERE '+QUOTENAME(c.name)+'=''shipper1@twinkle.com'') SET @hit=1;' FROM sys.foreign_keys f JOIN sys.foreign_key_columns fc ON fc.constraint_object_id=f.object_id JOIN sys.columns c ON c.object_id=fc.parent_object_id AND c.column_id=fc.parent_column_id WHERE f.referenced_object_id=OBJECT_ID('dbo.USERS');
 EXEC sp_executesql @fkSql,N'@hit bit OUTPUT',@hit=@referenced OUTPUT;
  IF @referenced=0 EXEC('DELETE dbo.USERS WHERE email=''shipper1@twinkle.com'' AND username=''shipper1'' OPTION(MAXDOP 1,RECOMPILE)');
 ELSE UPDATE USERS SET is_enabled=0 WHERE email='shipper1@twinkle.com';
END;
-- Config panels and their backend have been removed. Admin audit stays intact.
IF OBJECT_ID('dbo.SYSTEM_CONFIG_HISTORY','U') IS NOT NULL DROP TABLE dbo.SYSTEM_CONFIG_HISTORY;
IF OBJECT_ID('dbo.SYSTEM_CONFIGS','U') IS NOT NULL DROP TABLE dbo.SYSTEM_CONFIGS;
COMMIT;
DBCC CHECKCONSTRAINTS WITH ALL_CONSTRAINTS;
