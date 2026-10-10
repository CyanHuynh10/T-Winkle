import java.nio.file.*;
import org.springframework.security.crypto.bcrypt.BCrypt;

/** Local-only credential preparation. Reads a generated secret from the process, never a source constant. */
class PrepareManagerReview {
    public static void main(String[] args) throws Exception {
        String password=System.getenv("TWMGRDEMO_PASSWORD");
        if(password==null || password.length()<20)throw new IllegalArgumentException("Private temporary password required");
        Files.createDirectories(Path.of("target/manager-review"));
        Files.writeString(Path.of("target/manager-review/login.json"),"{\"email\":\"TWMGRDEMO-manager@example.invalid\",\"password\":\""+password+"\"}");
        System.out.print(BCrypt.hashpw(password,BCrypt.gensalt(12)));
    }
}
