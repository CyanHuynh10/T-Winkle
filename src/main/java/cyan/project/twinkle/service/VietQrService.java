package cyan.project.twinkle.service;

import cyan.project.twinkle.config.BankTransferProperties;
import cyan.project.twinkle.entity.Order;
import cyan.project.twinkle.exception.BusinessRuleException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class VietQrService {
    private final BankTransferProperties properties;

    public boolean available() { return properties.isConfigured(); }

    public void requireConfiguration() {
        if (!available()) throw new BusinessRuleException("Chuyển khoản ngân hàng chưa được cấu hình. Vui lòng chọn thanh toán khi nhận hàng");
    }

    public void validateOrderData(BigDecimal total, String orderCode) {
        if (total == null || total.signum() <= 0 || total.stripTrailingZeros().scale() > 0
                || total.compareTo(new BigDecimal("9999999999999")) > 0)
            throw new BusinessRuleException("Số tiền chuyển khoản phải là số nguyên VND dương, tối đa 13 chữ số");
        if (orderCode == null || !orderCode.matches("TW[A-Za-z0-9]{1,48}"))
            throw new BusinessRuleException("Mã đơn chuyển khoản không hợp lệ");
    }

    public String imageUrl(Order order) {
        requireConfiguration();
        if (order.getId() == null || !"BANKING".equals(order.getPaymentMethod()))
            throw new BusinessRuleException("Đơn hàng không hỗ trợ chuyển khoản");
        validateOrderData(order.getTotal(), order.getOrderCode());
        return "https://img.vietqr.io/image/" + encode(properties.getBankId()) + "-"
                + encode(properties.getAccountNo()) + "-compact2.png?amount="
                + order.getTotal().toBigIntegerExact() + "&addInfo=" + encode(order.getOrderCode())
                + "&accountName=" + encode(properties.getAccountName());
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8).replace("+", "%20");
    }
}
