-- Notification guard only. Historical delivered orders are not mailed or rewritten.
SET NOCOUNT ON;
SET XACT_ABORT ON;
IF DB_NAME() <> 'T_Winkle' THROW 51300, 'Expected T_Winkle database.', 1;
IF OBJECT_ID('dbo.ORDERS','U') IS NULL THROW 51301, 'Expected existing ORDERS table.', 1;
BEGIN TRANSACTION;
IF COL_LENGTH('dbo.ORDERS','delivery_mail_sent_at') IS NULL
    ALTER TABLE dbo.ORDERS ADD delivery_mail_sent_at DATETIME2 NULL;
COMMIT;
SELECT name,TYPE_NAME(user_type_id) data_type,is_nullable FROM sys.columns
WHERE object_id=OBJECT_ID('dbo.ORDERS') AND name='delivery_mail_sent_at';
