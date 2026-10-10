import {useState} from 'react'
import {toast} from 'sonner'
import {Card,CardHeader,CardTitle,CardContent} from '@/components/ui/card'
import {Input} from '@/components/ui/input'
import {Textarea} from '@/components/ui/textarea'
import {Button} from '@/components/ui/button'
import {request,type Row} from '../../api'
export function StoreProfile({store,saved}:{store:Row;saved:()=>void}){
 const [form,setForm]=useState<Row>({name:store.name,description:store.description||'',phone:store.phone||'',addressLine:store.address_line,ward:store.ward||'',district:store.district||'',city:store.city,imageUrl:store.image_url||''}),[busy,setBusy]=useState(false)
 const fields=[['name','Tên cửa hàng',180],['phone','Số điện thoại',20],['addressLine','Địa chỉ',200],['ward','Phường',100],['district','Quận',100],['city','Thành phố',100],['imageUrl','Đường dẫn ảnh (HTTPS hoặc nội bộ)',500]] as const
 const save=async()=>{setBusy(true);try{await request('/api/manager/store',form);toast.success('Đã cập nhật hồ sơ cửa hàng');saved()}catch(e){toast.error((e as Error).message)}finally{setBusy(false)}}
 return <div className="grid gap-6 xl:grid-cols-[2fr_1fr]"><Card><CardHeader><CardTitle>Thông tin công khai</CardTitle></CardHeader><CardContent><form onSubmit={e=>{e.preventDefault();save()}} className="grid gap-5 md:grid-cols-2">{fields.map(([key,label,max])=><label key={key} className={key==='addressLine'||key==='imageUrl'?'md:col-span-2':''}>{label}<Input className="mt-2" maxLength={max} required={['name','addressLine','city'].includes(key)} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}/></label>)}<label className="md:col-span-2">Mô tả<Textarea className="mt-2" rows={5} maxLength={500} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label><Button type="submit" disabled={busy} className="w-fit">{busy?'Đang lưu…':'Lưu hồ sơ'}</Button></form></CardContent></Card><Card className="h-fit"><CardHeader><CardTitle>Thông tin cửa hàng</CardTitle></CardHeader><CardContent className="space-y-4"><img src={store.image_url||'/images/T-Winkle.png'} alt="Ảnh cửa hàng" className="h-32 w-32 rounded-lg object-cover"/><p>ID: {store.store_id}</p><p>Slug: {store.slug}</p><p className="break-all">Tài khoản: {store.manager_email}</p><p>Trạng thái: {store.status==='OPEN'?'Đang mở':'Đã đóng'}</p><p>Đánh giá: {store.rating_average} / 5 · {store.review_count} lượt</p><p>Ngày tạo: {new Date(store.created_at).toLocaleDateString('vi-VN')}</p></CardContent></Card></div>
}
