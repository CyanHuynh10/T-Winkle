package cyan.project.twinkle.manager;
import java.time.*;
/** Inclusive dates from the UI, exclusive SQL end; Clock uses Asia/Ho_Chi_Minh. */
public record DashboardPeriod(String mode,String date,String from,String to,String month,Integer year) {
 public ManagerDashboardService.Window window(Clock clock){
  try {
   String selected=mode==null?"MONTH":mode;LocalDate today=LocalDate.now(clock);
   return switch(selected){
    case "DAY" -> {var d=date==null?today:LocalDate.parse(date);yield new ManagerDashboardService.Window(d.atStartOfDay(),d.plusDays(1).atStartOfDay(),"DATEPART(hour,o.created_at)");}
    case "WEEK" -> {if((from==null)!=(to==null))throw new IllegalArgumentException();if(from==null)yield ManagerDashboardService.window("WEEK",today);var a=LocalDate.parse(from);var b=LocalDate.parse(to);if(a.isAfter(b)||a.plusYears(3).isBefore(b))throw new IllegalArgumentException();yield new ManagerDashboardService.Window(a.atStartOfDay(),b.plusDays(1).atStartOfDay(),"CONVERT(varchar(10),o.created_at,23)");}
    case "MONTH" -> {var d=month==null?YearMonth.from(today):YearMonth.parse(month);yield new ManagerDashboardService.Window(d.atDay(1).atStartOfDay(),d.plusMonths(1).atDay(1).atStartOfDay(),"CONVERT(varchar(10),o.created_at,23)");}
    case "YEAR" -> {int y=year==null?today.getYear():year;if(y<1900||y>9998)throw new IllegalArgumentException();yield new ManagerDashboardService.Window(LocalDate.of(y,1,1).atStartOfDay(),LocalDate.of(y+1,1,1).atStartOfDay(),"DATEPART(month,o.created_at)");}
    default -> throw new IllegalArgumentException();
   };
  }catch(RuntimeException e){throw ManagerException.invalid("Ngày hoặc khoảng thời gian không hợp lệ");}
 }
}
