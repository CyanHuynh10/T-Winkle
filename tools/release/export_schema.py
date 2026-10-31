"""Read-only SQL Server schema export; never exports business rows or credentials."""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'tools/catalog'))
import pagination_db as db

def q(name):
    return '[' + name.replace(']', ']]') + ']'

def export():
    tables = db.rows("SELECT object_id,name FROM sys.tables WHERE schema_id=SCHEMA_ID('dbo') ORDER BY name")
    output = ['-- Schema only. Apply once to a NEW empty SQL Server database.',
              '-- No user records, credentials, database files or business data are included.',
              'SET ANSI_NULLS ON; SET QUOTED_IDENTIFIER ON; SET ANSI_PADDING ON;\nGO']
    for t in tables:
        columns = db.rows(f"""SELECT c.name,ty.name type,c.max_length,c.precision,c.scale,c.is_nullable,
          cc.definition computed,cc.is_persisted,CONVERT(varchar(40),ic.seed_value) seed,CONVERT(varchar(40),ic.increment_value) increment,
          dc.name default_name,dc.definition default_definition,c.collation_name
          FROM sys.columns c JOIN sys.types ty ON ty.user_type_id=c.user_type_id
          LEFT JOIN sys.computed_columns cc ON cc.object_id=c.object_id AND cc.column_id=c.column_id
          LEFT JOIN sys.identity_columns ic ON ic.object_id=c.object_id AND ic.column_id=c.column_id
          LEFT JOIN sys.default_constraints dc ON dc.object_id=c.default_object_id
          WHERE c.object_id={t['object_id']} ORDER BY c.column_id""")
        definitions = []
        for c in columns:
            definition = q(c['name'])
            if c['computed']:
                definition += ' AS ' + c['computed'] + (' PERSISTED' if c['is_persisted'] else '')
            else:
                typ = c['type']
                if typ in ('varchar','nvarchar','char','nchar','binary','varbinary'):
                    length = c['max_length']
                    typ += '(' + ('max' if length == -1 else str(length // 2 if typ.startswith('n') else length)) + ')'
                elif typ in ('decimal','numeric'):
                    typ += f"({c['precision']},{c['scale']})"
                elif typ in ('datetime2','datetimeoffset','time'):
                    typ += f"({c['scale']})"
                definition += ' ' + typ
                if c['collation_name']:
                    definition += ' COLLATE ' + c['collation_name']
                if c['seed'] is not None:
                    definition += f" IDENTITY({c['seed']},{c['increment']})"
                definition += ' NULL' if c['is_nullable'] else ' NOT NULL'
                if c['default_definition']:
                    definition += ' CONSTRAINT ' + q(c['default_name']) + ' DEFAULT ' + c['default_definition']
            definitions.append(definition)
        output.append('CREATE TABLE dbo.' + q(t['name']) + '(\n  ' + ',\n  '.join(definitions) + '\n);\nGO')
    for t in tables:
        indexes = db.rows(f"SELECT index_id,name,type_desc,is_unique,is_primary_key,is_unique_constraint,filter_definition FROM sys.indexes WHERE object_id={t['object_id']} AND index_id>0 AND is_hypothetical=0 ORDER BY index_id")
        for i in indexes:
            assert i['type_desc'] in ('CLUSTERED','NONCLUSTERED'), 'Review unsupported index type'
            cols = db.rows(f"SELECT c.name,ic.key_ordinal,ic.is_descending_key,ic.is_included_column FROM sys.index_columns ic JOIN sys.columns c ON c.object_id=ic.object_id AND c.column_id=ic.column_id WHERE ic.object_id={t['object_id']} AND ic.index_id={i['index_id']} ORDER BY ic.key_ordinal,ic.index_column_id")
            keys = ','.join(q(c['name']) + (' DESC' if c['is_descending_key'] else ' ASC') for c in cols if c['key_ordinal'])
            target = 'dbo.' + q(t['name'])
            if i['is_primary_key'] or i['is_unique_constraint']:
                statement = 'ALTER TABLE ' + target + ' ADD CONSTRAINT ' + q(i['name']) + (' PRIMARY KEY ' if i['is_primary_key'] else ' UNIQUE ') + i['type_desc'] + '(' + keys + ')'
            else:
                statement = 'CREATE ' + ('UNIQUE ' if i['is_unique'] else '') + i['type_desc'] + ' INDEX ' + q(i['name']) + ' ON ' + target + '(' + keys + ')'
                included = ','.join(q(c['name']) for c in cols if c['is_included_column'])
                if included:
                    statement += ' INCLUDE(' + included + ')'
                if i['filter_definition']:
                    statement += ' WHERE ' + i['filter_definition']
            output.append(statement + ';\nGO')
    for c in db.rows("SELECT OBJECT_NAME(parent_object_id) table_name,name,definition,is_not_for_replication FROM sys.check_constraints ORDER BY name"):
        output.append('ALTER TABLE dbo.' + q(c['table_name']) + ' WITH CHECK ADD CONSTRAINT ' + q(c['name']) + ' CHECK ' + ('NOT FOR REPLICATION ' if c['is_not_for_replication'] else '') + c['definition'] + ';\nGO')
    for fk in db.rows("SELECT object_id,name,OBJECT_NAME(parent_object_id) parent,OBJECT_NAME(referenced_object_id) referenced,delete_referential_action_desc del,update_referential_action_desc upd FROM sys.foreign_keys ORDER BY name"):
        cols = db.rows(f"SELECT COL_NAME(parent_object_id,parent_column_id) parent,COL_NAME(referenced_object_id,referenced_column_id) referenced FROM sys.foreign_key_columns WHERE constraint_object_id={fk['object_id']} ORDER BY constraint_column_id")
        statement = 'ALTER TABLE dbo.' + q(fk['parent']) + ' WITH CHECK ADD CONSTRAINT ' + q(fk['name']) + ' FOREIGN KEY(' + ','.join(q(c['parent']) for c in cols) + ') REFERENCES dbo.' + q(fk['referenced']) + '(' + ','.join(q(c['referenced']) for c in cols) + ')'
        for key, label in [('del','DELETE'),('upd','UPDATE')]:
            if fk[key] != 'NO_ACTION':
                statement += ' ON ' + label + ' ' + fk[key].replace('_',' ')
        output.append(statement + ';\nGO')
    for module in db.rows("SELECT o.name,m.definition FROM sys.sql_modules m JOIN sys.objects o ON o.object_id=m.object_id WHERE o.is_ms_shipped=0 ORDER BY o.type,o.name"):
        assert module['definition'], 'Encrypted module needs manual source'
        output.append(module['definition'] + '\nGO')
    (ROOT / 'src/main/resources/db/schema-baseline.sql').write_text('\n\n'.join(output) + '\n', encoding='utf-8')
    print('Exported schema only:', len(tables), 'tables')

if __name__ == '__main__':
    export()
