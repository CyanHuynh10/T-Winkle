import org.springframework.security.crypto.bcrypt.BCrypt;
/** Encodes a transient verification credential without writing it to source/logs. */
class PrepareCleanupSmoke {
 public static void main(String[] args) {
  String value=System.getenv("TWCLEANSMOKE_PASSWORD");
  if(value==null || value.length()<20)throw new IllegalArgumentException("Private temporary credential required");
  System.out.print(BCrypt.hashpw(value,BCrypt.gensalt(12)));
 }
}
