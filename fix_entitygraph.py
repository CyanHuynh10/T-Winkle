import os

path = 'src/main/java/cyan/project/twinkle/repository/ProductRepository.java'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# I will find every occurrence of @EntityGraph and check if the query has GROUP BY p.
# If so, remove the @EntityGraph line.

blocks = content.split('@EntityGraph(attributePaths = {"category", "brand"})')
new_content = blocks[0]

for block in blocks[1:]:
    if 'GROUP BY p' in block:
        # omit the entity graph
        new_content += block
    else:
        new_content += '@EntityGraph(attributePaths = {"category", "brand"})' + block

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)
    
print("Fixed EntityGraph")
