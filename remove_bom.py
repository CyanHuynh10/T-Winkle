import os
path = 'src/main/java/cyan/project/twinkle/service/StorefrontProductService.java'
with open(path, 'rb') as f:
    content = f.read()
if content.startswith(b'\xef\xbb\xbf'):
    content = content[3:]
with open(path, 'wb') as f:
    f.write(content)
print("Removed BOM")
