const $ = (s, root = document) => root.querySelector(s);
function uuid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = bytes[6] & 15 | 64;
  bytes[8] = bytes[8] & 63 | 128;
  const hex = [...bytes].map((value) => value.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === void 0 || v === null || v === false) continue;
    if (k === "class") node.className = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else if (k === "checked" || k === "disabled" || k === "hidden" || k === "selected" || k === "multiple" || k === "required") node[k] = !!v;
    else node.setAttribute(k, String(v));
  }
  for (const child of children.flat(Infinity)) {
    if (child !== null && child !== void 0) node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}
const csrf = () => ({ [$('meta[name="_csrf_header"]')?.content || "X-CSRF-TOKEN"]: $('meta[name="_csrf"]')?.content || "" });
async function request(path, body, options = {}) {
  const r = await fetch(path, { credentials: "same-origin", method: body === void 0 ? "GET" : "POST", ...options, headers: { ...csrf(), "Content-Type": "application/json", ...options.headers }, body: body === void 0 ? void 0 : JSON.stringify(body) });
  if (r.redirected || r.status === 401) throw Error("Phiên đăng nhập đã kết thúc. Vui lòng đăng nhập lại");
  if (!r.ok) {
    const e = await r.json().catch(() => ({}));
    throw Error(e.message || (r.status === 403 ? "Bạn không có quyền thực hiện thao tác này" : r.status === 429 ? "Vui lòng thử lại sau một chút" : "Chưa thể xử lý yêu cầu"));
  }
  return r.status === 204 ? null : r.json();
}
function button(text, action, style = "outline-secondary", attrs = {}) {
  return el("button", { type: "button", class: "btn btn-sm btn-" + style, onclick: async (e) => {
    const target = e.currentTarget;
    target.disabled = true;
    try {
      await action(e);
    } catch (error) {
      notice(error.message, true);
    } finally {
      if (target.isConnected) target.disabled = false;
    }
  }, ...attrs }, text);
}
function notice(message, error = false) {
  const area = $("#console-notice");
  if (!area) {
    const target = $("#chat-error");
    if (target) {
      target.textContent = message;
      target.hidden = false;
    }
    return;
  }
  const item = el("div", { class: "alert shadow " + (error ? "alert-danger" : "alert-success"), role: error ? "alert" : "status" }, message);
  area.append(item);
  setTimeout(() => item.remove(), 8e3);
}
function modal(title, content) {
  const box = $("#console-modal");
  if (!box) throw Error("Không thể mở hộp thoại");
  $("#console-modal-title").textContent = title;
  $("#console-modal-body").replaceChildren(content);
  const instance = bootstrap.Modal.getOrCreateInstance(box);
  instance.show();
  return () => instance.hide();
}
function field(label, input2) {
  const id = input2.id || "field-" + uuid();
  input2.id = id;
  return el("label", { class: "d-grid gap-1 mb-3", for: id }, el("span", { class: "small fw-semibold" }, label), input2);
}
function input(name, type = "text", value = "", attrs = {}) {
  return el("input", { class: "form-control", name, type, value: value ?? "", ...attrs });
}
function select(name, options, value = "", attrs = {}) {
  return el("select", { class: "form-select", name, ...attrs }, options.map((o) => {
    const [v, label] = Array.isArray(o) ? o : [o, o];
    return el("option", { value: v, selected: String(v) === String(value) }, label);
  }));
}
function loading(target) {
  target.replaceChildren(el("div", { class: "p-4 text-center", role: "status" }, el("span", { class: "spinner-border spinner-border-sm me-2", "aria-hidden": "true" }), "Đang tải…"));
  target.setAttribute("aria-busy", "true");
}
function errorPanel(target, error, retry) {
  target.removeAttribute("aria-busy");
  target.replaceChildren(el("div", { class: "alert alert-danger", role: "alert" }, error.message, " ", button("Thử lại", retry)));
}
function pagination(page, total, size, go) {
  const count = Math.max(1, Math.ceil(total / size));
  const indices = [.../* @__PURE__ */ new Set([0, page - 1, page, page + 1, count - 1])].filter((n) => n >= 0 && n < count).sort((a, b) => a - b);
  const nav = el("nav", { "aria-label": "Phân trang", class: "d-flex gap-1 flex-wrap" });
  nav.append(button("Trước", () => go(page - 1), "outline-secondary", { disabled: page === 0 }));
  let last = -1;
  for (const n of indices) {
    if (n - last > 1) nav.append(el("span", { class: "p-1" }, "…"));
    nav.append(button(String(n + 1), () => go(n), n === page ? "primary" : "outline-secondary", { "aria-current": n === page ? "page" : null }));
    last = n;
  }
  nav.append(button("Sau", () => go(page + 1), "outline-secondary", { disabled: page >= count - 1 }));
  return el("div", { class: "d-flex flex-wrap justify-content-between gap-3 align-items-center mt-3" }, el("span", { class: "text-secondary small" }, `${total} dòng · Trang ${page + 1}/${count}`), nav);
}
const money = (v) => Number(v || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });
async function confirmAction(title, fields, action) {
  let close;
  const form = el("form", {}, ...fields);
  form.append(el("p", { class: "small text-secondary" }, "Kiểm tra thông tin trước khi xác nhận."), el("button", { type: "submit", class: "btn btn-primary" }, "Xác nhận"));
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const b = $("button[type=submit]", form);
    b.disabled = true;
    try {
      await action(new FormData(form));
      close();
      notice("Đã xử lý");
    } catch (error) {
      notice(error.message, true);
    } finally {
      b.disabled = false;
    }
  });
  close = modal(title, form);
}
export {
  $,
  button,
  confirmAction,
  csrf,
  el,
  errorPanel,
  field,
  input,
  loading,
  modal,
  money,
  notice,
  pagination,
  request,
  select,
  uuid
};
