package cyan.project.twinkle.dto;
import java.math.BigDecimal;
import java.time.LocalDateTime;
public record CouponOption(String code, String discountType, BigDecimal discountValue, BigDecimal minOrderValue,
                           LocalDateTime startsAt, LocalDateTime endsAt, Integer remainingUsage, boolean available, String reason) {}
