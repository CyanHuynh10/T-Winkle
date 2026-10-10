package cyan.project.twinkle.controller;
import cyan.project.twinkle.manager.StoreFulfillmentService;
import cyan.project.twinkle.chat.support.SupportAuthorizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;
import org.springframework.security.core.Authentication;
@Controller @RequiredArgsConstructor
public class ManagerController {
 private final StoreFulfillmentService fulfillment;
 private final SupportAuthorizationService support;
 @GetMapping({"/manager","/manager/","/manager/products","/manager/products/{id}","/manager/variants","/manager/inventory","/manager/orders","/manager/payments","/manager/reviews","/manager/orders/{id}","/manager/store-profile"})
 public String manager(){return "manager/island";}
 @GetMapping({"/manager/support","/manager/support/{id}"})
 public String inbox(@PathVariable(required=false) Long id,Authentication auth,Model model){
  if(id!=null)support.require(id,auth);
  if(auth.getAuthorities().stream().anyMatch(a->a.getAuthority().equals("ROLE_MANAGER")))return "manager/island";
  model.addAttribute("chatMode",id==null?"inbox":"support");model.addAttribute("conversationId",id);return "chat/island";
 }
 @GetMapping({"/manager/dashboard","/manager/revenue"}) public String dashboard(){return "redirect:/manager";}
 @GetMapping({"/manager/store","/manager/account"}) public String profile(){return "redirect:/manager/store-profile";}
 @GetMapping("/manager/chat") public String chat(){return "redirect:/manager/support";}
 @PostMapping("/manager/orders/{id}/status") public String transition(@PathVariable long id,@RequestParam String status){fulfillment.transition(id,status);return "redirect:/manager/orders/"+id;}
}
