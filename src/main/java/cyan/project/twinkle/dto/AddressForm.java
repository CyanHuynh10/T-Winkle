package cyan.project.twinkle.dto;

import lombok.Data;

@Data
public class AddressForm {
    private Long id;
    private String fullName;
    private String phone;
    private String city;
    private String district;
    private String ward;
    private String addressLine;
    private String note;
    private Boolean isDefault;
}
