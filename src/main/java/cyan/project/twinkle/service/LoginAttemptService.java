package cyan.project.twinkle.service;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {

    public static final int MAX_ATTEMPT = 5;
    public static final int LOCK_TIME_DURATION_MINUTES = 15;
    private static final int MAX_CACHE_SIZE = 10000;

    private final ConcurrentHashMap<String, Integer> attemptsCache = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, LocalDateTime> lockCache = new ConcurrentHashMap<>();

    private String normalizeKey(String key) {
        return key != null ? key.toLowerCase().trim() : "";
    }

    // Safer cleanup strategy to prevent uncontrolled cache growth without wiping the entire map
    private void evictIfNecessary() {
        if (lockCache.size() > MAX_CACHE_SIZE || attemptsCache.size() > MAX_CACHE_SIZE) {
            LocalDateTime now = LocalDateTime.now();
            
            // Remove expired locks
            lockCache.entrySet().removeIf(entry -> entry.getValue().isBefore(now));
            
            // Remove attempts that are no longer tracked in the active lock cache to free space
            attemptsCache.keySet().removeIf(key -> !lockCache.containsKey(key));
        }
    }

    public void loginSucceeded(String key) {
        String normKey = normalizeKey(key);
        attemptsCache.remove(normKey);
        lockCache.remove(normKey);
    }

    public void loginFailed(String key) {
        evictIfNecessary();
        String normKey = normalizeKey(key);
        
        int attempts = attemptsCache.getOrDefault(normKey, 0);
        attempts++;
        attemptsCache.put(normKey, attempts);

        if (attempts >= MAX_ATTEMPT) {
            lockCache.put(normKey, LocalDateTime.now().plusMinutes(LOCK_TIME_DURATION_MINUTES));
        }
    }

    public boolean isBlocked(String key) {
        String normKey = normalizeKey(key);
        if (lockCache.containsKey(normKey)) {
            if (lockCache.get(normKey).isBefore(LocalDateTime.now())) {
                lockCache.remove(normKey);
                attemptsCache.remove(normKey);
                return false;
            }
            return true;
        }
        return false;
    }
}
