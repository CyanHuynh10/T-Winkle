export function csrf() {
  const token = document.querySelector<HTMLMetaElement>('meta[name="_csrf"]')?.content || ''
  const header = document.querySelector<HTMLMetaElement>('meta[name="_csrf_header"]')?.content || 'X-CSRF-TOKEN'
  return { [header]: token }
}
export async function request<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(path, { credentials: 'same-origin', headers: { ...csrf(), 'Content-Type': 'application/json' },
    method: body === undefined ? 'GET' : 'POST', body: body === undefined ? undefined : JSON.stringify(body) })
  if (response.redirected || response.status === 401) throw new Error('Phiên đăng nhập đã kết thúc. Vui lòng đăng nhập lại')
  if (!response.ok) throw new Error(response.status === 429 ? 'Bạn đang gửi tin nhắn hơi nhanh. Vui lòng thử lại sau một chút'
    : response.status === 403 ? 'Bạn không có quyền truy cập cuộc trò chuyện này' : 'Chưa thể xử lý yêu cầu. Vui lòng kiểm tra thông tin và thử lại')
  return response.json()
}
export async function streamMessage(content: string, receive: (event: string, value: any) => void) {
  const response = await fetch('/api/ai-chat/messages/stream', {
    method: 'POST', credentials: 'same-origin', headers: { ...csrf(), 'Content-Type': 'application/json', Accept: 'text/event-stream' },
    body: JSON.stringify({ content })
  })
  if (response.redirected) throw new Error('Phiên đăng nhập đã kết thúc. Vui lòng đăng nhập lại')
  if (!response.ok || !response.body) throw new Error(response.status === 429
    ? 'Bạn đang gửi tin nhắn hơi nhanh. Vui lòng thử lại sau một chút' : 'Chưa thể gửi tin nhắn. Vui lòng thử lại')
  const reader = response.body.getReader(), decoder = new TextDecoder()
  let buffer = '', completed = false
  try {
    while (true) {
      const { done, value } = await reader.read()
      buffer += decoder.decode(value, { stream: !done }).replace(/\r\n/g, '\n')
      let boundary: number
      while ((boundary = buffer.indexOf('\n\n')) >= 0) {
        const block = buffer.slice(0, boundary); buffer = buffer.slice(boundary + 2)
        const lines = block.split('\n'), event = lines.find(l => l.startsWith('event:'))?.slice(6).trim() || 'message'
        const data = lines.filter(l => l.startsWith('data:')).map(l => l.slice(5).trimStart()).join('\n')
        if (data) { receive(event, JSON.parse(data)); if (event === 'done' || event === 'error') completed = true }
      }
      if (done) break
    }
    if (!completed) throw new Error('Kết nối bị gián đoạn. Bạn có thể thử lại hoặc Chat với cửa hàng')
  } finally { reader.releaseLock() }
}
