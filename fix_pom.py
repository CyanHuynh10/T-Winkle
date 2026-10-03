import os

path = 'pom.xml'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old_dep = """        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>"""

new_dep = """        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.46</version>
            <scope>provided</scope>
        </dependency>"""

if old_dep in content:
    content = content.replace(old_dep, new_dep)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated Lombok dependency in pom.xml")
else:
    print("Could not find the exact dependency block in pom.xml")
