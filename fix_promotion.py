import os

path = 'src/main/java/cyan/project/twinkle/entity/Promotion.java'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if '@Column(name = "created_at"' in line:
        skip = True
        continue
    if '@Column(name = "updated_at"' in line:
        skip = True
        continue
    if skip and 'private LocalDateTime' in line:
        skip = False
        continue
    
    if 'createdAt = LocalDateTime.now();' in line:
        continue
    if 'updatedAt = LocalDateTime.now();' in line:
        continue
        
    if '@PreUpdate' in line:
        skip = True
        continue
    if skip and 'protected void onUpdate()' in line:
        continue
    if skip and 'updatedAt = LocalDateTime.now();' in line:
        continue
    if skip and '}' in line:
        skip = False
        continue
        
    new_lines.append(line)

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print("Updated Promotion.java")
