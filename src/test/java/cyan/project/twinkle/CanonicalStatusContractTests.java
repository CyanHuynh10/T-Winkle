package cyan.project.twinkle;
import cyan.project.twinkle.service.OrderStatus;
import org.junit.jupiter.api.Test;
import java.nio.file.*;
import java.util.*;
import java.util.regex.Pattern;
import static org.junit.jupiter.api.Assertions.*;
class CanonicalStatusContractTests {
 @Test void sharedFrontendVocabularyAndStyleKeysMatchBackend() throws Exception {
  String frontend=Files.readString(Path.of("frontend/shared/operational.ts"));
  var values=new ArrayList<String>();var matcher=Pattern.compile("'([^']+)'").matcher(frontend.substring(frontend.indexOf("["),frontend.indexOf("]")));
  while(matcher.find())values.add(matcher.group(1));assertEquals(Arrays.stream(OrderStatus.values()).map(OrderStatus::label).toList(),values);
  for(var status:OrderStatus.values())assertTrue(frontend.contains("'"+status.label()+"':'"+status.style()+"'"),status.label());
 }
 @Test void canonicalOrderColorsAreDistinctAndReadable() throws Exception {
  String css=Files.readString(Path.of("src/main/resources/static/css/order-status.css"));var colors=new HashSet<String>();
  for(String tone:List.of("waiting","payment-waiting","confirmed","preparing","ready","shipping","delivered","cancellation-pending","cancelled","refund-pending","refunded")){
   String bg=color(css,tone,"bg"),fg=color(css,tone,"fg");assertTrue(colors.add(bg),"Duplicate status background: "+tone);
   double a=luminance(bg),b=luminance(fg);assertTrue((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5,"Insufficient text contrast: "+tone);
  }
 }
 private String color(String css,String tone,String part){var m=Pattern.compile("--status-"+tone+"-"+part+":(#[0-9a-fA-F]{6})").matcher(css);assertTrue(m.find(),tone+" "+part);return m.group(1);}
 private double luminance(String hex){double total=0;double[] weights={.2126,.7152,.0722};for(int i=0;i<3;i++){double v=Integer.parseInt(hex.substring(1+i*2,3+i*2),16)/255.0;total+=weights[i]*(v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4));}return total;}
}
