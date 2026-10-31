package cyan.project.twinkle.security;

import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import java.time.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;
import static org.junit.jupiter.api.Assertions.*;

class ApiTokenTests {
    final byte[] key=new byte[32];
    final String secret;
    final AtomicReference<org.springframework.security.core.userdetails.UserDetails> user=new AtomicReference<>(User.withUsername("api@test.invalid").password("credential-one").roles("USER").build());
    final UserDetailsService users=name->User.withUserDetails(user.get()).build();
    ApiTokenTests(){new java.security.SecureRandom().nextBytes(key);secret=Base64.getEncoder().encodeToString(key);}
    String issue(ApiTokenService service){return service.issue(new UsernamePasswordAuthenticationToken("api@test.invalid",null,List.of())).get("access_token").toString();}
    @Test void signedTokenHasIssuerAudienceExpiryAndServerMappedAuthorities(){
        var service=new ApiTokenService(users,secret);var jwt=service.decode(issue(service));
        assertEquals(ApiTokenService.ISSUER,jwt.getIssuer().toString());assertEquals(List.of(ApiTokenService.AUDIENCE),jwt.getAudience());
        assertEquals(600,Duration.between(jwt.getIssuedAt(),jwt.getExpiresAt()).toSeconds());
        assertEquals("api@test.invalid",service.authenticate(jwt).getName());assertEquals("ROLE_USER",service.authenticate(jwt).getAuthorities().iterator().next().getAuthority());
    }
    @Test void tamperingInvalidSignatureUnsignedAndMalformedTokensAreRejected(){
        var service=new ApiTokenService(users,secret);String token=issue(service);String[] parts=token.split("\\.");
        assertThrows(JwtException.class,()->service.decode(parts[0]+"."+Base64.getUrlEncoder().withoutPadding().encodeToString("{\"sub\":\"admin\"}".getBytes())+"."+parts[2]));
        assertThrows(JwtException.class,()->service.decode("eyJhbGciOiJub25lIn0."+parts[1]+"."));
        assertThrows(JwtException.class,()->service.decode("invalid"));
        var other=new ApiTokenTests();assertThrows(JwtException.class,()->new ApiTokenService(users,other.secret).decode(token));
    }
    String signed(String issuer,String audience,Instant expires){
        var encoder=new NimbusJwtEncoder(new ImmutableSecret<>(new javax.crypto.spec.SecretKeySpec(key,"HmacSHA256")));
        return encoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(),JwtClaimsSet.builder().issuer(issuer).audience(List.of(audience)).subject("api@test.invalid").issuedAt(Instant.now().minusSeconds(120)).expiresAt(expires).id(UUID.randomUUID().toString()).build())).getTokenValue();
    }
    @Test void expiredWrongIssuerAndWrongAudienceAreRejected(){
        var service=new ApiTokenService(users,secret);
        assertThrows(JwtException.class,()->service.decode(signed(ApiTokenService.ISSUER,ApiTokenService.AUDIENCE,Instant.now().minusSeconds(1))));
        assertThrows(JwtException.class,()->service.decode(signed("wrong",ApiTokenService.AUDIENCE,Instant.now().plusSeconds(60))));
        assertThrows(JwtException.class,()->service.decode(signed(ApiTokenService.ISSUER,"wrong",Instant.now().plusSeconds(60))));
    }
    @Test void revocationPasswordResetDisabledAccountsAndRestartInvalidateTokens(){
        var service=new ApiTokenService(users,secret);String token=issue(service);var jwt=service.decode(token);var authentication=service.authenticate(jwt);
        service.revoke(authentication);final var revokedJwt=jwt;assertThrows(OAuth2AuthenticationException.class,()->service.authenticate(revokedJwt));
        jwt=service.decode(issue(service));final var passwordJwt=jwt;user.set(User.withUsername("api@test.invalid").password("credential-two").roles("USER").build());
        assertThrows(OAuth2AuthenticationException.class,()->service.authenticate(passwordJwt));
        jwt=service.decode(issue(service));final var disabledJwt=jwt;user.set(User.withUsername("api@test.invalid").password("credential-two").roles("USER").disabled(true).build());
        assertThrows(OAuth2AuthenticationException.class,()->service.authenticate(disabledJwt));
        assertThrows(OAuth2AuthenticationException.class,()->new ApiTokenService(users,secret).authenticate(disabledJwt));
    }
    @Test void changedRolesAreReloadedInsteadOfTrustingTokenClaims(){
        var service=new ApiTokenService(users,secret);var jwt=service.decode(issue(service));
        user.set(User.withUsername("api@test.invalid").password("credential-one").roles("SUPPORT").build());
        assertEquals(List.of("ROLE_SUPPORT"),service.authenticate(jwt).getAuthorities().stream().map(Object::toString).toList());
    }
    @Test void absentOrWeakConfigurationNeverCreatesUsableTokens(){
        assertThrows(org.springframework.web.server.ResponseStatusException.class,()->issue(new ApiTokenService(users,"")));
        assertThrows(IllegalArgumentException.class,()->new ApiTokenService(users,"weak"));
        assertThrows(JwtException.class,()->new ApiTokenService(users,"").decode("invalid"));
    }
}
