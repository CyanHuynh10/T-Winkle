import {Reviews} from '../../../shared/Reviews'
import {useEffect,useState} from 'react'
import {Store,Package,Boxes,Warehouse,Receipt,MessagesSquare,ChartNoAxesCombined,ChevronDown,LogOut,RefreshCw} from 'lucide-react'
import {toast} from 'sonner'
import {Toaster} from '@/components/ui/sonner'
import {request,csrf,type Row} from '../api'
import {Sidebar,SidebarProvider,SidebarHeader,SidebarContent,SidebarFooter,SidebarGroup,SidebarGroupLabel,SidebarMenu,SidebarMenuItem,SidebarMenuButton,SidebarInset,SidebarTrigger,useSidebar} from '@/components/ui/sidebar'
import {Collapsible,CollapsibleTrigger,CollapsibleContent} from '@/components/ui/collapsible'
import {DropdownMenu,DropdownMenuTrigger,DropdownMenuContent,DropdownMenuItem,DropdownMenuSeparator} from '@/components/ui/dropdown-menu'
import {Avatar,AvatarImage,AvatarFallback} from '@/components/ui/avatar'
import {Switch} from '@/components/ui/switch'
import {Button} from '@/components/ui/button'
import {Skeleton} from '@/components/ui/skeleton'
import {TooltipProvider} from '@/components/ui/tooltip'
import {Breadcrumb,BreadcrumbList,BreadcrumbItem,BreadcrumbPage} from '@/components/ui/breadcrumb'
import {Dashboard} from '../features/dashboard/Dashboard'
import {DataPage} from '../pages/DataPage'
import {StoreProfile} from '../features/store/StoreProfile'
import {Support} from '../features/support/Support'
import {Payments} from '../features/payments/Payments'

