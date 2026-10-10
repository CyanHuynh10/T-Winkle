import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from '@/components/ui/select'
import {Input} from '@/components/ui/input'
import {CalendarDays} from 'lucide-react'
export type Period={mode:string;date:string;from:string;to:string;month:string;year:string}
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())
export const initialPeriod:Period={mode:'MONTH',date:today,from:today,to:today,month:today.slice(0,7),year:today.slice(0,4)}
const displayDate=(v:string)=>v.split('-').reverse().join('/')
export const periodLabel=(p:Period)=>p.mode==='DAY'?displayDate(p.date):p.mode==='WEEK'?displayDate(p.from)+' – '+displayDate(p.to):p.mode==='MONTH'?p.month.split('-').reverse().join('/'):p.year
export function periodQuery(p:Period):Record<string,string>{return p.mode==='DAY'?{mode:p.mode,date:p.date}:p.mode==='WEEK'?{mode:p.mode,from:p.from,to:p.to}:p.mode==='MONTH'?{mode:p.mode,month:p.month}:{mode:p.mode,year:p.year}}
function DateField({label,value,onChange,type='date',min,max}:{label:string;value:string;onChange:(v:string)=>void;type?:'date'|'month';min?:string;max?:string}){
 return <label className="relative flex h-9 w-44 items-center justify-between rounded-md border bg-white px-3 text-sm focus-within:ring-2 focus-within:ring-ring"><span aria-hidden="true">{displayDate(value)||'Chọn thời gian'}</span><CalendarDays size={16} aria-hidden="true"/><Input type={type} aria-label={label} value={value} min={min} max={max} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" onClick={e=>{try{e.currentTarget.showPicker()}catch{}}} onChange={e=>onChange(e.target.value)}/></label>
}
export function DashboardDate({value:p,onChange}:{value:Period;onChange:(v:Period)=>void}){
 const change=(k:keyof Period,v:string)=>onChange({...p,[k]:v})
 return <div className="flex flex-wrap items-center gap-2"><Select value={p.mode} onValueChange={v=>change('mode',v)}><SelectTrigger aria-label="Loại thời gian" className="w-40"><SelectValue/></SelectTrigger><SelectContent>{[['DAY','Theo ngày'],['WEEK','Theo tuần'],['MONTH','Theo tháng'],['YEAR','Theo năm']].map(([v,l])=><SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent></Select>{p.mode==='DAY'?<DateField label="Ngày báo cáo" value={p.date} onChange={v=>change('date',v)}/>:p.mode==='WEEK'?<><DateField label="Từ ngày" value={p.from} max={p.to} onChange={v=>change('from',v)}/><span>–</span><DateField label="Đến ngày" min={p.from} value={p.to} onChange={v=>change('to',v)}/>{p.from>p.to&&<span role="alert">Ngày bắt đầu phải trước ngày kết thúc</span>}</>:p.mode==='MONTH'?<DateField type="month" label="Tháng báo cáo" value={p.month} onChange={v=>change('month',v)}/>:<Input type="number" className="w-28" min={1900} max={9998} aria-label="Năm báo cáo" value={p.year} onChange={e=>change('year',e.target.value)}/>}<span className="text-sm text-muted-foreground" aria-label="Thời gian đã chọn">{periodLabel(p)}</span></div>
}
