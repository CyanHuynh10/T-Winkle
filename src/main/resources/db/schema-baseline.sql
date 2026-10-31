-- Schema only. Apply once to a NEW empty SQL Server database.

-- No user records, credentials, database files or business data are included.

SET ANSI_NULLS ON; SET QUOTED_IDENTIFIER ON; SET ANSI_PADDING ON;
GO

CREATE TABLE dbo.[ADMIN_AUDIT_LOG](
  [id] bigint IDENTITY(1,1) NOT NULL,
  [actor_email] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [action_type] varchar(60) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [entity_type] varchar(40) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [entity_id] nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [summary] nvarchar(1000) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [created_at] datetime2(7) NOT NULL CONSTRAINT [DF__ADMIN_AUD__creat__11F49EE0] DEFAULT (sysdatetime())
);
GO

CREATE TABLE dbo.[BRAND_PROMOTIONS](
  [promotion_id] int NOT NULL,
  [brand_id] int NOT NULL
);
GO

CREATE TABLE dbo.[BRANDS](
  [id] int IDENTITY(1,1) NOT NULL,
  [slug] varchar(80) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [name] nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [description] nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [logo_url] nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [created_at] datetime2(0) NOT NULL CONSTRAINT [DF_BRANDS_CREATED_AT] DEFAULT (sysdatetime())
);
GO

CREATE TABLE dbo.[CART_ITEMS](
  [id] bigint IDENTITY(1,1) NOT NULL,
  [cart_id] bigint NOT NULL,
  [product_id] int NOT NULL,
  [variant_id] bigint NOT NULL,
  [store_id] int NOT NULL,
  [quantity] int NOT NULL,
  [selected] bit NOT NULL CONSTRAINT [DF_CART_ITEMS_SELECTED] DEFAULT ((1)),
  [unit_price] decimal(18,2) NOT NULL,
  [created_at] datetime2(0) NOT NULL CONSTRAINT [DF_CART_ITEMS_CREATED_AT] DEFAULT (sysdatetime()),
  [updated_at] datetime2(0) NOT NULL CONSTRAINT [DF_CART_ITEMS_UPDATED_AT] DEFAULT (sysdatetime())
);
GO

CREATE TABLE dbo.[CARTS](
  [id] bigint IDENTITY(1,1) NOT NULL,
  [user_email] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [status] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL CONSTRAINT [DF_CARTS_STATUS] DEFAULT ('ACTIVE'),
  [created_at] datetime2(0) NOT NULL CONSTRAINT [DF_CARTS_CREATED_AT] DEFAULT (sysdatetime()),
  [updated_at] datetime2(0) NOT NULL CONSTRAINT [DF_CARTS_UPDATED_AT] DEFAULT (sysdatetime())
);
GO

CREATE TABLE dbo.[CATALOG_CHANGE_REQUESTS](
  [id] bigint IDENTITY(1,1) NOT NULL,
  [store_id] int NOT NULL,
  [requester_email] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [request_type] varchar(30) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [product_id] int NULL,
  [variant_id] bigint NULL,
  [requested_data] nvarchar(max) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [reason] nvarchar(1000) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [status] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL CONSTRAINT [DF__CATALOG_C__statu__6EAB62A3] DEFAULT ('PENDING'),
  [reviewed_by] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [reviewed_at] datetime2(7) NULL,
  [created_at] datetime2(7) NOT NULL CONSTRAINT [DF__CATALOG_C__creat__7093AB15] DEFAULT (sysdatetime()),
  [updated_at] datetime2(7) NOT NULL CONSTRAINT [DF__CATALOG_C__updat__7187CF4E] DEFAULT (sysdatetime()),
  [review_note] nvarchar(1000) COLLATE SQL_Latin1_General_CP1_CI_AS NULL
);
GO

CREATE TABLE dbo.[CATALOG_IMPORT_BATCHES](
  [batch_id] varchar(80) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [manifest_sha256] char(64) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [deterministic_seed] int NOT NULL,
  [completed_at] datetime2(7) NOT NULL CONSTRAINT [DF__CATALOG_I__compl__0371755F] DEFAULT (sysdatetime())
);
GO

CREATE TABLE dbo.[CATALOG_PRODUCT_PROVENANCE](
  [product_id] int NOT NULL,
  [batch_id] varchar(80) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [product_key] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [model_family] nvarchar(180) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [colorway] nvarchar(180) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [manufacturer_style_code] varchar(80) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [dominant_color] nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [secondary_color] nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [source_url] nvarchar(1000) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [image_source_url] nvarchar(1500) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [image_sha256] char(64) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [verification_level] varchar(60) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL
);
GO

CREATE TABLE dbo.[CATEGORIES](
  [id] int IDENTITY(1,1) NOT NULL,
  [slug] varchar(80) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [name] nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [description] nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [image_url] nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [status] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL CONSTRAINT [DF_CATEGORIES_STATUS] DEFAULT ('ACTIVE'),
  [created_at] datetime2(0) NOT NULL CONSTRAINT [DF_CATEGORIES_CREATED_AT] DEFAULT (sysdatetime()),
  [updated_at] datetime2(0) NOT NULL CONSTRAINT [DF_CATEGORIES_UPDATED_AT] DEFAULT (sysdatetime())
);
GO

CREATE TABLE dbo.[CATEGORY_PROMOTIONS](
  [promotion_id] int NOT NULL,
  [category_id] int NOT NULL
);
GO

CREATE TABLE dbo.[COUPON_USAGES](
  [id] bigint IDENTITY(1,1) NOT NULL,
  [coupon_id] int NOT NULL,
  [user_email] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [order_id] bigint NOT NULL,
  [used_at] datetime2(0) NOT NULL CONSTRAINT [DF_COUPON_USAGES_USED_AT] DEFAULT (sysdatetime())
);
GO

CREATE TABLE dbo.[COUPONS](
  [id] int IDENTITY(1,1) NOT NULL,
  [code] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [name] nvarchar(120) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [description] nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [discount_type] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [discount_value] decimal(18,2) NOT NULL,
  [min_order_value] decimal(18,2) NOT NULL CONSTRAINT [DF_COUPONS_MIN_ORDER] DEFAULT ((0)),
  [max_discount_value] decimal(18,2) NULL,
  [usage_limit] int NULL,
  [used_count] int NOT NULL CONSTRAINT [DF_COUPONS_USED_COUNT] DEFAULT ((0)),
  [starts_at] datetime2(0) NOT NULL,
  [ends_at] datetime2(0) NOT NULL,
  [is_active] bit NOT NULL CONSTRAINT [DF_COUPONS_ACTIVE] DEFAULT ((1)),
  [per_user_limit] int NULL
);
GO

CREATE TABLE dbo.[DEMO_VARIANT_SALES](
  [variant_id] bigint NOT NULL,
  [store_id] int NOT NULL,
  [period_start] date NOT NULL,
  [period_end] date NOT NULL,
  [quantity_sold] int NOT NULL,
  [is_demo] bit NOT NULL CONSTRAINT [DF_DEMO_VARIANT_SALES_MARKER] DEFAULT ((1)),
  [batch_id] varchar(80) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL
);
GO

CREATE TABLE dbo.[INVENTORY_MOVEMENTS](
  [id] bigint IDENTITY(1,1) NOT NULL,
  [store_id] int NOT NULL,
  [variant_id] bigint NOT NULL,
  [old_quantity] int NOT NULL,
  [quantity_delta] int NOT NULL,
  [new_quantity] int NOT NULL,
  [movement_type] varchar(30) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [reason] nvarchar(1000) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [reference_type] varchar(40) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [reference_id] bigint NULL,
  [performed_by] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [created_at] datetime2(7) NOT NULL CONSTRAINT [DF__INVENTORY__creat__15C52FC4] DEFAULT (sysdatetime())
);
GO

CREATE TABLE dbo.[INVENTORY_RESTOCK_REQUESTS](
  [id] bigint IDENTITY(1,1) NOT NULL,
  [store_id] int NOT NULL,
  [variant_id] bigint NOT NULL,
  [current_quantity] int NOT NULL,
  [reorder_level] int NOT NULL,
  [requested_quantity] int NOT NULL,
  [reason] nvarchar(1000) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [note] nvarchar(1000) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [status] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL CONSTRAINT [DF__INVENTORY__statu__7740A8A4] DEFAULT ('PENDING'),
  [requested_by] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [reviewed_by] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [created_at] datetime2(7) NOT NULL CONSTRAINT [DF__INVENTORY__creat__7A1D154F] DEFAULT (sysdatetime()),
  [reviewed_at] datetime2(7) NULL,
  [fulfilled_at] datetime2(7) NULL
);
GO

CREATE TABLE dbo.[ORDER_CANCELLATIONS](
  [id] bigint IDENTITY(1,1) NOT NULL,
  [order_id] bigint NOT NULL,
  [requested_by_email] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [reason] nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [other_reason] nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [status] varchar(30) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL CONSTRAINT [DF_ORDER_CANCELLATIONS_STATUS] DEFAULT ('PENDING'),
  [requested_at] datetime2(0) NOT NULL,
  [responded_at] datetime2(0) NULL,
  [response_note] nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS NULL
);
GO

CREATE TABLE dbo.[ORDER_ITEMS](
  [id] bigint IDENTITY(1,1) NOT NULL,
  [order_id] bigint NOT NULL,
  [product_id] int NOT NULL,
  [store_id] int NOT NULL,
  [variant_id] bigint NOT NULL,
  [product_name] nvarchar(180) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [variant_name] nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [image_url] nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [quantity] int NOT NULL,
  [unit_price] decimal(18,2) NOT NULL,
  [discount_amount] decimal(18,2) NOT NULL CONSTRAINT [DF_ORDER_ITEMS_DISCOUNT] DEFAULT ((0)),
  [line_total] decimal(18,2) NOT NULL
);
GO

CREATE TABLE dbo.[ORDER_STATUS_HISTORY](
  [id] bigint IDENTITY(1,1) NOT NULL,
  [order_id] bigint NOT NULL,
  [status] nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [note] nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [created_at] datetime2(0) NOT NULL
);
GO

CREATE TABLE dbo.[ORDER_STORE_FULFILLMENTS](
  [id] bigint IDENTITY(1,1) NOT NULL,
  [order_id] bigint NOT NULL,
  [store_id] int NOT NULL,
  [status] nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [confirmed_at] datetime2(7) NULL,
  [delivered_at] datetime2(7) NULL,
  [cancelled_at] datetime2(7) NULL,
  [updated_by] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [updated_at] datetime2(7) NOT NULL CONSTRAINT [DF__ORDER_STO__updat__095F58DF] DEFAULT (sysdatetime())
);
GO

