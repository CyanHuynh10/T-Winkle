import {useEffect,useState} from 'react'
import {createRoot} from 'react-dom/client'
import {MessagesSquare,Star,LogOut} from 'lucide-react'
import {Sidebar,SidebarProvider,SidebarHeader,SidebarContent,SidebarFooter,SidebarMenu,SidebarMenuItem,SidebarMenuButton,SidebarInset,SidebarTrigger,useSidebar} from '@/components/ui/sidebar'
import {Avatar,AvatarImage,AvatarFallback} from '@/components/ui/avatar'
import {Button} from '@/components/ui/button'
import {TooltipProvider} from '@/components/ui/tooltip'
import {Toaster} from '@/components/ui/sonner'
import {Conversations} from '../../shared/Conversations'
import {Reviews} from '../../shared/Reviews'
import {request,csrf,type Row} from '../../shared/api'
import './support.css'
function SupportNavigation({page,go}:{page:string;go:(p:string)=>void}){const sidebar=useSidebar();return <SidebarMenu>{([['','Hội thoại',MessagesSquare],['reviews','Đánh giá',Star]] as const).map(([key,label,Icon])=><SidebarMenuItem key={String(key)}><SidebarMenuButton isActive={page===key} onClick={()=>{go(String(key));sidebar.setOpenMobile(false)}}><Icon/><span>{String(label)}</span></SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu>}
function SupportApp(){
 const [page,setPage]=useState(location.pathname==='/support/reviews'?'reviews':''),[profile,setProfile]=useState<Row>(),[error,setError]=useState('')
 useEffect(()=>{request('/api/support/context').then(setProfile).catch(e=>setError(e.message));const pop=()=>setPage(location.pathname==='/support/reviews'?'reviews':'');addEventListener('popstate',pop);return()=>removeEventListener('popstate',pop)},[])
 const go=(p:string)=>{history.pushState({},'','/support'+(p?'/'+p:''));setPage(p)}
 const logout=()=>{const form=document.createElement('form');form.method='POST';form.action='/logout';const token=document.createElement('input');token.name='_csrf';token.value=Object.values(csrf())[0];form.append(token);document.body.append(form);form.submit()}
 return <TooltipProvider><SidebarProvider><Sidebar collapsible="offcanvas"><SidebarHeader className="border-b p-5"><a href="/support" className="flex items-center gap-3 font-semibold"><img src="/T-Winkle_LogoNoBG.png" alt="" className="h-9 w-9"/>T-Winkle - Support</a></SidebarHeader><SidebarContent className="p-3 pt-5"><SupportNavigation page={page} go={go}/></SidebarContent><SidebarFooter className="border-t p-3"><div className="flex min-w-0 items-center gap-3"><Avatar><AvatarImage src={profile?.avatar_url}/><AvatarFallback>TW</AvatarFallback></Avatar><div className="min-w-0"><strong className="block truncate">{profile?.name||'Support'}</strong><small className="block truncate">{profile?.email}</small></div></div><Button variant="ghost" onClick={logout}><LogOut size={16}/>Đăng xuất</Button></SidebarFooter></Sidebar><SidebarInset className="min-w-0"><header className="flex h-16 items-center gap-3 border-b px-5"><SidebarTrigger/><span>Support / {page==='reviews'?'Đánh giá':'Hội thoại'}</span></header><main className="min-w-0 p-4 md:p-7"><h1 className="mb-6 text-2xl font-semibold">{page==='reviews'?'Đánh giá':'Hội thoại'}</h1>{error?<p role="alert">{error}</p>:page==='reviews'?<Reviews role="support"/>:<Conversations role="support"/>}</main></SidebarInset></SidebarProvider><Toaster richColors position="bottom-right"/></TooltipProvider>
}
createRoot(document.getElementById('support-root')!).render(<SupportApp/>)
