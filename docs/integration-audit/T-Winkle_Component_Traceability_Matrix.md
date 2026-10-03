# T-Winkle Component Traceability Matrix

| Page | Component | Purpose | Read/Write | UI Source | JS Source | Route | Controller | Service | Repository | Entity | Database Table | Expected Result | Current Status | Issue |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Cart | Quantity Control | Update quantity | WRITE | cart.html | cart-handler.js | /cart/update | StorefrontCartController | CartService | CartItemRepository | CartItem | CART_ITEMS | SQL row updated | PENDING | TODO |
| Cart | Select Item | Toggle select | WRITE | cart.html | cart-handler.js | /cart/toggle-select | StorefrontCartController | CartService | CartItemRepository | CartItem | CART_ITEMS | SQL row updated | PENDING | TODO |
| Cart | Remove Item | Remove from cart | WRITE | cart.html | cart-handler.js | /cart/remove | StorefrontCartController | CartService | CartItemRepository | CartItem | CART_ITEMS | SQL row updated | PENDING | TODO |
| Cart | Add Item | Add to cart | WRITE | detail.html | product-handler.js | /cart/add | StorefrontCartController | CartService | CartItemRepository | CartItem | CART_ITEMS | SQL row updated | PENDING | TODO |
| Home | Newest Drops | Show new products | READ | index.html | N/A | / | StorefrontMainController | StorefrontProductService | ProductRepository | Product | PRODUCTS | Display new products | PENDING | TODO |
