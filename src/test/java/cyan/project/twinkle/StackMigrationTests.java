package cyan.project.twinkle;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;
import tools.jackson.databind.json.JsonMapper;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest @Transactional
class StackMigrationTests {
    @Autowired WebApplicationContext context;
    @Autowired JdbcTemplate sql;
    MockMvc mvc;
    static final String SECRET;
    static {byte[] bytes=new byte[32];new java.security.SecureRandom().nextBytes(bytes);SECRET=Base64.getEncoder().encodeToString(bytes);}
    @DynamicPropertySource static void key(DynamicPropertyRegistry properties){properties.add("twinkle.jwt.secret",()->SECRET);}
    @BeforeEach void setup(){mvc=org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup(context).apply(org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity()).build();}
    String fixture(String role){String email="stack-"+UUID.randomUUID()+"@test.invalid";sql.update("INSERT USERS(email,username,password_hash,is_enabled) VALUES(?,?,'fixture-credential',1)",email,"stack-"+role);sql.update("INSERT USER_ROLES(user_email,role_id) SELECT ?,id FROM ROLES WHERE name=?",email,"ROLE_"+role);return email;}
    String token(String email,String role) throws Exception {String json=mvc.perform(post("/api/tokens").with(user(email).roles(role)).with(csrf())).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();return JsonMapper.builder().build().readTree(json).get("access_token").asString();}
    @Test void bearerApisRejectMissingInvalidInsufficientAndRevokedTokens() throws Exception {
        mvc.perform(get("/api/client/me")).andExpect(status().isUnauthorized());mvc.perform(get("/api/client/me").header("Authorization","Bearer invalid")).andExpect(status().isUnauthorized());
        String email=fixture("USER"),token=token(email,"USER");
        mvc.perform(get("/api/client/me").header("Authorization","Bearer "+token)).andExpect(status().isOk()).andExpect(jsonPath("$.email").value(email));
        mvc.perform(get("/api/client/admin/stores").header("Authorization","Bearer "+token)).andExpect(status().isForbidden());
        mvc.perform(get("/api/client/manager/inventory").header("Authorization","Bearer "+token)).andExpect(status().isForbidden());
        mvc.perform(get("/api/client/orders").header("Authorization","Bearer "+token)).andExpect(status().isOk()).andExpect(jsonPath("$.total").value(0));
        mvc.perform(delete("/api/client/token").header("Authorization","Bearer "+token)).andExpect(status().isNoContent());
        mvc.perform(get("/api/client/me").header("Authorization","Bearer "+token)).andExpect(status().isUnauthorized());
    }
    @Test void sessionCannotAuthenticateBearerChainAndIssuanceRequiresCsrf() throws Exception {
        String email=fixture("USER");
        mvc.perform(post("/api/tokens").with(user(email).roles("USER"))).andExpect(status().isForbidden());
        var session=new org.springframework.mock.web.MockHttpSession();var security=org.springframework.security.core.context.SecurityContextHolder.createEmptyContext();security.setAuthentication(new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(email,null,List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_USER"))));session.setAttribute("SPRING_SECURITY_CONTEXT",security);
        mvc.perform(get("/api/client/me").session(session)).andExpect(status().isUnauthorized());
    }
    @Test void thymeleafConsolesRenderActualRowsAndOnlyRoleMenus() throws Exception {
        String admin=fixture("ADMIN"),support=fixture("SUPPORT");
        String html=mvc.perform(get("/admin/products").with(user(admin).roles("ADMIN"))).andExpect(status().isOk()).andExpect(view().name("console/page")).andReturn().getResponse().getContentAsString(java.nio.charset.StandardCharsets.UTF_8);
        assertTrue(html.contains("<tbody>"),"Server rendered table exists");assertTrue(html.contains("/js/console/app.js"),"Native module exists");assertFalse(html.contains("/admin-assets/"));assertFalse(html.contains("admin-root"));assertTrue(org.springframework.web.util.HtmlUtils.htmlUnescape(html).contains(sql.queryForObject("SELECT TOP(1) name FROM PRODUCTS ORDER BY id DESC",String.class)),"Server rendered product name exists");
        html=mvc.perform(get("/support").with(user(support).roles("SUPPORT"))).andExpect(status().isOk()).andReturn().getResponse().getContentAsString(java.nio.charset.StandardCharsets.UTF_8);
        assertTrue(html.contains("conversation-app"));assertFalse(html.contains("/support-assets/"));assertFalse(html.contains("href=\"/support/products\""));
        mvc.perform(get("/admin/products").with(user(support).roles("SUPPORT"))).andExpect(status().isForbidden());
    }
    @Test void chatUsesNativeMarkupAndLocalProductPhotosRemainAvailable() throws Exception {
        String user=fixture("USER");String html=mvc.perform(get("/chat").with(user(user).roles("USER"))).andExpect(status().isOk()).andExpect(view().name("chat/page")).andReturn().getResponse().getContentAsString();
        assertTrue(html.contains("chat-compose"));assertTrue(html.contains("/js/console/chat.js"));assertFalse(html.contains("/chat-assets/"));
        for(String image:sql.queryForList("SELECT image_url FROM PRODUCT_IMAGES WHERE is_primary=1 AND image_url LIKE '/images/%'",String.class))mvc.perform(get(image)).andExpect(status().isOk());
    }

    @Test void consoleStorefrontReturnIsSessionBackedAndSharedAcrossPages() throws Exception {
        for(String role:List.of("ADMIN","MANAGER","SUPPORT")){
            String email=fixture(role),origin="/"+role.toLowerCase()+"/reviews";
            var session=new org.springframework.mock.web.MockHttpSession();
            String console=mvc.perform(get(origin).session(session).with(user(email).roles(role))).andExpect(status().isOk()).andReturn().getResponse().getContentAsString(java.nio.charset.StandardCharsets.UTF_8);
            assertFalse(console.substring(console.indexOf("<header"),console.indexOf("</header>")).contains("dropdown"));
            assertTrue(console.contains("console-account"));
            mvc.perform(post("/console-storefront/enter").session(session).with(user(email).roles(role))).andExpect(status().isForbidden());
            mvc.perform(post("/console-storefront/enter").session(session).with(user(email).roles(role)).with(csrf())).andExpect(redirectedUrl("/"));
            for(String page:List.of("/","/categories","/stores")){
                String html=mvc.perform(get(page).session(session).with(user(email).roles(role))).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
                assertTrue(html.contains("href=\"/console-storefront/return\""));
            }
            mvc.perform(get("/console-storefront/return").session(session).with(user(email).roles(role)).param("returnUrl","https://evil.invalid")).andExpect(redirectedUrl(origin));
            String html=mvc.perform(get("/").session(session).with(user(email).roles(role))).andReturn().getResponse().getContentAsString();
            assertFalse(html.contains("href=\"/console-storefront/return\""));
        }
    }
    @Test void customersAndGuestsCannotStartConsoleReturnOrSeeItsControl() throws Exception {
        String customer=fixture("USER");
        mvc.perform(post("/console-storefront/enter").with(user(customer).roles("USER")).with(csrf())).andExpect(status().isForbidden());
        mvc.perform(get("/console-storefront/return").with(user(customer).roles("USER"))).andExpect(redirectedUrl("/"));
        mvc.perform(post("/console-storefront/enter").with(csrf())).andExpect(status().is3xxRedirection());
        for(String page:List.of("/","/categories","/stores")){
            assertFalse(mvc.perform(get(page)).andReturn().getResponse().getContentAsString().contains("href=\"/console-storefront/return\""));
            assertFalse(mvc.perform(get(page).with(user(customer).roles("USER"))).andReturn().getResponse().getContentAsString().contains("href=\"/console-storefront/return\""));
        }
    }

    @Test void revokedOperationalRoleReturnsToSafeCustomerHome() throws Exception {
        String email=fixture("ADMIN");var session=new org.springframework.mock.web.MockHttpSession();
        mvc.perform(get("/admin/products").session(session).with(user(email).roles("ADMIN"))).andExpect(status().isOk());
        mvc.perform(post("/console-storefront/enter").session(session).with(user(email).roles("ADMIN")).with(csrf())).andExpect(redirectedUrl("/"));
        sql.update("DELETE FROM USER_ROLES WHERE user_email=?",email);
        sql.update("INSERT USER_ROLES(user_email,role_id) SELECT ?,id FROM ROLES WHERE name='ROLE_USER'",email);
        mvc.perform(get("/console-storefront/return").session(session).with(user(email).roles("USER"))).andExpect(redirectedUrl("/"));
        mvc.perform(get("/admin/products").session(session).with(user(email).roles("USER"))).andExpect(status().isForbidden());
        assertFalse(mvc.perform(get("/").session(session).with(user(email).roles("USER"))).andReturn().getResponse().getContentAsString().contains("href=\"/console-storefront/return\""));
    }
}
