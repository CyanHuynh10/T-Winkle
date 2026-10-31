package cyan.project.twinkle.security;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.core.*;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.*;
import java.util.*;

/** Short-lived, explicitly issued API credentials. Restart/key rotation revokes every issued token. */
@Service
public class ApiTokenService {
    static final String ISSUER="https://t-winkle.local", AUDIENCE="t-winkle-api";
    private final UserDetailsService users;
    private final JwtEncoder encoder;
    private final JwtDecoder decoder;
    private final Clock clock;
    private final Map<String,Instant> issued=new HashMap<>();
    @org.springframework.beans.factory.annotation.Autowired
    public ApiTokenService(UserDetailsService users,@Value("${twinkle.jwt.secret:}") String secret){this(users,secret,Clock.systemUTC());}
    ApiTokenService(UserDetailsService users,String secret,Clock clock){
        this.users=users;this.clock=clock;
        if(secret.isBlank()){encoder=null;decoder=null;return;}
        byte[] bytes;
        try{bytes=Base64.getDecoder().decode(secret);}catch(IllegalArgumentException ex){throw new IllegalArgumentException("JWT_SECRET must be Base64 encoded",ex);}
        if(bytes.length<32)throw new IllegalArgumentException("JWT_SECRET must contain at least 256 bits");
        var key=new javax.crypto.spec.SecretKeySpec(bytes,"HmacSHA256");
        encoder=new NimbusJwtEncoder(new ImmutableSecret<>(key));
        var validator=new JwtTimestampValidator(Duration.ZERO);validator.setClock(clock);
        var nimbus=NimbusJwtDecoder.withSecretKey(key).macAlgorithm(MacAlgorithm.HS256).build();
        nimbus.setJwtValidator(new DelegatingOAuth2TokenValidator<>(validator,new JwtIssuerValidator(ISSUER),token->{
            boolean valid=token.getAudience().contains(AUDIENCE)&&token.getExpiresAt()!=null&&token.getIssuedAt()!=null&&token.getSubject()!=null&&token.getId()!=null;
            return valid?OAuth2TokenValidatorResult.success():OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token"));
        }));decoder=nimbus;
    }
    public synchronized Map<String,Object> issue(Authentication authentication){
        if(encoder==null)throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE,"API token issuance is not configured");
        var user=users.loadUserByUsername(authentication.getName());
        if(!user.isEnabled())throw new org.springframework.security.access.AccessDeniedException("ACCOUNT_DISABLED");
        issued.values().removeIf(expiry->!expiry.isAfter(clock.instant()));
        if(issued.size()>=10000)throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.TOO_MANY_REQUESTS,"Too many active API tokens");
        Instant now=clock.instant(),expires=now.plusSeconds(600);String id=UUID.randomUUID().toString();
        var claims=JwtClaimsSet.builder().issuer(ISSUER).audience(List.of(AUDIENCE)).subject(user.getUsername()).issuedAt(now).notBefore(now).expiresAt(expires).id(id)
                .claim("credential",fingerprint(user.getPassword())).claim("roles",user.getAuthorities().stream().map(Object::toString).sorted().toList()).build();
        String token=encoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(),claims)).getTokenValue();issued.put(id,expires);
        return Map.of("access_token",token,"token_type","Bearer","expires_in",600);
    }
    public Jwt decode(String token){if(decoder==null)throw new BadJwtException("API tokens are not configured");return decoder.decode(token);}
    public synchronized UsernamePasswordAuthenticationToken authenticate(Jwt jwt){
        Instant expiry=issued.get(jwt.getId());
        if(expiry==null||!expiry.isAfter(clock.instant()))throw invalid();
        try{
            var user=users.loadUserByUsername(jwt.getSubject());
            if(!user.isEnabled()||!MessageDigest.isEqual(fingerprint(user.getPassword()).getBytes(StandardCharsets.US_ASCII),Objects.toString(jwt.getClaimAsString("credential"),"").getBytes(StandardCharsets.US_ASCII)))throw invalid();
            // Reload current roles and assignments; token-supplied authorities are never trusted.
            if(user instanceof org.springframework.security.core.CredentialsContainer credentials)credentials.eraseCredentials();
            var auth=new UsernamePasswordAuthenticationToken(user,null,user.getAuthorities());auth.setDetails(jwt.getId());return auth;
        }catch(org.springframework.security.core.userdetails.UsernameNotFoundException ex){throw invalid();}
    }
    public synchronized void revoke(Authentication auth){issued.remove(Objects.toString(auth.getDetails(),""));}
    public synchronized void revokeAll(){issued.clear();}
    private static OAuth2AuthenticationException invalid(){return new OAuth2AuthenticationException(new OAuth2Error("invalid_token"),"Invalid or revoked API token");}
    private static String fingerprint(String hash){try{return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(hash.getBytes(StandardCharsets.UTF_8)));}catch(java.security.NoSuchAlgorithmException ex){throw new IllegalStateException(ex);}}
}
