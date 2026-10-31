package cyan.project.twinkle.service;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
class StockPresentationTests {
 @ParameterizedTest @CsvSource({"0,out","1,low","5,low","6,in","9,in","10,in","11,in"})
 void customerThresholdDoesNotReplaceReorderThreshold(int quantity,String style){assertEquals(style,StockPresentation.of(quantity,true).style());assertEquals(quantity==0?"OUT":quantity<=10?"LOW":"AVAILABLE",cyan.project.twinkle.manager.ManagerQueryService.replenishment(quantity,10));}
 @Test void missingInventoryIsNeutral(){assertEquals("Không kinh doanh",StockPresentation.of(0,false).label());assertEquals("neutral",StockPresentation.of(null,true).style());}
}
