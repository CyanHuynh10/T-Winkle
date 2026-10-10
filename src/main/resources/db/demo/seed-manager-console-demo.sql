-- Optional, isolated synthetic review data. Never auto-run. Manager starts disabled.
SET XACT_ABORT ON;
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET ANSI_WARNINGS ON;
SET ANSI_PADDING ON;
SET ARITHABORT ON;
SET CONCAT_NULL_YIELDS_NULL ON;
SET NUMERIC_ROUNDABORT OFF;
BEGIN TRANSACTION;
IF EXISTS(SELECT 1 FROM STORES WHERE slug='TWMGRDEMO-store')
BEGIN
 PRINT 'TWMGRDEMO dataset already installed; no rows changed.';
 COMMIT;
 RETURN;
END;
IF EXISTS(SELECT 1 FROM USERS WHERE email LIKE 'TWMGRDEMO%@example.invalid') OR EXISTS(SELECT 1 FROM PRODUCTS WHERE slug LIKE 'TWMGRDEMO-%')
 THROW 51000,'Partial/colliding TWMGRDEMO data exists. Review before cleanup or seed.',1;
INSERT USERS(email,username,full_name,password_hash,is_enabled) VALUES('TWMGRDEMO-manager@example.invalid','TWMGRDEMO-manager',N'TWMGRDEMO Manager','!disabled-synthetic-account',0),('TWMGRDEMO-support@example.invalid','TWMGRDEMO-support',N'TWMGRDEMO Support','!disabled-synthetic-account',0);
INSERT USER_ROLES(user_email,role_id) SELECT 'TWMGRDEMO-manager@example.invalid',id FROM ROLES WHERE name='ROLE_MANAGER';
INSERT USER_ROLES(user_email,role_id) SELECT 'TWMGRDEMO-support@example.invalid',id FROM ROLES WHERE name='ROLE_SUPPORT';
DECLARE @n INT=1;
WHILE @n<=30
BEGIN
 INSERT USERS(email,username,full_name,password_hash,is_enabled) VALUES(CONCAT('TWMGRDEMO-customer',@n,'@example.invalid'),CONCAT('TWMGRDEMO-customer',@n),CONCAT(N'Khách mẫu ',@n),'!disabled-synthetic-account',0);
 INSERT USER_ROLES(user_email,role_id) SELECT CONCAT('TWMGRDEMO-customer',@n,'@example.invalid'),id FROM ROLES WHERE name='ROLE_USER';
 SET @n+=1;
END;
INSERT STORES(slug,name,description,image_url,phone,address_line,ward,district,city,status,rating_average,review_count,manager_email)
 VALUES('TWMGRDEMO-store',N'T-Winkle · Cửa hàng mẫu Manager',N'TWMGRDEMO — dữ liệu tổng hợp để kiểm tra giao diện.','/images/T-Winkle.png','0900000000',N'Địa chỉ mẫu',N'Phường mẫu',N'Quận mẫu',N'Hồ Chí Minh','OPEN',0,0,'TWMGRDEMO-manager@example.invalid');
DECLARE @store INT=SCOPE_IDENTITY();
INSERT STORE_STAFF_ASSIGNMENTS(store_id,user_email,active) VALUES(@store,'TWMGRDEMO-support@example.invalid',1);
INSERT BRANDS(slug,name,description) VALUES('TWMGRDEMO-brand',N'TWMGRDEMO Brand',N'Nhóm sản phẩm mẫu');
DECLARE @brand INT=SCOPE_IDENTITY();
INSERT CATEGORIES(slug,name,description,status) VALUES('TWMGRDEMO-category',N'TWMGRDEMO Shoes',N'Danh mục mẫu','ACTIVE');
DECLARE @category INT=SCOPE_IDENTITY(),@p INT=1,@product INT,@size INT,@variant BIGINT;
WHILE @p<=10
BEGIN
 INSERT PRODUCTS(slug,name,description,category_id,brand_id,base_price,status)
 VALUES(CONCAT('TWMGRDEMO-product-',@p),CONCAT(N'TWMGRDEMO Giày ',@p),N'Sản phẩm mẫu — chỉ dùng kiểm tra Manager.',@category,@brand,450000+@p*35000,'ACTIVE');
 SET @product=SCOPE_IDENTITY();
 INSERT PRODUCT_IMAGES(product_id,image_url,alt_text,sort_order,is_primary) VALUES(@product,'/images/storefront/products/T-Winkle.png',N'TWMGRDEMO ảnh mẫu',1,1);
 SET @size=39;
 WHILE @size<=43
 BEGIN
  INSERT PRODUCT_VARIANTS(product_id,size,color,sku,price_adjustment,image_url,status)
  VALUES(@product,CAST(@size AS VARCHAR),CASE WHEN @size%2=0 THEN N'Trắng' ELSE N'Đen' END,CONCAT('TWMGRDEMO-SKU-',@p,'-',@size),0,'/images/T-Winkle.png','ACTIVE');
  SET @variant=SCOPE_IDENTITY();
  INSERT STORE_INVENTORY(store_id,variant_id,quantity,reorder_level)
  VALUES(@store,@variant,CASE (@p+@size)%7 WHEN 0 THEN 0 WHEN 1 THEN 3 WHEN 2 THEN 7 WHEN 3 THEN 10 WHEN 4 THEN 11 WHEN 5 THEN 20 ELSE 25 END,10);
  SET @size+=1;
 END;
 SET @p+=1;