const menu=[{title:'HÀNG HÓA',items:[['products','Sản phẩm',Package],['variants','Biến thể sản phẩm',Boxes],['inventory','Kho hàng',Warehouse]]},{title:'GIAO DỊCH',items:[['orders','Đơn hàng',Receipt],['payments','Giao dịch',Receipt],['support','Hội thoại',MessagesSquare],['reviews','Đánh giá',MessagesSquare]]},{title:'BÁO CÁO',items:[['','Dashboard',ChartNoAxesCombined]]}] as const
function Navigation({page,go}:{page:string;go:(page:string)=>void}){const sidebar=useSidebar();return <>{menu.map(group=><SidebarGroup key={group.title}><Collapsible defaultOpen><CollapsibleTrigger className="w-full"><SidebarGroupLabel className="flex justify-between text-xs tracking-wider">{group.title}<ChevronDown size={14}/></SidebarGroupLabel></CollapsibleTrigger><CollapsibleContent><SidebarMenu>{group.items.map(([key,label,Icon])=><SidebarMenuItem key={key}><SidebarMenuButton isActive={page===key} onClick={()=>{go(key);sidebar.setOpenMobile(false)}} tooltip={label}><Icon/><span>{label}</span></SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu></CollapsibleContent></Collapsible></SidebarGroup>)}</>}
export function ManagerApp(){
 const [store,setStore]=useState<Row>(),[error,setError]=useState(''),[page,setPage]=useState(location.pathname.split('/')[2]||''),[statusBusy,setStatusBusy]=useState(false)
 const load=()=>{setError('');request('/api/manager/context').then(setStore).catch(e=>setError(e.message))}
 useEffect(load,[])
 useEffect(()=>{const pop=()=>setPage(location.pathname.split('/')[2]||'');window.addEventListener('popstate',pop);return()=>window.removeEventListener('popstate',pop)},[])
 const go=(next:string)=>{history.pushState({},'',`/manager${next?'/'+next:''}`);setPage(next)}
 const status=async(open:boolean)=>{setStatusBusy(true);try{await request('/api/manager/store/status',{status:open?'OPEN':'CLOSED'});setStore({...store,status:open?'OPEN':'CLOSED'});toast.success('Đã cập nhật trạng thái hoạt động')}catch(e){toast.error((e as Error).message)}finally{setStatusBusy(false)}}
 const logout=()=>{const form=document.createElement('form');form.method='POST';form.action='/logout';const token=document.createElement('input');token.type='hidden';token.name='_csrf';token.value=Object.values(csrf())[0];form.append(token);document.body.append(form);form.submit()}
 if(error)return <main className="mx-auto max-w-xl p-12"><Store className="mb-6"/><h1 className="text-xl font-semibold">T-Winkle - Manager</h1><p role="alert" className="my-6">{error}</p><Button onClick={load}>Thử lại</Button><Button variant="outline" className="ml-3" onClick={logout}>Đăng xuất</Button></main>
 if(!store)return <main className="p-8" aria-label="Đang tải cửa hàng"><Skeleton className="h-12 w-64"/><Skeleton className="mt-8 h-80 w-full"/></main>
 const title=page==='store-profile'?'Hồ sơ cửa hàng':menu.map(g=>g.items.find(i=>i[0]===page)?.[1]).find(Boolean)||'Dashboard'
 return <TooltipProvider><SidebarProvider><Sidebar collapsible="offcanvas"><SidebarHeader className="border-b p-5"><a href="/manager" className="flex items-center gap-3 font-semibold"><img src="/T-Winkle_LogoNoBG.png" alt="" className="h-9 w-9 rounded-md"/><span>T-Winkle <span className="block text-xs font-normal text-muted-foreground">Manager Console</span></span></a></SidebarHeader><SidebarContent className="pt-4"><Navigation page={page} go={go}/></SidebarContent><SidebarFooter className="border-t p-3"><DropdownMenu><DropdownMenuTrigger asChild><SidebarMenuButton className="h-auto py-2 text-sidebar-accent-foreground"><Avatar><AvatarImage src={store.image_url}/><AvatarFallback>TW</AvatarFallback></Avatar><span className="min-w-0 flex-1"><strong className="block truncate">{store.name}</strong><small className="block truncate text-muted-foreground">{store.manager_email}</small></span><ChevronDown/></SidebarMenuButton></DropdownMenuTrigger><DropdownMenuContent side="top" className="w-72"><div className="flex items-center justify-between p-3"><label htmlFor="store-status">Trạng thái hoạt động</label><Switch id="store-status" checked={store.status==='OPEN'} disabled={statusBusy} onCheckedChange={status}/></div><p className="px-3 pb-3 text-xs text-muted-foreground">Mở/đóng là thông tin hoạt động của cửa hàng.</p><DropdownMenuSeparator/><DropdownMenuItem onSelect={()=>go('store-profile')}><Store/>Hồ sơ cửa hàng</DropdownMenuItem><DropdownMenuItem onSelect={logout}><LogOut/>Đăng xuất</DropdownMenuItem></DropdownMenuContent></DropdownMenu></SidebarFooter></Sidebar><SidebarInset className="min-w-0 bg-background"><header className="flex h-16 items-center gap-4 border-b bg-white px-5"><SidebarTrigger/><Breadcrumb><BreadcrumbList><BreadcrumbItem>Manager</BreadcrumbItem><BreadcrumbItem>/</BreadcrumbItem><BreadcrumbItem><BreadcrumbPage>{title}</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb><span className="ml-auto hidden text-xs text-muted-foreground sm:block">{store.status==='OPEN'?'● Đang mở':'● Đã đóng'}</span><Button variant="ghost" size="icon" aria-label="Tải lại trang" onClick={()=>location.reload()}><RefreshCw size={16}/></Button></header><main className="min-w-0 p-4 md:p-7"><div className="mb-6"><h1 className="text-2xl font-semibold tracking-tight">{title}</h1><p className="mt-1 text-sm text-muted-foreground">{store.name}</p></div>{page===''?<Dashboard/>:page==='store-profile'?<StoreProfile store={store} saved={load}/>:page==='payments'?<Payments/>:page==='reviews'?<Reviews role="manager"/>:page==='support'?<Support role="manager"/>:<DataPage key={page} area={page}/>}</main></SidebarInset></SidebarProvider><Toaster richColors position="bottom-right"/></TooltipProvider>
}


