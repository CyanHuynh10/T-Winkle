package cyan.project.twinkle;

import cyan.project.twinkle.dto.ProductDetailDTO;
import cyan.project.twinkle.exception.BusinessRuleException;
import cyan.project.twinkle.repository.UserRepository;
import cyan.project.twinkle.security.CustomUserDetails;
import cyan.project.twinkle.service.CartService;
import cyan.project.twinkle.service.StorefrontProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import javax.imageio.ImageIO;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
class StorefrontRecoveryTests {
    @Autowired WebApplicationContext context;
    @Autowired UserRepository users;
    @Autowired JdbcTemplate jdbc;
    @Autowired CartService carts;
    @Autowired StorefrontProductService products;
    @Autowired jakarta.persistence.EntityManager entityManager;
    MockMvc mvc;
    static final String EMAIL = "user1@twinkle.com";

    @BeforeEach void setup() { mvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build(); }
    CustomUserDetails principal() { return new CustomUserDetails(users.findByEmail(EMAIL).orElseThrow()); }

    @Test void publicAndAuthenticatedTemplatesRenderWithRealDatabase() throws Exception {
        for (String route : new String[]{"/", "/categories", "/categories/sneaker", "/categories/sandals", "/categories/sports", "/products/1", "/products/2", "/stores"}) {
            mvc.perform(get(route)).andExpect(status().isOk());
        }
        for (String slug : new String[]{"q1", "q3", "q5", "q7", "thu-duc", "binh-thanh"}) {
            mvc.perform(get("/stores/" + slug + "/catagories")).andExpect(status().isOk());
        }
        for (String route : new String[]{"/profile", "/addresses", "/cart", "/wishlist", "/orders"}) {
            mvc.perform(get(route).with(user(principal()))).andExpect(status().isOk());
        }
    }

    @Test void vietnameseSearchIncludesClosedStoresAndUsesDatabaseCount() throws Exception {
        var all = mvc.perform(get("/stores")).andExpect(status().isOk()).andReturn();
        assertEquals(jdbc.queryForObject("SELECT COUNT(*) FROM STORES", Long.class), all.getModelAndView().getModel().get("totalStoreCount"));
        for (String keyword : new String[]{"Quận 1", "Quận 3", "Thủ Đức"}) {
            var result = mvc.perform(get("/stores").param("keyword", keyword)).andExpect(status().isOk()).andReturn();
            var stores = (java.util.List<?>) result.getModelAndView().getModel().get("stores");
            assertFalse(stores.isEmpty(), keyword);
        }
        var result = mvc.perform(get("/stores").param("keyword", "codex-no-store-match")).andReturn();
        assertTrue(((java.util.List<?>) result.getModelAndView().getModel().get("stores")).isEmpty());
    }

    @Test void profileCommitAvatarAndSessionRefreshThenValidationFailure() throws Exception {
        Map<String,Object> before = jdbc.queryForMap("SELECT username,full_name,phone,avatar_url,updated_at FROM USERS WHERE email=?", EMAIL);
        String uploaded = null;
        try {
            var bytes = new ByteArrayOutputStream();
            ImageIO.write(new BufferedImage(16, 16, BufferedImage.TYPE_INT_RGB), "png", bytes);
            var update = mvc.perform(multipart("/profile/update")
                    .file(new MockMultipartFile("avatar", "../../other.png", "image/png", bytes.toByteArray()))
                    .param("username", "codex_recovery_verify").param("fullName", "Codex Kiểm Tra").param("phone", "0901234567")
                    .with(user(principal())).with(csrf()))
                    .andExpect(redirectedUrl("/profile")).andExpect(flash().attribute("success", "Cập nhật thông tin thành công!"))
                    .andReturn();
            var after = jdbc.queryForMap("SELECT username,full_name,phone,avatar_url FROM USERS WHERE email=?", EMAIL);
            assertEquals("codex_recovery_verify", after.get("username"));
            assertEquals("Codex Kiểm Tra", after.get("full_name"));
            assertEquals("0901234567", after.get("phone"));
            uploaded = (String) after.get("avatar_url");
            assertTrue(uploaded.matches("/uploads/avatars/[a-f0-9-]+\\.png"));
            var session = (MockHttpSession) update.getRequest().getSession(false);
            var profile = mvc.perform(get("/profile").session(session)).andExpect(status().isOk()).andReturn();
            assertTrue(profile.getResponse().getContentAsString().contains("codex_recovery_verify"));
            assertTrue(profile.getResponse().getContentAsString().contains(uploaded));
            mvc.perform(get(uploaded)).andExpect(status().isOk()).andExpect(content().contentType("image/png"));
            mvc.perform(post("/profile/update").session(session).with(csrf())
                    .param("username", "").param("fullName", "Invalid").param("phone", "bad"))
                    .andExpect(redirectedUrl("/profile")).andExpect(flash().attributeExists("error"));
            assertEquals(after, jdbc.queryForMap("SELECT username,full_name,phone,avatar_url FROM USERS WHERE email=?", EMAIL));
            mvc.perform(multipart("/profile/update").session(session).with(csrf())
                    .file(new MockMultipartFile("avatar", "fake.png", "image/png", "not an image".getBytes()))
                    .param("username", "codex_recovery_verify").param("fullName", "Should Roll Back").param("phone", "0901234567"))
                    .andExpect(redirectedUrl("/profile")).andExpect(flash().attributeExists("error"));
            assertEquals(after, jdbc.queryForMap("SELECT username,full_name,phone,avatar_url FROM USERS WHERE email=?", EMAIL));
        } finally {
            jdbc.update("UPDATE USERS SET username=?,full_name=?,phone=?,avatar_url=?,updated_at=? WHERE email=?", before.get("username"), before.get("full_name"), before.get("phone"), before.get("avatar_url"), before.get("updated_at"), EMAIL);
            if (uploaded != null) Files.deleteIfExists(Path.of("uploads/avatars").resolve(Path.of(uploaded).getFileName()));
        }
    }

