SET NOCOUNT ON;
SELECT id,order_code,user_email FROM ORDERS WHERE order_code LIKE 'TWDM%' OR order_code LIKE 'TWFINALFIX%';
SELECT email,username,full_name FROM USERS WHERE email LIKE 'DM%@twinkle.test' OR email LIKE 'TWFINALFIX%';
SELECT COUNT(*) AS current_orders FROM ORDERS;
SELECT COUNT(*) AS current_users FROM USERS;
