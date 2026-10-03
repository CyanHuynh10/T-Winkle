import re

path = 'src/main/java/cyan/project/twinkle/controller/StorefrontCheckoutController.java'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """        model.addAttribute("selectedItems", selectedItems);
        model.addAttribute("addresses", addresses);
        model.addAttribute("checkoutForm", new CheckoutForm());
        
        java.math.BigDecimal subtotal = selectedItems.stream()
                .map(item -> item.getUnitPrice().multiply(java.math.BigDecimal.valueOf(item.getQuantity())))
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
        model.addAttribute("subtotal", subtotal);
        model.addAttribute("shippingFee", java.math.BigDecimal.valueOf(30000));
        model.addAttribute("total", subtotal.add(java.math.BigDecimal.valueOf(30000)));
"""

content = re.sub(r'model\.addAttribute\("selectedItems", selectedItems\);\s*model\.addAttribute\("addresses", addresses\);\s*model\.addAttribute\("checkoutForm", new CheckoutForm\(\)\);', replacement, content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated StorefrontCheckoutController.java with totals")
