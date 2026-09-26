package cyan.project.twinkle.dto;

import jakarta.validation.constraints.NotBlank;

public class OtpRequest {

    private String email;

    @NotBlank(message = "Mã OTP không được để trống")
    private String otpCode;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getOtpCode() { return otpCode; }
    public void setOtpCode(String otpCode) { this.otpCode = otpCode; }
}
