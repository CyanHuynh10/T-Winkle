package cyan.project.twinkle.chat.ai;

/** Safe provider control signal; never contains provider error bodies. */
public class AiRateLimitException extends RuntimeException {
    private final long waitSeconds;
    public AiRateLimitException(long waitSeconds) { super("AI_RATE_LIMIT"); this.waitSeconds=Math.max(1,Math.min(90,waitSeconds)); }
    public long waitSeconds() { return waitSeconds; }
}