CREATE TABLE dbo.[ORDERS](
  [id] bigint IDENTITY(1,1) NOT NULL,
  [order_code] varchar(40) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [user_email] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [status] nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL CONSTRAINT [DF_ORDER_STATUS_FINAL] DEFAULT (N'Chờ xác nhận đơn hàng'),
  [recipient_name] nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [recipient_phone] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [shipping_address_line] nvarchar(200) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [shipping_ward] nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [shipping_district] nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [shipping_city] nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [shipping_note] nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [payment_method] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [coupon_id] int NULL,
  [subtotal] decimal(18,2) NOT NULL,
  [product_discount] decimal(18,2) NOT NULL CONSTRAINT [DF_ORDERS_PRODUCT_DISCOUNT] DEFAULT ((0)),
  [shipping_fee] decimal(18,2) NOT NULL CONSTRAINT [DF_ORDERS_SHIPPING_FEE] DEFAULT ((30000)),
  [coupon_discount] decimal(18,2) NOT NULL CONSTRAINT [DF_ORDERS_COUPON_DISCOUNT] DEFAULT ((0)),
  [total] decimal(18,2) NOT NULL,
  [created_at] datetime2(0) NOT NULL CONSTRAINT [DF_ORDERS_CREATED_AT] DEFAULT (sysdatetime()),
  [updated_at] datetime2(0) NOT NULL CONSTRAINT [DF_ORDERS_UPDATED_AT] DEFAULT (sysdatetime()),
  [delivery_mail_sent_at] datetime2(7) NULL,
  [fulfillment_mode] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL CONSTRAINT [DF_ORDER_MODE] DEFAULT ('DELIVERY')
);
GO

CREATE TABLE dbo.[OTP_VERIFICATIONS](
  [id] bigint IDENTITY(1,1) NOT NULL,
  [user_email] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [hashed_otp] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [expires_at] datetime2(0) NOT NULL,
  [attempts] int NOT NULL CONSTRAINT [DF_OTP_ATTEMPTS] DEFAULT ((0)),
  [type] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [is_used] bit NOT NULL CONSTRAINT [DF_OTP_IS_USED] DEFAULT ((0)),
  [created_at] datetime2(0) NOT NULL CONSTRAINT [DF_OTP_CREATED_AT] DEFAULT (sysdatetime())
);
GO

CREATE TABLE dbo.[PASSWORD_RESET_TOKENS](
  [id] bigint IDENTITY(1,1) NOT NULL,
  [user_email] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [hashed_token] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [expires_at] datetime2(0) NOT NULL,
  [is_used] bit NOT NULL CONSTRAINT [DF_RESET_IS_USED] DEFAULT ((0)),
  [created_at] datetime2(0) NOT NULL CONSTRAINT [DF_RESET_CREATED_AT] DEFAULT (sysdatetime())
);
GO

CREATE TABLE dbo.[PAYMENT_REFUNDS](
  [id] bigint IDENTITY(1,1) NOT NULL,
  [payment_id] bigint NOT NULL,
  [order_id] bigint NOT NULL,
  [amount] decimal(18,2) NOT NULL,
  [status] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [reason] nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [requested_at] datetime2(7) NOT NULL CONSTRAINT [DF__PAYMENT_R__reque__54B68676] DEFAULT (sysdatetime()),
  [processed_by] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [processed_at] datetime2(7) NULL,
  [transaction_reference] nvarchar(150) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [note] nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [created_at] datetime2(7) NOT NULL CONSTRAINT [DF__PAYMENT_R__creat__569ECEE8] DEFAULT (sysdatetime()),
  [updated_at] datetime2(7) NOT NULL CONSTRAINT [DF__PAYMENT_R__updat__5792F321] DEFAULT (sysdatetime())
);
GO

CREATE TABLE dbo.[PAYMENT_VERIFICATIONS](
  [id] bigint IDENTITY(1,1) NOT NULL,
  [payment_id] bigint NOT NULL,
  [reported_by] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [reported_at] datetime2(7) NOT NULL CONSTRAINT [DF__PAYMENT_V__repor__1C722D53] DEFAULT (sysdatetime()),
  [status] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL CONSTRAINT [DF__PAYMENT_V__statu__1D66518C] DEFAULT ('PENDING'),
  [reviewed_by] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [reviewed_at] datetime2(7) NULL,
  [review_note] nvarchar(1000) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [created_at] datetime2(7) NOT NULL CONSTRAINT [DF__PAYMENT_V__creat__1F4E99FE] DEFAULT (sysdatetime()),
  [updated_at] datetime2(7) NOT NULL CONSTRAINT [DF__PAYMENT_V__updat__2042BE37] DEFAULT (sysdatetime())
);
GO

CREATE TABLE dbo.[PAYMENTS](
  [id] bigint IDENTITY(1,1) NOT NULL,
  [order_id] bigint NOT NULL,
  [method] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [status] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [transaction_ref] varchar(120) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [amount] decimal(18,2) NOT NULL,
  [paid_at] datetime2(0) NULL,
  [created_at] datetime2(0) NOT NULL CONSTRAINT [DF_PAYMENTS_CREATED_AT] DEFAULT (sysdatetime())
);
GO

CREATE TABLE dbo.[PRODUCT_IMAGES](
  [id] bigint IDENTITY(1,1) NOT NULL,
  [product_id] int NOT NULL,
  [image_url] nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [alt_text] nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [sort_order] int NOT NULL CONSTRAINT [DF_PRODUCT_IMAGES_SORT] DEFAULT ((1)),
  [is_primary] bit NOT NULL CONSTRAINT [DF_PRODUCT_IMAGES_PRIMARY] DEFAULT ((0))
);
GO

CREATE TABLE dbo.[PRODUCT_PROMOTIONS](
  [product_id] int NOT NULL,
  [promotion_id] int NOT NULL
);
GO

CREATE TABLE dbo.[PRODUCT_VARIANTS](
  [id] bigint IDENTITY(1,1) NOT NULL,
  [product_id] int NOT NULL,
  [size] nvarchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [color] nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [sku] varchar(80) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [price_adjustment] decimal(18,2) NOT NULL CONSTRAINT [DF_VARIANTS_PRICE_ADJ] DEFAULT ((0)),
  [image_url] nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [status] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL CONSTRAINT [DF_VARIANTS_STATUS] DEFAULT ('ACTIVE')
);
GO

CREATE TABLE dbo.[PRODUCTS](
  [id] int IDENTITY(1,1) NOT NULL,
  [slug] varchar(180) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [name] nvarchar(180) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [description] nvarchar(max) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [category_id] int NOT NULL,
  [brand_id] int NOT NULL,
  [base_price] decimal(18,2) NOT NULL,
  [status] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL CONSTRAINT [DF_PRODUCTS_STATUS] DEFAULT ('ACTIVE'),
  [created_at] datetime2(0) NOT NULL CONSTRAINT [DF_PRODUCTS_CREATED_AT] DEFAULT (sysdatetime()),
  [updated_at] datetime2(0) NOT NULL CONSTRAINT [DF_PRODUCTS_UPDATED_AT] DEFAULT (sysdatetime())
);
GO

CREATE TABLE dbo.[PROMOTIONS](
  [id] int IDENTITY(1,1) NOT NULL,
  [name] nvarchar(120) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [description] nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [discount_type] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [discount_value] decimal(18,2) NOT NULL,
  [starts_at] datetime2(0) NOT NULL,
  [ends_at] datetime2(0) NOT NULL,
  [status] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL CONSTRAINT [DF_PROMOTIONS_STATUS] DEFAULT ('ACTIVE'),
  [scope] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL CONSTRAINT [DF_ADMIN_PROMOTION_SCOPE] DEFAULT ('PRODUCT'),
  [priority] int NOT NULL CONSTRAINT [DF_ADMIN_PROMOTION_PRIORITY] DEFAULT ((0))
);
GO

CREATE TABLE dbo.[REVIEW_RESPONSES](
  [id] bigint IDENTITY(1,1) NOT NULL,
  [review_id] bigint NOT NULL,
  [order_item_id] bigint NOT NULL,
  [store_id] int NOT NULL,
  [responder_email] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [content] nvarchar(2000) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [created_at] datetime2(7) NOT NULL CONSTRAINT [DF__REVIEW_RE__creat__6D823440] DEFAULT (sysdatetime()),
  [updated_at] datetime2(7) NOT NULL CONSTRAINT [DF__REVIEW_RE__updat__6E765879] DEFAULT (sysdatetime())
);
GO

CREATE TABLE dbo.[REVIEWS](
  [id] bigint IDENTITY(1,1) NOT NULL,
  [order_id] bigint NOT NULL,
  [order_item_id] bigint NOT NULL,
  [user_email] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [product_id] int NOT NULL,
  [rating] int NOT NULL,
  [comment] nvarchar(1000) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [status] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL CONSTRAINT [DF_REVIEWS_STATUS] DEFAULT ('APPROVED'),
  [created_at] datetime2(0) NOT NULL CONSTRAINT [DF_REVIEWS_CREATED_AT] DEFAULT (sysdatetime()),
  [updated_at] datetime2(0) NOT NULL CONSTRAINT [DF_REVIEWS_UPDATED_AT] DEFAULT (sysdatetime())
);
GO

CREATE TABLE dbo.[ROLES](
  [id] int IDENTITY(1,1) NOT NULL,
  [name] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL
);
GO

CREATE TABLE dbo.[SIZE_CHART_ENTRIES](
  [id] bigint IDENTITY(1,1) NOT NULL,
  [size_chart_id] bigint NOT NULL,
  [foot_length_min_cm] decimal(5,2) NOT NULL,
  [foot_length_max_cm] decimal(5,2) NOT NULL,
  [eu_size] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [us_men_size] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [us_women_size] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [uk_size] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [jp_cm] decimal(5,2) NULL,
  [width_code] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [recommendation_note] nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [sort_order] int NOT NULL CONSTRAINT [DF__SIZE_CHAR__sort___47919582] DEFAULT ((0))
);
GO

CREATE TABLE dbo.[SIZE_CHARTS](
  [id] bigint IDENTITY(1,1) NOT NULL,
  [name] nvarchar(180) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [brand_id] int NULL,
  [category_id] int NULL,
  [product_id] int NULL,
  [gender_scope] varchar(30) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [source_type] varchar(30) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [source_reference] nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [notes] nvarchar(1000) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [is_active] bit NOT NULL CONSTRAINT [DF__SIZE_CHAR__is_ac__40E497F3] DEFAULT ((1)),
  [created_at] datetime2(7) NOT NULL CONSTRAINT [DF__SIZE_CHAR__creat__41D8BC2C] DEFAULT (sysdatetime()),
  [updated_at] datetime2(7) NOT NULL CONSTRAINT [DF__SIZE_CHAR__updat__42CCE065] DEFAULT (sysdatetime())
);
GO

CREATE TABLE dbo.[STORE_INVENTORY](
  [store_id] int NOT NULL,
  [variant_id] bigint NOT NULL,
  [quantity] int NOT NULL CONSTRAINT [DF_STORE_INVENTORY_QTY] DEFAULT ((0)),
  [updated_at] datetime2(0) NOT NULL CONSTRAINT [DF_STORE_INVENTORY_UPDATED_AT] DEFAULT (sysdatetime()),
  [reorder_level] int NOT NULL CONSTRAINT [DF_MANAGER_REORDER] DEFAULT ((10))
);
GO

CREATE TABLE dbo.[STORE_INVENTORY_BACKUP_20261004_140514500](
  [store_id] int NOT NULL,
  [variant_id] bigint NOT NULL,
  [quantity] int NOT NULL,
  [updated_at] datetime2(0) NOT NULL
);
GO

