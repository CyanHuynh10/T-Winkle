# C15 → Antigravity MERGE-REQUIRED LIST

This file identifies files for which the 12,862-line Gemini transcript does not contain one final, self-contained latest code block that can safely be treated as a verbatim final source.

## High-priority closure
- `src/main/java/cyan/project/twinkle/repository/ProductRepository.java`
  - The transcript contains later patches, but final query signatures still have historical `CURRENT_TIMESTAMP`/missing-`:now` drift in some snapshots.
  - Canonical staging version therefore reconstructs the complete contract with the same `:now` parameter and explicit `COUNT(DISTINCT p.id)` strategy.
- `src/main/java/cyan/project/twinkle/service/StorefrontProductService.java`
  - Latest transcript contains partial patches after a complete source block.
  - Canonical staging version merges those patches into one complete file.
- `src/main/java/cyan/project/twinkle/service/CheckoutService.java`
  - Full source exists before the final email-signature patch; canonical staging version merges the email rehydration patch and shared clock.
- `src/main/java/cyan/project/twinkle/controller/StorefrontUserController.java`
  - Final security patch is partial and says other mappings are retained; staging merges that security patch into the full earlier controller.
- `src/main/java/cyan/project/twinkle/controller/StorefrontMainController.java`
  - Complete source is older than the final Integer/email service-contract patches; staging reconciles both.
- `src/main/java/cyan/project/twinkle/controller/StorefrontCartController.java`
  - Older complete source still references stale repository/User signatures; staging reconciles it to CartService's email-based contract.
- `src/main/java/cyan/project/twinkle/controller/StorefrontStoreController.java`
  - Complete source still calls generic `getProducts`; staging changes it to `getStoreProducts(...)`.
- `src/main/java/cyan/project/twinkle/controller/StorefrontCheckoutController.java`
  - Source exists, but its service call must match the final email-based CheckoutService.
- `src/main/java/cyan/project/twinkle/entity/Category.java`
- `src/main/java/cyan/project/twinkle/entity/Brand.java`
- `src/main/java/cyan/project/twinkle/entity/ProductVariant.java`
- `src/main/java/cyan/project/twinkle/entity/Store.java`
- `src/main/java/cyan/project/twinkle/entity/WishlistItemId.java`
- `src/main/java/cyan/project/twinkle/dto/ProfileUpdateForm.java`
- `src/main/java/cyan/project/twinkle/repository/CouponUsageRepository.java`
  - These have stale complete snapshots in the transcript; staging contains C15/SQL-reconciled versions.

## Existing project dependencies NOT re-created here
These are referenced by the backend but the Gemini transcript does not provide a single canonical full source block in a reliable final state:
- `src/main/java/cyan/project/twinkle/dto/ProductDTO.java`
- `src/main/java/cyan/project/twinkle/dto/CheckoutForm.java`
- `src/main/java/cyan/project/twinkle/entity/ProductImage.java`
- `src/main/java/cyan/project/twinkle/entity/Role.java`
- `src/main/java/cyan/project/twinkle/service/StorefrontStoreService.java`

Antigravity must preserve the existing project versions of these files and verify only their contract compatibility; do not invent replacements.

## Duplicate / stale source
- `src/main/java/cyan/project/twinkle/controller/StorefrontController.java` is retained only under `04_DO_NOT_INTEGRATE`.
  It is a stale duplicate controller and conflicts with the established `StorefrontMainController` contract.
