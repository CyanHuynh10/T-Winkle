package cyan.project.twinkle.service;
/** Customer availability only; reorder thresholds remain in inventory services. */
public record StockPresentation(String style,String label) {
 public static void enrich(java.util.Map<String,Object> row,boolean tracked){
  var stock=of(row.get("quantity") instanceof Number n?n:null,tracked);
  row.put("availability",stock.label());
  row.put("availability_style",stock.style());
 }
 public static StockPresentation of(Number quantity,boolean tracked){
  if(!tracked || quantity==null)return new StockPresentation("neutral","Không kinh doanh");
  if(quantity.longValue()<=0)return new StockPresentation("out","Hết hàng");
  if(quantity.longValue()<=5)return new StockPresentation("low","Sắp hết");
  return new StockPresentation("in","Còn hàng");
 }
}