CREATE TABLE dbo.[STORE_PROMOTIONS](
  [promotion_id] int NOT NULL,
  [store_id] int NOT NULL
);
GO

CREATE TABLE dbo.[STORE_REPORTS](
  [id] bigint IDENTITY(1,1) NOT NULL,
  [store_id] int NOT NULL,
  [created_by_email] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [report_type] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [file_name] varchar(150) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [content_type] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [file_size] bigint NOT NULL,
  [sha256] char(64) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [file_data] varbinary(max) NOT NULL,
  [filter_snapshot] nvarchar(4000) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [sort_snapshot] nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [columns_snapshot] nvarchar(2000) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [row_count] int NOT NULL,
  [created_at] datetime2(7) NOT NULL CONSTRAINT [DF__STORE_REP__creat__76177A41] DEFAULT (sysdatetime()),
  [sent_at] datetime2(7) NULL
);
GO

CREATE TABLE dbo.[STORE_STAFF_ASSIGNMENTS](
  [id] bigint IDENTITY(1,1) NOT NULL,
  [store_id] int NOT NULL,
  [user_email] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [active] bit NOT NULL CONSTRAINT [DF__STORE_STA__activ__4E3E9311] DEFAULT ((1)),
  [assigned_at] datetime2(7) NOT NULL CONSTRAINT [DF__STORE_STA__assig__4F32B74A] DEFAULT (sysdatetime())
);
GO

CREATE TABLE dbo.[STORE_STATUS_HISTORY](
  [id] bigint IDENTITY(1,1) NOT NULL,
  [store_id] int NOT NULL,
  [old_status] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [new_status] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [changed_by] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [changed_at] datetime2(7) NOT NULL CONSTRAINT [DF__STORE_STA__chang__670A40DB] DEFAULT (sysdatetime())
);
GO

CREATE TABLE dbo.[STORES](
  [store_id] int IDENTITY(1,1) NOT NULL,
  [slug] varchar(80) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [name] nvarchar(150) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [description] nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [image_url] nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [phone] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [address_line] nvarchar(200) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [ward] nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [district] nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [city] nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [status] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [rating_average] decimal(3,2) NOT NULL CONSTRAINT [DF_STORES_RATING] DEFAULT ((0)),
  [review_count] int NOT NULL CONSTRAINT [DF_STORES_REVIEW_COUNT] DEFAULT ((0)),
  [manager_email] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [created_at] datetime2(0) NOT NULL CONSTRAINT [DF_STORES_CREATED_AT] DEFAULT (sysdatetime())
);
GO

CREATE TABLE dbo.[SUPPORT_CONVERSATION_READ_STATE](
  [conversation_id] bigint NOT NULL,
  [user_email] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [last_read_message_id] bigint NULL,
  [last_read_at] datetime2(7) NOT NULL CONSTRAINT [DF__SUPPORT_C__last___02B25B50] DEFAULT (sysdatetime())
);
GO

CREATE TABLE dbo.[SUPPORT_CONVERSATIONS](
  [id] bigint IDENTITY(1,1) NOT NULL,
  [user_email] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [store_id] int NOT NULL,
  [order_id] bigint NULL,
  [product_id] int NULL,
  [source] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [status] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL CONSTRAINT [DF__SUPPORT_C__statu__55DFB4D9] DEFAULT ('OPEN'),
  [handoff_reason] varchar(30) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [handoff_summary] nvarchar(1000) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [created_at] datetime2(7) NOT NULL CONSTRAINT [DF__SUPPORT_C__creat__56D3D912] DEFAULT (sysdatetime()),
  [updated_at] datetime2(7) NOT NULL CONSTRAINT [DF__SUPPORT_C__updat__57C7FD4B] DEFAULT (sysdatetime()),
  [last_message_at] datetime2(7) NULL,
  [closed_at] datetime2(7) NULL
);
GO

CREATE TABLE dbo.[SUPPORT_MESSAGES](
  [id] bigint IDENTITY(1,1) NOT NULL,
  [conversation_id] bigint NOT NULL,
  [sender_type] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [sender_email] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [content] nvarchar(2000) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [client_message_id] varchar(36) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [created_at] datetime2(7) NOT NULL CONSTRAINT [DF__SUPPORT_M__creat__5F691F13] DEFAULT (sysdatetime())
);
GO

CREATE TABLE dbo.[USER_ADDRESSES](
  [id] bigint IDENTITY(1,1) NOT NULL,
  [user_email] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [full_name] nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [phone] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [city] nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [district] nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [ward] nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [address_line] nvarchar(200) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [note] nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [is_default] bit NOT NULL CONSTRAINT [DF_USER_ADDRESSES_DEFAULT] DEFAULT ((0)),
  [created_at] datetime2(0) NOT NULL CONSTRAINT [DF_USER_ADDRESSES_CREATED_AT] DEFAULT (sysdatetime()),
  [updated_at] datetime2(0) NOT NULL CONSTRAINT [DF_USER_ADDRESSES_UPDATED_AT] DEFAULT (sysdatetime())
);
GO

CREATE TABLE dbo.[USER_ROLES](
  [user_email] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [role_id] int NOT NULL
);
GO

CREATE TABLE dbo.[USERS](
  [email] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [username] varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [full_name] nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [phone] varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
  [password_hash] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [is_enabled] bit NOT NULL CONSTRAINT [DF_USERS_IS_ENABLED] DEFAULT ((1)),
  [created_at] datetime2(0) NOT NULL CONSTRAINT [DF_USERS_CREATED_AT] DEFAULT (sysdatetime()),
  [updated_at] datetime2(0) NOT NULL CONSTRAINT [DF_USERS_UPDATED_AT] DEFAULT (sysdatetime()),
  [avatar_url] nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS NULL
);
GO

CREATE TABLE dbo.[VARIANT_PROMOTIONS](
  [promotion_id] int NOT NULL,
  [variant_id] bigint NOT NULL
);
GO

CREATE TABLE dbo.[WISHLIST_ITEMS](
  [user_email] varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
  [product_id] int NOT NULL,
  [created_at] datetime2(0) NOT NULL CONSTRAINT [DF_WISHLIST_CREATED_AT] DEFAULT (sysdatetime())
);
GO

ALTER TABLE dbo.[ADMIN_AUDIT_LOG] ADD CONSTRAINT [PK__ADMIN_AU__3213E83F162D0080] PRIMARY KEY CLUSTERED([id] ASC);
GO

CREATE NONCLUSTERED INDEX [IX_ADMIN_AUDIT] ON dbo.[ADMIN_AUDIT_LOG]([created_at] DESC);
GO

ALTER TABLE dbo.[BRAND_PROMOTIONS] ADD CONSTRAINT [PK__BRAND_PR__495CFD89EC59F572] PRIMARY KEY CLUSTERED([promotion_id] ASC,[brand_id] ASC);
GO

ALTER TABLE dbo.[BRANDS] ADD CONSTRAINT [PK_BRANDS] PRIMARY KEY CLUSTERED([id] ASC);
GO

ALTER TABLE dbo.[BRANDS] ADD CONSTRAINT [UQ_BRANDS_NAME] UNIQUE NONCLUSTERED([name] ASC);
GO

ALTER TABLE dbo.[BRANDS] ADD CONSTRAINT [UQ_BRANDS_SLUG] UNIQUE NONCLUSTERED([slug] ASC);
GO

ALTER TABLE dbo.[CART_ITEMS] ADD CONSTRAINT [PK_CART_ITEMS] PRIMARY KEY CLUSTERED([id] ASC);
GO

ALTER TABLE dbo.[CART_ITEMS] ADD CONSTRAINT [UQ_CART_ITEMS_IDENTITY] UNIQUE NONCLUSTERED([cart_id] ASC,[product_id] ASC,[variant_id] ASC,[store_id] ASC);
GO

CREATE NONCLUSTERED INDEX [IX_CART_ITEMS_CART] ON dbo.[CART_ITEMS]([cart_id] ASC);
GO

ALTER TABLE dbo.[CARTS] ADD CONSTRAINT [PK_CARTS] PRIMARY KEY CLUSTERED([id] ASC);
GO

ALTER TABLE dbo.[CATALOG_CHANGE_REQUESTS] ADD CONSTRAINT [PK__CATALOG___3213E83F491286FA] PRIMARY KEY CLUSTERED([id] ASC);
GO

CREATE NONCLUSTERED INDEX [IX_MANAGER_CATALOG_REQUESTS] ON dbo.[CATALOG_CHANGE_REQUESTS]([store_id] ASC,[created_at] DESC);
GO

ALTER TABLE dbo.[CATALOG_IMPORT_BATCHES] ADD CONSTRAINT [PK__CATALOG___DBFC04315E2318EC] PRIMARY KEY CLUSTERED([batch_id] ASC);
GO

ALTER TABLE dbo.[CATALOG_PRODUCT_PROVENANCE] ADD CONSTRAINT [PK__CATALOG___47027DF5A4ACA509] PRIMARY KEY CLUSTERED([product_id] ASC);
GO

ALTER TABLE dbo.[CATALOG_PRODUCT_PROVENANCE] ADD CONSTRAINT [UQ_CATALOG_PROVENANCE_BATCH_KEY] UNIQUE NONCLUSTERED([batch_id] ASC,[product_key] ASC);
GO

ALTER TABLE dbo.[CATEGORIES] ADD CONSTRAINT [PK_CATEGORIES] PRIMARY KEY CLUSTERED([id] ASC);
GO

ALTER TABLE dbo.[CATEGORIES] ADD CONSTRAINT [UQ_CATEGORIES_NAME] UNIQUE NONCLUSTERED([name] ASC);
GO

ALTER TABLE dbo.[CATEGORIES] ADD CONSTRAINT [UQ_CATEGORIES_SLUG] UNIQUE NONCLUSTERED([slug] ASC);
GO

ALTER TABLE dbo.[CATEGORY_PROMOTIONS] ADD CONSTRAINT [PK__CATEGORY__71EDBBF0BB9AB1DD] PRIMARY KEY CLUSTERED([promotion_id] ASC,[category_id] ASC);
GO

ALTER TABLE dbo.[COUPON_USAGES] ADD CONSTRAINT [PK_COUPON_USAGES] PRIMARY KEY CLUSTERED([id] ASC);
GO

ALTER TABLE dbo.[COUPONS] ADD CONSTRAINT [PK_COUPONS] PRIMARY KEY CLUSTERED([id] ASC);
GO

ALTER TABLE dbo.[COUPONS] ADD CONSTRAINT [UQ_COUPONS_CODE] UNIQUE NONCLUSTERED([code] ASC);
GO

ALTER TABLE dbo.[DEMO_VARIANT_SALES] ADD CONSTRAINT [PK_DEMO_VARIANT_SALES] PRIMARY KEY CLUSTERED([variant_id] ASC,[store_id] ASC,[period_start] ASC,[period_end] ASC);
GO

ALTER TABLE dbo.[INVENTORY_MOVEMENTS] ADD CONSTRAINT [PK__INVENTOR__3213E83F09EBB14B] PRIMARY KEY CLUSTERED([id] ASC);
GO

CREATE NONCLUSTERED INDEX [IX_ADMIN_MOVEMENTS] ON dbo.[INVENTORY_MOVEMENTS]([store_id] ASC,[variant_id] ASC,[created_at] DESC);
GO

