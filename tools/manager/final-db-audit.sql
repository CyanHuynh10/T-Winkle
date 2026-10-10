SET NOCOUNT ON;
DECLARE @store INT=(SELECT store_id FROM STORES WHERE slug='TWMGRDEMO-store');
SELECT 'Manager tables' AS audit, name FROM sys.tables WHERE name IN('STORE_STATUS_HISTORY','CATALOG_CHANGE_REQUESTS','INVENTORY_RESTOCK_REQUESTS','SUPPORT_CONVERSATION_READ_STATE','ORDER_STORE_FULFILLMENTS');
SELECT 'Added column' AS audit,COLUMN_NAME,DATA_TYPE,IS_NULLABLE,COLUMN_DEFAULT FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='STORE_INVENTORY' AND COLUMN_NAME='reorder_level';
SELECT 'Explicit indexes' AS audit,OBJECT_NAME(object_id) AS table_name,name FROM sys.indexes WHERE name IN('UX_MANAGER_PENDING_RESTOCK','IX_MANAGER_ORDER_ITEMS','IX_MANAGER_CATALOG_REQUESTS');
SELECT 'Checks' AS audit,name,definition FROM sys.check_constraints WHERE name LIKE 'CK_MANAGER_%';
SELECT 'Demo stores' AS metric,COUNT(*) AS count FROM STORES WHERE slug='TWMGRDEMO-store'
UNION ALL SELECT 'Demo users',COUNT(*) FROM USERS WHERE email LIKE 'TWMGRDEMO%@example.invalid'
UNION ALL SELECT 'Demo enabled accounts',COUNT(*) FROM USERS WHERE email LIKE 'TWMGRDEMO%@example.invalid' AND is_enabled=1
UNION ALL SELECT 'Demo products',COUNT(*) FROM PRODUCTS WHERE slug LIKE 'TWMGRDEMO-product-%'
UNION ALL SELECT 'Demo variants',COUNT(*) FROM PRODUCT_VARIANTS WHERE sku LIKE 'TWMGRDEMO-SKU-%'
UNION ALL SELECT 'Demo orders',COUNT(*) FROM ORDERS WHERE order_code LIKE 'TWMGRDEMO-%'
UNION ALL SELECT 'Demo order items',COUNT(*) FROM ORDER_ITEMS WHERE store_id=@store
UNION ALL SELECT 'Demo inventory',COUNT(*) FROM STORE_INVENTORY WHERE store_id=@store
UNION ALL SELECT 'Demo restock requests',COUNT(*) FROM INVENTORY_RESTOCK_REQUESTS WHERE store_id=@store
UNION ALL SELECT 'Demo conversations',COUNT(*) FROM SUPPORT_CONVERSATIONS WHERE store_id=@store
UNION ALL SELECT 'Demo messages',COUNT(*) FROM SUPPORT_MESSAGES WHERE conversation_id IN(SELECT id FROM SUPPORT_CONVERSATIONS WHERE store_id=@store)
UNION ALL SELECT 'Demo catalog requests',COUNT(*) FROM CATALOG_CHANGE_REQUESTS WHERE store_id=@store
UNION ALL SELECT 'Demo status changes',COUNT(*) FROM STORE_STATUS_HISTORY WHERE store_id=@store;
SELECT 'Demo order distribution' AS audit,status,COUNT(*) AS count FROM ORDERS WHERE order_code LIKE 'TWMGRDEMO-%' GROUP BY status;
SELECT 'Demo payments' AS audit,payment_method,COUNT(*) AS count FROM ORDERS WHERE order_code LIKE 'TWMGRDEMO-%' GROUP BY payment_method;
SELECT 'Demo restock states' AS audit,status,COUNT(*) AS count FROM INVENTORY_RESTOCK_REQUESTS WHERE store_id=@store GROUP BY status;
SELECT 'Demo month distribution' AS audit,MONTH(created_at) AS month,COUNT(*) AS orders FROM ORDERS WHERE order_code LIKE 'TWMGRDEMO-%' GROUP BY MONTH(created_at) ORDER BY MONTH(created_at);
