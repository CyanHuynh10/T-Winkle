"""Generate a fresh-database demo seed from retained manifests; no database writes.

Usage: python tools/release/seed_demo.py OUTPUT.sql
Apply the result manually ONLY to an empty database after schema-baseline.sql.
Existing installations must never use this bootstrap seed.
"""
import hashlib
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[2]
DB = ROOT / 'src/main/resources/db'

def literal(value):
    if value is None:
        return 'NULL'
    if isinstance(value, (int, float)):
        return str(value)
    return "N'" + str(value).replace("'", "''") + "'"

def generate():
    manifest = (DB / 'catalog-final-20261018.json').read_bytes()
    data = json.loads(manifest)
    master = json.loads((DB / 'demo-master-data.json').read_text(encoding='utf-8'))
    sql = ["-- Fresh demo bootstrap only. Refuses any existing dbo rows. No users/passwords.",
           "SET NOCOUNT ON; SET XACT_ABORT ON; SET ANSI_NULLS ON; SET QUOTED_IDENTIFIER ON; SET ANSI_PADDING ON; SET ANSI_WARNINGS ON; SET CONCAT_NULL_YIELDS_NULL ON; SET ARITHABORT ON; SET NUMERIC_ROUNDABORT OFF;",
           "IF DB_NAME() IN ('T_Winkle','master','model','msdb','tempdb') THROW 51500,'Bootstrap requires a separate empty database.',1;",
           "DECLARE @guard nvarchar(max)=N''; SELECT @guard=@guard+N'IF EXISTS(SELECT 1 FROM dbo.'+QUOTENAME(name)+N') THROW 51501,''Bootstrap requires empty tables.'',1;' FROM sys.tables WHERE schema_id=SCHEMA_ID('dbo'); EXEC sys.sp_executesql @guard;",
           'BEGIN TRY BEGIN TRANSACTION;']
    for table, rows in master.items():
        sql.append('SET IDENTITY_INSERT dbo.[' + table + '] ON;')
        for row in rows:
            sql.append('INSERT dbo.[' + table + '](' + ','.join('['+key+']' for key in row) + ') VALUES(' + ','.join(literal(v) for v in row.values()) + ');')
        sql.append('SET IDENTITY_INSERT dbo.[' + table + '] OFF;')
    sql += ["DECLARE @batch varchar(80)='FINAL-CATALOG-20261018-V1';",
            "INSERT CATALOG_IMPORT_BATCHES(batch_id,manifest_sha256,deterministic_seed) VALUES(@batch,'" + hashlib.sha256(manifest).hexdigest() + "',20261018);",
            "DECLARE @json nvarchar(max)=N'';"]
    text = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
    for offset in range(0, len(text), 3000):
        sql.append('SET @json=@json+' + literal(text[offset:offset+3000]) + ';')
    historical = (DB / 'reset-seed-final-catalog.sql').read_text(encoding='utf-8')
    start = historical.index(' SELECT * INTO #products')
    end = historical.index(' IF (SELECT COUNT(*) FROM PRODUCTS)<>45', start)
    sql += [historical[start:end], 'COMMIT; END TRY BEGIN CATCH IF @@TRANCOUNT>0 ROLLBACK; THROW; END CATCH;']
    Path(sys.argv[1]).write_text('\n'.join(sql), encoding='utf-8-sig')
    print('Fresh demo seed generated: 45 products; no users, orders, payments or private records.')

if __name__ == '__main__':
    generate()
