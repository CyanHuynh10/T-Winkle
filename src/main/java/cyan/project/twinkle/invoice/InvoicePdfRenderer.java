package cyan.project.twinkle.invoice;

import org.apache.pdfbox.pdmodel.*;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import java.io.*;
import java.awt.Color;
import java.math.BigDecimal;
import java.text.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.List;

/** A4 with embedded Vietnamese fonts, wrapped rows and repeated table headers. */
@Component
public class InvoicePdfRenderer {
    public byte[] render(InvoiceDataService.Invoice invoice) {
        try(var pdf=new PDDocument();var regular=new ClassPathResource("fonts/NotoSans-Regular.ttf").getInputStream();var bold=new ClassPathResource("fonts/NotoSans-Bold.ttf").getInputStream()){
            pdf.getDocumentInformation().setTitle("Hóa đơn "+invoice.number());
            pdf.getDocumentInformation().setAuthor(invoice.issuerName());
            var layout=new Layout(pdf,PDType0Font.load(pdf,regular),PDType0Font.load(pdf,bold),invoice);
            layout.draw();var out=new ByteArrayOutputStream();pdf.save(out);return out.toByteArray();
        }catch(IOException e){throw new IllegalStateException("Không thể tạo hóa đơn PDF",e);}
    }
    public static String money(BigDecimal value){var n=NumberFormat.getNumberInstance(Locale.forLanguageTag("vi-VN"));n.setMaximumFractionDigits(2);return n.format(value)+" đ";}
    public static String time(LocalDateTime value){return value==null?"Chưa ghi nhận":value.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));}
    private static final class Layout {
        final PDDocument pdf;final PDType0Font regular,bold;final InvoiceDataService.Invoice invoice;
        final float left=40,width=515;final float[] cols={30,186,31,88,85,95};
        final Color ink=new Color(31,41,55),accent=new Color(8,145,178),muted=new Color(100,116,139);
        PDPageContentStream canvas;float y;
        Layout(PDDocument pdf,PDType0Font regular,PDType0Font bold,InvoiceDataService.Invoice invoice){this.pdf=pdf;this.regular=regular;this.bold=bold;this.invoice=invoice;}
        void page()throws IOException {
            if(canvas!=null)canvas.close();var p=new PDPage(PDRectangle.A4);pdf.addPage(p);canvas=new PDPageContentStream(pdf,p);y=800;
            text("T-WINKLE",left,y,bold,18,accent);text("HÓA ĐƠN BÁN HÀNG",left+210,y,bold,16,ink);y-=27;
            paragraph("Số hóa đơn: "+invoice.number(),bold,10,3);paragraph("Mã đơn hàng: "+invoice.orderCode(),regular,10,10);
        }
        void ensure(float height,boolean table)throws IOException {if(y-height<62){page();if(table)header();}}
        String clean(String value)throws IOException {
            String normalized=Normalizer.normalize(value==null?"":value,Normalizer.Form.NFC).replaceAll("[\\p{Cntrl}]"," ");
            StringBuilder out=new StringBuilder();for(int c:normalized.codePoints().toArray()){
                String glyph=new String(Character.toChars(c));
                try{regular.encode(glyph);out.append(glyph);}catch(IllegalArgumentException unsupported){out.append('?');}
            }return out.toString();
        }
        float measure(String s,PDFont font,float size)throws IOException{return font.getStringWidth(s)/1000*size;}
        List<String> wrap(String value,PDFont font,float size,float max)throws IOException {
            var lines=new ArrayList<String>();String line="";
            for(String word:clean(value).split("\\s+")){
                if(word.isEmpty())continue;
                String candidate=line.isEmpty()?word:line+" "+word;
                if(measure(candidate,font,size)<=max){line=candidate;continue;}
                if(!line.isEmpty()){lines.add(line);line="";}
                for(int c:word.codePoints().toArray()){
                    String next=line+new String(Character.toChars(c));
                    if(measure(next,font,size)>max&&!line.isEmpty()){lines.add(line);line="";}
                    line+=new String(Character.toChars(c));
                }
            }
            if(!line.isEmpty())lines.add(line);if(lines.isEmpty())lines.add("");return lines;
        }
        void text(String value,float x,float baseline,PDFont font,float size,Color color)throws IOException {
            canvas.setNonStrokingColor(color);canvas.beginText();canvas.setFont(font,size);canvas.newLineAtOffset(x,baseline);canvas.showText(clean(value));canvas.endText();
        }
        void paragraph(String value,PDFont font,float size,float gap)throws IOException {
            for(String line:wrap(value,font,size,width)){ensure(size+5,false);text(line,left,y,font,size,ink);y-=size+5;}y-=gap;
        }
        void section(String title)throws IOException {ensure(45,false);y-=5;text(title,left,y,bold,11,accent);y-=20;}
        void draw()throws IOException {
            page();paragraph("Ngày lập: "+time(invoice.issuedAt())+" | Ngày đặt: "+time(invoice.orderedAt()),regular,9,3);
            paragraph("Giao thành công: "+time(invoice.deliveredAt())+" | "+invoice.fulfillment(),regular,9,5);
            section("BÊN BÁN / NGƯỜI LẬP HÓA ĐƠN");
            for(var seller:invoice.sellers()){paragraph(seller.name(),bold,10,0);paragraph("Địa chỉ: "+seller.address(),regular,9,0);if(!seller.phone().isBlank())paragraph("Điện thoại: "+seller.phone(),regular,9,3);}
            paragraph("Người lập hóa đơn: "+invoice.issuerName(),regular,9,0);
            if(!invoice.issuerEmail().isBlank())paragraph("Email người lập: "+invoice.issuerEmail(),regular,9,3);
            section("KHÁCH HÀNG / NGƯỜI LẬP ĐƠN");
            paragraph("Người đặt đơn: "+invoice.customerName(),bold,10,0);paragraph("Email: "+invoice.customerEmail(),regular,9,0);
            if(!invoice.customerPhone().isBlank())paragraph("Điện thoại tài khoản: "+invoice.customerPhone(),regular,9,0);
            paragraph("Người nhận: "+invoice.recipientName()+" | Điện thoại: "+invoice.recipientPhone(),regular,9,0);
            if(!invoice.address().isBlank())paragraph("Địa chỉ nhận hàng: "+invoice.address(),regular,9,0);
            if(!invoice.note().isBlank())paragraph("Ghi chú giao hàng: "+invoice.note(),regular,9,0);
            paragraph("Trạng thái: "+invoice.status()+" | Thanh toán: "+invoice.paymentMethod()+" / "+invoice.paymentStatus(),regular,9,8);
            section("CHI TIẾT HÀNG HÓA");ensure(80,false);header();
            for(var line:invoice.lines())row(new String[]{String.valueOf(line.index()),line.product()+" | "+line.variant()+" | "+line.store(),String.valueOf(line.quantity()),money(line.unitPrice()),money(line.discount()),money(line.total())},false);
            ensure(190,false);y-=18;
            summary("Tạm tính",invoice.subtotal(),false);summary("Giảm giá sản phẩm",invoice.productDiscount(),false);summary("Mã giảm giá",invoice.couponDiscount(),false);summary("Phí vận chuyển",invoice.shippingFee(),false);summary("TỔNG THANH TOÁN",invoice.total(),true);
            if(!invoice.scopeNote().isBlank()){y-=8;paragraph(invoice.scopeNote(),regular,9,4);}
            ensure(85,false);y-=20;text("Người lập hóa đơn",left+20,y,bold,10,ink);text("Người mua hàng",left+330,y,bold,10,ink);y-=17;
            for(String line:wrap(invoice.issuerName(),regular,9,220)){text(line,left+20,y,regular,9,muted);y-=14;}
            canvas.close();canvas=null;
            for(int i=0;i<pdf.getNumberOfPages();i++)try(var footer=new PDPageContentStream(pdf,pdf.getPage(i),PDPageContentStream.AppendMode.APPEND,true)){
                footer.setNonStrokingColor(muted);footer.beginText();footer.setFont(regular,8);footer.newLineAtOffset(left,30);footer.showText("T-Winkle | "+clean(invoice.number())+" | Trang "+(i+1)+" / "+pdf.getNumberOfPages());footer.endText();
            }
        }
        void header()throws IOException {row(new String[]{"STT","Sản phẩm / Biến thể / Cửa hàng","SL","Đơn giá","Giảm giá","Thành tiền"},true);}
        void row(String[] values,boolean heading)throws IOException {
            var font=heading?bold:regular;var cells=new ArrayList<List<String>>();int count=1;
            for(int i=0;i<values.length;i++){var lines=wrap(values[i],font,8.5f,cols[i]-10);cells.add(lines);count=Math.max(count,lines.size());}
            float height=count*13+12;if(!heading)ensure(height,true);
            float x=left;canvas.setStrokingColor(new Color(203,213,225));canvas.setLineWidth(.5f);
            for(int i=0;i<values.length;i++){
                if(heading){canvas.setNonStrokingColor(new Color(236,254,255));canvas.addRect(x,y-height,cols[i],height);canvas.fill();}
                canvas.addRect(x,y-height,cols[i],height);canvas.stroke();float baseline=y-15;
                for(String line:cells.get(i)){float tx=i>=2?x+cols[i]-5-measure(line,font,8.5f):x+5;text(line,tx,baseline,font,8.5f,ink);baseline-=13;}x+=cols[i];
            }y-=height;
        }
        void summary(String label,BigDecimal value,boolean total)throws IOException {
            ensure(24,false);var font=total?bold:regular;float size=total?12:10;
            text(label,left+235,y,font,size,total?accent:ink);String amount=money(value);text(amount,left+width-measure(amount,font,size),y,font,size,total?accent:ink);y-=24;
        }
    }
}