ALTER TABLE dbo.[INVENTORY_RESTOCK_REQUESTS] ADD CONSTRAINT [PK__INVENTOR__3213E83F486EB607] PRIMARY KEY CLUSTERED([id] ASC);
GO

CREATE UNIQUE NONCLUSTERED INDEX [UX_MANAGER_PENDING_RESTOCK] ON dbo.[INVENTORY_RESTOCK_REQUESTS]([store_id] ASC,[variant_id] ASC) WHERE ([status]='PENDING');
GO

ALTER TABLE dbo.[ORDER_CANCELLATIONS] ADD CONSTRAINT [PK_ORDER_CANCELLATIONS] PRIMARY KEY CLUSTERED([id] ASC);
GO

ALTER TABLE dbo.[ORDER_ITEMS] ADD CONSTRAINT [PK_ORDER_ITEMS] PRIMARY KEY CLUSTERED([id] ASC);
GO

CREATE NONCLUSTERED INDEX [IX_ORDER_ITEMS_ORDER] ON dbo.[ORDER_ITEMS]([order_id] ASC);
GO

CREATE NONCLUSTERED INDEX [IX_MANAGER_ORDER_ITEMS] ON dbo.[ORDER_ITEMS]([store_id] ASC,[order_id] ASC) INCLUDE([quantity],[line_total],[product_id],[variant_id]);
GO

CREATE UNIQUE NONCLUSTERED INDEX [UQ_FINAL_ITEM_STORE] ON dbo.[ORDER_ITEMS]([id] ASC,[store_id] ASC);
GO

ALTER TABLE dbo.[ORDER_STATUS_HISTORY] ADD CONSTRAINT [PK_ORDER_STATUS_HISTORY] PRIMARY KEY CLUSTERED([id] ASC);
GO

CREATE NONCLUSTERED INDEX [IX_ORDER_STATUS_HISTORY_ORDER_CREATED_AT] ON dbo.[ORDER_STATUS_HISTORY]([order_id] ASC,[created_at] ASC);
GO

ALTER TABLE dbo.[ORDER_STORE_FULFILLMENTS] ADD CONSTRAINT [PK__ORDER_ST__3213E83F7AC9A009] PRIMARY KEY CLUSTERED([id] ASC);
GO

ALTER TABLE dbo.[ORDER_STORE_FULFILLMENTS] ADD CONSTRAINT [UQ_MANAGER_FULFILLMENT] UNIQUE NONCLUSTERED([order_id] ASC,[store_id] ASC);
GO

ALTER TABLE dbo.[ORDERS] ADD CONSTRAINT [PK_ORDERS] PRIMARY KEY CLUSTERED([id] ASC);
GO

ALTER TABLE dbo.[ORDERS] ADD CONSTRAINT [UQ_ORDERS_CODE] UNIQUE NONCLUSTERED([order_code] ASC);
GO

CREATE NONCLUSTERED INDEX [IX_ORDERS_USER_CREATED_AT] ON dbo.[ORDERS]([user_email] ASC,[created_at] DESC);
GO

ALTER TABLE dbo.[OTP_VERIFICATIONS] ADD CONSTRAINT [PK_OTP_VERIFICATIONS] PRIMARY KEY CLUSTERED([id] ASC);
GO

ALTER TABLE dbo.[PASSWORD_RESET_TOKENS] ADD CONSTRAINT [PK_PASSWORD_RESET_TOKENS] PRIMARY KEY CLUSTERED([id] ASC);
GO

ALTER TABLE dbo.[PAYMENT_REFUNDS] ADD CONSTRAINT [PK__PAYMENT___3213E83F03BC5071] PRIMARY KEY CLUSTERED([id] ASC);
GO

ALTER TABLE dbo.[PAYMENT_REFUNDS] ADD CONSTRAINT [UQ__PAYMENT___ED1FC9EBAEB9CCA3] UNIQUE NONCLUSTERED([payment_id] ASC);
GO

ALTER TABLE dbo.[PAYMENT_VERIFICATIONS] ADD CONSTRAINT [PK__PAYMENT___3213E83FEC8EBDDE] PRIMARY KEY CLUSTERED([id] ASC);
GO

CREATE UNIQUE NONCLUSTERED INDEX [UX_ADMIN_PENDING_VERIFICATION] ON dbo.[PAYMENT_VERIFICATIONS]([payment_id] ASC) WHERE ([status]='PENDING');
GO

ALTER TABLE dbo.[PAYMENTS] ADD CONSTRAINT [PK_PAYMENTS] PRIMARY KEY CLUSTERED([id] ASC);
GO

ALTER TABLE dbo.[PRODUCT_IMAGES] ADD CONSTRAINT [PK_PRODUCT_IMAGES] PRIMARY KEY CLUSTERED([id] ASC);
GO

CREATE NONCLUSTERED INDEX [IX_PRODUCT_IMAGES_PRODUCT] ON dbo.[PRODUCT_IMAGES]([product_id] ASC,[is_primary] ASC,[sort_order] ASC);
GO

ALTER TABLE dbo.[PRODUCT_PROMOTIONS] ADD CONSTRAINT [PK_PRODUCT_PROMOTIONS] PRIMARY KEY CLUSTERED([product_id] ASC,[promotion_id] ASC);
GO

ALTER TABLE dbo.[PRODUCT_VARIANTS] ADD CONSTRAINT [PK_PRODUCT_VARIANTS] PRIMARY KEY CLUSTERED([id] ASC);
GO

ALTER TABLE dbo.[PRODUCT_VARIANTS] ADD CONSTRAINT [UQ_PRODUCT_VARIANTS_PRODUCT_SIZE_COLOR] UNIQUE NONCLUSTERED([product_id] ASC,[size] ASC,[color] ASC);
GO

ALTER TABLE dbo.[PRODUCT_VARIANTS] ADD CONSTRAINT [UQ_PRODUCT_VARIANTS_SKU] UNIQUE NONCLUSTERED([sku] ASC);
GO

CREATE NONCLUSTERED INDEX [IX_PRODUCT_VARIANTS_PRODUCT] ON dbo.[PRODUCT_VARIANTS]([product_id] ASC,[status] ASC);
GO

ALTER TABLE dbo.[PRODUCTS] ADD CONSTRAINT [PK_PRODUCTS] PRIMARY KEY CLUSTERED([id] ASC);
GO

ALTER TABLE dbo.[PRODUCTS] ADD CONSTRAINT [UQ_PRODUCTS_SLUG] UNIQUE NONCLUSTERED([slug] ASC);
GO

CREATE NONCLUSTERED INDEX [IX_PRODUCTS_CATEGORY_STATUS] ON dbo.[PRODUCTS]([category_id] ASC,[status] ASC);
GO

CREATE NONCLUSTERED INDEX [IX_PRODUCTS_BRAND_STATUS] ON dbo.[PRODUCTS]([brand_id] ASC,[status] ASC);
GO

ALTER TABLE dbo.[PROMOTIONS] ADD CONSTRAINT [PK_PROMOTIONS] PRIMARY KEY CLUSTERED([id] ASC);
GO

ALTER TABLE dbo.[REVIEW_RESPONSES] ADD CONSTRAINT [PK__REVIEW_R__3213E83F66781FA4] PRIMARY KEY CLUSTERED([id] ASC);
GO

ALTER TABLE dbo.[REVIEW_RESPONSES] ADD CONSTRAINT [UQ__REVIEW_R__60883D911F605FB8] UNIQUE NONCLUSTERED([review_id] ASC);
GO

ALTER TABLE dbo.[REVIEWS] ADD CONSTRAINT [PK_REVIEWS] PRIMARY KEY CLUSTERED([id] ASC);
GO

ALTER TABLE dbo.[REVIEWS] ADD CONSTRAINT [UQ_REVIEWS_USER_PRODUCT] UNIQUE NONCLUSTERED([user_email] ASC,[product_id] ASC);
GO

CREATE NONCLUSTERED INDEX [IX_REVIEWS_PRODUCT_STATUS] ON dbo.[REVIEWS]([product_id] ASC,[status] ASC);
GO

CREATE UNIQUE NONCLUSTERED INDEX [UQ_FINAL_REVIEW_ITEM] ON dbo.[REVIEWS]([id] ASC,[order_item_id] ASC);
GO

ALTER TABLE dbo.[ROLES] ADD CONSTRAINT [PK_ROLES] PRIMARY KEY CLUSTERED([id] ASC);
GO

ALTER TABLE dbo.[ROLES] ADD CONSTRAINT [UQ_ROLES_NAME] UNIQUE NONCLUSTERED([name] ASC);
GO

ALTER TABLE dbo.[SIZE_CHART_ENTRIES] ADD CONSTRAINT [PK__SIZE_CHA__3213E83F15AE7820] PRIMARY KEY CLUSTERED([id] ASC);
GO

ALTER TABLE dbo.[SIZE_CHARTS] ADD CONSTRAINT [PK__SIZE_CHA__3213E83F8FC61ED4] PRIMARY KEY CLUSTERED([id] ASC);
GO

ALTER TABLE dbo.[STORE_INVENTORY] ADD CONSTRAINT [PK_STORE_INVENTORY] PRIMARY KEY CLUSTERED([store_id] ASC,[variant_id] ASC);
GO

CREATE NONCLUSTERED INDEX [IX_STORE_INVENTORY_STORE_QTY] ON dbo.[STORE_INVENTORY]([store_id] ASC,[quantity] ASC);
GO

ALTER TABLE dbo.[STORE_PROMOTIONS] ADD CONSTRAINT [PK__STORE_PR__F6967F5B1067EE24] PRIMARY KEY CLUSTERED([promotion_id] ASC,[store_id] ASC);
GO

ALTER TABLE dbo.[STORE_REPORTS] ADD CONSTRAINT [PK__STORE_RE__3213E83F23B55F41] PRIMARY KEY CLUSTERED([id] ASC);
GO

CREATE NONCLUSTERED INDEX [IX_REPORT_SENT] ON dbo.[STORE_REPORTS]([sent_at] DESC,[id] DESC) INCLUDE([store_id],[report_type]) WHERE ([sent_at] IS NOT NULL);
GO

ALTER TABLE dbo.[STORE_STAFF_ASSIGNMENTS] ADD CONSTRAINT [PK__STORE_ST__3213E83FF1F24B37] PRIMARY KEY CLUSTERED([id] ASC);
GO

ALTER TABLE dbo.[STORE_STAFF_ASSIGNMENTS] ADD CONSTRAINT [UQ_STORE_STAFF] UNIQUE NONCLUSTERED([store_id] ASC,[user_email] ASC);
GO

ALTER TABLE dbo.[STORE_STATUS_HISTORY] ADD CONSTRAINT [PK__STORE_ST__3213E83FB3CF149D] PRIMARY KEY CLUSTERED([id] ASC);
GO

ALTER TABLE dbo.[STORES] ADD CONSTRAINT [PK_STORES] PRIMARY KEY CLUSTERED([store_id] ASC);
GO

ALTER TABLE dbo.[STORES] ADD CONSTRAINT [UQ_STORES_SLUG] UNIQUE NONCLUSTERED([slug] ASC);
GO

