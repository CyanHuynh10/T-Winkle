package cyan.project.twinkle.admin;
import jakarta.validation.constraints.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import cyan.project.twinkle.entity.*;
import cyan.project.twinkle.repository.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.math.BigDecimal;
import java.util.*;

/** Canonical master catalog writes, shared by direct Admin actions and Manager request application. */
@Service @RequiredArgsConstructor
public class AdminCatalogService {
 private final ProductRepository products;
 private final ProductVariantRepository variants;
 private final BrandRepository brands;
 private final CategoryRepository categories;
 private final JdbcTemplate sql;
 private final AdminContextService context;
 private final AdminAuditService audit;
 public record ProductInput(@NotBlank @Size(max=180) String name,@NotBlank @Pattern(regexp="[a-z0-9]+(?:-[a-z0-9]+)*") @Size(max=180) String slug,@NotNull Integer brandId,@NotNull Integer categoryId,@NotNull @DecimalMin("0") @DecimalMax("9999999999999999.99") BigDecimal basePrice,@Size(max=4000) String description,@NotBlank @Pattern(regexp="ACTIVE|INACTIVE") String status,@Size(max=500) String imageUrl) {
  public ProductInput(String name,String slug,Integer brandId,Integer categoryId,BigDecimal basePrice,String description,String status){this(name,slug,brandId,categoryId,basePrice,description,status,null);}
 }
 public record VariantInput(@NotNull Integer productId,@NotBlank @Size(max=20) String size,@NotBlank @Size(max=50) String color,@NotBlank @Pattern(regexp="[A-Za-z0-9_.-]+") @Size(max=80) String sku,@NotNull @DecimalMin("0") BigDecimal priceAdjustment,@Size(max=500) String imageUrl,@NotBlank @Pattern(regexp="ACTIVE|INACTIVE") String status) {}
 public record MasterInput(@NotBlank @Size(max=100) String name,@NotBlank @Pattern(regexp="[a-z0-9]+(?:-[a-z0-9]+)*") @Size(max=80) String slug,@Size(max=500) String description,@Size(max=500) String imageUrl,@Pattern(regexp="ACTIVE|INACTIVE") String status) {}
 public static void url(String value){if(value!=null&&!value.isBlank()&&!value.matches("^(https://[^\\s]+|/(?!/)[^\\s]*)$"))throw new IllegalArgumentException("Invalid URL");}
 private <T>T exists(Optional<T> value){return value.orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Dữ liệu không tồn tại"));}
 @Transactional public int product(Integer id,ProductInput input){String actor=context.actor();url(input.imageUrl());var p=id==null?new Product():exists(products.findById(id));p.setName(cyan.project.twinkle.service.ProductNames.commercial(input.name()));p.setSlug(input.slug());p.setBrand(exists(brands.findById(input.brandId())));p.setCategory(exists(categories.findById(input.categoryId())));p.setBasePrice(input.basePrice());p.setDescription(input.description());p.setStatus(input.status());p=products.saveAndFlush(p);if(input.imageUrl()!=null){if(input.imageUrl().isBlank())sql.update("DELETE PRODUCT_IMAGES WHERE product_id=? AND is_primary=1",p.getId());else{var images=sql.queryForList("SELECT id FROM PRODUCT_IMAGES WITH(UPDLOCK,HOLDLOCK) WHERE product_id=? AND is_primary=1 ORDER BY id",Long.class,p.getId());if(images.isEmpty())sql.update("INSERT PRODUCT_IMAGES(product_id,image_url,sort_order,is_primary) SELECT ?,?,COALESCE(MAX(sort_order),0)+1,1 FROM PRODUCT_IMAGES WHERE product_id=?",p.getId(),input.imageUrl(),p.getId());else sql.update("UPDATE PRODUCT_IMAGES SET image_url=? WHERE id=?",input.imageUrl(),images.getFirst());}}audit.record(actor,"PRODUCT_CHANGED","PRODUCTS",p.getId(),"Master product saved.");return p.getId();}
 @Transactional public long variant(Long id,VariantInput input){String actor=context.actor();url(input.imageUrl());var v=id==null?new ProductVariant():exists(variants.findById(id));if(id!=null&&!v.getProduct().getId().equals(input.productId()))throw new IllegalArgumentException("Cannot move historical variant");v.setProduct(exists(products.findById(input.productId())));v.setSize(input.size());v.setColor(input.color());v.setSku(input.sku());v.setPriceAdjustment(input.priceAdjustment());v.setImageUrl(input.imageUrl());v.setStatus(input.status());v=variants.saveAndFlush(v);audit.record(actor,"VARIANT_CHANGED","PRODUCT_VARIANTS",v.getId(),"Master variant saved.");return v.getId();}
 @Transactional public int master(String area,Integer id,MasterInput input){String actor=context.actor();url(input.imageUrl());int result;
  if(area.equals("categories")){var c=id==null?new Category():exists(categories.findById(id));c.setName(input.name());c.setSlug(input.slug());c.setDescription(input.description());c.setImageUrl(input.imageUrl());c.setStatus(input.status()==null?"ACTIVE":input.status());result=categories.saveAndFlush(c).getId();}
  else if(area.equals("brands")){var b=id==null?new Brand():exists(brands.findById(id));b.setName(input.name());b.setSlug(input.slug());b.setDescription(input.description());b.setLogoUrl(input.imageUrl());result=brands.saveAndFlush(b).getId();}
  else throw new IllegalArgumentException("Unknown master");audit.record(actor,area.equals("brands")?"BRAND_CHANGED":"CATEGORY_CHANGED",area,result,"Master data saved.");return result;
 }
 @Transactional public void delete(String area,long id){String actor=context.actor();String table=switch(area){case "products"->"PRODUCTS";case "variants"->"PRODUCT_VARIANTS";case "categories"->"CATEGORIES";case "brands"->"BRANDS";default->throw new IllegalArgumentException();};if(sql.update("DELETE "+table+" WHERE id=?",id)!=1)throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Dữ liệu không tồn tại");audit.record(actor,"MASTER_DELETED",table,id,"Unused master deleted; foreign keys enforce historical preservation.");}
}