    @Test @Transactional void wishlistToggleIsPersistentAndCsrfProtected() throws Exception {
        var id = jdbc.queryForObject("SELECT TOP 1 id FROM PRODUCTS WHERE status='ACTIVE' ORDER BY id", Integer.class);
        int before = jdbc.queryForObject("SELECT COUNT(*) FROM WISHLIST_ITEMS WHERE user_email=? AND product_id=?", Integer.class, EMAIL, id);
        mvc.perform(post("/wishlist/toggle").param("productId", id.toString()).accept("application/json").with(user(principal())))
                .andExpect(status().isForbidden());
        mvc.perform(post("/wishlist/toggle").param("productId", id.toString()).accept("application/json").with(user(principal())).with(csrf()))
                .andExpect(status().isOk()).andExpect(jsonPath("$.inWishlist").value(before == 0));
        entityManager.flush();
        assertEquals(1-before, jdbc.queryForObject("SELECT COUNT(*) FROM WISHLIST_ITEMS WHERE user_email=? AND product_id=?", Integer.class, EMAIL, id));
        mvc.perform(get("/wishlist").with(user(principal()))).andExpect(status().isOk());
    }

    @Test @Transactional void addressCrudAndDefaultPersistWithCanonicalFields() throws Exception {
        var auth = user(principal());
        mvc.perform(post("/addresses/save").with(auth).with(csrf()).param("fullName", "Codex Address")
                .param("phone", "0901234567").param("city", "TP. Hồ Chí Minh").param("district", "Quận 1")
                .param("ward", "Phường 1").param("addressLine", "Codex integration address"))
                .andExpect(redirectedUrl("/addresses"));
        Long id = jdbc.queryForObject("SELECT id FROM USER_ADDRESSES WHERE user_email=? AND address_line=?", Long.class, EMAIL, "Codex integration address");
        mvc.perform(get("/addresses").with(auth)).andExpect(status().isOk());
        mvc.perform(post("/addresses/save").with(auth).with(csrf()).param("id", id.toString()).param("fullName", "Codex Edited")
                .param("phone", "0901234567").param("city", "TP. Hồ Chí Minh").param("district", "Quận 3")
                .param("ward", "Phường 3").param("addressLine", "Codex edited address"))
                .andExpect(redirectedUrl("/addresses"));
        entityManager.flush();
        assertEquals("Codex edited address", jdbc.queryForObject("SELECT address_line FROM USER_ADDRESSES WHERE id=?", String.class, id));
        mvc.perform(post("/addresses/default/" + id).with(auth).with(csrf())).andExpect(redirectedUrl("/addresses"));
        entityManager.flush();
        assertEquals(id, jdbc.queryForObject("SELECT id FROM USER_ADDRESSES WHERE user_email=? AND is_default=1", Long.class, EMAIL));
        mvc.perform(post("/addresses/delete/" + id).with(auth).with(csrf())).andExpect(redirectedUrl("/addresses"));
        entityManager.flush();
        assertEquals(0, jdbc.queryForObject("SELECT COUNT(*) FROM USER_ADDRESSES WHERE id=?", Integer.class, id));
        mvc.perform(get("/addresses").with(auth)).andExpect(status().isOk());
    }

    @Test @Transactional void productAggregatesAndCartRespectInventoryAndClosedStores() {
        for (int id : new int[]{1, 2}) {
            ProductDetailDTO detail = products.getProductDetailDTO(id, EMAIL);
            assertFalse(detail.getImages().isEmpty()); assertFalse(detail.getVariants().isEmpty());
            assertEquals(jdbc.queryForObject("SELECT COALESCE(SUM(oi.quantity),0) FROM ORDER_ITEMS oi JOIN ORDERS o ON o.id=oi.order_id WHERE oi.product_id=? AND o.status=N'Đã giao'", Long.class, id), detail.getSoldCount());
            assertEquals(jdbc.queryForObject("SELECT COUNT(*) FROM REVIEWS WHERE product_id=? AND status='APPROVED'", Integer.class, id), detail.getReviews().size());
            var inventory = detail.getStoreAvailability().stream().filter(i -> i.getQuantity() > 0).findFirst().orElseThrow();
            carts.addToCart(EMAIL, inventory.getVariantId(), inventory.getStoreId(), 1);
            assertTrue(jdbc.queryForObject("SELECT COUNT(*) FROM CART_ITEMS ci JOIN CARTS c ON c.id=ci.cart_id WHERE c.user_email=? AND ci.variant_id=? AND ci.store_id=?", Integer.class, EMAIL, inventory.getVariantId(), inventory.getStoreId()) > 0);
            assertThrows(BusinessRuleException.class, () -> carts.addToCart(EMAIL, inventory.getVariantId(), inventory.getStoreId(), Integer.MAX_VALUE));
            var closed = detail.getStoreAvailability().stream().filter(i -> i.getStoreId() == 2 && i.getQuantity() > 0).findFirst().orElseThrow();
            carts.addToCart(EMAIL, closed.getVariantId(), closed.getStoreId(), 1);
            assertEquals("CLOSED", jdbc.queryForObject("SELECT status FROM STORES WHERE store_id=2",String.class));
            var empty = detail.getStoreAvailability().stream().filter(i -> i.getQuantity() == 0).findFirst();
            empty.ifPresent(i -> assertThrows(BusinessRuleException.class, () -> carts.addToCart(EMAIL,i.getVariantId(),i.getStoreId(),1)));
        }
    }
}
