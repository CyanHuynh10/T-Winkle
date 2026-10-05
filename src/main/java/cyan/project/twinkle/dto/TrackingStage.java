package cyan.project.twinkle.dto;
import java.time.LocalDateTime;
public record TrackingStage(String status, LocalDateTime createdAt, String note, String color, boolean completed, boolean current) {}
