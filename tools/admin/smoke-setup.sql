SET NOCOUNT ON; SET XACT_ABORT ON;
SET ANSI_NULLS ON; SET QUOTED_IDENTIFIER ON; SET ANSI_PADDING ON; SET ANSI_WARNINGS ON; SET CONCAT_NULL_YIELDS_NULL ON; SET ARITHABORT ON; SET NUMERIC_ROUNDABORT OFF;
BEGIN TRANSACTION;
IF EXISTS(SELECT 1 FROM USERS WHERE email LIKE 'TWADMINTEST-smoke-%@example.invalid') THROW 51230,'Previous smoke fixture exists; review cleanup before proceeding.',1;
INSERT USERS(email,username,full_name,password_hash,is_enabled) VALUES
 ('TWADMINTEST-smoke-admin@example.invalid','TWADMINTEST-smoke-admin',N'Temporary Admin','$(PasswordHash)',1),
 ('TWADMINTEST-smoke-manager@example.invalid','TWADMINTEST-smoke-manager',N'Temporary Manager','$(PasswordHash)',1),
 ('TWADMINTEST-smoke-user@example.invalid','TWADMINTEST-smoke-user',N'Temporary Customer','$(PasswordHash)',1),
 ('TWADMINTEST-smoke-support@example.invalid','TWADMINTEST-smoke-support',N'Temporary Support','$(PasswordHash)',1);
INSERT USER_ROLES(user_email,role_id) SELECT 'TWADMINTEST-smoke-admin@example.invalid',id FROM ROLES WHERE name='ROLE_ADMIN';
INSERT USER_ROLES(user_email,role_id) SELECT 'TWADMINTEST-smoke-manager@example.invalid',id FROM ROLES WHERE name='ROLE_MANAGER';
INSERT USER_ROLES(user_email,role_id) SELECT 'TWADMINTEST-smoke-user@example.invalid',id FROM ROLES WHERE name='ROLE_USER';
INSERT USER_ROLES(user_email,role_id) SELECT 'TWADMINTEST-smoke-support@example.invalid',id FROM ROLES WHERE name='ROLE_SUPPORT';
INSERT STORES(slug,name,address_line,city,status,manager_email) VALUES('twadmintest-smoke-store',N'TWADMINTEST Smoke Store','Verification only','Verification only','OPEN','TWADMINTEST-smoke-manager@example.invalid');
DECLARE @store INT=SCOPE_IDENTITY();
INSERT STORE_STAFF_ASSIGNMENTS(store_id,user_email,active) VALUES(@store,'TWADMINTEST-smoke-support@example.invalid',1);
INSERT CATEGORIES(slug,name,description,status) VALUES('twadmintest-smoke-category',N'TWADMINTEST Smoke Category',N'Temporary browser verification','ACTIVE');
DECLARE @category INT=SCOPE_IDENTITY();
INSERT BRANDS(slug,name,description) VALUES('twadmintest-smoke-brand',N'TWADMINTEST Smoke Brand',N'Temporary browser verification');
DECLARE @brand INT=SCOPE_IDENTITY();
INSERT PRODUCTS(slug,name,brand_id,category_id,base_price,status) VALUES('twadmintest-smoke-product',N'TWADMINTEST Smoke Product',@brand,@category,100000,'ACTIVE');
DECLARE @product INT=SCOPE_IDENTITY();
INSERT PRODUCT_VARIANTS(product_id,size,color,sku,price_adjustment,status) VALUES(@product,'41',N'Blue','TWADMINTEST-smoke-sku',0,'ACTIVE');
DECLARE @variant BIGINT=SCOPE_IDENTITY();
INSERT STORE_INVENTORY(store_id,variant_id,quantity,reorder_level) VALUES(@store,@variant,10,10);
INSERT INVENTORY_RESTOCK_REQUESTS(store_id,variant_id,current_quantity,reorder_level,requested_quantity,reason,requested_by) VALUES(@store,@variant,10,10,15,N'TWADMINTEST restock','TWADMINTEST-smoke-manager@example.invalid');
INSERT CATALOG_CHANGE_REQUESTS(store_id,requester_email,request_type,product_id,requested_data,reason) VALUES(@store,'TWADMINTEST-smoke-manager@example.invalid','UPDATE_PRODUCT',@product,CONCAT('{"requestType":"UPDATE_PRODUCT","productId":',@product,',"reason":"TWADMINTEST rename","name":"TWADMINTEST Reviewed Product"}'),N'TWADMINTEST rename');
INSERT ORDERS(order_code,user_email,status,recipient_name,recipient_phone,shipping_address_line,shipping_ward,shipping_district,shipping_city,payment_method,subtotal,product_discount,shipping_fee,coupon_discount,total) VALUES('TWADMINTEST-smoke-banking','TWADMINTEST-smoke-user@example.invalid',N'Chờ xác nhận đơn hàng','Temporary Customer','0','Verification','Verification','Verification','Verification','BANKING',100000,0,30000,0,130000);
DECLARE @order BIGINT=SCOPE_IDENTITY();
INSERT ORDER_ITEMS(order_id,product_id,store_id,variant_id,product_name,variant_name,quantity,unit_price,discount_amount,line_total) VALUES(@order,@product,@store,@variant,N'TWADMINTEST Smoke Product','41 Blue',1,100000,0,100000);
INSERT ORDER_STORE_FULFILLMENTS(order_id,store_id,status) VALUES(@order,@store,N'Chờ xác nhận đơn hàng');
INSERT PAYMENTS(order_id,method,status,amount) VALUES(@order,'BANKING','PENDING',130000);
INSERT SUPPORT_CONVERSATIONS(user_email,store_id,product_id,source,status) VALUES('TWADMINTEST-smoke-user@example.invalid',@store,@product,'DIRECT','OPEN');
DECLARE @conversation BIGINT=SCOPE_IDENTITY();
INSERT SUPPORT_MESSAGES(conversation_id,sender_type,sender_email,content,client_message_id) VALUES(@conversation,'USER','TWADMINTEST-smoke-user@example.invalid',N'TWADMINTEST browser support question',CONVERT(VARCHAR(36),NEWID()));
COMMIT;
