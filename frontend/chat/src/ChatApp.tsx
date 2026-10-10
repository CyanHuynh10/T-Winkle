import {Dialog as DialogPrimitive} from 'radix-ui'
import {X} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'
import { Send, Plus, LoaderCircle, Store, ArrowLeft } from 'lucide-react'
import { Message, MessageAvatar, MessageContent, MessageHeader } from '@/components/ui/message'
import { MessageScrollerProvider, MessageScroller, MessageScrollerViewport, MessageScrollerContent, MessageScrollerItem, MessageScrollerButton } from '@/components/ui/message-scroller'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Bubble, BubbleContent } from '@/components/ui/bubble'
import { Marker, MarkerContent, MarkerIcon } from '@/components/ui/marker'
import { request, csrf, streamMessage } from './api'

type ChatMessage = { id: string | number; role?: string; content: string; senderType?: string; displayName?: string; avatar?: string; staffName?: string; clientMessageId?: string }
type Session = { messages: ChatMessage[]; available: boolean; handoffRecommended: boolean }
type Conversation = { id: number; storeId:number;storeName: string; storeAvatar: string; internal: boolean; status: string; handoffSummary?: string; orderCode?: string }
type InboxItem = { id: number; storeName: string; storeAvatar?: string; status: string; handoffSummary: string; lastMessage?:string;lastMessageAt?:string;unreadCount?:number }
type StoreOption = { storeId: number; storeName: string; address:string;status:string;productId?: number; productName?: string }
const welcome = 'Xin chào! Mình là T-Winkle AI 👋\n\nMình có thể giúp bạn tìm sản phẩm, kiểm tra giá, size, màu sắc, tồn kho tại cửa hàng hoặc trạng thái đơn hàng.\n\nBạn đang tìm sản phẩm như thế nào?'
const unavailable = 'T-Winkle AI hiện chưa thể phản hồi. Bạn có thể thử lại hoặc chuyển sang Chat với cửa hàng'
function merge(previous: ChatMessage[], next: ChatMessage[]) {
  const byId = new Map(previous.map(m => [String(m.id), m]))
  next.forEach(m => byId.set(String(m.id), m))
  return [...byId.values()].sort((a, b) => Number(a.id) - Number(b.id))
}
function Logo({ src = '/images/T-Winkle.png', name = 'T-Winkle AI' }) {
  return <Avatar size="lg"><AvatarImage src={src} alt={name} /><AvatarFallback>TW</AvatarFallback></Avatar>
}
export default function ChatApp({ mode, conversationId, startStoreId }: { mode: string; conversationId?: number;startStoreId?:number }) {
  const customer = location.pathname.startsWith('/chat')
  const startRequested = useRef(false)
  useEffect(() => {
    if (!customer) return
    const mount = document.getElementById('twinkle-ai-chat-root')!
    const navbar = document.querySelector('.chat-page > div')
    const resize = () => mount.style.setProperty('--chat-top', `${mount.getBoundingClientRect().top}px`)
    const observer = new ResizeObserver(resize)
    if (navbar) observer.observe(navbar)
    window.addEventListener('resize', resize)
    resize()
    return () => { observer.disconnect(); window.removeEventListener('resize', resize) }
  }, [customer])
  const [mobileList, setMobileList] = useState(!conversationId && !startStoreId)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [conversation, setConversation] = useState<Conversation>()
  const [inbox, setInbox] = useState<InboxItem[]>([])
  const [options, setOptions] = useState<StoreOption[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [available, setAvailable] = useState(true)
  const [handoff, setHandoff] = useState(false)
  const [connected, setConnected] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [hasOlder, setHasOlder] = useState(false)
  const [pending, setPending] = useState<{ clientMessageId: string; content: string }>()
  const stomp = useRef<Client | null>(null)
  const busyRef = useRef(false)
  const fail = useCallback((e: unknown) => setError(e instanceof Error ? e.message : 'Chưa thể tải cuộc trò chuyện'), [])
  const loadAi = useCallback(async () => {
    if (busyRef.current) return
    const session = await request<Session>('/api/ai-chat/session')
    setMessages(session.messages); setAvailable(session.available); setHandoff(session.handoffRecommended)
  }, [])
  const loadInbox = useCallback(async () => {
    setInbox(await request<InboxItem[]>(mode === 'inbox' ? '/api/support/inbox' : '/api/support/conversations'))
  }, [mode])
  useEffect(() => {
    if (mode === 'ai') {
      loadAi().catch(fail)
      const refresh = () => { loadAi().catch(fail) }
      window.addEventListener('focus', refresh)
      return () => window.removeEventListener('focus', refresh)
    }
    if (mode === 'inbox' || customer) loadInbox().catch(fail)
  }, [mode, loadAi, loadInbox, fail])
  useEffect(() => {
    if (mode !== 'support' && mode !== 'inbox' && !customer) return
    let alive = true
    const client = new Client({
      brokerURL: (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/ws/chat',
      connectHeaders: csrf(), reconnectDelay: 4000, heartbeatIncoming: 10000, heartbeatOutgoing: 10000,
      onConnect: async () => {
        if (!alive) return
        try {
          client.subscribe('/user/queue/support-errors', frame => { fail(new Error(JSON.parse(frame.body).message)); setBusy(false); busyRef.current = false })
          client.subscribe('/user/queue/support-inbox', frame => { const event=JSON.parse(frame.body); if(event.event==='DELETED' && event.conversationId===conversationId)location.assign('/chat');else loadInbox().catch(fail) })
          await loadInbox()
          if (mode === 'support' && conversationId) {
            client.subscribe('/user/queue/support/' + conversationId, frame => {
              const message = JSON.parse(frame.body) as ChatMessage
              setMessages(previous => merge(previous, [message]))
              setPending(p => p?.clientMessageId === message.clientMessageId ? undefined : p)
              setBusy(false); busyRef.current = false
            })
            const c = await request<Conversation>('/api/support/conversations/' + conversationId)
            const history = await request<ChatMessage[]>('/api/support/conversations/' + conversationId + '/messages')
            if (!alive) return
            setConversation(c); setMessages(previous => merge(previous, history)); setHasOlder(history.length === 50)
          }
          setConnected(true); setError('')
        } catch (e) { fail(e); await client.deactivate() }
      },
      onWebSocketClose: () => { setConnected(false); setBusy(false); busyRef.current = false },
      onStompError: () => { setConnected(false); setBusy(false); busyRef.current = false; setError('Kết nối Chat chưa được chấp nhận. Tải lại trang để kiểm tra phiên đăng nhập') }
    })
    stomp.current = client; client.activate()
    return () => { alive = false; stomp.current = null; void client.deactivate() }
  }, [mode, conversationId, fail, loadInbox])

  // Staff read positions are independent; customer and AI views never update them.
  useEffect(() => {
    if (mode !== 'support' || !conversationId || !messages.length) return
    const latest = Math.max(...messages.map(m => Number(m.id)).filter(Number.isFinite))
    if (!Number.isFinite(latest) || latest <= 0) return
    const markRead = () => {
      if (document.visibilityState === 'visible')
        request('/api/support/conversations/' + conversationId + '/read', { lastReadMessageId: latest }).then(loadInbox).catch(fail)
    }
    markRead()
    document.addEventListener('visibilitychange', markRead)
    return () => document.removeEventListener('visibilitychange', markRead)
  }, [mode, conversationId, conversation?.internal, messages, fail])
  async function sendAi(content: string) {
    if (busyRef.current || !content.trim()) return
    busyRef.current = true; setBusy(true); setError(''); setInput('')
    setMessages(previous => [...previous, { id: crypto.randomUUID(), role: 'user', content }])
    let retry = false
    try {
      await streamMessage(content, (event, data) => {
        if (event === 'status') setStatus(data.label)
        if (event === 'done') {
          setHandoff(data.handoffRecommended); setAvailable(!data.unavailable)
          retry = Boolean(data.unavailable)
        }
        if (event === 'error') { setError(data.message); retry = true }
      })
    } catch (e) { fail(e); retry = true }
    finally {
      busyRef.current = false; setBusy(false); setStatus('')
      if (retry) setInput(content)
      await loadAi().catch(fail)
    }
  }
  function sendHuman() {
    if (!connected || !conversationId || busyRef.current || (!pending && !input.trim())) return
    const payload = pending || { clientMessageId: crypto.randomUUID(), content: input.trim() }
    setPending(payload); busyRef.current = true; setBusy(true); setError('')
    stomp.current?.publish({ destination: '/app/support/' + conversationId + '/send', body: JSON.stringify(payload) })
    setInput('')
    // A lost acknowledgement can be retried with the same ID after reconnect.
    window.setTimeout(() => { busyRef.current = false; setBusy(false) }, 10000)
  }
  async function reset() {
    setError('')
    try { await request('/api/ai-chat/reset', {}); setMessages([]); setHandoff(false); setInput(''); await loadAi() } catch (e) { fail(e) }
  }
  async function beginHandoff() {
    setError('')
    try { setOptions(await request<StoreOption[]>('/api/support/handoff-options')); setHandoff(true) } catch (e) { fail(e) }
  }
  async function transfer(storeId: number, direct = false) {
    setBusy(true); setError('')
    try {const c=await request<Conversation>('/api/support/conversations/'+(direct?'direct':'handoff'),{storeId});location.assign('/chat/store/'+c.id)}
    catch(e){fail(e);setBusy(false)}
  }
  useEffect(()=>{if(startStoreId&&!startRequested.current){startRequested.current=true;void transfer(startStoreId,true)}},[startStoreId])
  async function older() {
    if (!conversationId || !messages.length) return
    setBusy(true)
    try {
      const history = await request<ChatMessage[]>('/api/support/conversations/' + conversationId + '/messages?beforeId=' + messages[0].id)
      setMessages(previous => merge(previous, history)); setHasOlder(history.length === 50)
    } catch (e) { fail(e) } finally { setBusy(false) }
  }
  const title = mode === 'ai' ? 'T-Winkle AI' : mode === 'inbox' ? 'Hỗ trợ cửa hàng' : conversation?.storeName || 'Chat với cửa hàng'
  const displayed = mode === 'ai' && messages.length === 0 ? [{ id: 'welcome', role: 'assistant', content: welcome }] : messages
  return <div className={'conversation-layout'+(customer?' customer-layout':'')+(mobileList?' show-list':'')}>
    {customer && <aside className="conversation-sidebar"><h2>Cuộc trò chuyện</h2>
      <a href="/chat" className={'conversation-row'+(mode==='ai'?' selected':'')} onClick={e=>{if(mode==='ai'){e.preventDefault();setMobileList(false)}}}><img src="/images/T-Winkle.png" alt=""/><span><strong>T-Winkle AI</strong><small>Trợ lý mua sắm · Ghim</small></span></a>
      <div className="store-threads">{!inbox.length&&<p className="notice">Chưa có cuộc trò chuyện với cửa hàng</p>}{inbox.map(c=><a className={'conversation-row'+(c.id===conversationId?' selected':'')} key={c.id} href={'/chat/store/'+c.id}><img src={c.storeAvatar||'/images/T-Winkle.png'} alt=""/><span><strong>{c.storeName}</strong><small>{c.lastMessage||c.handoffSummary}</small>{c.lastMessageAt&&<time>{new Date(c.lastMessageAt).toLocaleString('vi-VN',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}</time>}</span>{!!c.unreadCount&&<b className="unread" aria-label={c.unreadCount+' tin nhắn chưa đọc'}>{c.unreadCount}</b>}</a>)}</div>
    </aside>}
    <div className="chat-frame">
      <header className="chat-header">
        {customer&&<button className="mobile-back" aria-label="Danh sách cuộc trò chuyện" onClick={()=>setMobileList(true)}><ArrowLeft size={18}/></button>}
        <Logo src={conversation?.storeAvatar} name={title} />
        <div><h1>{title}</h1><p>{mode === 'ai' ? 'AI Shopping Assistant' : mode === 'inbox' ? 'Tin nhắn khách hàng' : connected ? 'Đã kết nối với cửa hàng' : 'Đang kết nối lại…'}</p></div>
        <div className="actions">{mode === 'ai'
          ? <><button onClick={beginHandoff} disabled={busy}><Store size={16} aria-hidden /> Chat với cửa hàng</button><button onClick={reset} disabled={busy}><Plus size={16} aria-hidden /> Cuộc trò chuyện mới</button>{!customer&&<button onClick={() => { setShowHistory(!showHistory); loadInbox().catch(fail) }}>Chat cửa hàng đã lưu</button>}</>
          : !customer && <a className="chat-link" href={conversation?.internal || mode === 'inbox' ? '/manager/support' : '/chat'}><ArrowLeft size={16} aria-hidden /> Quay lại</a>}</div>
      </header>
      {mode === 'inbox' || showHistory ? <div className="inbox notice">
        {!inbox.length && <p>Chưa có cuộc trò chuyện</p>}
        {inbox.map(c => <a key={c.id} href={(mode === 'inbox' ? '/manager/support/' : '/chat/store/') + c.id}><strong>{c.storeName}</strong> · {c.status === 'OPEN' ? 'Đang mở' : 'Đã đóng'}<p>{c.handoffSummary}</p></a>)}
      </div> : null}
      {mode !== 'inbox' && <MessageScrollerProvider autoScroll>
        <MessageScroller className="flex-1"><MessageScrollerViewport><MessageScrollerContent className="p-6">
          {hasOlder && <button onClick={older} disabled={busy}>Tải tin nhắn trước</button>}
          {displayed.map(m => {
            const own = mode === 'ai' ? m.role === 'user' : conversation?.internal ? m.senderType === 'STAFF' : m.senderType === 'USER'
            return <MessageScrollerItem key={m.id} messageId={String(m.id)}>
              {m.senderType === 'SYSTEM' ? <Marker variant="separator"><MarkerContent>{m.content}</MarkerContent></Marker> :
                <Message align={own ? 'end' : 'start'}>
                  {!own && <MessageAvatar><Logo src={m.avatar} name={m.displayName} /></MessageAvatar>}
                  <MessageContent>
                    <MessageHeader>{mode === 'ai' ? own ? 'Bạn' : 'T-Winkle AI' : m.displayName}{m.staffName && <span> · Gửi bởi {m.staffName}</span>}</MessageHeader>
                    <Bubble variant={own ? 'default' : 'muted'} align={own ? 'end' : 'start'}><BubbleContent className="message-text">{m.content}</BubbleContent></Bubble>
                  </MessageContent>
                </Message>}
            </MessageScrollerItem>
          })}
          {busy && mode === 'ai' && <Marker role="status"><MarkerIcon><LoaderCircle className="animate-spin" /></MarkerIcon><MarkerContent>{status || 'Đang xử lý…'}</MarkerContent></Marker>}
        </MessageScrollerContent></MessageScrollerViewport><MessageScrollerButton aria-label="Đến tin nhắn mới nhất" /></MessageScroller>
      </MessageScrollerProvider>}
      {conversation?.handoffSummary && <div className="notice">{conversation.orderCode && <>Đơn {conversation.orderCode} · </>}{conversation.handoffSummary}</div>}
      {mode === 'ai' && !available && <div className="notice">{unavailable}</div>}
      {error && <div className="notice error" role="alert">{error}</div>}
      {customer && conversation?.status==='CLOSED' && <div className="notice">Cuộc trò chuyện đã đóng <button disabled={busy} onClick={()=>transfer(conversation.storeId,true)}>Trò chuyện lại</button></div>}
      {mode === 'ai' && handoff && <div className="notice">Nhân viên cửa hàng có thể hỗ trợ bạn trực tiếp</div>}
      <DialogPrimitive.Root open={mode==='ai'&&options.length>0} onOpenChange={open=>{if(!open)setOptions([])}}><DialogPrimitive.Portal container={document.getElementById('twinkle-ai-chat-root')}><DialogPrimitive.Content className="store-options"><DialogPrimitive.Title>Chọn cửa hàng</DialogPrimitive.Title><DialogPrimitive.Description className="sr-only">Chọn cửa hàng để trò chuyện</DialogPrimitive.Description><DialogPrimitive.Close className="store-dialog-close" aria-label="Đóng"><X size={18}/></DialogPrimitive.Close>{options.map(o=><article key={o.storeId}><div><strong>{o.storeName}</strong><p>{o.address}</p><small className={o.status==='OPEN'?'store-open':'store-closed'}>{o.status==='OPEN'?'Đang mở':'Đã đóng'}</small></div><button disabled={busy} onClick={()=>transfer(o.storeId)}>Chuyển</button></article>)}</DialogPrimitive.Content></DialogPrimitive.Portal></DialogPrimitive.Root>
      {mode !== 'inbox' && <form className="composer" onSubmit={e => { e.preventDefault(); if (mode === 'ai') void sendAi(input); else sendHuman() }}>
        <textarea rows={1} aria-label="Tin nhắn" placeholder="Nhập tin nhắn của bạn…" maxLength={2000} value={input} onChange={e => setInput(e.target.value)}
          disabled={busy || conversation?.status === 'CLOSED'} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (mode === 'ai') void sendAi(input); else sendHuman() } }} />
        <button className="send-button" type="submit" disabled={busy || mode === 'support' && (!connected || conversation?.status === 'CLOSED') || !input.trim() && !pending}>
          <Send size={18} aria-hidden /> {pending ? 'Thử gửi lại' : !available && input ? 'Thử lại' : 'Gửi'}
        </button>
      </form>}
    </div>
  </div>
}
