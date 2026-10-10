import {ExportButton} from '../../../../shared/ExportButton'
import {DashboardDate,initialPeriod,periodQuery} from '../../../../shared/DashboardDate'
import {useEffect,useState} from 'react'
import {Area,AreaChart,Bar,BarChart,CartesianGrid,XAxis,YAxis,PieChart,Pie,Cell} from 'recharts'
import {ChartContainer,ChartTooltip,ChartTooltipContent} from '@/components/ui/chart'
import {Card,CardHeader,CardTitle,CardContent,CardDescription} from '@/components/ui/card'
import {Tabs,TabsList,TabsTrigger} from '@/components/ui/tabs'
import {Skeleton} from '@/components/ui/skeleton'
import {Button} from '@/components/ui/button'
import {request,money,states,type Row} from '../../api'

const colors=['#6366f1','#10b981','#f59e0b','#f43f5e','#06b6d4','#8b5cf6','#64748b','#ec4899']
function Chart({title,data=[],kind='bar'}:{title:string;data:Row[];kind?:'bar'|'area'|'pie'|'horizontal'}){
 const rows:Row[]=data.map(r=>({...r,label:states[r.label]||String(r.label)}))
 return <Card className="chart-card"><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent>{rows.length?<><ChartContainer className="h-60 w-full" config={{value:{label:title,color:colors[0]}}}>
 {kind==='area'?<AreaChart data={rows} accessibilityLayer><CartesianGrid vertical={false}/><XAxis dataKey="label" tickLine={false} axisLine={false}/><YAxis width={56} tickFormatter={v=>Number(v)>=1000000?`${Number(v)/1000000}tr`:String(v)}/><ChartTooltip content={<ChartTooltipContent/>}/><Area dataKey="value" type="monotone" stroke={colors[0]} fill={colors[0]} fillOpacity={.12} isAnimationActive={false}/></AreaChart>
 :kind==='pie'?<PieChart accessibilityLayer><ChartTooltip content={<ChartTooltipContent nameKey="label"/>}/><Pie data={rows} dataKey="value" nameKey="label" innerRadius={55} outerRadius={85} isAnimationActive={false}>{rows.map((r,i)=><Cell key={r.label} fill={colors[i%colors.length]}/>)}</Pie></PieChart>
 :kind==='horizontal'?<BarChart data={rows} layout="vertical" accessibilityLayer><CartesianGrid horizontal={false}/><XAxis type="number"/><YAxis type="category" dataKey="label" width={120} tick={{fontSize:10}} tickFormatter={v=>String(v).length>19?String(v).slice(0,18)+'…':String(v)}/><ChartTooltip content={<ChartTooltipContent/>}/><Bar dataKey="value" fill={colors[0]} radius={[0,4,4,0]} isAnimationActive={false}/></BarChart>
 :<BarChart data={rows} accessibilityLayer><CartesianGrid vertical={false}/><XAxis dataKey="label" tickLine={false} axisLine={false} tick={{fontSize:10}} interval={0}/><YAxis width={36}/><ChartTooltip content={<ChartTooltipContent/>}/><Bar dataKey="value" fill={colors[0]} radius={[4,4,0,0]} isAnimationActive={false}/></BarChart>}
 </ChartContainer><p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground" aria-label="Số liệu biểu đồ">{rows.map((r,i)=><span key={r.label}><span style={{color:colors[i%colors.length]}}>●</span> {r.label}: {Number(r.value).toLocaleString('vi-VN')}</span>)}</p></>:<div className="flex h-60 items-center justify-center text-sm text-muted-foreground">Chưa có dữ liệu trong khoảng thời gian này</div>}</CardContent></Card>
}
export function Dashboard(){
 const [period,setPeriod]=useState(initialPeriod),[data,setData]=useState<Row>(),[error,setError]=useState(''),[revision,setRevision]=useState(0)
 useEffect(()=>{let live=true;setData(undefined);setError('');request('/api/manager/dashboard?'+new URLSearchParams(periodQuery(period))).then(v=>{if(live)setData(v)}).catch(e=>{if(live)setError(e.message)});return()=>{live=false}},[period,revision])
 const count=(key:string,label:string)=>data?.[key]?.find((r:Row)=>r.label===label)?.value||0
 const cards=data?[['Doanh thu sản phẩm đã giao',money(data.kpi.revenue)],['Số đơn hàng',data.kpi.orders],['Sản phẩm đã bán',data.kpi.items_sold],['Giá trị đơn trung bình',money(data.kpi.average_order_value)],['Đơn chờ xác nhận',data.kpi.pending_orders],['Biến thể sắp hết',count('inventory','LOW')],['Biến thể hết hàng',count('inventory','OUT')],['Yêu cầu nhập hàng đang chờ',count('restock','PENDING')]]:[]
 return <><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted-foreground">Số liệu riêng cửa hàng · múi giờ Việt Nam</p><div className="flex flex-wrap gap-3"><DashboardDate value={period} onChange={setPeriod}/><ExportButton type="DASHBOARD" query={periodQuery(period)}/></div></div>
 {error?<div role="alert" className="rounded-lg border bg-white p-6">{error}<Button className="ml-3" onClick={()=>setRevision(v=>v+1)}>Thử lại</Button></div>:!data?<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({length:8},(_,i)=><Skeleton key={i} className="h-28"/>)}</div>:<><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label,value])=><Card key={label}><CardHeader className="pb-2"><CardDescription>{label}</CardDescription><CardTitle className="text-2xl tabular-nums">{value}</CardTitle></CardHeader></Card>)}</div><p className="my-4 text-xs text-muted-foreground">Doanh thu = tổng giá trị dòng hàng đã giao tại cửa hàng, theo ngày tạo đơn. Không phân bổ phí giao hàng hoặc giảm giá cấp đơn.</p>
 <div className="grid gap-5 lg:grid-cols-2"><Chart title="Doanh thu theo thời gian" data={data.trend} kind="area"/><Chart title="Đơn hàng theo trạng thái" data={data.order_status}/><Chart title="Phương thức thanh toán" data={data.payments} kind="pie"/><Chart title="Sản phẩm bán nhiều" data={data.top_products} kind="horizontal"/><Chart title="Size bán nhiều" data={data.top_sizes}/><Chart title="Màu bán nhiều" data={data.top_colors}/><Chart title="Sức khỏe kho hàng" data={data.inventory} kind="pie"/><Chart title="Mặt hàng sắp hết" data={data.low_stock} kind="horizontal"/><Chart title="Yêu cầu nhập hàng" data={data.restock}/><Chart title="Tỷ lệ hủy theo thời gian (%)" data={data.trend.map((r:Row)=>({...r,value:r.orders?Math.round(100*r.cancelled/r.orders):0}))} kind="area"/><Chart title="Hoạt động hỗ trợ" data={[{label:'Mới',value:data.support.new_conversations},{label:'Tin nhắn',value:data.support.messages},{label:'Đang mở',value:data.support.open_conversations},{label:'Chưa đọc',value:data.support.unread_conversations}]}/></div></>}
 </>
}


