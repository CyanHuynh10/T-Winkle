import { el, request, button, field, input, select, loading, errorPanel, money } from "./core.js";
import { exportButtons } from "./exports.js";
const kpis = { revenue: "Doanh thu hàng đã giao", orders: "Đơn hàng", items_sold: "Sản phẩm đã bán", demo_units_period_ending: "Lượt bán mô phỏng (kỳ kết thúc trong bộ lọc)", average_order_value: "Giá trị đơn đã giao TB", pending_orders: "Đơn chờ xác nhận", pending_verifications: "Chuyển khoản chờ xác minh", low_stock: "Sắp hết hàng", out_of_stock: "Hết hàng", pending_restock: "Yêu cầu nhập hàng", pending_catalog: "Yêu cầu danh mục", active_users: "Tài khoản hoạt động (toàn hệ thống)", active_stores: "Cửa hàng đang mở", open_conversations: "Hội thoại đang mở", cancelled_orders: "Đơn đã hủy", delivered_orders: "Đơn đã giao", cancellation_rate: "Tỷ lệ hủy" };
const charts = { trend: "Doanh thu theo thời gian", revenue_by_store: "Doanh thu theo cửa hàng", orders_by_store: "Đơn hàng theo cửa hàng", order_status: "Trạng thái giao hàng", payment_method: "Phương thức thanh toán", payments: "Phương thức thanh toán", payment_status: "Trạng thái thanh toán", promotion_performance: "Giảm giá tự động trên hàng đã giao", top_products: "Sản phẩm bán chạy", top_brands: "Thương hiệu", top_categories: "Danh mục", top_sizes: "Size bán nhiều", top_colors: "Màu bán nhiều", inventory: "Tình trạng tồn kho", low_stock: "Mặt hàng sắp hết", restock: "Yêu cầu nhập hàng", support: "Hoạt động hỗ trợ", coupon_redemption: "Lượt sử dụng coupon", user_growth: "Tài khoản mới (toàn hệ thống)", cancellation: "Tỷ lệ hủy theo thời gian (%)" };
async function dashboard(root, role, meta) {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit" }).format(/* @__PURE__ */ new Date()), form = el("form", { class: "console-filters" }), panel = el("div");
  let revision = 0, initialData = window.twConsoleInitial;
  window.twConsoleInitial = null;
  const mode = select("mode", [["DAY", "Theo ngày"], ["WEEK", "Theo tuần"], ["MONTH", "Theo tháng"], ["YEAR", "Theo năm"]], "MONTH");
  form.append(field("Loại thời gian", mode));
  const dates = { date: input("date", "date", today, { required: true }), from: input("from", "date", today, { required: true }), to: input("to", "date", today, { required: true }), month: input("month", "month", today.slice(0, 7), { required: true }), year: input("year", "number", today.slice(0, 4), { required: true, min: 1900, max: 9998 }) };
  for (const [key, label] of Object.entries({ date: "Ngày báo cáo", from: "Từ ngày", to: "Đến ngày", month: "Tháng báo cáo", year: "Năm báo cáo" })) form.append(field(label, dates[key]));
  function visibility() {
    for (const [key, control] of Object.entries(dates)) {
      const shown = { DAY: ["date"], WEEK: ["from", "to"], MONTH: ["month"], YEAR: ["year"] }[mode.value].includes(key);
      control.disabled = !shown;
      control.parentElement.hidden = !shown;
    }
  }
  if (role === "admin") {
    const stores = await request("/api/admin/options?kind=stores");
    form.append(field("Cửa hàng báo cáo", select("storeId", [["", "Tất cả cửa hàng"], ...stores.map((s) => [s.id, s.name])])));
  }
  const query = () => Object.fromEntries([...new FormData(form)].filter(([, v]) => v !== ""));
  form.append(button("Tải lại", load));
  if (role === "manager") form.append(exportButtons("DASHBOARD", query, () => []));
  root.replaceChildren(form, el("p", { class: "text-secondary small" }, "Doanh thu = giá trị hàng đã giao theo từng cửa hàng; chưa phân bổ coupon, phí giao hay hoàn tiền. Số liệu theo múi giờ Việt Nam."), panel);
  async function load() {
    visibility();
    if (!form.reportValidity()) return;
    if (mode.value === "WEEK" && dates.from.value > dates.to.value) {
      errorPanel(panel, Error("Ngày bắt đầu phải trước ngày kết thúc"), load);
      return;
    }
    const token = ++revision;
    loading(panel);
    try {
      const data = initialData?.kpi ? initialData : await request("/api/" + role + "/dashboard?" + new URLSearchParams(query()));
      initialData = null;
      if (token !== revision) return;
      panel.removeAttribute("aria-busy");
      const cards = el("div", { class: "row g-3 mb-4" });
      for (const [key, v] of Object.entries(data.kpi)) {
        cards.append(el("div", { class: "col-12 col-sm-6 col-xl-3" }, el("div", { class: "card p-3 h-100" }, el("p", { class: "text-secondary small mb-2" }, kpis[key] || key), el("strong", { class: "fs-4" }, ["revenue", "average_order_value"].includes(key) ? money(v) : key === "cancellation_rate" ? (100 * Number(v)).toFixed(1) + "%" : Number(v || 0).toLocaleString("vi-VN")))));
      }
      if (role === "manager") {
        data.support = Object.entries(data.support).map(([label, value]) => ({ label: { conversations: "Hội thoại", open_conversations: "Đang mở", new_conversations: "Mới", messages: "Tin nhắn", unread_conversations: "Chưa đọc" }[label] || label, value }));
        data.cancellation = data.trend.map((r) => ({ label: r.label, value: r.orders ? Math.round(100 * r.cancelled / r.orders) : 0 }));
      }
      const grid = el("div", { class: "row g-4" });
      for (const [key, title] of Object.entries(charts)) {
        if (!Array.isArray(data[key])) continue;
        const card = el("section", { class: "card h-100 p-3" }, el("h2", { class: "h6 mb-4" }, title)), rows = data[key], max = Math.max(1, ...rows.map((r) => Number(r.value) || 0));
        if (!rows.length) card.append(el("p", { class: "text-secondary py-5 text-center" }, "Chưa có dữ liệu trong khoảng thời gian này"));
        for (const r of rows) card.append(el("div", { class: "console-chart" }, el("span", {}, meta.states[r.label] || String(r.label)), el("meter", { min: 0, max, value: Number(r.value) || 0, title: Number(r.value || 0).toLocaleString("vi-VN"), "aria-label": title + ": " + r.label }, r.value), el("strong", {}, Number(r.value || 0).toLocaleString("vi-VN"))));
        grid.append(el("div", { class: "col-12 col-xl-6" }, card));
      }
      panel.replaceChildren(cards, grid);
    } catch (error) {
      if (token === revision) errorPanel(panel, error, load);
    }
  }
  form.addEventListener("change", load);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    load();
  });
  visibility();
  await load();
}
export {
  dashboard
};
