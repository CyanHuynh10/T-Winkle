-- Manual, additive migration. Apply after a verified COPY_ONLY backup.
-- No reset or import runs on application startup. Keep ddl-auto=none.
SET NOCOUNT ON;
SET XACT_ABORT ON;
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET ANSI_PADDING ON;
SET ANSI_WARNINGS ON;
SET CONCAT_NULL_YIELDS_NULL ON;
SET ARITHABORT ON;
SET NUMERIC_ROUNDABORT OFF;
BEGIN TRANSACTION;
IF OBJECT_ID('dbo.CATALOG_IMPORT_BATCHES','U') IS NULL
 CREATE TABLE dbo.CATALOG_IMPORT_BATCHES (
  batch_id varchar(80) NOT NULL PRIMARY KEY,
  manifest_sha256 char(64) NOT NULL,
  deterministic_seed int NOT NULL,
  completed_at datetime2 NOT NULL DEFAULT SYSDATETIME()
 );
-- Separate provenance avoids adding optional research fields to operational CRUD.
IF OBJECT_ID('dbo.CATALOG_PRODUCT_PROVENANCE','U') IS NULL
 CREATE TABLE dbo.CATALOG_PRODUCT_PROVENANCE (
  product_id int NOT NULL PRIMARY KEY REFERENCES dbo.PRODUCTS(id) ON DELETE CASCADE,
  batch_id varchar(80) NOT NULL REFERENCES dbo.CATALOG_IMPORT_BATCHES(batch_id),
  product_key varchar(20) NOT NULL,
  model_family nvarchar(180) NOT NULL,
  colorway nvarchar(180) NOT NULL,
  manufacturer_style_code varchar(80) NULL,
  dominant_color nvarchar(50) NOT NULL,
  secondary_color nvarchar(50) NULL,
  source_url nvarchar(1000) NOT NULL,
  image_source_url nvarchar(1500) NOT NULL,
  image_sha256 char(64) NOT NULL,
  verification_level varchar(60) NOT NULL,
  CONSTRAINT UQ_CATALOG_PROVENANCE_BATCH_KEY UNIQUE(batch_id,product_key)
 );
-- Demonstration units only: no price, revenue, customer, order or payment fields.
-- A period is [start,end); reports select complete periods by period_end.
IF OBJECT_ID('dbo.DEMO_VARIANT_SALES','U') IS NULL
 CREATE TABLE dbo.DEMO_VARIANT_SALES (
  variant_id bigint NOT NULL REFERENCES dbo.PRODUCT_VARIANTS(id) ON DELETE CASCADE,
  store_id int NOT NULL REFERENCES dbo.STORES(store_id),
  period_start date NOT NULL,
  period_end date NOT NULL,
  quantity_sold int NOT NULL,
  is_demo bit NOT NULL CONSTRAINT DF_DEMO_VARIANT_SALES_MARKER DEFAULT 1,
  batch_id varchar(80) NOT NULL REFERENCES dbo.CATALOG_IMPORT_BATCHES(batch_id),
  CONSTRAINT PK_DEMO_VARIANT_SALES PRIMARY KEY(variant_id,store_id,period_start,period_end),
  CONSTRAINT CK_DEMO_VARIANT_SALES_QUANTITY CHECK(quantity_sold>=0),
  CONSTRAINT CK_DEMO_VARIANT_SALES_PERIOD CHECK(period_start<period_end),
  CONSTRAINT CK_DEMO_VARIANT_SALES_MARKER CHECK(is_demo=1)
 );
COMMIT;
