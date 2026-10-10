package cyan.project.twinkle.controller;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@ControllerAdvice
public class UploadExceptionAdvice {
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public String oversizedAvatar(RedirectAttributes flash) {
        flash.addFlashAttribute("error", "Ảnh đại diện tối đa 5 MB");
        return "redirect:/profile";
    }
}
