import { tableCell, rowActions, compactActions, dateTime } from "./table.js";
import { $, el, request, button, field, input, select, loading, errorPanel, pagination, modal, confirmAction, notice } from "./core.js";
async function reviews(root, role) {
  const filters = el("form", { class: "console-filters" }), panel = el("div"), pager = el("div");
  let page = 0, revision = 0, initialData = window.twConsoleInitial;
  window.twConsoleInitial = null;
  const search = input("search", "search", "", { placeholder: "Tìm sản phẩm hoặc nội dung…", maxlength: 150 });
  filters.append(field("Tìm đánh giá", search), field("Số sao", select("rating", [["", "Tất cả số sao"], ...[1, 2, 3, 4, 5].map((n) => [n, n + " sao"])])), field("Phản hồi đánh giá", select("replied", [["", "Tất cả phản hồi"], ["yes", "Đã phản hồi"], ["no", "Chưa phản hồi"]])));
  if (role === "admin") {
    const context = await request("/api/support/context");
    filters.append(field("Cửa hàng đánh giá", select("storeId", [["", "Tất cả cửa hàng"], ...context.stores.map((s) => [s.id, s.name])])));
  }
  root.replaceChildren(filters, panel, pager);
  async function load() {
    const version = ++revision;
    loading(panel);
    try {
      const q = new URLSearchParams(new FormData(filters));
      q.set("page", page);
      const data = initialData?.items ? initialData : await request("/api/" + role + "/reviews?" + q);
      initialData = null;
      if (version !== revision) return;
      panel.removeAttribute("aria-busy");
      const tbody = el("tbody");
      for (const r of data.items) {
        const group = rowActions(button("Chi tiết", () => {
          modal(r.product, el("div", {}, el("p", {}, `${r.store || "Chưa xác định"} · ${r.rating} ★`), el("p", { class: "text-break", style: "white-space:pre-wrap" }, r.comment), el("strong", {}, r.store || ""), el("p", { style: "white-space:pre-wrap" }, r.response || "Chưa phản hồi"), el("small", {}, r.responder || "", " · ", r.responder_role || "")));
        }));
        const actions = group.querySelector(".console-actions");
        actions.append(button("Phản hồi", async () => {
          const area = el("textarea", { class: "form-control", name: "content", required: true, maxlength: 2e3, rows: 5 }, r.response || "");
          await confirmAction("Phản hồi đánh giá", [field("Nội dung phản hồi", area)], async (form) => {
            await request(`/api/${role}/reviews/${r.id}/reply`, { content: form.get("content") });
            await load();
          });
        }, "primary", { disabled: !r.store_id }));
        if (role !== "support") actions.append(button("Xóa", () => confirmAction("Xóa đánh giá và phản hồi liên quan", [], async () => {
          await request(`/api/${role}/reviews/${r.id}/delete`, {});
          await load();
        }), "outline-danger"));
        tbody.append(el("tr", {}, ...[r.product, r.store || "Chưa xác định", r.customer, r.rating + " ★", r.comment || "—", el("div", {}, r.response || "Chưa phản hồi", el("small", { class: "d-block text-secondary" }, r.response ? [r.responder, r.responder_role?.replaceAll("ROLE_", "")].filter(Boolean).join(" · ") : "")), dateTime(r.created_at), compactActions(group)].map((v,i) => i === 7 ? el("td",{class:"tw-cell-actions"},v) : tableCell(["product","store","customer","rating","comment","response","created_at"][i],v))));
      }
      if (!data.items.length) tbody.append(el("tr", {}, el("td", { colspan: 8, class: "p-5 text-center" }, role === "support" ? "Chưa có đánh giá thuộc cửa hàng được phân công" : "Chưa có đánh giá phù hợp")));
      panel.replaceChildren(el("div", { class: "table-responsive card" }, el("table", { class: "table table-hover tw-console-table" }, el("thead", {}, el("tr", {}, ...["Sản phẩm", "Cửa hàng", "Khách hàng", "Đánh giá", "Nội dung", "Phản hồi", "Ngày đánh giá", "Thao tác"].map((t) => el("th", { scope: "col" }, t)))), tbody)));
      pager.replaceChildren(pagination(page, data.total, 30, (n) => {
        page = n;
        return load();
      }));
    } catch (error) {
      if (version === revision) errorPanel(panel, error, load);
    }
  }
  let timer;
  filters.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      page = 0;
      load();
    }, 250);
  });
  filters.addEventListener("submit", (e) => {
    e.preventDefault();
    clearTimeout(timer);
    page = 0;
    load();
  });
  await load();
}
export {
  reviews
};
