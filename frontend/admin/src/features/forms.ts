export type Field={key:string;label:string;type?:string;required?:boolean;values?:string[];options?:string;max?:number}
const text=(key:string,label:string,required=false,max=100):Field=>({key,label,required,max})
const number=(key:string,label:string,required=false):Field=>({key,label,type:'number',required})
const status:Field={key:'status',label:'Trạng thái',values:['ACTIVE','INACTIVE'],required:true}
const discount:Field={key:'discountType',label:'Loại giảm giá',values:['PERCENT','FIXED'],required:true}
const dates:Field[]=[{key:'startsAt',label:'Bắt đầu',type:'datetime-local',required:true},{key:'endsAt',label:'Kết thúc',type:'datetime-local',required:true}]
export const fields:Record<string,Field[]>={
 users:[{...text('email','Email',true),type:'email'},text('username','Tên đăng nhập',true,50),text('fullName','Họ tên'),text('phone','Điện thoại',false,20),{key:'enabled',label:'Hoạt động',type:'checkbox'},{key:'roles',label:'Quyền tài khoản',type:'roles',required:true}],
 stores:[text('name','Tên cửa hàng',true,150),text('slug','Slug',true,80),text('description','Mô tả',false,500),text('imageUrl','Ảnh HTTPS / đường dẫn nội bộ',false,500),text('phone','Điện thoại',false,20),text('addressLine','Địa chỉ',true,200),text('ward','Phường'),text('district','Quận'),text('city','Thành phố',true),{key:'status',label:'Hoạt động',values:['OPEN','CLOSED'],required:true},{key:'managerEmail',label:'Manager',options:'managers'}],
 categories:[text('name','Tên danh mục',true),text('slug','Slug',true,80),text('description','Mô tả',false,500),text('imageUrl','Ảnh',false,500),status],
 brands:[text('name','Tên thương hiệu',true),text('slug','Slug',true,80),text('description','Mô tả',false,500),text('imageUrl','Logo',false,500)],
 products:[text('name','Tên sản phẩm',true,180),text('slug','Slug',true,180),{key:'brandId',label:'Thương hiệu',options:'brands',required:true},{key:'categoryId',label:'Danh mục',options:'categories',required:true},number('basePrice','Giá cơ bản',true),text('imageUrl','Ảnh chính HTTPS / đường dẫn nội bộ',false,500),text('description','Mô tả',false,4000),status],
 variants:[{key:'productId',label:'Sản phẩm',options:'products',required:true},text('sku','SKU',true,80),text('size','Size',true,20),text('color','Màu',true,50),number('priceAdjustment','Điều chỉnh giá',true),text('imageUrl','Ảnh',false,500),status],
 promotions:[text('name','Tên khuyến mãi',true,120),text('description','Mô tả',false,500),discount,number('discountValue','Giá trị giảm',true),...dates,{key:'scope',label:'Phạm vi',values:['GLOBAL','STORE','CATEGORY','BRAND','PRODUCT','VARIANT'],required:true},{key:'targets',label:'Đối tượng áp dụng',type:'targets'},number('priority','Ưu tiên',true),status],
 coupons:[text('code','Mã coupon',true,50),text('name','Tên coupon',true,120),text('description','Mô tả',false,500),{...discount,values:['PERCENT','FIXED','FREESHIP']},number('discountValue','Giá trị giảm',true),number('minOrderValue','Đơn tối thiểu',true),number('maxDiscountValue','Giảm tối đa'),number('usageLimit','Tổng lượt tối đa'),number('perUserLimit','Lượt tối đa / khách'),...dates,{key:'active',label:'Hoạt động',type:'checkbox'}]
}
export const defaults:Record<string,unknown>={status:'ACTIVE',scope:'GLOBAL',discountType:'PERCENT',enabled:true,active:true,roles:['ROLE_USER'],targets:[],priority:0,priceAdjustment:0,minOrderValue:0}
export const snake=(s:string)=>s.replace(/[A-Z]/g,c=>'_'+c.toLowerCase())

