package cyan.project.twinkle.report;
import cyan.project.twinkle.manager.*;
import cyan.project.twinkle.payment.PaymentQueryService;
import cyan.project.twinkle.admin.*;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import java.util.*;
import java.time.*;
import java.io.*;
import java.security.MessageDigest;

@Service @RequiredArgsConstructor
public class ReportService {
 private final JdbcTemplate sql;private final ManagerStoreContextService manager;private final AdminContextService admin;private final ManagerQueryService queries;private final PaymentQueryService payments;private final ManagerDashboardService dashboard;private final AdminAuditService audit;private final Clock managerClock;
 public static final int MAX_BYTES=20*1024*1024,MAX_ROWS=100000;
 public static final String MIME="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
 public record Prepare(String type,Map<String,String> query,List<String> columns){}
 public record File(String name,byte[] data){}
 private static final Map<String,List<String>> COLUMNS=Map.of(
  "PRODUCTS",List.of("index","id","name","brand","category","base_price","effective_price","variant_count","size_count","color_count","quantity","status","updated_at"),
  "INVENTORY",List.of("index","product","sku","size","color","quantity","reorder_level","replenishment_state","updated_at","pending_request"),
  "ORDERS",List.of("index","order_code","created_at","item_count","quantity","merchandise_value","payment_method","payment_status","fulfillment_status","status","updated_at"),
  "PAYMENTS",List.of("order_code","amount","method","status","refund_status","verification_status","reported_at","reviewed_by","review_note"));
 private static final Set<String> FILTERS=Set.of("search","status","sort","direction","brand","category","sizeFilter","color","pending","method","paymentStatus","verificationStatus","fromDate","toDate","mode","date","from","to","month","year");
 private static final Map<String,String> LABELS=Map.ofEntries(Map.entry("index","STT"),Map.entry("id","ID"),Map.entry("name","Sản phẩm"),Map.entry("product","Sản phẩm"),Map.entry("brand","Thương hiệu"),Map.entry("category","Danh mục"),Map.entry("base_price","Giá cơ bản"),Map.entry("effective_price","Giá hiện tại"),Map.entry("quantity","Số lượng"),Map.entry("sku","SKU"),Map.entry("size","Size"),Map.entry("color","Màu"),Map.entry("reorder_level","Ngưỡng nhập hàng"),Map.entry("replenishment_state","Tình trạng kho"),Map.entry("order_code","Mã đơn"),Map.entry("merchandise_value","Giá trị hàng"),Map.entry("amount","Số tiền"),Map.entry("status","Trạng thái"),Map.entry("created_at","Ngày tạo"),Map.entry("updated_at","Cập nhật"),Map.entry("method","Phương thức"),Map.entry("payment_method","Phương thức"),Map.entry("payment_status","Thanh toán"),Map.entry("fulfillment_status","Giao hàng"),Map.entry("refund_status","Hoàn tiền"),Map.entry("verification_status","Xác minh"),Map.entry("reported_at","Ngày báo"),Map.entry("reviewed_by","Người duyệt"),Map.entry("review_note","Ghi chú"),Map.entry("variant_count","Biến thể"),Map.entry("size_count","Số size"),Map.entry("color_count","Số màu"),Map.entry("item_count","Dòng hàng"),Map.entry("pending_request","Yêu cầu chờ"),Map.entry("revenue","Doanh thu"),Map.entry("orders","Số đơn"),Map.entry("items_sold","Sản phẩm đã bán"),Map.entry("average_order_value","Giá trị đơn trung bình"),Map.entry("pending_orders","Đơn chờ xử lý"),Map.entry("delivered_orders","Đơn đã giao"),Map.entry("cancelled_orders","Đơn đã hủy"),Map.entry("cancellation_rate","Tỷ lệ hủy"),Map.entry("label","Chỉ tiêu"),Map.entry("value","Giá trị"),Map.entry("cancelled","Đơn hủy"));
 private String value(Map<String,String> q,String key){return q.getOrDefault(key,"");}
 private boolean money(String key){return key.contains("price")||Set.of("amount","revenue","merchandise_value","average_order_value").contains(key);}
 private void cell(Cell c,Object v,String key,CellStyle dateStyle,CellStyle moneyStyle){
  if(v==null)return;
  if(v instanceof Number n){c.setCellValue(n.doubleValue());if(money(key))c.setCellStyle(moneyStyle);}
  else if(v instanceof java.sql.Timestamp t){c.setCellValue(t.toLocalDateTime());c.setCellStyle(dateStyle);}
  else if(v instanceof LocalDateTime t){c.setCellValue(t);c.setCellStyle(dateStyle);}
  else if(v instanceof Boolean b)c.setCellValue(b);
  else {String text=String.valueOf(v);c.setCellValue(text.length()>32767?text.substring(0,32767):text);} // Always STRING; never setCellFormula for user text.
 }
 private Sheet sheet(SXSSFWorkbook wb,String title,List<String> columns,Map<String,Object> store,String actor,String filters){
  var s=wb.createSheet(title);String[] meta={title,String.valueOf(store.get("name")),"Người tạo: "+actor,"Thời gian: "+LocalDateTime.now(managerClock).format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")),"Bộ lọc: "+filters};
  for(int i=0;i<meta.length;i++)s.createRow(i).createCell(0).setCellValue(meta[i]);
  var bold=wb.createCellStyle();var font=wb.createFont();font.setBold(true);bold.setFont(font);var header=s.createRow(6);
  for(int i=0;i<columns.size();i++){var c=header.createCell(i);c.setCellValue(LABELS.getOrDefault(columns.get(i),columns.get(i)));c.setCellStyle(bold);s.setColumnWidth(i,24*256);}s.createFreezePane(0,7);return s;
 }
 private List<Map<String,Object>> page(String type,Map<String,String> q,int page){
  if(type.equals("PAYMENTS"))return payments.list(false,page,30,value(q,"search"),value(q,"status"),null,value(q,"method"),value(q,"verificationStatus"),value(q,"fromDate"),value(q,"toDate")).items();
  return queries.list(type.toLowerCase(Locale.ROOT),page,30,value(q,"search"),value(q,"status"),q.getOrDefault("sort","id"),q.getOrDefault("direction","desc"),value(q,"brand"),value(q,"category"),value(q,"sizeFilter"),value(q,"color"),q.containsKey("pending")&&!value(q,"pending").isBlank()?Boolean.valueOf(value(q,"pending")):null,value(q,"method"),value(q,"paymentStatus"),value(q,"fromDate"),value(q,"toDate")).items();
 }
 @Transactional(isolation=org.springframework.transaction.annotation.Isolation.SERIALIZABLE) public Map<String,Object> prepare(Prepare input){
  var store=manager.requireCurrentStore();String actor=manager.actor();if(input==null||input.type()==null)throw bad();String type=input.type();var q=input.query()==null?Map.<String,String>of():input.query();
  if(!Set.of("PRODUCTS","INVENTORY","ORDERS","PAYMENTS","DASHBOARD").contains(type)||q.size()>FILTERS.size()||!FILTERS.containsAll(q.keySet())||q.values().stream().anyMatch(v->v==null||v.length()>150))throw bad();
  Set<String> allowed=switch(type){case "PRODUCTS"->Set.of("search","status","sort","direction","brand","category");case "INVENTORY"->Set.of("search","status","sort","direction","sizeFilter","color","pending");case "ORDERS"->Set.of("search","status","sort","direction","method","paymentStatus","fromDate","toDate");case "PAYMENTS"->Set.of("search","status","method","verificationStatus","fromDate","toDate");default->Set.of("mode","date","from","to","month","year");};
  if(!allowed.containsAll(q.keySet())||q.containsKey("pending")&&!Set.of("","true","false").contains(q.get("pending")))throw bad();
  if(q.containsKey("sort")&&!Set.of("id","name","quantity","updated_at").contains(q.get("sort"))||q.containsKey("direction")&&!Set.of("asc","desc").contains(q.get("direction")))throw bad();
  var cols=input.columns()==null?List.<String>of():input.columns();if(!type.equals("DASHBOARD")&&(cols.isEmpty()||!COLUMNS.get(type).containsAll(cols)||new HashSet<>(cols).size()!=cols.size()))throw bad();
  sql.update("DELETE STORE_REPORTS WHERE store_id=? AND sent_at IS NULL AND created_at<DATEADD(hour,-24,SYSDATETIME())",store.getId());
  // Limit per store protects private binary storage from repeated prepare requests.
  if(sql.queryForObject("SELECT COUNT(*) FROM STORE_REPORTS WHERE store_id=? AND sent_at IS NULL",Integer.class,store.getId())>=20)throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,"Đã đạt giới hạn báo cáo chưa gửi trong 24 giờ");
  var metadata=sql.queryForMap("SELECT name FROM STORES WHERE store_id=?",store.getId());int count=0;byte[] bytes;
  try(var wb=new SXSSFWorkbook(100)){
   wb.setCompressTempFiles(true);var date=wb.createCellStyle();date.setDataFormat(wb.createDataFormat().getFormat("dd/mm/yyyy hh:mm"));var currency=wb.createCellStyle();currency.setDataFormat(wb.createDataFormat().getFormat("#,##0 \"₫\""));
   if(type.equals("DASHBOARD")){
    var period=new DashboardPeriod(q.getOrDefault("mode","MONTH"),q.get("date"),q.get("from"),q.get("to"),q.get("month"),q.containsKey("year")?Integer.valueOf(q.get("year")):null);
    var d=dashboard.dashboard(period);String summary=q+" · "+d.get("start")+" – "+d.get("end");
    var overview=sheet(wb,"Tổng quan",List.of("label","value"),metadata,actor,summary);int row=7;
    for(var e:((Map<String,Object>)d.get("kpi")).entrySet()){var r=overview.createRow(row++);r.createCell(0).setCellValue(LABELS.getOrDefault(e.getKey(),e.getKey()));cell(r.createCell(1),e.getValue(),e.getKey(),date,currency);count++;}overview.setAutoFilter(new CellRangeAddress(6,Math.max(6,row-1),0,1));
    for(var e:Map.of("Doanh thu","trend","Đơn hàng","order_status","Kho hàng","inventory","Nhập hàng","restock").entrySet()){
     List<String> c=e.getValue().equals("trend")?List.of("label","value","orders","cancelled"):List.of("label","value");var s=sheet(wb,e.getKey(),c,metadata,actor,summary);int n=7;
     for(var data:(List<Map<String,Object>>)d.get(e.getValue())){var r=s.createRow(n++);for(int i=0;i<c.size();i++)cell(r.createCell(i),data.get(c.get(i)),e.getValue().equals("trend")&&i==1?"revenue":c.get(i),date,currency);count++;}s.setAutoFilter(new CellRangeAddress(6,Math.max(6,n-1),0,c.size()-1));
    }
   }else {
    var s=sheet(wb,type,cols,metadata,actor,q.toString());int p=0;
    while(true){var rows=page(type,q,p++);if(rows.isEmpty())break;if(count+rows.size()>MAX_ROWS)throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE,"Báo cáo vượt giới hạn 100000 dòng");for(var data:rows){var r=s.createRow(7+count++);for(int i=0;i<cols.size();i++)cell(r.createCell(i),cols.get(i).equals("index")?count:data.get(cols.get(i)),cols.get(i),date,currency);}if(rows.size()<30)break;}s.setAutoFilter(new CellRangeAddress(6,Math.max(6,6+count),0,cols.size()-1));
   }
   var out=new ByteArrayOutputStream();wb.write(new FilterOutputStream(out){int length;@Override public void write(int b)throws IOException{if(++length>MAX_BYTES)throw new IOException("REPORT_SIZE_LIMIT");out.write(b);}@Override public void write(byte[] b,int off,int len)throws IOException{length+=len;if(length>MAX_BYTES)throw new IOException("REPORT_SIZE_LIMIT");out.write(b,off,len);}});bytes=out.toByteArray();
  }catch(IOException e){throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE,"Chưa thể tạo báo cáo trong giới hạn 20 MB");}
  String hash;try{hash=HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(bytes));}catch(Exception e){throw new IllegalStateException(e);}
  String name="T-Winkle_"+type+"_"+store.getId()+"_"+LocalDate.now(managerClock)+".xlsx";
  long id=sql.queryForObject("INSERT STORE_REPORTS(store_id,created_by_email,report_type,file_name,content_type,file_size,sha256,file_data,filter_snapshot,sort_snapshot,columns_snapshot,row_count) OUTPUT INSERTED.id VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",Long.class,store.getId(),actor,type,name,MIME,bytes.length,hash,bytes,q.toString(),q.getOrDefault("sort","id")+" "+q.getOrDefault("direction","desc"),String.join(",",cols),count);
  return Map.of("id",id,"filename",name,"rowCount",count,"fileSize",bytes.length);
 }
 private ResponseStatusException bad(){return new ResponseStatusException(HttpStatus.BAD_REQUEST,"Thông tin báo cáo không hợp lệ");}
 private Map<String,Object> report(long id,boolean global){String where;if(global){admin.actor();where=" AND sent_at IS NOT NULL";}else where=" AND store_id="+manager.requireCurrentStore().getId();var rows=sql.queryForList("SELECT id,store_id,file_name,file_data FROM STORE_REPORTS WHERE id=?"+where,id);if(rows.isEmpty())throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Báo cáo không tồn tại hoặc không thuộc phạm vi truy cập");return rows.getFirst();}
 @Transactional public void send(long id){var r=report(id,false);if(sql.update("UPDATE STORE_REPORTS SET sent_at=SYSDATETIME() WHERE id=? AND sent_at IS NULL",id)>0)audit.record(manager.actor(),"REPORT_SENT_TO_ADMIN","STORE_REPORTS",id,"Store "+r.get("store_id"));}
 @Transactional public File download(long id,boolean global){var r=report(id,global);if(global)audit.record(admin.actor(),"REPORT_DOWNLOADED_BY_ADMIN","STORE_REPORTS",id,"Store "+r.get("store_id"));return new File((String)r.get("file_name"),(byte[])r.get("file_data"));}
 @Transactional(readOnly=true) public ManagerQueryService.PageDto list(int page,String search,Integer store){admin.actor();if(page<0||page>1000000||search.length()>150)throw bad();String source=" FROM STORE_REPORTS r JOIN STORES s ON s.store_id=r.store_id JOIN USERS u ON u.email=r.created_by_email WHERE r.sent_at IS NOT NULL AND (? IS NULL OR r.store_id=?) AND (r.file_name LIKE ? OR s.name LIKE ?)";Object[] args={store,store,"%"+search+"%","%"+search+"%"};long total=sql.queryForObject("SELECT COUNT_BIG(*)"+source,Long.class,args);var params=new ArrayList<Object>(Arrays.asList(args));params.add(page*30);return new ManagerQueryService.PageDto(sql.queryForList("SELECT r.id,s.name AS store,COALESCE(NULLIF(u.full_name,''),u.username) AS manager,r.report_type,r.file_name,r.row_count,r.filter_snapshot,r.file_size,r.sent_at"+source+" ORDER BY r.sent_at DESC,r.id DESC OFFSET ? ROWS FETCH NEXT 30 ROWS ONLY",params.toArray()),total,page,30);}
}
