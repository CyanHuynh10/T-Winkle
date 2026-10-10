package cyan.project.twinkle.dto;

import lombok.Data;

@Data
public class CheckoutForm {
    private Long addressId;
    private String couponCode;
    private String paymentMethod;
    private String fulfillmentMode = "DELIVERY";
}
