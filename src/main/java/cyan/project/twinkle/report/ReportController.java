package cyan.project.twinkle.report;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import java.util.Map;
@RestController @RequiredArgsConstructor public class ReportController {
 private final ReportService reports;
 private final cyan.project.twinkle.invoice.InvoiceService invoices;
 @PostMapping("/api/manager/invoices/prepare") public Map<String,Object> invoice(@RequestBody cyan.project.twinkle.invoice.InvoiceService.Prepare input){return invoices.prepare(input);}
 @PostMapping("/api/manager/exports/prepare") public Map<String,Object> prepare(@RequestBody ReportService.Prepare input){return reports.prepare(input);}
 @PostMapping("/api/manager/exports/{id}/send") public Map<String,Object> send(@PathVariable long id){reports.send(id);return Map.of("message","Đã gửi báo cáo cho Admin");}
 private ResponseEntity<byte[]> file(long id,boolean admin){var f=reports.download(id,admin);return ResponseEntity.ok().contentType(MediaType.parseMediaType(f.contentType())).header("X-Content-Type-Options","nosniff").header("Cache-Control","no-store").header(HttpHeaders.CONTENT_DISPOSITION,ContentDisposition.attachment().filename(f.name()).build().toString()).body(f.data());}
 @GetMapping("/api/manager/exports/{id}/download") public ResponseEntity<byte[]> manager(@PathVariable long id){return file(id,false);}
 @GetMapping("/api/admin/reports/{id}/download") public ResponseEntity<byte[]> admin(@PathVariable long id){return file(id,true);}
 @GetMapping("/api/admin/reports") public cyan.project.twinkle.manager.ManagerQueryService.PageDto list(@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="") String search,@RequestParam(required=false) Integer storeId){return reports.list(page,search,storeId);}
}
