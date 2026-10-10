export const orderStatuses=['Chờ xác nhận đơn hàng','Đã xác nhận','Đang chuẩn bị đơn hàng','Đơn hàng đã sẵn sàng','Đang giao','Đã giao','Đã hủy']
export function nextOrderStatus(status:string,mode:string='DELIVERY',method?:string,paymentStatus?:string) {
 const sequence=orderStatuses.filter(s=>s!=='Đã hủy'&&(mode!=='PICKUP'||s!=='Đang giao'))
 const i=sequence.indexOf(status),next=i>=0?sequence[i+1]:undefined;return next==='Đã xác nhận'&&method==='BANKING'&&paymentStatus!=='PAID'?undefined:next
}
const tones:Record<string,string>={'Chờ xác nhận thanh toán':'payment-waiting','Chờ xác nhận đơn hàng':'waiting','Đã xác nhận':'confirmed','Đang chuẩn bị đơn hàng':'preparing','Đơn hàng đã sẵn sàng':'ready','Đang giao':'shipping','Đã giao':'delivered','Đã hủy':'cancelled','Chờ xác nhận hủy':'cancellation-pending',PENDING:'payment-waiting',PAID:'delivered',FAILED:'cancelled',REFUNDED:'refunded',OUT:'cancelled',LOW:'payment-waiting',AVAILABLE:'delivered',OPEN:'delivered',CLOSED:'cancelled',ACTIVE:'delivered',INACTIVE:'cancelled',APPROVED:'confirmed',REJECTED:'cancelled',FULFILLED:'delivered',APPLIED:'delivered',COMPLETED:'refunded'}
export function statusStyle(value:string){const tone=tones[value]||'confirmed';return {backgroundColor:`var(--status-${tone}-bg)`,color:`var(--status-${tone}-fg)`,borderColor:`var(--status-${tone}-border)`}}
export function refundLabel(value:string){return value==='COMPLETED'?'Hoàn tiền':value==='PENDING'?'Chờ hoàn tiền':'Hoàn tiền thất bại'}
export function refundStyle(value:string){const tone=value==='COMPLETED'?'refunded':value==='PENDING'?'refund-pending':'cancelled';return {backgroundColor:`var(--status-${tone}-bg)`,color:`var(--status-${tone}-fg)`,borderColor:`var(--status-${tone}-border)`}}
export function pageNumbers(page:number,total:number){const count=Math.max(1,Math.ceil(total/30)),numbers=new Set([0,count-1,page-1,page,page+1]);return [...numbers].filter(i=>i>=0&&i<count).sort((a,b)=>a-b)}
