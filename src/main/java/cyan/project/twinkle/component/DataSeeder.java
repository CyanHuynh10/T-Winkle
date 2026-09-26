package cyan.project.twinkle.component;

import cyan.project.twinkle.entity.Role;
import cyan.project.twinkle.entity.User;
import cyan.project.twinkle.repository.RoleRepository;
import cyan.project.twinkle.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        seedRoles();
        seedUsers();
    }

    private void seedRoles() {
        List<String> roleNames = Arrays.asList("ROLE_ADMIN", "ROLE_MANAGER", "ROLE_SHIPPER", "ROLE_SUPPORT", "ROLE_USER");
        for (String roleName : roleNames) {
            if (roleRepository.findByName(roleName).isEmpty()) {
                roleRepository.save(new Role(roleName));
            }
        }
    }

    private void seedUsers() {
        String defaultPassword = passwordEncoder.encode("123456");

        createUserIfNotFound("admin", "admin@twinkle.com", defaultPassword, "ROLE_ADMIN");
        createUserIfNotFound("district1", "district1@twinkle.com", defaultPassword, "ROLE_MANAGER");
        createUserIfNotFound("shipper1", "shipper1@twinkle.com", defaultPassword, "ROLE_SHIPPER");
        createUserIfNotFound("support1", "support1@twinkle.com", defaultPassword, "ROLE_SUPPORT");
        createUserIfNotFound("user1", "user1@twinkle.com", defaultPassword, "ROLE_USER");
    }

    private void createUserIfNotFound(String username, String email, String password, String roleName) {
        if (userRepository.findByEmail(email).isEmpty()) {
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPasswordHash(password);
            user.setIsEnabled(true);

            Role role = roleRepository.findByName(roleName).orElseThrow();
            user.getRoles().add(role);

            userRepository.save(user);
        }
    }
}