END;
DECLARE @month INT=1,@j INT,@count INT,@order BIGINT,@date DATETIME2,@status NVARCHAR(30),@method VARCHAR(20),@line INT,@qty INT,@price DECIMAL(18,2),@sum DECIMAL(18,2),@customer VARCHAR(100);
WHILE @month<=12
BEGIN
 -- Intentional seasonality, 299 orders / 598 lines, not uniform random noise.
 SET @count=CASE @month WHEN 1 THEN 14 WHEN 2 THEN 18 WHEN 3 THEN 18 WHEN 4 THEN 22 WHEN 5 THEN 27 WHEN 6 THEN 23 WHEN 7 THEN 27 WHEN 8 THEN 27 WHEN 9 THEN 29 WHEN 10 THEN 30 WHEN 11 THEN 30 ELSE 34 END;
 SET @j=1;
 WHILE @j<=@count
 BEGIN
  SET @date=DATEADD(hour,9+(@j%9),CAST(DATEFROMPARTS(YEAR(SYSDATETIME()),@month,1+((@j-1)%28)) AS DATETIME2));
  SET @status=CASE WHEN (@j*7+@month*3)%20<13 THEN N'Đã giao' WHEN (@j*7+@month*3)%20<16 THEN N'Đã xác nhận' WHEN (@j*7+@month*3)%20<18 THEN N'Chờ xác nhận đơn hàng' ELSE N'Đã hủy' END;
  SET @method=CASE WHEN (@j*3+@month*7)%20<11 THEN 'COD' ELSE 'BANKING' END;
  SET @customer=CONCAT('TWMGRDEMO-customer',1+(@j%30),'@example.invalid');
  INSERT ORDERS(order_code,user_email,status,recipient_name,recipient_phone,shipping_address_line,shipping_ward,shipping_district,shipping_city,payment_method,subtotal,product_discount,shipping_fee,coupon_discount,total,created_at,updated_at,delivery_mail_sent_at)
  VALUES(CONCAT('TWMGRDEMO-',@month,'-',@j),@customer,@status,N'Khách mẫu','0900000000',N'Địa chỉ mẫu',N'Phường mẫu',N'Quận mẫu',N'Hồ Chí Minh',@method,0,0,0,0,0,@date,@date,CASE WHEN @status=N'Đã giao' THEN @date ELSE NULL END);
  SET @order=SCOPE_IDENTITY();SET @line=1;SET @sum=0;
  WHILE @line<=2
  BEGIN
   SET @p=CASE WHEN (@j+@line)%100<25 THEN 1 WHEN (@j+@line)%100<43 THEN 2 WHEN (@j+@line)%100<56 THEN 3 WHEN (@j+@line)%100<66 THEN 4 ELSE 5+((@j+@line)%6) END;
   -- Spread popular products across the full year with deterministic weighting.
   SET @p=CASE WHEN (@j*7+@month*11+@line*13)%100<25 THEN 1 WHEN (@j*7+@month*11+@line*13)%100<43 THEN 2 WHEN (@j*7+@month*11+@line*13)%100<56 THEN 3 WHEN (@j*7+@month*11+@line*13)%100<66 THEN 4 ELSE 5+((@j+@line)%6) END;
   SET @size=CASE WHEN (@j*3+@month+@line)%20<2 THEN 39 WHEN (@j*3+@month+@line)%20<6 THEN 40 WHEN (@j*3+@month+@line)%20<12 THEN 41 WHEN (@j*3+@month+@line)%20<17 THEN 42 ELSE 43 END;
   SELECT @variant=v.id,@product=p.id,@price=p.base_price FROM PRODUCT_VARIANTS v JOIN PRODUCTS p ON p.id=v.product_id WHERE v.sku=CONCAT('TWMGRDEMO-SKU-',@p,'-',@size);
   SET @qty=1+(@j%3);SET @sum+=@price*@qty;
   INSERT ORDER_ITEMS(order_id,product_id,variant_id,store_id,product_name,variant_name,image_url,quantity,unit_price,discount_amount,line_total)
   VALUES(@order,@product,@variant,@store,CONCAT(N'TWMGRDEMO Giày ',@p),CONCAT(N'Size ',@size,N' · Màu mẫu'),'/images/T-Winkle.png',@qty,@price,0,@price*@qty);
   SET @line+=1;
  END;
  UPDATE ORDERS SET subtotal=@sum,total=@sum WHERE id=@order;
  INSERT PAYMENTS(order_id,method,status,amount,created_at,paid_at) VALUES(@order,@method,CASE WHEN @status=N'Đã giao' THEN 'PAID' ELSE 'PENDING' END,@sum,@date,CASE WHEN @status=N'Đã giao' THEN @date ELSE NULL END);
  INSERT ORDER_STATUS_HISTORY(order_id,status,note,created_at) VALUES(@order,N'Chờ xác nhận đơn hàng',N'TWMGRDEMO synthetic creation',@date);
  IF @status<>N'Chờ xác nhận đơn hàng' INSERT ORDER_STATUS_HISTORY(order_id,status,note,created_at) VALUES(@order,@status,N'TWMGRDEMO synthetic history',DATEADD(hour,1,@date));
  INSERT ORDER_STORE_FULFILLMENTS(order_id,store_id,status,confirmed_at,delivered_at,cancelled_at,updated_at)
  VALUES(@order,@store,@status,CASE WHEN @status IN(N'Đã xác nhận',N'Đã giao') THEN @date ELSE NULL END,CASE WHEN @status=N'Đã giao' THEN @date ELSE NULL END,CASE WHEN @status=N'Đã hủy' THEN @date ELSE NULL END,@date);
  SET @j+=1;
 END;
 SET @month+=1;