CREATE UNIQUE NONCLUSTERED INDEX [UX_STORES_MANAGER_EMAIL] ON dbo.[STORES]([manager_email] ASC) WHERE ([manager_email] IS NOT NULL);
GO

ALTER TABLE dbo.[SUPPORT_CONVERSATION_READ_STATE] ADD CONSTRAINT [PK_MANAGER_READ_STATE] PRIMARY KEY CLUSTERED([conversation_id] ASC,[user_email] ASC);
GO

ALTER TABLE dbo.[SUPPORT_CONVERSATIONS] ADD CONSTRAINT [PK__SUPPORT___3213E83F252A80EE] PRIMARY KEY CLUSTERED([id] ASC);
GO

CREATE UNIQUE NONCLUSTERED INDEX [UX_SUPPORT_OPEN] ON dbo.[SUPPORT_CONVERSATIONS]([user_email] ASC,[store_id] ASC,[order_id] ASC) WHERE ([status]='OPEN');
GO

ALTER TABLE dbo.[SUPPORT_MESSAGES] ADD CONSTRAINT [PK__SUPPORT___3213E83FF992BCEF] PRIMARY KEY CLUSTERED([id] ASC);
GO

CREATE UNIQUE NONCLUSTERED INDEX [UX_SUPPORT_MESSAGE_RETRY] ON dbo.[SUPPORT_MESSAGES]([conversation_id] ASC,[sender_email] ASC,[client_message_id] ASC) WHERE ([client_message_id] IS NOT NULL);
GO

CREATE NONCLUSTERED INDEX [IX_SUPPORT_MESSAGE_HISTORY] ON dbo.[SUPPORT_MESSAGES]([conversation_id] ASC,[id] ASC);
GO

ALTER TABLE dbo.[USER_ADDRESSES] ADD CONSTRAINT [PK_USER_ADDRESSES] PRIMARY KEY CLUSTERED([id] ASC);
GO

ALTER TABLE dbo.[USER_ROLES] ADD CONSTRAINT [PK_USER_ROLES] PRIMARY KEY CLUSTERED([user_email] ASC,[role_id] ASC);
GO

ALTER TABLE dbo.[USERS] ADD CONSTRAINT [PK_USERS] PRIMARY KEY CLUSTERED([email] ASC);
GO

ALTER TABLE dbo.[VARIANT_PROMOTIONS] ADD CONSTRAINT [PK__VARIANT___421593E034F8F1B4] PRIMARY KEY CLUSTERED([promotion_id] ASC,[variant_id] ASC);
GO

ALTER TABLE dbo.[WISHLIST_ITEMS] ADD CONSTRAINT [PK_WISHLIST_ITEMS] PRIMARY KEY CLUSTERED([user_email] ASC,[product_id] ASC);
GO

CREATE NONCLUSTERED INDEX [IX_WISHLIST_USER] ON dbo.[WISHLIST_ITEMS]([user_email] ASC,[created_at] DESC);
GO

ALTER TABLE dbo.[COUPONS] WITH CHECK ADD CONSTRAINT [CK_ADMIN_COUPON_USER_LIMIT] CHECK ([per_user_limit] IS NULL OR [per_user_limit]>(0));
GO

ALTER TABLE dbo.[INVENTORY_MOVEMENTS] WITH CHECK ADD CONSTRAINT [CK_ADMIN_MOVEMENT] CHECK ([old_quantity]>=(0) AND [new_quantity]>=(0) AND (CONVERT([bigint],[old_quantity])+[quantity_delta])=[new_quantity] AND ([movement_type]='RETURN' OR [movement_type]='CORRECTION' OR [movement_type]='MANUAL_ADJUSTMENT' OR [movement_type]='RESTOCK'));
GO

ALTER TABLE dbo.[PROMOTIONS] WITH CHECK ADD CONSTRAINT [CK_ADMIN_PROMOTION_SCOPE] CHECK ([scope]='VARIANT' OR [scope]='PRODUCT' OR [scope]='BRAND' OR [scope]='CATEGORY' OR [scope]='STORE' OR [scope]='GLOBAL');
GO

ALTER TABLE dbo.[PAYMENT_VERIFICATIONS] WITH CHECK ADD CONSTRAINT [CK_ADMIN_VERIFICATION] CHECK ([status]='REJECTED' OR [status]='CONFIRMED' OR [status]='PENDING');
GO

ALTER TABLE dbo.[CART_ITEMS] WITH CHECK ADD CONSTRAINT [CK_CART_ITEMS_PRICE] CHECK ([unit_price]>=(0));
GO

ALTER TABLE dbo.[CART_ITEMS] WITH CHECK ADD CONSTRAINT [CK_CART_ITEMS_QTY] CHECK ([quantity]>(0));
GO

ALTER TABLE dbo.[CARTS] WITH CHECK ADD CONSTRAINT [CK_CARTS_STATUS] CHECK ([status]='ARCHIVED' OR [status]='ACTIVE');
GO

ALTER TABLE dbo.[CATEGORIES] WITH CHECK ADD CONSTRAINT [CK_CATEGORIES_STATUS] CHECK ([status]='INACTIVE' OR [status]='ACTIVE');
GO

ALTER TABLE dbo.[COUPONS] WITH CHECK ADD CONSTRAINT [CK_COUPONS_MIN] CHECK ([min_order_value]>=(0));
GO

ALTER TABLE dbo.[COUPONS] WITH CHECK ADD CONSTRAINT [CK_COUPONS_TIME] CHECK ([ends_at]>[starts_at]);
GO

ALTER TABLE dbo.[COUPONS] WITH CHECK ADD CONSTRAINT [CK_COUPONS_TYPE] CHECK ([discount_type]='FREESHIP' OR [discount_type]='FIXED' OR [discount_type]='PERCENT');
GO

ALTER TABLE dbo.[COUPONS] WITH CHECK ADD CONSTRAINT [CK_COUPONS_USAGE] CHECK ([usage_limit] IS NULL OR [usage_limit]>(0));
GO

ALTER TABLE dbo.[COUPONS] WITH CHECK ADD CONSTRAINT [CK_COUPONS_VALUE] CHECK ([discount_value]>=(0));
GO

ALTER TABLE dbo.[DEMO_VARIANT_SALES] WITH CHECK ADD CONSTRAINT [CK_DEMO_VARIANT_SALES_MARKER] CHECK ([is_demo]=(1));
GO

ALTER TABLE dbo.[DEMO_VARIANT_SALES] WITH CHECK ADD CONSTRAINT [CK_DEMO_VARIANT_SALES_PERIOD] CHECK ([period_start]<[period_end]);
GO

ALTER TABLE dbo.[DEMO_VARIANT_SALES] WITH CHECK ADD CONSTRAINT [CK_DEMO_VARIANT_SALES_QUANTITY] CHECK ([quantity_sold]>=(0));
GO

ALTER TABLE dbo.[SUPPORT_CONVERSATIONS] WITH CHECK ADD CONSTRAINT [CK_HANDOFF_REASON] CHECK ([handoff_reason] IS NULL OR ([handoff_reason]='OTHER' OR [handoff_reason]='AI_UNRESOLVED' OR [handoff_reason]='ORDER_PROBLEM' OR [handoff_reason]='COMPLAINT' OR [handoff_reason]='REFUND_REQUEST' OR [handoff_reason]='MISSING_ITEM' OR [handoff_reason]='WRONG_ITEM' OR [handoff_reason]='PRODUCT_DEFECT'));
GO

ALTER TABLE dbo.[CATALOG_CHANGE_REQUESTS] WITH CHECK ADD CONSTRAINT [CK_MANAGER_CATALOG_JSON] CHECK (isjson([requested_data])=(1));
GO

ALTER TABLE dbo.[CATALOG_CHANGE_REQUESTS] WITH CHECK ADD CONSTRAINT [CK_MANAGER_CATALOG_STATUS] CHECK ([status]='APPLIED' OR [status]='REJECTED' OR [status]='APPROVED' OR [status]='PENDING');
GO

ALTER TABLE dbo.[CATALOG_CHANGE_REQUESTS] WITH CHECK ADD CONSTRAINT [CK_MANAGER_CATALOG_TYPE] CHECK ([request_type]='REMOVE_VARIANT' OR [request_type]='UPDATE_VARIANT' OR [request_type]='ADD_VARIANT' OR [request_type]='REMOVE_PRODUCT' OR [request_type]='UPDATE_PRODUCT' OR [request_type]='ADD_PRODUCT');
GO

ALTER TABLE dbo.[ORDER_STORE_FULFILLMENTS] WITH CHECK ADD CONSTRAINT [CK_MANAGER_FULFILLMENT_STATUS] CHECK ([status]=N'Đã hủy' OR [status]=N'Đã giao' OR [status]=N'Đang giao' OR [status]=N'Đơn hàng đã sẵn sàng' OR [status]=N'Đang chuẩn bị đơn hàng' OR [status]=N'Đã xác nhận' OR [status]=N'Chờ xác nhận đơn hàng');
GO

ALTER TABLE dbo.[STORE_INVENTORY] WITH CHECK ADD CONSTRAINT [CK_MANAGER_REORDER] CHECK ([reorder_level]>=(0));
GO

ALTER TABLE dbo.[INVENTORY_RESTOCK_REQUESTS] WITH CHECK ADD CONSTRAINT [CK_MANAGER_RESTOCK_QUANTITY] CHECK ([current_quantity]>=(0) AND [reorder_level]>=(0) AND [requested_quantity]>(0));
GO

ALTER TABLE dbo.[INVENTORY_RESTOCK_REQUESTS] WITH CHECK ADD CONSTRAINT [CK_MANAGER_RESTOCK_STATUS] CHECK ([status]='FULFILLED' OR [status]='REJECTED' OR [status]='APPROVED' OR [status]='PENDING');
GO

ALTER TABLE dbo.[STORE_STATUS_HISTORY] WITH CHECK ADD CONSTRAINT [CK_MANAGER_STORE_STATUS] CHECK (([old_status]='CLOSED' OR [old_status]='OPEN') AND ([new_status]='CLOSED' OR [new_status]='OPEN') AND [old_status]<>[new_status]);
GO

ALTER TABLE dbo.[ORDER_CANCELLATIONS] WITH CHECK ADD CONSTRAINT [CK_ORDER_CANCELLATIONS_STATUS] CHECK ([status]='REJECTED' OR [status]='APPROVED' OR [status]='PENDING');
GO

ALTER TABLE dbo.[ORDER_ITEMS] WITH CHECK ADD CONSTRAINT [CK_ORDER_ITEMS_MONEY] CHECK ([unit_price]>=(0) AND [discount_amount]>=(0) AND [line_total]>=(0));
GO

ALTER TABLE dbo.[ORDER_ITEMS] WITH CHECK ADD CONSTRAINT [CK_ORDER_ITEMS_QTY] CHECK ([quantity]>(0));
GO

ALTER TABLE dbo.[ORDERS] WITH CHECK ADD CONSTRAINT [CK_ORDER_MODE] CHECK ([fulfillment_mode]='DELIVERY' OR [fulfillment_mode]='PICKUP');
GO

