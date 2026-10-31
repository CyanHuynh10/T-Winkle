package cyan.project.twinkle.service;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.*;
import java.time.Instant;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
class ConsoleReturnTests {
 JdbcTemplate sql;ConsoleReturnService service;MockHttpSession session;
 UsernamePasswordAuthenticationToken auth(String role){return new UsernamePasswordAuthenticationToken("staff@test.invalid","",List.of(new SimpleGrantedAuthority("ROLE_"+role)));}
 @BeforeEach void setup(){sql=mock(JdbcTemplate.class);service=new ConsoleReturnService(sql);session=new MockHttpSession();}
 void persisted(String... roles){when(sql.queryForList(anyString(),eq(String.class),eq("staff@test.invalid"))).thenReturn(Arrays.asList(roles));}
 @ParameterizedTest @CsvSource({"ADMIN,/admin/products","MANAGER,/manager/inventory","SUPPORT,/support/reviews","ADMIN,/admin/support/123","MANAGER,/manager/orders/12","SUPPORT,/support/conversations/12"})
 void roleSpecificOriginSurvivesPageVisitsAndIsConsumed(String role,String path){
  persisted("ROLE_"+role);var auth=auth(role);service.remember(session,path,auth);assertNull(service.active(session,auth));
  assertTrue(service.enter(session,auth));assertEquals(path,service.active(session,auth).path());assertNotNull(service.active(session,auth));
  assertEquals(path,service.finish(session,auth));assertNull(service.active(session,auth));assertFalse(service.enter(session,auth));
 }
 @ParameterizedTest @ValueSource(strings={"https://evil.invalid","//evil.invalid","/admin/../manager","/admin/products?returnUrl=https://evil.invalid","/admin/%2e%2e","/admin/products%0d%0aLocation:evil","/admin/products/1","/support/products","/manager/users","/admin;evil","/admin/products\\evil","/admin/orders/1"})
 void rejectPathsOutsideConsoleAllowlist(String path){assertNull(ConsoleReturnService.roleFor(path));persisted("ROLE_ADMIN");service.remember(session,path,auth("ADMIN"));assertFalse(service.enter(session,auth("ADMIN")));}
 @Test void ordinaryCustomerAndGuestHaveNoContext(){persisted("ROLE_USER");service.remember(session,"/admin",auth("USER"));assertFalse(service.enter(session,auth("USER")));assertNull(service.active(session,null));assertEquals("/",service.finish(session,null));}
 @Test void wrongRoleCannotEnter(){persisted("ROLE_MANAGER");service.remember(session,"/admin/products",auth("MANAGER"));assertFalse(service.enter(session,auth("MANAGER")));}
 @Test void revokedRoleIsHiddenAndUsesSafeFallback(){persisted("ROLE_ADMIN");service.remember(session,"/admin/products",auth("ADMIN"));assertTrue(service.enter(session,auth("ADMIN")));persisted();assertNull(service.active(session,auth("ADMIN")));assertEquals("/",service.finish(session,auth("ADMIN")));}
 @Test void expiredContextAndChangedIdentityAreRejected(){persisted("ROLE_ADMIN");session.setAttribute(ConsoleReturnService.ACTIVE,new ConsoleReturnService.Destination("staff@test.invalid","admin","/admin/products",Instant.now().minusSeconds(14401)));assertNull(service.active(session,auth("ADMIN")));session.setAttribute(ConsoleReturnService.ACTIVE,new ConsoleReturnService.Destination("other@test.invalid","admin","/admin/products",Instant.now()));assertNull(service.active(session,auth("ADMIN")));}
 @Test void directConsoleVisitClearsActiveContext(){persisted("ROLE_ADMIN");service.remember(session,"/admin/products",auth("ADMIN"));service.enter(session,auth("ADMIN"));service.remember(session,"/admin/users",auth("ADMIN"));assertNull(service.active(session,auth("ADMIN")));service.enter(session,auth("ADMIN"));assertEquals("/admin/users",service.finish(session,auth("ADMIN")));}
 @Test void missingSessionHasNoButton(){assertNull(service.active(null,auth("ADMIN")));}
 @Test void changedSessionAuthorityUsesCustomerFallbackAndClearsState(){persisted("ROLE_ADMIN");service.remember(session,"/admin/products",auth("ADMIN"));assertTrue(service.enter(session,auth("ADMIN")));persisted("ROLE_USER");assertEquals("/",service.finish(session,auth("USER")));assertNull(service.active(session,auth("USER")));}
}
