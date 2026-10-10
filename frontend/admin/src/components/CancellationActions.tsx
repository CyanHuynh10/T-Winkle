import {useState} from 'react'
import {toast} from 'sonner'
import {Button} from '@/components/ui/button'
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from '@/components/ui/dialog'
import {Textarea} from '@/components/ui/textarea'
import {Input} from '@/components/ui/input'
import {request,type Row} from '../api'
export function CancellationActions({order,scope,saved}:{order:Row;scope:'admin'|'manager';saved:()=>void}) {
 const [decision,setDecision]=useState<boolean>(),[note,setNote]=useState(''),[reference,setReference]=useState(''),[transferred,setTransferred]=useState(false),[busy,setBusy]=useState(false)
 const pending=order.cancellation?.some((c:Row)=>c.status==='PENDING'),refund=order.refunds?.some((r:Row)=>r.status==='PENDING')
 if(!pending&&!refund)return null
 const paid=order.payment_method==='BANKING'&&(order.payment_status==='PAID'||order.payment?.some((p:Row)=>p.status==='PAID'))
 async function submit(){setBusy(true);try{await request(`/api/${scope}/orders/${order.id}/cancellation`,{approve:decision,refundTransferred:transferred,reference,note});toast.success('Đã xử lý yêu cầu hủy');setDecision(undefined);saved()}catch(e){toast.error((e as Error).message)}finally{setBusy(false)}}
 return <section className="mt-6 rounded-lg border bg-muted/30 p-4"><h3 className="font-semibold">{refund?'Chờ hoàn tiền':'Yêu cầu hủy'}</h3><p className="mt-2 text-sm text-muted-foreground">{paid?'Chuyển khoản được hoàn thủ công. Chỉ xác nhận hoàn tiền sau khi đã thực hiện chuyển tiền':'Hủy đơn sẽ hoàn lại tồn kho đúng một lần'}</p><div className="mt-3 flex flex-wrap gap-2"><Button onClick={()=>{setDecision(true);setTransferred(false);setNote('')}}>{refund?'Xác nhận hoàn tiền':'Xác nhận hủy'}</Button>{pending&&<Button variant="outline" onClick={()=>{setDecision(false);setTransferred(false);setNote('')}}>Từ chối hủy</Button>}</div><Dialog open={decision!==undefined} onOpenChange={v=>{if(!v&&!busy)setDecision(undefined)}}><DialogContent><DialogHeader><DialogTitle>{decision?'Xác nhận hủy / hoàn tiền':'Từ chối yêu cầu hủy'}</DialogTitle><DialogDescription>Thao tác được lưu trong lịch sử, tồn kho và thanh toán được cập nhật cùng giao dịch</DialogDescription></DialogHeader><form className="space-y-4" onSubmit={e=>{e.preventDefault();void submit()}}><Textarea aria-label="Ghi chú xử lý hủy" required maxLength={500} value={note} onChange={e=>setNote(e.target.value)}/>{decision&&paid&&<><label className="flex gap-2 text-sm"><input type="checkbox" required={refund} checked={transferred} onChange={e=>setTransferred(e.target.checked)}/>Tôi xác nhận đã chuyển khoản hoàn tiền cho khách hàng</label><Input aria-label="Mã giao dịch hoàn tiền" maxLength={150} value={reference} onChange={e=>setReference(e.target.value)} placeholder="Mã giao dịch (nếu có)"/></>}<Button disabled={busy}>Xác nhận</Button></form></DialogContent></Dialog></section>
}