ALTER TABLE dbo.[ORDER_STATUS_HISTORY] WITH CHECK ADD CONSTRAINT [CK_ORDER_STATUS_HISTORY_STATUS] CHECK ([status]=N'Đã hủy' OR [status]=N'Đã giao' OR [status]=N'Đang giao' OR [status]=N'Đơn hàng đã sẵn sàng' OR [status]=N'Đang chuẩn bị đơn hàng' OR [status]=N'Đã xác nhận' OR [status]=N'Chờ xác nhận đơn hàng');
GO

ALTER TABLE dbo.[ORDERS] WITH CHECK ADD CONSTRAINT [CK_ORDERS_MONEY] CHECK ([subtotal]>=(0) AND [product_discount]>=(0) AND [shipping_fee]>=(0) AND [coupon_discount]>=(0) AND [total]>=(0));
GO

ALTER TABLE dbo.[ORDERS] WITH CHECK ADD CONSTRAINT [CK_ORDERS_PAYMENT_METHOD] CHECK ([payment_method]='BANKING' OR [payment_method]='COD');
GO

ALTER TABLE dbo.[ORDERS] WITH CHECK ADD CONSTRAINT [CK_ORDERS_STATUS] CHECK ([status]=N'Đã hủy' OR [status]=N'Đã giao' OR [status]=N'Đang giao' OR [status]=N'Đơn hàng đã sẵn sàng' OR [status]=N'Đang chuẩn bị đơn hàng' OR [status]=N'Đã xác nhận' OR [status]=N'Chờ xác nhận đơn hàng');
GO

ALTER TABLE dbo.[OTP_VERIFICATIONS] WITH CHECK ADD CONSTRAINT [CK_OTP_TYPE_FINAL] CHECK ([type]='CHANGE_PASSWORD' OR [type]='FORGOT_PASSWORD' OR [type]='REGISTER');
GO

ALTER TABLE dbo.[PAYMENTS] WITH CHECK ADD CONSTRAINT [CK_PAYMENTS_AMOUNT] CHECK ([amount]>=(0));
GO

ALTER TABLE dbo.[PAYMENTS] WITH CHECK ADD CONSTRAINT [CK_PAYMENTS_METHOD] CHECK ([method]='BANKING' OR [method]='COD');
GO

ALTER TABLE dbo.[PAYMENTS] WITH CHECK ADD CONSTRAINT [CK_PAYMENTS_STATUS] CHECK ([status]='REFUNDED' OR [status]='FAILED' OR [status]='PAID' OR [status]='PENDING');
GO

ALTER TABLE dbo.[PRODUCT_IMAGES] WITH CHECK ADD CONSTRAINT [CK_PRODUCT_IMAGES_SORT] CHECK ([sort_order]>(0));
GO

ALTER TABLE dbo.[PRODUCT_VARIANTS] WITH CHECK ADD CONSTRAINT [CK_PRODUCT_VARIANTS_STATUS] CHECK ([status]='INACTIVE' OR [status]='ACTIVE');
GO

ALTER TABLE dbo.[PRODUCTS] WITH CHECK ADD CONSTRAINT [CK_PRODUCTS_PRICE] CHECK ([base_price]>=(0));
GO

ALTER TABLE dbo.[PRODUCTS] WITH CHECK ADD CONSTRAINT [CK_PRODUCTS_STATUS] CHECK ([status]='INACTIVE' OR [status]='ACTIVE');
GO

ALTER TABLE dbo.[PROMOTIONS] WITH CHECK ADD CONSTRAINT [CK_PROMOTIONS_STATUS] CHECK ([status]='INACTIVE' OR [status]='ACTIVE');
GO

ALTER TABLE dbo.[PROMOTIONS] WITH CHECK ADD CONSTRAINT [CK_PROMOTIONS_TIME] CHECK ([ends_at]>[starts_at]);
GO

ALTER TABLE dbo.[PROMOTIONS] WITH CHECK ADD CONSTRAINT [CK_PROMOTIONS_TYPE] CHECK ([discount_type]='FIXED' OR [discount_type]='PERCENT');
GO

ALTER TABLE dbo.[PROMOTIONS] WITH CHECK ADD CONSTRAINT [CK_PROMOTIONS_VALUE] CHECK ([discount_value]>(0));
GO

ALTER TABLE dbo.[PAYMENT_REFUNDS] WITH CHECK ADD CONSTRAINT [CK_REFUND_AMOUNT] CHECK ([amount]>(0));
GO

ALTER TABLE dbo.[PAYMENT_REFUNDS] WITH CHECK ADD CONSTRAINT [CK_REFUND_COMPLETION] CHECK ([status]<>'COMPLETED' OR [processed_by] IS NOT NULL AND [processed_at] IS NOT NULL);
GO

ALTER TABLE dbo.[PAYMENT_REFUNDS] WITH CHECK ADD CONSTRAINT [CK_REFUND_STATUS] CHECK ([status]='FAILED' OR [status]='COMPLETED' OR [status]='PENDING');
GO

ALTER TABLE dbo.[STORE_REPORTS] WITH CHECK ADD CONSTRAINT [CK_REPORT_ROWS] CHECK ([row_count]>=(0));
GO

ALTER TABLE dbo.[STORE_REPORTS] WITH CHECK ADD CONSTRAINT [CK_REPORT_SIZE] CHECK ([file_size]=datalength([file_data]) AND [file_size]>(0) AND [file_size]<=(20971520));
GO

ALTER TABLE dbo.[STORE_REPORTS] WITH CHECK ADD CONSTRAINT [CK_REPORT_TYPE] CHECK ([report_type]='DASHBOARD' OR [report_type]='PAYMENTS' OR [report_type]='ORDERS' OR [report_type]='INVENTORY' OR [report_type]='PRODUCTS');
GO

ALTER TABLE dbo.[REVIEW_RESPONSES] WITH CHECK ADD CONSTRAINT [CK_RESPONSE_CONTENT] CHECK (len(ltrim(rtrim([content])))>(0));
GO

ALTER TABLE dbo.[REVIEWS] WITH CHECK ADD CONSTRAINT [CK_REVIEWS_RATING] CHECK ([rating]>=(1) AND [rating]<=(5));
GO

ALTER TABLE dbo.[REVIEWS] WITH CHECK ADD CONSTRAINT [CK_REVIEWS_STATUS] CHECK ([status]='HIDDEN' OR [status]='APPROVED' OR [status]='PENDING');
GO

ALTER TABLE dbo.[SIZE_CHART_ENTRIES] WITH CHECK ADD CONSTRAINT [CK_SIZE_RANGE] CHECK ([foot_length_min_cm]>(0) AND [foot_length_max_cm]>=[foot_length_min_cm]);
GO

ALTER TABLE dbo.[SIZE_CHARTS] WITH CHECK ADD CONSTRAINT [CK_SIZE_SOURCE] CHECK ([source_type]='TWINKLE_REFERENCE' OR [source_type]='APPROVED' OR [source_type]='OFFICIAL');
GO

ALTER TABLE dbo.[STORE_INVENTORY] WITH CHECK ADD CONSTRAINT [CK_STORE_INVENTORY_QTY] CHECK ([quantity]>=(0));
GO

ALTER TABLE dbo.[STORES] WITH CHECK ADD CONSTRAINT [CK_STORES_RATING] CHECK ([rating_average]>=(0) AND [rating_average]<=(5));
GO

ALTER TABLE dbo.[STORES] WITH CHECK ADD CONSTRAINT [CK_STORES_REVIEW_COUNT] CHECK ([review_count]>=(0));
GO

ALTER TABLE dbo.[STORES] WITH CHECK ADD CONSTRAINT [CK_STORES_STATUS] CHECK ([status]='CLOSED' OR [status]='OPEN');
GO

ALTER TABLE dbo.[SUPPORT_MESSAGES] WITH CHECK ADD CONSTRAINT [CK_SUPPORT_SENDER] CHECK ([sender_type]='SYSTEM' OR [sender_type]='STAFF' OR [sender_type]='USER');
GO

ALTER TABLE dbo.[SUPPORT_CONVERSATIONS] WITH CHECK ADD CONSTRAINT [CK_SUPPORT_SOURCE] CHECK ([source]='DIRECT' OR [source]='AI_HANDOFF');
GO

ALTER TABLE dbo.[SUPPORT_CONVERSATIONS] WITH CHECK ADD CONSTRAINT [CK_SUPPORT_STATUS] CHECK ([status]='CLOSED' OR [status]='OPEN');
GO

ALTER TABLE dbo.[ADMIN_AUDIT_LOG] WITH CHECK ADD CONSTRAINT [FK__ADMIN_AUD__actor__11007AA7] FOREIGN KEY([actor_email]) REFERENCES dbo.[USERS]([email]);
GO

ALTER TABLE dbo.[BRAND_PROMOTIONS] WITH CHECK ADD CONSTRAINT [FK__BRAND_PRO__brand__2F8501C7] FOREIGN KEY([brand_id]) REFERENCES dbo.[BRANDS]([id]);
GO

ALTER TABLE dbo.[BRAND_PROMOTIONS] WITH CHECK ADD CONSTRAINT [FK__BRAND_PRO__promo__2E90DD8E] FOREIGN KEY([promotion_id]) REFERENCES dbo.[PROMOTIONS]([id]);
GO

ALTER TABLE dbo.[CATALOG_CHANGE_REQUESTS] WITH CHECK ADD CONSTRAINT [FK__CATALOG_C__produ__6CC31A31] FOREIGN KEY([product_id]) REFERENCES dbo.[PRODUCTS]([id]);
GO

ALTER TABLE dbo.[CATALOG_CHANGE_REQUESTS] WITH CHECK ADD CONSTRAINT [FK__CATALOG_C__reque__6BCEF5F8] FOREIGN KEY([requester_email]) REFERENCES dbo.[USERS]([email]);
GO

ALTER TABLE dbo.[CATALOG_CHANGE_REQUESTS] WITH CHECK ADD CONSTRAINT [FK__CATALOG_C__revie__6F9F86DC] FOREIGN KEY([reviewed_by]) REFERENCES dbo.[USERS]([email]);
GO

ALTER TABLE dbo.[CATALOG_CHANGE_REQUESTS] WITH CHECK ADD CONSTRAINT [FK__CATALOG_C__store__6ADAD1BF] FOREIGN KEY([store_id]) REFERENCES dbo.[STORES]([store_id]);
GO

ALTER TABLE dbo.[CATALOG_CHANGE_REQUESTS] WITH CHECK ADD CONSTRAINT [FK__CATALOG_C__varia__6DB73E6A] FOREIGN KEY([variant_id]) REFERENCES dbo.[PRODUCT_VARIANTS]([id]);
GO

ALTER TABLE dbo.[CATALOG_PRODUCT_PROVENANCE] WITH CHECK ADD CONSTRAINT [FK__CATALOG_P__batch__08362A7C] FOREIGN KEY([batch_id]) REFERENCES dbo.[CATALOG_IMPORT_BATCHES]([batch_id]);
GO

ALTER TABLE dbo.[CATALOG_PRODUCT_PROVENANCE] WITH CHECK ADD CONSTRAINT [FK__CATALOG_P__produ__07420643] FOREIGN KEY([product_id]) REFERENCES dbo.[PRODUCTS]([id]) ON DELETE CASCADE;
GO

