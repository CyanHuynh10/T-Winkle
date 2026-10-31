"""Repair prior browser assignment fixtures ONLY in the established test database."""
import verify as v

assert v.CLONE == 'T_Winkle_StackMigration_20261022'
assert v.db.sql('SELECT DB_NAME()', v.CLONE) == v.CLONE
for slug, local in {'q1':'district1','q3':'district3','q5':'district5','q7':'district7','thu-duc':'thuduc','binh-thanh':'binhthanh'}.items():
    v.db.sql('UPDATE STORES SET manager_email=' + v.db.literal(local + '@twinkle.com') + ' WHERE slug=' + v.db.literal(slug), v.CLONE)
print('Established isolated test database: baseline manager assignments restored.')
