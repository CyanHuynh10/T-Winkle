package cyan.project.twinkle.service;
import cyan.project.twinkle.entity.Product;
import cyan.project.twinkle.entity.ProductVariant;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.jdbc.core.JdbcTemplate;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service @RequiredArgsConstructor
public class PricingService {
 private final JdbcTemplate sql;
 private final cyan.project.twinkle.repository.ProductRepository products;
 /** Price-ordered catalog pagination uses the same scope/priority winner as item pricing. */
 @Transactional(readOnly=true) public org.springframework.data.domain.Page<Product> pricedPage(String keyword,String category,String brand,Integer store,LocalDateTime now,int page,int size,boolean ascending,boolean sale){
  return catalogPage(keyword,category,brand,store,now,page,size,ascending?"price-asc":"price-desc",new CatalogFilter(null,null,null,null,null,sale),sale);
 }
 public record CatalogFilter(String size,String color,BigDecimal minPrice,BigDecimal maxPrice,Boolean available,Boolean sale){}
 @Transactional(readOnly=true) public org.springframework.data.domain.Page<Product> catalogPage(String keyword,String category,String brand,Integer store,LocalDateTime now,int page,int size,String sort,CatalogFilter filter,boolean saleOrdering){
  if(size<1||size>100||keyword!=null&&keyword.length()>150||!Set.of("popular","newest","price-asc","price-desc").contains(sort)||filter.minPrice()!=null&&filter.minPrice().signum()<0||filter.maxPrice()!=null&&filter.maxPrice().signum()<0||filter.minPrice()!=null&&filter.maxPrice()!=null&&filter.minPrice().compareTo(filter.maxPrice())>0)throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST,"Bộ lọc sản phẩm không hợp lệ");
  boolean sale=Boolean.TRUE.equals(filter.sale());
  String amount="CASE WHEN pr.discount_type='PERCENT' THEN p.base_price*(1-pr.discount_value/100.0) ELSE p.base_price-pr.discount_value END";
  String effective="CAST(CASE WHEN ("+amount+")<0 THEN 0 ELSE ("+amount+") END AS DECIMAL(18,2))";
  String ranks="CASE pr.scope "+List.of("GLOBAL","STORE","CATEGORY","BRAND","PRODUCT","VARIANT").stream().map(s->"WHEN '"+s+"' THEN "+specificity(s)).collect(java.util.stream.Collectors.joining(" "))+" END";
  String source=" FROM PRODUCTS p JOIN BRANDS b ON b.id=p.brand_id JOIN CATEGORIES c ON c.id=p.category_id OUTER APPLY(SELECT TOP(1) "+effective+" AS effective_price FROM PROMOTIONS pr WHERE pr.status='ACTIVE' AND pr.starts_at<=? AND pr.ends_at>? AND (pr.scope='GLOBAL' OR (pr.scope='PRODUCT' AND EXISTS(SELECT 1 FROM PRODUCT_PROMOTIONS t WHERE t.promotion_id=pr.id AND t.product_id=p.id)) OR (pr.scope='CATEGORY' AND EXISTS(SELECT 1 FROM CATEGORY_PROMOTIONS t WHERE t.promotion_id=pr.id AND t.category_id=p.category_id)) OR (pr.scope='BRAND' AND EXISTS(SELECT 1 FROM BRAND_PROMOTIONS t WHERE t.promotion_id=pr.id AND t.brand_id=p.brand_id)) OR (pr.scope='STORE' AND EXISTS(SELECT 1 FROM STORE_PROMOTIONS t WHERE t.promotion_id=pr.id AND t.store_id=?))) ORDER BY "+ranks+" DESC,pr.priority DESC,"+effective+" ASC,pr.id ASC) price WHERE p.status='ACTIVE' AND (? IS NULL OR p.name LIKE ?) AND (? IS NULL OR c.slug=?) AND (? IS NULL OR b.slug=?) AND (? IS NULL OR EXISTS(SELECT 1 FROM STORE_INVENTORY si JOIN PRODUCT_VARIANTS v ON v.id=si.variant_id WHERE v.product_id=p.id AND si.store_id=?))"+(sale?" AND COALESCE(price.effective_price,p.base_price)<p.base_price":"");
  var args=new ArrayList<Object>(Arrays.asList(now,now,store,keyword,keyword==null?null:"%"+keyword+"%",category,category,brand,brand,store,store));
  if(filter.minPrice()!=null){source+=" AND COALESCE(price.effective_price,p.base_price)>=?";args.add(filter.minPrice());}
  if(filter.maxPrice()!=null){source+=" AND COALESCE(price.effective_price,p.base_price)<=?";args.add(filter.maxPrice());}
  if(filter.size()!=null||filter.color()!=null||filter.available()!=null){
   source+=" AND EXISTS(SELECT 1 FROM PRODUCT_VARIANTS fv WHERE fv.product_id=p.id AND fv.status='ACTIVE' AND (? IS NULL OR fv.size=?) AND (? IS NULL OR fv.color=?)";
   args.add(filter.size());args.add(filter.size());args.add(filter.color());args.add(filter.color());
   if(store!=null){source+=" AND EXISTS(SELECT 1 FROM STORE_INVENTORY carried WHERE carried.variant_id=fv.id AND carried.store_id=?)";args.add(store);}
   if(Boolean.TRUE.equals(filter.available())){source+=" AND EXISTS(SELECT 1 FROM STORE_INVENTORY fs JOIN STORES st ON st.store_id=fs.store_id WHERE fs.variant_id=fv.id AND fs.quantity>0 AND (? IS NULL OR fs.store_id=?))";args.add(store);args.add(store);}source+=")";
   if(Boolean.FALSE.equals(filter.available())){source+=" AND NOT EXISTS(SELECT 1 FROM PRODUCT_VARIANTS av JOIN STORE_INVENTORY fs ON fs.variant_id=av.id JOIN STORES st ON st.store_id=fs.store_id WHERE av.product_id=p.id AND av.status='ACTIVE' AND (? IS NULL OR av.size=?) AND (? IS NULL OR av.color=?) AND fs.quantity>0 AND (? IS NULL OR fs.store_id=?))";args.add(filter.size());args.add(filter.size());args.add(filter.color());args.add(filter.color());args.add(store);args.add(store);}
  }
  long total=sql.queryForObject("SELECT COUNT_BIG(*)"+source,Long.class,args.toArray());page=(int)Math.min(Math.max(0L,page),total==0?0:(total-1)/size);args.add((long)page*size);args.add(size);
  String ordering=saleOrdering?"p.base_price-COALESCE(price.effective_price,p.base_price) DESC":switch(sort){case "price-asc"->"COALESCE(price.effective_price,p.base_price) ASC";case "price-desc"->"COALESCE(price.effective_price,p.base_price) DESC";case "newest"->"p.created_at DESC";default->"COALESCE((SELECT SUM(oi.quantity) FROM ORDER_ITEMS oi JOIN ORDERS o ON o.id=oi.order_id WHERE oi.product_id=p.id AND o.status=N'Đã giao' AND (? IS NULL OR oi.store_id=?)),0) DESC";};
  if(sort.equals("popular")&&!saleOrdering){args.add(args.size()-2,store);args.add(args.size()-2,store);}
  var ids=sql.queryForList("SELECT p.id"+source+" ORDER BY "+ordering+",p.id ASC OFFSET ? ROWS FETCH NEXT ? ROWS ONLY",Integer.class,args.toArray());var byId=new HashMap<Integer,Product>();products.findByIdIn(ids).forEach(p->byId.put(p.getId(),p));return new org.springframework.data.domain.PageImpl<>(ids.stream().map(byId::get).toList(),org.springframework.data.domain.PageRequest.of(page,size),total);
 }
 @Transactional(readOnly=true) public BigDecimal calculateEffectivePrice(Product product,LocalDateTime now){return resolve(product,null,null,product.getBasePrice(),now);}
 @Transactional(readOnly=true) public BigDecimal calculateProductPrice(Product product,Integer store,LocalDateTime now){return resolve(product,null,store,product.getBasePrice(),now);}
 @Transactional(readOnly=true) public BigDecimal calculateItemPrice(Product product,ProductVariant variant,Integer store,LocalDateTime now){return resolve(product,variant.getId(),store,product.getBasePrice().add(variant.getPriceAdjustment()),now);}
 @Transactional(readOnly=true) public Map<Integer,BigDecimal> calculateEffectivePricesBatch(List<Product> products,LocalDateTime now){return calculateEffectivePricesBatch(products,now,null);}
 @Transactional(readOnly=true) public Map<Integer,BigDecimal> calculateEffectivePricesBatch(List<Product> products,LocalDateTime now,Integer store){
  var result=new HashMap<Integer,BigDecimal>();if(products.isEmpty())return result;
  var args=new ArrayList<Object>();args.add(now);args.add(now);args.add(store);products.forEach(p->args.add(p.getId()));
  String ids=String.join(",",Collections.nCopies(products.size(),"?"));
  var candidates=sql.queryForList("SELECT x.id AS product_id,p.id,p.scope,p.priority,p.discount_type,p.discount_value FROM PRODUCTS x JOIN PROMOTIONS p ON p.status='ACTIVE' AND p.starts_at<=? AND p.ends_at>? AND (p.scope='GLOBAL' OR (p.scope='PRODUCT' AND EXISTS(SELECT 1 FROM PRODUCT_PROMOTIONS t WHERE t.promotion_id=p.id AND t.product_id=x.id)) OR (p.scope='CATEGORY' AND EXISTS(SELECT 1 FROM CATEGORY_PROMOTIONS t WHERE t.promotion_id=p.id AND t.category_id=x.category_id)) OR (p.scope='BRAND' AND EXISTS(SELECT 1 FROM BRAND_PROMOTIONS t WHERE t.promotion_id=p.id AND t.brand_id=x.brand_id)) OR (p.scope='STORE' AND EXISTS(SELECT 1 FROM STORE_PROMOTIONS t WHERE t.promotion_id=p.id AND t.store_id=?))) WHERE x.id IN("+ids+")",args.toArray());
  var byProduct=new HashMap<Integer,List<Map<String,Object>>>();candidates.forEach(r->byProduct.computeIfAbsent(((Number)r.get("product_id")).intValue(),k->new ArrayList<>()).add(r));
  products.forEach(p->result.put(p.getId(),winnerPrice(p.getBasePrice(),byProduct.getOrDefault(p.getId(),List.of()))));return result;
 }
 private BigDecimal resolve(Product product,Long variant,Integer store,BigDecimal base,LocalDateTime now){return winnerPrice(base,eligible(product,variant,store,now));}
 private List<Map<String,Object>> eligible(Product product,Long variant,Integer store,LocalDateTime now){
  var rows=sql.queryForList("""
    SELECT p.id,p.name,p.scope,p.priority,p.discount_type,p.discount_value FROM PROMOTIONS p
    WHERE p.status='ACTIVE' AND p.starts_at<=? AND p.ends_at>? AND (
    p.scope='GLOBAL' OR
    (p.scope='PRODUCT' AND EXISTS(SELECT 1 FROM PRODUCT_PROMOTIONS t WHERE t.promotion_id=p.id AND t.product_id=?)) OR
    (p.scope='CATEGORY' AND EXISTS(SELECT 1 FROM CATEGORY_PROMOTIONS t WHERE t.promotion_id=p.id AND t.category_id=?)) OR
    (p.scope='BRAND' AND EXISTS(SELECT 1 FROM BRAND_PROMOTIONS t WHERE t.promotion_id=p.id AND t.brand_id=?)) OR
    (p.scope='STORE' AND EXISTS(SELECT 1 FROM STORE_PROMOTIONS t WHERE t.promotion_id=p.id AND t.store_id=?)) OR
    (p.scope='VARIANT' AND EXISTS(SELECT 1 FROM VARIANT_PROMOTIONS t WHERE t.promotion_id=p.id AND t.variant_id=?)))
    """,now,now,product.getId(),product.getCategory().getId(),product.getBrand().getId(),store,variant);
  return rows;
 }
 public static BigDecimal winnerPrice(BigDecimal base,List<Map<String,Object>> rows){
  return winner(base,rows).map(r->discounted(base,(String)r.get("discount_type"),(BigDecimal)r.get("discount_value"))).orElse(base).max(BigDecimal.ZERO);
 }
 private static Optional<Map<String,Object>> winner(BigDecimal base,List<Map<String,Object>> rows){
  return rows.stream().sorted(Comparator.<Map<String,Object>>comparingInt(r->specificity((String)r.get("scope"))).reversed()
    .thenComparing(Comparator.<Map<String,Object>>comparingInt(r->((Number)r.get("priority")).intValue()).reversed())
    .thenComparing(r->discounted(base,(String)r.get("discount_type"),(BigDecimal)r.get("discount_value")))
    .thenComparingLong(r->((Number)r.get("id")).longValue())).findFirst();

 }
 @Transactional(readOnly=true) public Map<String,Object> currentProductQuote(Product product,LocalDateTime now){var rows=eligible(product,null,null,now);return Map.of("effectivePrice",winnerPrice(product.getBasePrice(),rows),"promotionNames",winner(product.getBasePrice(),rows).map(r->List.of((String)r.get("name"))).orElse(List.of()));}
 public static int specificity(String scope){return switch(scope){case "VARIANT"->6;case "PRODUCT"->5;case "BRAND"->4;case "CATEGORY"->3;case "STORE"->2;case "GLOBAL"->1;default->0;};}
 private static BigDecimal discounted(BigDecimal base,String type,BigDecimal value){return (type.equals("PERCENT")?base.subtract(base.multiply(value).divide(BigDecimal.valueOf(100))):base.subtract(value)).max(BigDecimal.ZERO).min(base).setScale(2,java.math.RoundingMode.HALF_UP);}
}
