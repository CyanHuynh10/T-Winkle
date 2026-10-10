package cyan.project.twinkle.manager;

public class ManagerException extends RuntimeException {
    public final String code;
    public final int status;
    public ManagerException(String code, String message, int status) { super(message); this.code=code; this.status=status; }
    public static ManagerException invalid(String message) { return new ManagerException("INVALID_INPUT",message,400); }
}
