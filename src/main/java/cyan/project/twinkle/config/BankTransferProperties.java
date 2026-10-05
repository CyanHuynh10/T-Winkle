package cyan.project.twinkle.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/** Process environment binding; no dotenv loading or secret-bearing toString. */
@Component
@ConfigurationProperties(prefix = "twinkle.payment.bank")
@Getter @Setter
public class BankTransferProperties {
    private String bankId = "BIDV";
    private String accountNo = "";
    private String accountName = "";

    public boolean isConfigured() {
        return bankId != null && bankId.matches("(?i)BIDV|970418")
                && accountNo != null && accountNo.matches("[A-Za-z0-9]{1,19}")
                && accountName != null && !accountName.isBlank()
                && !accountNo.startsWith("YOUR_") && !accountName.contains("YOUR_ACCOUNT_HOLDER_NAME");
    }
}
