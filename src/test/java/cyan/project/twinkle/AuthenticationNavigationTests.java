package cyan.project.twinkle;
import cyan.project.twinkle.security.RoleBasedAuthenticationSuccessHandler;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
class AuthenticationNavigationTests {
 @Test void roleDefaultsAndPriorityAreDeterministic() throws Exception {
  for(var expected:Map.of("ADMIN","/admin","MANAGER","/manager","SUPPORT","/support","USER","/").entrySet()) {
   var response=new MockHttpServletResponse();new RoleBasedAuthenticationSuccessHandler().onAuthenticationSuccess(new MockHttpServletRequest(),response,new UsernamePasswordAuthenticationToken("fixture","unused",List.of(new SimpleGrantedAuthority("ROLE_"+expected.getKey()))));assertEquals(expected.getValue(),response.getRedirectedUrl());
  }
  var response=new MockHttpServletResponse();new RoleBasedAuthenticationSuccessHandler().onAuthenticationSuccess(new MockHttpServletRequest(),response,new UsernamePasswordAuthenticationToken("fixture","unused",List.of(new SimpleGrantedAuthority("ROLE_USER"),new SimpleGrantedAuthority("ROLE_MANAGER"),new SimpleGrantedAuthority("ROLE_ADMIN"))));assertEquals("/admin",response.getRedirectedUrl());
 }
 @Test void customerSavedChatRestoresLocalRouteAndAdminContinueIsDiscarded() throws Exception {
  for(String role:List.of("USER","ADMIN")){
   var request=new MockHttpServletRequest("GET",role.equals("USER")?"/chat/start/42":"/admin");request.setQueryString("continue");var response=new MockHttpServletResponse();new HttpSessionRequestCache().saveRequest(request,response);new RoleBasedAuthenticationSuccessHandler().onAuthenticationSuccess(request,response,new UsernamePasswordAuthenticationToken("fixture","unused",List.of(new SimpleGrantedAuthority("ROLE_"+role))));assertEquals(role.equals("USER")?"/chat/start/42":"/admin",response.getRedirectedUrl());assertNull(new HttpSessionRequestCache().getRequest(request,response));
  }
 }
}
