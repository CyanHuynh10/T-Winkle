SET QUOTED_IDENTIFIER ON;
SET NOCOUNT ON;
SET XACT_ABORT ON;
BEGIN TRANSACTION;
IF EXISTS(SELECT 1 FROM USERS WHERE email IN('TWFINALFIX-admin@test.invalid','TWFINALFIX-manager@test.invalid','TWFINALFIX-user@test.invalid','TWFINALFIX-support@test.invalid')) THROW 51400,'Review fixture already exists',1;
INSERT USERS(email,username,full_name,phone,password_hash,is_enabled) VALUES
 ('TWFINALFIX-admin@test.invalid','TWFINALFIX-admin','TWFINALFIX Admin','0900000000','$(PasswordHash)',1),
 ('TWFINALFIX-manager@test.invalid','TWFINALFIX-manager','TWFINALFIX Manager','0900000000','$(PasswordHash)',1),
 ('TWFINALFIX-user@test.invalid','TWFINALFIX-user','TWFINALFIX User','0900000000','$(PasswordHash)',1),
 ('TWFINALFIX-support@test.invalid','TWFINALFIX-support','TWFINALFIX Support','0900000000','$(PasswordHash)',1);
INSERT USER_ROLES(user_email,role_id) SELECT u.email,r.id FROM USERS u JOIN ROLES r ON r.name=CASE u.username WHEN 'TWFINALFIX-admin' THEN 'ROLE_ADMIN' WHEN 'TWFINALFIX-manager' THEN 'ROLE_MANAGER' WHEN 'TWFINALFIX-support' THEN 'ROLE_SUPPORT' ELSE 'ROLE_USER' END WHERE u.email IN('TWFINALFIX-admin@test.invalid','TWFINALFIX-manager@test.invalid','TWFINALFIX-user@test.invalid','TWFINALFIX-support@test.invalid');
INSERT STORES(slug,name,address_line,city,manager_email,status) VALUES('twfinalfix-review-store','TWFINALFIX Review Store','Fixture location','Fixture city','TWFINALFIX-manager@test.invalid','OPEN');
DECLARE @store int=SCOPE_IDENTITY();
INSERT STORE_STAFF_ASSIGNMENTS(store_id,user_email,active) VALUES(@store,'TWFINALFIX-support@test.invalid',1);
INSERT USER_ADDRESSES(user_email,full_name,phone,address_line,ward,district,city,is_default) VALUES('TWFINALFIX-user@test.invalid','TWFINALFIX User','0900000000','Fixture address','Fixture ward','Fixture district','Fixture city',1);
INSERT STORE_INVENTORY(store_id,variant_id,quantity,reorder_level) SELECT @store,MIN(id),10,10 FROM PRODUCT_VARIANTS WHERE status='ACTIVE';
COMMIT;