ALTER TABLE dbo.[CATEGORY_PROMOTIONS] WITH CHECK ADD CONSTRAINT [FK__CATEGORY___categ__2BB470E3] FOREIGN KEY([category_id]) REFERENCES dbo.[CATEGORIES]([id]);
GO

ALTER TABLE dbo.[CATEGORY_PROMOTIONS] WITH CHECK ADD CONSTRAINT [FK__CATEGORY___promo__2AC04CAA] FOREIGN KEY([promotion_id]) REFERENCES dbo.[PROMOTIONS]([id]);
GO

ALTER TABLE dbo.[DEMO_VARIANT_SALES] WITH CHECK ADD CONSTRAINT [FK__DEMO_VARI__batch__0DEF03D2] FOREIGN KEY([batch_id]) REFERENCES dbo.[CATALOG_IMPORT_BATCHES]([batch_id]);
GO

ALTER TABLE dbo.[DEMO_VARIANT_SALES] WITH CHECK ADD CONSTRAINT [FK__DEMO_VARI__store__0C06BB60] FOREIGN KEY([store_id]) REFERENCES dbo.[STORES]([store_id]);
GO

ALTER TABLE dbo.[DEMO_VARIANT_SALES] WITH CHECK ADD CONSTRAINT [FK__DEMO_VARI__varia__0B129727] FOREIGN KEY([variant_id]) REFERENCES dbo.[PRODUCT_VARIANTS]([id]) ON DELETE CASCADE;
GO

ALTER TABLE dbo.[INVENTORY_MOVEMENTS] WITH CHECK ADD CONSTRAINT [FK__INVENTORY__perfo__14D10B8B] FOREIGN KEY([performed_by]) REFERENCES dbo.[USERS]([email]);
GO

ALTER TABLE dbo.[INVENTORY_RESTOCK_REQUESTS] WITH CHECK ADD CONSTRAINT [FK__INVENTORY__reque__7834CCDD] FOREIGN KEY([requested_by]) REFERENCES dbo.[USERS]([email]);
GO

ALTER TABLE dbo.[INVENTORY_RESTOCK_REQUESTS] WITH CHECK ADD CONSTRAINT [FK__INVENTORY__revie__7928F116] FOREIGN KEY([reviewed_by]) REFERENCES dbo.[USERS]([email]);
GO

ALTER TABLE dbo.[ORDER_STORE_FULFILLMENTS] WITH CHECK ADD CONSTRAINT [FK__ORDER_STO__order__0682EC34] FOREIGN KEY([order_id]) REFERENCES dbo.[ORDERS]([id]);
GO

ALTER TABLE dbo.[ORDER_STORE_FULFILLMENTS] WITH CHECK ADD CONSTRAINT [FK__ORDER_STO__store__0777106D] FOREIGN KEY([store_id]) REFERENCES dbo.[STORES]([store_id]);
GO

ALTER TABLE dbo.[ORDER_STORE_FULFILLMENTS] WITH CHECK ADD CONSTRAINT [FK__ORDER_STO__updat__086B34A6] FOREIGN KEY([updated_by]) REFERENCES dbo.[USERS]([email]);
GO

ALTER TABLE dbo.[PAYMENT_REFUNDS] WITH CHECK ADD CONSTRAINT [FK__PAYMENT_R__order__53C2623D] FOREIGN KEY([order_id]) REFERENCES dbo.[ORDERS]([id]);
GO

ALTER TABLE dbo.[PAYMENT_REFUNDS] WITH CHECK ADD CONSTRAINT [FK__PAYMENT_R__payme__52CE3E04] FOREIGN KEY([payment_id]) REFERENCES dbo.[PAYMENTS]([id]);
GO

ALTER TABLE dbo.[PAYMENT_REFUNDS] WITH CHECK ADD CONSTRAINT [FK__PAYMENT_R__proce__55AAAAAF] FOREIGN KEY([processed_by]) REFERENCES dbo.[USERS]([email]);
GO

ALTER TABLE dbo.[PAYMENT_VERIFICATIONS] WITH CHECK ADD CONSTRAINT [FK__PAYMENT_V__payme__1A89E4E1] FOREIGN KEY([payment_id]) REFERENCES dbo.[PAYMENTS]([id]);
GO

ALTER TABLE dbo.[PAYMENT_VERIFICATIONS] WITH CHECK ADD CONSTRAINT [FK__PAYMENT_V__repor__1B7E091A] FOREIGN KEY([reported_by]) REFERENCES dbo.[USERS]([email]);
GO

ALTER TABLE dbo.[PAYMENT_VERIFICATIONS] WITH CHECK ADD CONSTRAINT [FK__PAYMENT_V__revie__1E5A75C5] FOREIGN KEY([reviewed_by]) REFERENCES dbo.[USERS]([email]);
GO

ALTER TABLE dbo.[REVIEW_RESPONSES] WITH CHECK ADD CONSTRAINT [FK__REVIEW_RE__respo__6C8E1007] FOREIGN KEY([responder_email]) REFERENCES dbo.[USERS]([email]);
GO

ALTER TABLE dbo.[REVIEW_RESPONSES] WITH CHECK ADD CONSTRAINT [FK__REVIEW_RE__store__6B99EBCE] FOREIGN KEY([store_id]) REFERENCES dbo.[STORES]([store_id]);
GO

ALTER TABLE dbo.[SIZE_CHARTS] WITH CHECK ADD CONSTRAINT [FK__SIZE_CHAR__brand__3E082B48] FOREIGN KEY([brand_id]) REFERENCES dbo.[BRANDS]([id]);
GO

ALTER TABLE dbo.[SIZE_CHARTS] WITH CHECK ADD CONSTRAINT [FK__SIZE_CHAR__categ__3EFC4F81] FOREIGN KEY([category_id]) REFERENCES dbo.[CATEGORIES]([id]);
GO

ALTER TABLE dbo.[SIZE_CHARTS] WITH CHECK ADD CONSTRAINT [FK__SIZE_CHAR__produ__3FF073BA] FOREIGN KEY([product_id]) REFERENCES dbo.[PRODUCTS]([id]);
GO

ALTER TABLE dbo.[SIZE_CHART_ENTRIES] WITH CHECK ADD CONSTRAINT [FK__SIZE_CHAR__size___469D7149] FOREIGN KEY([size_chart_id]) REFERENCES dbo.[SIZE_CHARTS]([id]);
GO

ALTER TABLE dbo.[STORE_PROMOTIONS] WITH CHECK ADD CONSTRAINT [FK__STORE_PRO__promo__26EFBBC6] FOREIGN KEY([promotion_id]) REFERENCES dbo.[PROMOTIONS]([id]);
GO

ALTER TABLE dbo.[STORE_PROMOTIONS] WITH CHECK ADD CONSTRAINT [FK__STORE_PRO__store__27E3DFFF] FOREIGN KEY([store_id]) REFERENCES dbo.[STORES]([store_id]);
GO

ALTER TABLE dbo.[STORE_REPORTS] WITH CHECK ADD CONSTRAINT [FK__STORE_REP__creat__75235608] FOREIGN KEY([created_by_email]) REFERENCES dbo.[USERS]([email]);
GO

ALTER TABLE dbo.[STORE_REPORTS] WITH CHECK ADD CONSTRAINT [FK__STORE_REP__store__742F31CF] FOREIGN KEY([store_id]) REFERENCES dbo.[STORES]([store_id]);
GO

ALTER TABLE dbo.[STORE_STATUS_HISTORY] WITH CHECK ADD CONSTRAINT [FK__STORE_STA__chang__66161CA2] FOREIGN KEY([changed_by]) REFERENCES dbo.[USERS]([email]);
GO

ALTER TABLE dbo.[STORE_STAFF_ASSIGNMENTS] WITH CHECK ADD CONSTRAINT [FK__STORE_STA__store__4C564A9F] FOREIGN KEY([store_id]) REFERENCES dbo.[STORES]([store_id]);
GO

ALTER TABLE dbo.[STORE_STATUS_HISTORY] WITH CHECK ADD CONSTRAINT [FK__STORE_STA__store__6521F869] FOREIGN KEY([store_id]) REFERENCES dbo.[STORES]([store_id]);
GO

ALTER TABLE dbo.[STORE_STAFF_ASSIGNMENTS] WITH CHECK ADD CONSTRAINT [FK__STORE_STA__user___4D4A6ED8] FOREIGN KEY([user_email]) REFERENCES dbo.[USERS]([email]);
GO

ALTER TABLE dbo.[SUPPORT_CONVERSATION_READ_STATE] WITH CHECK ADD CONSTRAINT [FK__SUPPORT_C__conve__7FD5EEA5] FOREIGN KEY([conversation_id]) REFERENCES dbo.[SUPPORT_CONVERSATIONS]([id]);
GO

ALTER TABLE dbo.[SUPPORT_CONVERSATION_READ_STATE] WITH CHECK ADD CONSTRAINT [FK__SUPPORT_C__last___01BE3717] FOREIGN KEY([last_read_message_id]) REFERENCES dbo.[SUPPORT_MESSAGES]([id]);
GO

ALTER TABLE dbo.[SUPPORT_CONVERSATIONS] WITH CHECK ADD CONSTRAINT [FK__SUPPORT_C__order__53F76C67] FOREIGN KEY([order_id]) REFERENCES dbo.[ORDERS]([id]);
GO

ALTER TABLE dbo.[SUPPORT_CONVERSATIONS] WITH CHECK ADD CONSTRAINT [FK__SUPPORT_C__produ__54EB90A0] FOREIGN KEY([product_id]) REFERENCES dbo.[PRODUCTS]([id]);
GO

ALTER TABLE dbo.[SUPPORT_CONVERSATIONS] WITH CHECK ADD CONSTRAINT [FK__SUPPORT_C__store__5303482E] FOREIGN KEY([store_id]) REFERENCES dbo.[STORES]([store_id]);
GO

ALTER TABLE dbo.[SUPPORT_CONVERSATION_READ_STATE] WITH CHECK ADD CONSTRAINT [FK__SUPPORT_C__user___00CA12DE] FOREIGN KEY([user_email]) REFERENCES dbo.[USERS]([email]);
GO

ALTER TABLE dbo.[SUPPORT_CONVERSATIONS] WITH CHECK ADD CONSTRAINT [FK__SUPPORT_C__user___520F23F5] FOREIGN KEY([user_email]) REFERENCES dbo.[USERS]([email]);
GO

ALTER TABLE dbo.[SUPPORT_MESSAGES] WITH CHECK ADD CONSTRAINT [FK__SUPPORT_M__conve__5D80D6A1] FOREIGN KEY([conversation_id]) REFERENCES dbo.[SUPPORT_CONVERSATIONS]([id]);
GO

ALTER TABLE dbo.[SUPPORT_MESSAGES] WITH CHECK ADD CONSTRAINT [FK__SUPPORT_M__sende__5E74FADA] FOREIGN KEY([sender_email]) REFERENCES dbo.[USERS]([email]);
GO

