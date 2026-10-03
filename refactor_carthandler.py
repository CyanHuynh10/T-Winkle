import re

path = 'src/main/resources/static/js/cart-handler.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the 'show.bs.modal' listener entirely
content = re.sub(r"document\.addEventListener\('show\.bs\.modal', function\(e\) \{.*?if \(hint\) hint\.textContent = '\* Vui lA.ng ch.n mA.u vA. size';\s*\}\s*\}\s*\}\s*\}\s*\}\s*\}\);", "", content, flags=re.DOTALL)

# And remove the mock logic in addToCart button inside the modal
# Wait, CartHandler.addToCart logic itself needs an overhaul (Phase 5).
# I'll just remove the modal interception for now.

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated cart-handler.js")
