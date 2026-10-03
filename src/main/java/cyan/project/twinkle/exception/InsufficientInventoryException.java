package cyan.project.twinkle.exception;

public class InsufficientInventoryException extends BusinessRuleException {
    public InsufficientInventoryException(String message) {
        super(message);
    }
}
