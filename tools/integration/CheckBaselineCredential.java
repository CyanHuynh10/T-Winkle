import java.sql.DriverManager;
import java.util.List;
import org.springframework.security.crypto.bcrypt.BCrypt;

/** Read-only credential check. Requires TWINKLE_VERIFY_PASSWORD; prints no credentials or hashes. */
class CheckBaselineCredential {
    public static void main(String[] args) throws Exception {
        String password=System.getenv("TWINKLE_VERIFY_PASSWORD");
        if(password==null || password.isBlank())throw new IllegalArgumentException("TWINKLE_VERIFY_PASSWORD is required");
        try(var connection=DriverManager.getConnection("jdbc:sqlserver://localhost:1433;databaseName=T_Winkle;encrypt=true;trustServerCertificate=true",System.getenv("DB_USERNAME"),System.getenv("DB_PASSWORD"));
            var query=connection.prepareStatement("SELECT password_hash FROM USERS WHERE email=?")) {
            for(String email:List.of("admin@twinkle.com","support1@twinkle.com","24110064@student.hcmute.edu.vn","district1@twinkle.com","district3@twinkle.com","district5@twinkle.com","district7@twinkle.com","thuduc@twinkle.com","binhthanh@twinkle.com")) {
                query.setString(1,email);
                try(var row=query.executeQuery()) {
                    boolean matches=row.next() && BCrypt.checkpw(password,row.getString(1));
                    System.out.println(email+" provided_credential_matches="+matches);
                }
            }
        }
    }
}
