import io
with io.open('src/main/java/cyan/project/twinkle/service/StorefrontProductService.java', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('Da giao', 'Đã giao')
with io.open('src/main/java/cyan/project/twinkle/service/StorefrontProductService.java', 'w', encoding='utf-8') as f:
    f.write(content)