ALTER TABLE dbo.[VARIANT_PROMOTIONS] WITH CHECK ADD CONSTRAINT [FK__VARIANT_P__promo__32616E72] FOREIGN KEY([promotion_id]) REFERENCES dbo.[PROMOTIONS]([id]);
GO

ALTER TABLE dbo.[VARIANT_PROMOTIONS] WITH CHECK ADD CONSTRAINT [FK__VARIANT_P__varia__335592AB] FOREIGN KEY([variant_id]) REFERENCES dbo.[PRODUCT_VARIANTS]([id]);
GO

ALTER TABLE dbo.[INVENTORY_MOVEMENTS] WITH CHECK ADD CONSTRAINT [FK_ADMIN_MOVEMENT_INVENTORY] FOREIGN KEY([store_id],[variant_id]) REFERENCES dbo.[STORE_INVENTORY]([store_id],[variant_id]);
GO

ALTER TABLE dbo.[CART_ITEMS] WITH CHECK ADD CONSTRAINT [FK_CART_ITEMS_CART] FOREIGN KEY([cart_id]) REFERENCES dbo.[CARTS]([id]);
GO

ALTER TABLE dbo.[CART_ITEMS] WITH CHECK ADD CONSTRAINT [FK_CART_ITEMS_PRODUCT] FOREIGN KEY([product_id]) REFERENCES dbo.[PRODUCTS]([id]);
GO

ALTER TABLE dbo.[CART_ITEMS] WITH CHECK ADD CONSTRAINT [FK_CART_ITEMS_STORE] FOREIGN KEY([store_id]) REFERENCES dbo.[STORES]([store_id]);
GO

ALTER TABLE dbo.[CART_ITEMS] WITH CHECK ADD CONSTRAINT [FK_CART_ITEMS_VARIANT] FOREIGN KEY([variant_id]) REFERENCES dbo.[PRODUCT_VARIANTS]([id]);
GO

ALTER TABLE dbo.[CARTS] WITH CHECK ADD CONSTRAINT [FK_CARTS_USER] FOREIGN KEY([user_email]) REFERENCES dbo.[USERS]([email]);
GO

ALTER TABLE dbo.[COUPON_USAGES] WITH CHECK ADD CONSTRAINT [FK_COUPON_USAGES_COUPON] FOREIGN KEY([coupon_id]) REFERENCES dbo.[COUPONS]([id]);
GO

ALTER TABLE dbo.[COUPON_USAGES] WITH CHECK ADD CONSTRAINT [FK_COUPON_USAGES_ORDER] FOREIGN KEY([order_id]) REFERENCES dbo.[ORDERS]([id]);
GO

ALTER TABLE dbo.[COUPON_USAGES] WITH CHECK ADD CONSTRAINT [FK_COUPON_USAGES_USER] FOREIGN KEY([user_email]) REFERENCES dbo.[USERS]([email]);
GO

ALTER TABLE dbo.[INVENTORY_RESTOCK_REQUESTS] WITH CHECK ADD CONSTRAINT [FK_MANAGER_RESTOCK_INVENTORY] FOREIGN KEY([store_id],[variant_id]) REFERENCES dbo.[STORE_INVENTORY]([store_id],[variant_id]);
GO

ALTER TABLE dbo.[ORDER_CANCELLATIONS] WITH CHECK ADD CONSTRAINT [FK_ORDER_CANCELLATIONS_ORDER] FOREIGN KEY([order_id]) REFERENCES dbo.[ORDERS]([id]);
GO

ALTER TABLE dbo.[ORDER_CANCELLATIONS] WITH CHECK ADD CONSTRAINT [FK_ORDER_CANCELLATIONS_USER] FOREIGN KEY([requested_by_email]) REFERENCES dbo.[USERS]([email]);
GO

ALTER TABLE dbo.[ORDER_ITEMS] WITH CHECK ADD CONSTRAINT [FK_ORDER_ITEMS_ORDER] FOREIGN KEY([order_id]) REFERENCES dbo.[ORDERS]([id]);
GO

ALTER TABLE dbo.[ORDER_ITEMS] WITH CHECK ADD CONSTRAINT [FK_ORDER_ITEMS_PRODUCT] FOREIGN KEY([product_id]) REFERENCES dbo.[PRODUCTS]([id]);
GO

ALTER TABLE dbo.[ORDER_ITEMS] WITH CHECK ADD CONSTRAINT [FK_ORDER_ITEMS_STORE] FOREIGN KEY([store_id]) REFERENCES dbo.[STORES]([store_id]);
GO

ALTER TABLE dbo.[ORDER_ITEMS] WITH CHECK ADD CONSTRAINT [FK_ORDER_ITEMS_VARIANT] FOREIGN KEY([variant_id]) REFERENCES dbo.[PRODUCT_VARIANTS]([id]);
GO

ALTER TABLE dbo.[ORDER_STATUS_HISTORY] WITH CHECK ADD CONSTRAINT [FK_ORDER_STATUS_HISTORY_ORDER] FOREIGN KEY([order_id]) REFERENCES dbo.[ORDERS]([id]);
GO

ALTER TABLE dbo.[ORDERS] WITH CHECK ADD CONSTRAINT [FK_ORDERS_COUPON] FOREIGN KEY([coupon_id]) REFERENCES dbo.[COUPONS]([id]);
GO

ALTER TABLE dbo.[ORDERS] WITH CHECK ADD CONSTRAINT [FK_ORDERS_USER] FOREIGN KEY([user_email]) REFERENCES dbo.[USERS]([email]);
GO

ALTER TABLE dbo.[OTP_VERIFICATIONS] WITH CHECK ADD CONSTRAINT [FK_OTP_USER] FOREIGN KEY([user_email]) REFERENCES dbo.[USERS]([email]);
GO

ALTER TABLE dbo.[PAYMENTS] WITH CHECK ADD CONSTRAINT [FK_PAYMENTS_ORDER] FOREIGN KEY([order_id]) REFERENCES dbo.[ORDERS]([id]);
GO

ALTER TABLE dbo.[PRODUCT_IMAGES] WITH CHECK ADD CONSTRAINT [FK_PRODUCT_IMAGES_PRODUCT] FOREIGN KEY([product_id]) REFERENCES dbo.[PRODUCTS]([id]);
GO

ALTER TABLE dbo.[PRODUCT_PROMOTIONS] WITH CHECK ADD CONSTRAINT [FK_PRODUCT_PROMOTIONS_PRODUCT] FOREIGN KEY([product_id]) REFERENCES dbo.[PRODUCTS]([id]);
GO

ALTER TABLE dbo.[PRODUCT_PROMOTIONS] WITH CHECK ADD CONSTRAINT [FK_PRODUCT_PROMOTIONS_PROMOTION] FOREIGN KEY([promotion_id]) REFERENCES dbo.[PROMOTIONS]([id]);
GO

ALTER TABLE dbo.[PRODUCT_VARIANTS] WITH CHECK ADD CONSTRAINT [FK_PRODUCT_VARIANTS_PRODUCT] FOREIGN KEY([product_id]) REFERENCES dbo.[PRODUCTS]([id]);
GO

ALTER TABLE dbo.[PRODUCTS] WITH CHECK ADD CONSTRAINT [FK_PRODUCTS_BRAND] FOREIGN KEY([brand_id]) REFERENCES dbo.[BRANDS]([id]);
GO

ALTER TABLE dbo.[PRODUCTS] WITH CHECK ADD CONSTRAINT [FK_PRODUCTS_CATEGORY] FOREIGN KEY([category_id]) REFERENCES dbo.[CATEGORIES]([id]);
GO

ALTER TABLE dbo.[PASSWORD_RESET_TOKENS] WITH CHECK ADD CONSTRAINT [FK_RESET_USER] FOREIGN KEY([user_email]) REFERENCES dbo.[USERS]([email]);
GO

ALTER TABLE dbo.[REVIEW_RESPONSES] WITH CHECK ADD CONSTRAINT [FK_RESPONSE_ITEM_STORE] FOREIGN KEY([order_item_id],[store_id]) REFERENCES dbo.[ORDER_ITEMS]([id],[store_id]);
GO

ALTER TABLE dbo.[REVIEW_RESPONSES] WITH CHECK ADD CONSTRAINT [FK_RESPONSE_REVIEW_ITEM] FOREIGN KEY([review_id],[order_item_id]) REFERENCES dbo.[REVIEWS]([id],[order_item_id]);
GO

ALTER TABLE dbo.[REVIEWS] WITH CHECK ADD CONSTRAINT [FK_REVIEWS_ORDER] FOREIGN KEY([order_id]) REFERENCES dbo.[ORDERS]([id]);
GO

ALTER TABLE dbo.[REVIEWS] WITH CHECK ADD CONSTRAINT [FK_REVIEWS_ORDER_ITEM] FOREIGN KEY([order_item_id]) REFERENCES dbo.[ORDER_ITEMS]([id]);
GO

ALTER TABLE dbo.[REVIEWS] WITH CHECK ADD CONSTRAINT [FK_REVIEWS_PRODUCT] FOREIGN KEY([product_id]) REFERENCES dbo.[PRODUCTS]([id]);
GO

ALTER TABLE dbo.[REVIEWS] WITH CHECK ADD CONSTRAINT [FK_REVIEWS_USER] FOREIGN KEY([user_email]) REFERENCES dbo.[USERS]([email]);
GO

ALTER TABLE dbo.[STORE_INVENTORY] WITH CHECK ADD CONSTRAINT [FK_STORE_INVENTORY_STORE] FOREIGN KEY([store_id]) REFERENCES dbo.[STORES]([store_id]);
GO

ALTER TABLE dbo.[STORE_INVENTORY] WITH CHECK ADD CONSTRAINT [FK_STORE_INVENTORY_VARIANT] FOREIGN KEY([variant_id]) REFERENCES dbo.[PRODUCT_VARIANTS]([id]);
GO

ALTER TABLE dbo.[STORES] WITH CHECK ADD CONSTRAINT [FK_STORES_MANAGER] FOREIGN KEY([manager_email]) REFERENCES dbo.[USERS]([email]);
GO

ALTER TABLE dbo.[USER_ADDRESSES] WITH CHECK ADD CONSTRAINT [FK_USER_ADDRESSES_USER] FOREIGN KEY([user_email]) REFERENCES dbo.[USERS]([email]);
GO

ALTER TABLE dbo.[USER_ROLES] WITH CHECK ADD CONSTRAINT [FK_USER_ROLES_ROLE] FOREIGN KEY([role_id]) REFERENCES dbo.[ROLES]([id]);
GO

ALTER TABLE dbo.[USER_ROLES] WITH CHECK ADD CONSTRAINT [FK_USER_ROLES_USER] FOREIGN KEY([user_email]) REFERENCES dbo.[USERS]([email]);
GO

ALTER TABLE dbo.[WISHLIST_ITEMS] WITH CHECK ADD CONSTRAINT [FK_WISHLIST_PRODUCT] FOREIGN KEY([product_id]) REFERENCES dbo.[PRODUCTS]([id]);
GO

ALTER TABLE dbo.[WISHLIST_ITEMS] WITH CHECK ADD CONSTRAINT [FK_WISHLIST_USER] FOREIGN KEY([user_email]) REFERENCES dbo.[USERS]([email]);
GO
