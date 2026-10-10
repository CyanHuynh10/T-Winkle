import {Button} from '@/components/ui/button'
import {pageNumbers} from '../../../shared/operational'
export function NumericPagination({page,total,onChange,busy=false}:{page:number;total:number;onChange:(page:number)=>void;busy?:boolean}) {
 const pages=pageNumbers(page,total),count=Math.max(1,Math.ceil(total/30))
 return <nav aria-label="Phân trang" className="flex flex-wrap items-center gap-1"><Button variant="outline" size="sm" disabled={busy||page===0} onClick={()=>onChange(page-1)} aria-label="Trang trước">‹</Button>{pages.map((i,index)=><span key={i} className="flex items-center gap-1">{index>0&&i>pages[index-1]+1&&<span aria-hidden className="px-2">…</span>}<Button size="sm" variant={i===page?'default':'outline'} aria-current={i===page?'page':undefined} aria-label={'Trang '+(i+1)} disabled={busy} onClick={()=>onChange(i)}>{i+1}</Button></span>)}<Button variant="outline" size="sm" disabled={busy||page>=count-1} onClick={()=>onChange(page+1)} aria-label="Trang sau">›</Button></nav>
}
