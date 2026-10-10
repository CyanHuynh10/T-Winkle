SET NOCOUNT ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
BEGIN TRANSACTION;
IF EXISTS(SELECT 1 FROM USERS WHERE email LIKE 'TWFINALFEATURE-%@test.invalid') THROW 51500,'Final-feature browser fixture already exists',1;
INSERT USERS(email,username,full_name,password_hash,is_enabled) VALUES
('TWFINALFEATURE-admin@test.invalid','TWFINALFEATURE-admin','TWFINALFEATURE Admin','$(PasswordHash)',1),
('TWFINALFEATURE-manager@test.invalid','TWFINALFEATURE-manager','TWFINALFEATURE Manager','$(PasswordHash)',1),
('TWFINALFEATURE-user@test.invalid','TWFINALFEATURE-user','TWFINALFEATURE User','$(PasswordHash)',1),
('TWFINALFEATURE-support@test.invalid','TWFINALFEATURE-support','TWFINALFEATURE Support','$(PasswordHash)',1);
INSERT USER_ROLES(user_email,role_id) SELECT u.email,r.id FROM USERS u JOIN ROLES r ON r.name=CASE u.username WHEN 'TWFINALFEATURE-admin' THEN 'ROLE_ADMIN' WHEN 'TWFINALFEATURE-manager' THEN 'ROLE_MANAGER' WHEN 'TWFINALFEATURE-support' THEN 'ROLE_SUPPORT' ELSE 'ROLE_USER' END WHERE u.email LIKE 'TWFINALFEATURE-%@test.invalid';
INSERT STORES(slug,name,address_line,city,manager_email,status) VALUES('twfinalfeature-review-store','TWFINALFEATURE Review Store','Fixture location','Fixture city','TWFINALFEATURE-manager@test.invalid','OPEN');
DECLARE @store int=SCOPE_IDENTITY();
INSERT STORE_STAFF_ASSIGNMENTS(store_id,user_email,active) VALUES(@store,'TWFINALFEATURE-support@test.invalid',1);
INSERT PRODUCTS(slug,name,category_id,brand_id,base_price,status) SELECT 'twfinalfeature-product','TWFINALFEATURE Product',MIN(c.id),MIN(b.id),100000,'ACTIVE' FROM CATEGORIES c CROSS JOIN BRANDS b;
DECLARE @product int=SCOPE_IDENTITY();
INSERT PRODUCT_VARIANTS(product_id,size,color,sku,price_adjustment,status) VALUES(@product,'41','blue','TWFINALFEATURE-SKU',0,'ACTIVE');
DECLARE @variant bigint=SCOPE_IDENTITY();
INSERT STORE_INVENTORY(store_id,variant_id,quantity,reorder_level) VALUES(@store,@variant,30,10);
INSERT ORDERS(order_code,user_email,status,recipient_name,recipient_phone,shipping_address_line,shipping_ward,shipping_district,shipping_city,payment_method,subtotal,product_discount,shipping_fee,coupon_discount,total)
 VALUES('TWFINALFEATURE-ORDER','TWFINALFEATURE-user@test.invalid',N'Đã giao','Fixture','0','Fixture','Fixture','Fixture','Fixture','COD',100000,0,0,0,100000);
DECLARE @order bigint=SCOPE_IDENTITY();
INSERT ORDER_ITEMS(order_id,product_id,store_id,variant_id,product_name,variant_name,quantity,unit_price,discount_amount,line_total) VALUES(@order,@product,@store,@variant,'TWFINALFEATURE Product','fixture',1,100000,0,100000);
DECLARE @item bigint=SCOPE_IDENTITY();
INSERT REVIEWS(order_id,order_item_id,user_email,product_id,rating,comment,status) VALUES(@order,@item,'TWFINALFEATURE-user@test.invalid',@product,5,'TWFINALFEATURE Review','APPROVED');
INSERT PAYMENTS(order_id,method,status,amount) VALUES(@order,'COD','PAID',100000);
COMMIT;
