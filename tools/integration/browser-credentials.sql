SET NOCOUNT ON;
SET XACT_ABORT ON;
BEGIN TRANSACTION;
IF (SELECT COUNT(*) FROM USERS WHERE email IN('TWFINALFIX-admin@test.invalid','TWFINALFIX-manager@test.invalid','TWFINALFIX-user@test.invalid','TWFINALFIX-support@test.invalid') AND full_name LIKE 'TWFINALFIX %')<>4 THROW 51407,'Exact review accounts are not present',1;
UPDATE USERS SET password_hash='$(PasswordHash)' WHERE email IN('TWFINALFIX-admin@test.invalid','TWFINALFIX-manager@test.invalid','TWFINALFIX-user@test.invalid','TWFINALFIX-support@test.invalid') AND full_name LIKE 'TWFINALFIX %';
COMMIT;
