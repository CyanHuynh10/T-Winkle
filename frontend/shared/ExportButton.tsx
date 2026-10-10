import {useState} from 'react'
import {toast} from 'sonner'
import {Download} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from '@/components/ui/dialog'
import {request,type Row} from './api'
export function ExportButton({type,query,columns=[]}:{type:string;query:Record<string,string>;columns?:string[]}){
 const [busy,setBusy]=useState(false),[file,setFile]=useState<Row>()
 const prepare=async()=>{setBusy(true);try{setFile(await request('/api/manager/exports/prepare',{type,query,columns}))}catch(e){toast.error((e as Error).message)}finally{setBusy(false)}}
 const send=async()=>{setBusy(true);try{await request('/api/manager/exports/'+file?.id+'/send',{});toast.success('Đã gửi báo cáo cho Admin')}catch(e){toast.error((e as Error).message)}finally{setBusy(false)}}
 return <><Button variant="outline" disabled={busy} onClick={prepare}><Download size={16}/>{busy?'Đang tạo Excel…':'Xuất Excel'}</Button><Dialog open={!!file} onOpenChange={o=>{if(!o&&!busy)setFile(undefined)}}><DialogContent><DialogHeader><DialogTitle>Báo cáo Excel đã sẵn sàng</DialogTitle><DialogDescription>{file?.filename} · {file?.rowCount} dòng · {Math.ceil((file?.fileSize||0)/1024)} KB</DialogDescription></DialogHeader><div className="flex gap-3"><Button disabled={busy} onClick={send}>Gửi cho Admin</Button><Button asChild variant="outline"><a href={'/api/manager/exports/'+file?.id+'/download'}>Tải xuống</a></Button></div></DialogContent></Dialog></>
}