END;
SET @n=1;
WHILE @n<=12
BEGIN
 SELECT @variant=id FROM (SELECT v.id,ROW_NUMBER() OVER(ORDER BY v.id) AS rn FROM PRODUCT_VARIANTS v JOIN STORE_INVENTORY si ON si.variant_id=v.id WHERE si.store_id=@store AND si.quantity<=si.reorder_level) x WHERE rn=@n;
 INSERT INVENTORY_RESTOCK_REQUESTS(store_id,variant_id,current_quantity,reorder_level,requested_quantity,reason,note,status,requested_by,reviewed_at,fulfilled_at)
 SELECT @store,@variant,quantity,reorder_level,20,N'TWMGRDEMO cần bổ sung',N'Dữ liệu mẫu',CASE WHEN @n<=4 THEN 'PENDING' WHEN @n<=7 THEN 'APPROVED' WHEN @n<=9 THEN 'REJECTED' ELSE 'FULFILLED' END,'TWMGRDEMO-manager@example.invalid',CASE WHEN @n>4 THEN SYSDATETIME() ELSE NULL END,CASE WHEN @n>9 THEN SYSDATETIME() ELSE NULL END FROM STORE_INVENTORY WHERE store_id=@store AND variant_id=@variant;
 SET @n+=1;
END;
DECLARE @conversation BIGINT,@message BIGINT,@m INT;
SET @n=1;
WHILE @n<=10
BEGIN
 INSERT SUPPORT_CONVERSATIONS(user_email,store_id,source,status,handoff_reason,handoff_summary,last_message_at)
 VALUES(CONCAT('TWMGRDEMO-customer',@n,'@example.invalid'),@store,'DIRECT','OPEN','OTHER',N'TWMGRDEMO tư vấn sản phẩm',SYSDATETIME());
 SET @conversation=SCOPE_IDENTITY();SET @m=1;
 WHILE @m<=3+(@n%10)
 BEGIN
  INSERT SUPPORT_MESSAGES(conversation_id,sender_type,sender_email,content,client_message_id)
  VALUES(@conversation,CASE WHEN @m%3=0 THEN 'STAFF' ELSE 'USER' END,CASE WHEN @m%3=0 THEN 'TWMGRDEMO-manager@example.invalid' ELSE CONCAT('TWMGRDEMO-customer',@n,'@example.invalid') END,CONCAT(N'TWMGRDEMO tin nhắn mẫu ',@m),CONVERT(VARCHAR(36),NEWID()));
  SET @message=SCOPE_IDENTITY();SET @m+=1;
 END;
 IF @n>4 INSERT SUPPORT_CONVERSATION_READ_STATE(conversation_id,user_email,last_read_message_id) VALUES(@conversation,'TWMGRDEMO-manager@example.invalid',@message);
 SET @n+=1;
END;
COMMIT;
PRINT 'TWMGRDEMO installed: 299 orders, 598 lines, 30 customers, 10 products, 50 variants, 12 restock requests, 10 conversations. Synthetic current-year months include future months for annual chart review.';
