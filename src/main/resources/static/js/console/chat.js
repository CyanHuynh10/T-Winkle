import { $, el, csrf, request, button, select, field, loading, pagination, confirmAction, notice, modal, uuid } from "./core.js";
let stompLibrary;
async function stomp() {
  if (!stompLibrary) stompLibrary = new Promise((resolve, reject) => {
    const script = el("script", { src: "/vendor/stomp/stomp.umd.min.js", onload: () => resolve(window.StompJs), onerror: () => reject(Error("Chưa thể tải kết nối trực tiếp")) });
    document.head.append(script);
  });
  return stompLibrary;
}
async function chat(root, role) {
  const staff = !!role, mode = staff ? "staff" : root.dataset.mode || "ai";
  let selected = Number(root.dataset.conversationId) || void 0, ai = mode === "ai", page = 0, store = "", conversation, messages = [], hasOlder = false, pending, busy = false, socket, subscription, version = 0, alive = true, connected = false;
  const inbox = $("#chat-inbox", root), pane = $("#chat-messages", root), composer = $("#chat-compose", root), text = $("#chat-input", root), actions = $("#chat-actions", root), connection = $("#chat-connection", root), summary = $("#chat-summary", root), error = $("#chat-error", root);
  const fail = (e) => {
    error.textContent = e.message;
    error.hidden = false;
  };
  const clearError = () => {
    error.hidden = true;
  };
  function status() {
    composer.hidden = !ai && !selected;
    connection.textContent = ai ? "AI Shopping Assistant" : connected ? "● Kết nối trực tiếp" : "Đang kết nối lại…";
    text.disabled = busy || !ai && (!conversation || conversation.status !== "OPEN");
    $("button[type=submit]", composer).disabled = busy || !ai && (!conversation || conversation.status !== "OPEN");
  }
  function messageBody(content) {
    const container = el("div", { class: "bubble" });
    const pattern = /\[([^\]]+)\]\((\/(?:products|stores|orders)\/[^\s)]+)\)/g;
    let start = 0;
    for (const match of content.matchAll(pattern)) {
      container.append(document.createTextNode(content.slice(start, match.index)), el("a", { href: match[2] }, match[1]));
      start = match.index + match[0].length;
    }
    container.append(document.createTextNode(content.slice(start)));
    return container;
  }
  function renderMessages(preserve = false) {
    const offset = pane.scrollHeight - pane.scrollTop;
    pane.replaceChildren();
    if (hasOlder) pane.append(button("Tin nhắn trước", older));
    const list = ai && !messages.length ? [{ role: "assistant", content: "Xin chào! Mình là T-Winkle AI 👋\nMình có thể giúp bạn tìm sản phẩm, kiểm tra giá, size, màu sắc, tồn kho tại cửa hàng hoặc trạng thái đơn hàng. Bạn đang tìm sản phẩm như thế nào?" }] : messages;
    for (const m of list) {
      const own = ai ? m.role === "user" : m.senderType === (staff ? "STAFF" : "USER");
      pane.append(el("article", { class: "conversation-message " + (own ? "own" : "") }, el("small", {}, ai ? own ? "Bạn" : "T-Winkle AI" : m.displayName || "", m.staffName ? " · " + m.staffName : ""), messageBody(m.content || ""), m.createdAt ? el("small", {}, new Date(m.createdAt).toLocaleString("vi-VN")) : null));
    }
    if (!list.length) pane.append(el("p", { class: "text-secondary" }, selected ? "Chưa có tin nhắn" : "Chọn cuộc trò chuyện để xem lịch sử và trả lời"));
    pane.scrollTop = preserve ? pane.scrollHeight - offset : pane.scrollHeight;
  }
  function merge(list, preserve = false) {
    const map = new Map(messages.map((m) => [String(m.id), m]));
    for (const m of list) map.set(String(m.id), m);
    messages = [...map.values()].sort((a, b) => Number(a.id) - Number(b.id));
    renderMessages(preserve);
  }
  async function synchronizeMessages(id) {
    const lastKnown = messages.length ? Number(messages.at(-1).id) : 0;
    let list = await request(`/api/support/conversations/${id}/messages`);
    while (id === selected) {
      const first = list[0]?.id;
      merge(list);
      if (!lastKnown || list.length < 50 || Number(first) <= lastKnown) break;
      list = await request(`/api/support/conversations/${id}/messages?beforeId=${first}`);
    }
    if (id === selected) await read(id);
  }
  async function read(id = selected) {
    if (!ai && id && id === selected && messages.length && document.visibilityState === "visible") {
      await request(`/api/support/conversations/${id}/read`, { lastReadMessageId: messages.at(-1).id });
    }
  }
  async function loadAi() {
    const data = await request("/api/ai-chat/session");
    messages = data.messages;
    renderMessages();
    summary.hidden = data.available && !data.handoffRecommended;
    summary.textContent = !data.available ? "T-Winkle AI hiện chưa thể phản hồi. Bạn có thể thử lại hoặc Chat với cửa hàng." : data.handoffRecommended ? "Nhân viên cửa hàng có thể hỗ trợ bạn trực tiếp" : "";
  }
  async function loadInbox() {
    const data = await request(staff ? "/api/support/staff-inbox?" + new URLSearchParams({ page: String(page), size: "30", ...store ? { storeId: store } : {} }) : "/api/support/conversations");
    if (!alive) return;
    const list = staff ? data.items : data;
    inbox.replaceChildren();
    if (staff && role !== "manager") {
      const context = await request("/api/support/context");
      const filter = select("storeId", [["", role === "admin" ? "Tất cả cửa hàng" : "Cửa hàng được phân công"], ...context.stores.map((s) => [s.id, s.name])], store);
      filter.addEventListener("change", () => {
        store = filter.value;
        page = 0;
        selected = void 0;
        conversation = void 0;
        messages = [];
        renderMessages();
        status();
        loadInbox().catch(fail);
      });
      inbox.append(field("Cửa hàng hội thoại", filter));
    }
    if (!staff) inbox.append(el("a", { href: "/chat", class: "conversation-inbox-item " + (ai ? "active" : "") }, el("strong", {}, "T-Winkle AI"), el("small", {}, "Trợ lý mua sắm · Ghim")));
    for (const c of list) {
      const item = el(staff ? "button" : "a", { class: "conversation-inbox-item " + (selected === c.id ? "active" : ""), ...staff ? { type: "button", onclick: () => selectConversation(c.id).catch(fail) } : { href: "/chat/store/" + c.id } }, el("strong", {}, staff ? "Khách hàng · #" + c.id : c.storeName), c.unreadCount ? el("span", { class: "badge text-bg-primary ms-2" }, c.unreadCount) : null, el("small", {}, c.lastMessage || c.handoffSummary || "Chưa có tin nhắn"), el("small", {}, c.status === "OPEN" ? "Đang mở" : "Đã đóng"));
      inbox.append(item);
    }
    if (!list.length) inbox.append(el("p", { class: "small text-secondary p-3" }, "Chưa có cuộc trò chuyện"));
    if (staff) inbox.append(pagination(page, data.total, 30, (n) => {
      page = n;
      return loadInbox();
    }));
  }
  async function selectConversation(id) {
    const revision = ++version;
    selected = id;
    conversation = void 0;
    messages = [];
    pending = void 0;
    text.value = "";
    status();
    loading(pane);
    clearError();
    subscription?.unsubscribe();
    subscription = void 0;
    if (socket?.connected) subscribe();
    try {
      const [c, list] = await Promise.all([request("/api/support/conversations/" + id), request("/api/support/conversations/" + id + "/messages")]);
      if (revision !== version) return;
      conversation = c;
      hasOlder = list.length === 50;
      merge(list);
      $("#chat-title", root).textContent = staff ? "Khách hàng · #" + id : c.storeName;
      summary.textContent = [c.orderCode, c.handoffSummary].filter(Boolean).join(" · ");
      summary.hidden = !summary.textContent;
      if (!staff && c.status === "CLOSED") {
        summary.hidden = false;
        summary.append(el("p", {}, "Cuộc trò chuyện đã đóng "), button("Trò chuyện lại", () => transfer(c.storeId, true)));
      }
      pane.removeAttribute("aria-busy");
      await read(id);
      await loadInbox();
    } finally {
      if (revision === version) status();
    }
  }
  async function older() {
    if (!selected || !messages.length) return;
    const id = selected, list = await request(`/api/support/conversations/${id}/messages?beforeId=${messages[0].id}`);
    if (id !== selected) return;
    hasOlder = list.length === 50;
    merge(list, true);
  }
  function subscribe() {
    subscription?.unsubscribe();
    if (!selected || !socket?.connected || ai) return;
    const id = selected;
    subscription = socket.subscribe("/user/queue/support/" + id, (frame) => {
      if (id !== selected) return;
      const m = JSON.parse(frame.body);
      merge([m]);
      read(id).then(loadInbox).catch(fail);
    });
  }
  async function beginHandoff() {
    const options = await request("/api/support/handoff-options");
    const list = el("div");
    for (const s of options) list.append(el("article", { class: "border-bottom py-3" }, el("strong", {}, s.storeName), el("p", {}, s.address), el("small", {}, s.status === "OPEN" ? "Đang mở" : "Đã đóng"), " ", button("Chuyển", () => transfer(s.storeId), "primary")));
    if (!options.length) list.append(el("p", {}, "Chưa có cửa hàng"));
    modal("Chọn cửa hàng", list);
  }
  async function transfer(storeId, direct = false) {
    const c = await request("/api/support/conversations/" + (direct ? "direct" : "handoff"), { storeId });
    location.assign("/chat/store/" + c.id);
  }
  async function stream(content) {
    const response = await fetch("/api/ai-chat/messages/stream", { method: "POST", credentials: "same-origin", headers: { ...csrf(), "Content-Type": "application/json", Accept: "text/event-stream" }, body: JSON.stringify({ content }) });
    if (response.redirected || !response.ok || !response.body) throw Error(response.status === 429 ? "Bạn đang gửi tin nhắn hơi nhanh. Vui lòng thử lại sau một chút" : "Chưa thể gửi tin nhắn. Vui lòng đăng nhập lại hoặc thử lại");
    const reader = response.body.getReader(), decoder = new TextDecoder();
    let buffer = "", completed = false;
    try {
      while (true) {
        const { done, value } = await reader.read();
        buffer += decoder.decode(value, { stream: !done });
        buffer = buffer.replace(/\r\n/g, "\n");
        let boundary;
        while ((boundary = buffer.indexOf("\n\n")) >= 0) {
          const block = buffer.slice(0, boundary);
          buffer = buffer.slice(boundary + 2);
          const lines = block.split("\n"), event = lines.find((l) => l.startsWith("event:"))?.slice(6).trim(), data = lines.filter((l) => l.startsWith("data:")).map((l) => l.slice(5).trimStart()).join("\n");
          if (data) {
            const payload = JSON.parse(data);
            if (event === "status") connection.textContent = payload.label;
            if (event === "error") throw Error(payload.message);
            if (event === "done") {
              completed = true;
              if (payload.unavailable) text.value = content;
            }
          }
        }
        if (done) break;
      }
      if (!completed) throw Error("Kết nối bị gián đoạn. Vui lòng thử lại.");
    } finally {
      reader.releaseLock();
    }
  }
  composer.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (busy || !text.value.trim()) return;
    const content = text.value.trim(), id = selected;
    let acknowledged = false;
    busy = true;
    clearError();
    status();
    try {
      if (ai) {
        messages.push({ id: uuid(), role: "user", content });
        renderMessages();
        text.value = "";
        await stream(content);
        await loadAi();
      } else {
        if (!id || conversation?.status !== "OPEN") return;
        pending = pending?.content === content ? pending : { content, clientMessageId: uuid() };
        await request(`/api/support/conversations/${id}/messages`, pending);
        acknowledged = true;
        if (id !== selected) return;
        text.value = "";
        pending = void 0;
        const list = await request(`/api/support/conversations/${id}/messages`);
        if (id !== selected) return;
        merge(list);
        await read(id);
        await loadInbox();
      }
    } catch (e2) {
      fail(e2);
      if (!acknowledged) text.value = content;
      if (ai) await loadAi().catch(fail);
    } finally {
      busy = false;
      status();
    }
  });
  text.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      composer.requestSubmit();
    }
  });
  if (ai) {
    $("#chat-title", root).textContent = "T-Winkle AI";
    actions.append(button("Chat với cửa hàng", beginHandoff), button("Cuộc trò chuyện mới", async () => {
      if (busy) return;
      await confirmAction("Bắt đầu cuộc trò chuyện mới", [], async () => {
        await request("/api/ai-chat/reset", {});
        text.value = "";
        await loadAi();
      });
    }));
    await loadAi();
  } else if (staff && role !== "support") {
    actions.append(button("Xóa cuộc hội thoại", async () => {
      if (!selected) return;
      const id = selected;
      await confirmAction("Xóa cuộc hội thoại và toàn bộ tin nhắn", [], async () => {
        await request(`/api/support/conversations/${id}/delete`, {});
        selected = void 0;
        conversation = void 0;
        messages = [];
        renderMessages();
        await loadInbox();
        status();
      });
    }, "outline-danger"));
  }
  await loadInbox();
  if (selected && !ai) await selectConversation(selected);
  else if (!ai) {
    renderMessages();
    status();
  }
  const visible = () => {
    if (document.visibilityState === "visible") {
      if (ai && !busy) loadAi().catch(fail);
      else read().then(loadInbox).catch(fail);
    }
  };
  document.addEventListener("visibilitychange", visible);
  const lib = await stomp();
  socket = new lib.Client({ brokerURL: (location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/ws/chat", connectHeaders: csrf(), reconnectDelay: 3e3, heartbeatIncoming: 1e4, heartbeatOutgoing: 1e4, onConnect: async () => {
    connected = true;
    status();
    socket.subscribe("/user/queue/support-errors", (f) => fail(Error(JSON.parse(f.body).message)));
    socket.subscribe("/user/queue/support-inbox", (f) => {
      const event = JSON.parse(f.body);
      if (event.event === "DELETED" && event.conversationId === selected) {
        if (!staff) {
          location.assign("/chat");
          return;
        }
        selected = void 0;
        conversation = void 0;
        messages = [];
        subscription?.unsubscribe();
        renderMessages();
        status();
      }
      loadInbox().catch(fail);
    });
    subscribe();
    if (selected && !ai) {
      const id = selected;
      synchronizeMessages(id).catch(fail);
    }
    loadInbox().catch(fail);
  }, onWebSocketClose: () => {
    connected = false;
    status();
  }, onStompError: () => {
    connected = false;
    status();
    fail(Error("Kết nối chưa được chấp nhận. Tải lại trang để kiểm tra phiên đăng nhập"));
  } });
  socket.activate();
  window.addEventListener("pagehide", () => {
    alive = false;
    document.removeEventListener("visibilitychange", visible);
    socket?.deactivate();
  }, { once: true });
  if (root.dataset.startStoreId) await transfer(Number(root.dataset.startStoreId), true);
}
export {
  chat
};
