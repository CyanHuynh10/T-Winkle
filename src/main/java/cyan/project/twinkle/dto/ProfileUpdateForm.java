package cyan.project.twinkle.dto;

import lombok.Data;

@Data
public class ProfileUpdateForm {
    @jakarta.validation.constraints.NotBlank(message = "Vui lòng nhập Username.")
    @jakarta.validation.constraints.Pattern(regexp = "[A-Za-z0-9_.-]{3,50}", message = "Username phải có 3-50 ký tự chữ, số, dấu chấm, gạch dưới hoặc gạch ngang.")
    private String username;
    @jakarta.validation.constraints.NotBlank(message = "Vui lòng nhập họ và tên.")
    @jakarta.validation.constraints.Size(max = 100, message = "Họ và tên tối đa 100 ký tự.")
    private String fullName;
    @jakarta.validation.constraints.Pattern(regexp = "|[0-9]{10,11}", message = "Số điện thoại phải có 10-11 chữ số.")
    private String phone;
}
