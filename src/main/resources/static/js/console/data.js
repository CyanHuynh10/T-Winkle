import { tableCell, rowActions, compactActions, dateTime, quantityCell } from "./table.js";
import { $, el, request, button, field, input, select, loading, errorPanel, pagination, modal, confirmAction, notice, money } from "./core.js";
import { editor } from "./editor.js";
import { exportButtons } from "./exports.js";
const orderStatuses = ["Chờ xác nhận đơn hàng", "Đã xác nhận", "Đang chuẩn bị đơn hàng", "Đơn hàng đã sẵn sàng", "Đang giao", "Đã giao", "Đã hủy"];
const orderStyles = {"Chờ xác nhận đơn hàng":"waiting","Đã xác nhận":"confirmed","Đang chuẩn bị đơn hàng":"preparing","Đơn hàng đã sẵn sàng":"ready","Đang giao":"shipping","Đã giao":"delivered","Đã hủy":"cancelled"};
function nextStatus(status, mode, method, payment) {
  const sequence = orderStatuses.filter((s) => s !== "Đã hủy" && (mode !== "PICKUP" || s !== "Đang giao"));
  const i = sequence.indexOf(status), next = i < 0 ? void 0 : sequence[i + 1];
  return next === "Đã xác nhận" && method === "BANKING" && payment !== "PAID" ? void 0 : next;
}
const extraLabels = { email: "Email", full_name: "Họ tên", roles: "Quyền", is_enabled: "Hoạt động", is_active: "Hoạt động", assigned_store: "Cửa hàng", manager_email: "Manager", manager_enabled: "Tài khoản Manager", store: "Cửa hàng", stores: "Các cửa hàng", store_count: "Số cửa hàng", inventory_count: "Dòng tồn kho", order_count: "Số đơn", product_count: "Số sản phẩm", city: "Thành phố", customer: "Khách hàng", amount: "Số tiền", method: "Phương thức", verification_status: "Xác minh", reported_at: "Ngày báo", scope: "Phạm vi", priority: "Ưu tiên", discount_type: "Loại giảm", discount_value: "Giá trị giảm", starts_at: "Bắt đầu", ends_at: "Kết thúc", code: "Mã", used_count: "Đã dùng", usage_limit: "Tổng lượt", per_user_limit: "Lượt / khách", pending_requests: "Yêu cầu chờ", old_quantity: "Tồn cũ", quantity_delta: "Thay đổi", new_quantity: "Tồn mới", movement_type: "Loại biến động", performed_by: "Nhân viên", actor_email: "Nhân viên", action_type: "Thao tác", entity_type: "Đối tượng", entity_id: "ID", summary: "Nội dung", user_email: "Khách hàng", total: "Tổng tiền", fulfillments: "Giao hàng theo cửa hàng", payment: "Thanh toán", review_note: "Ghi chú duyệt" };
function value(key, v, meta) {
  if (key === "status" && orderStyles[v]) return el("span", { class: "order-status " + orderStyles[v] }, v);
  if (v === null || v === void 0 || v === "") return "—";
  if (key === "image_url" || key === "logo_url") {
    if (typeof v === "string" && /^(https:\/\/|\/(?!\/))/.test(v)) return el("img", { src: v, alt: "Ảnh", width: 100, height: 100, style: "object-fit:contain" });
    return "—";
  }
  if (key === "roles") return String(v).replaceAll("ROLE_ADMIN","Admin").replaceAll("ROLE_MANAGER","Manager").replaceAll("ROLE_SUPPORT","Support").replaceAll("ROLE_USER","User");
  if (key === "refund_status") return { COMPLETED: "Hoàn tiền", PENDING: "Chờ hoàn tiền", FAILED: "Hoàn tiền thất bại" }[v] || v;
  if (key.endsWith("_at")) return dateTime(v);
  if (typeof v === "boolean") return v ? "Hoạt động" : "Ngừng";
  if (/price|amount|total|merchandise_value/.test(key) && !Number.isNaN(Number(v))) return money(v);
  if (key.includes("status") || key === "replenishment_state") return el("span", { class: "badge border text-dark bg-light" }, meta.states[String(v)] || String(v));
  return meta.states[String(v)] || String(v);
}
function details(row, meta) {
  const labels = { ...meta.labels, ...extraLabels }, dl = el("dl", { class: "console-detail" });
  for (const [key, v] of Object.entries(row)) {
    if (["inventory_store_id","availability_style"].includes(key)) continue; // Internal presentation marker, not a detail field.
    let item;
    if (Array.isArray(v)) item = v.length ? el("div", {}, ...v.map((child) => typeof child === "object" && child ? el("div", { class: "border rounded p-3 my-2" }, details(child, meta)) : el("p", {}, String(child)))) : "—";
    else if (typeof v === "object" && v) item = details(v, meta);
    else if (key === "requested_data") {
      try {
        item = details(JSON.parse(v), meta);
      } catch {
        item = String(v);
      }
    } else item = value(key, v, meta);
    dl.append(el("dt", {}, labels[key] || key), el("dd", {}, item));
  }
  return dl;
}
async function dataPage(root, role, initial, meta) {
  if (initial === "store-profile") return storeProfile(root, meta);
  const labels = { ...meta.labels, ...extraLabels, replenishment_state: "Nhập hàng" }, admin = role === "admin", base = "/api/" + role + "/";
  let area = initial === "history" ? "audit" : initial, page = 0, sort = "id", direction = "desc", revision = 0, data, visible = [], initialData = window.twConsoleInitial;
  window.twConsoleInitial = null;
  const tabs = el("div", { class: "console-actions mb-3" }), tools = el("div", { class: "console-actions mb-3" }), filters = el("form", { class: "console-filters" }), columns = el("details", { class: "mb-3" }, el("summary", { class: "btn btn-sm btn-outline-secondary" }, "Cột hiển thị")), panel = el("div"), pager = el("div");
  root.replaceChildren(tabs, tools, filters, columns, panel, pager);
  function getColumns() {
    if (area === "payments") return admin ? ["order_code", "stores", "customer", "amount", "method", "status", "refund_status", "cancellation_status", "verification_status", "reported_at", "reviewed_by", "review_note"] : ["order_code", "amount", "method", "status", "refund_status", "verification_status", "reported_at", "reviewed_by", "review_note"];
    if (area === "reports") return ["store", "manager", "report_type", "file_name", "row_count", "filter_snapshot", "file_size", "sent_at"];
    return (admin ? meta.adminColumns : meta.managerColumns)[area] || [];
  }
  function query() {
    return Object.fromEntries(new FormData(filters));
  }
  function columnLabel(key) {
    return area === "inventory" && key === "status" ? "Nhập hàng" : labels[key] || key;
  }
  function addSelect(name, label, options) {
    const control = select(name, [["", "Tất cả"], ...options.map((o) => Array.isArray(o) ? o : [o, meta.states[o] || o])]);
    filters.append(field(label, control));
    return control;
  }
  function addInput(name, label, type = "text") {
    const control = input(name, type, "", { maxlength: 150 });
    filters.append(field(label, control));
    return control;
  }
  async function configure() {
    revision++;
    data = void 0;
    loading(panel);
    page = 0;
    sort = "id";
    direction = "desc";
    visible = [...getColumns()];
    filters.replaceChildren();
    tools.replaceChildren();
    columns.replaceChildren(el("summary", { class: "btn btn-sm btn-outline-secondary" }, "Cột hiển thị"));
    addInput("search", "Tìm kiếm", "search");
    if (area !== "reports") addSelect("status", "Trạng thái", area === "orders" ? orderStatuses : area === "inventory" ? [["OUT", "Hết tồn kho"], ["LOW", "Cần nhập hàng"], ["AVAILABLE", "Đủ ngưỡng nhập"]] : area === "payments" ? ["PENDING", "PAID", "FAILED", "REFUNDED"] : area.includes("requests") ? ["PENDING", "APPROVED", "APPLIED", "FULFILLED", "REJECTED"] : area === "stores" ? ["OPEN", "CLOSED"] : ["ACTIVE", "INACTIVE"]);
    if (admin && ["inventory", "orders", "payments", "catalog-requests", "restock-requests", "inventory-movements", "reports"].includes(area)) {
      const stores = await request("/api/admin/options?kind=stores");
      addSelect("storeId", "Cửa hàng", stores.map((s) => [s.id, s.name]));
    }
    if (!admin && area !== "payments") {
      const sortControl = select("sort", [["id", "ID"], ["name", "Tên"], ["quantity", "Số lượng"], ["updated_at", "Cập nhật"]], sort);
      const directionControl = select("direction", [["desc", "Giảm dần"], ["asc", "Tăng dần"]], direction);
      sortControl.addEventListener("change", () => {
        sort = sortControl.value;
      });
      directionControl.addEventListener("change", () => {
        direction = directionControl.value;
      });
      filters.append(field("Sắp xếp", sortControl), field("Thứ tự", directionControl));
    }
    if (area === "users") addSelect("role", "Quyền", ["ROLE_USER", "ROLE_MANAGER", "ROLE_SUPPORT", "ROLE_ADMIN"]);
    if (["orders", "payments"].includes(area)) addSelect("method", "Thanh toán", ["COD", "BANKING"]);
    if (area === "payments") addSelect("verificationStatus", "Xác minh", ["PENDING", "CONFIRMED", "REJECTED"]);
    if (area === "orders") addSelect("paymentStatus", "Trạng thái thanh toán", ["PENDING", "PAID", "FAILED", "REFUNDED"]);
    if (area === "catalog-requests") addSelect("requestType", "Loại yêu cầu", ["ADD_PRODUCT", "UPDATE_PRODUCT", "REMOVE_PRODUCT", "ADD_VARIANT", "UPDATE_VARIANT", "REMOVE_VARIANT"]);
    if (!admin && area === "products") {
      addInput("brand", "Slug thương hiệu");
      addInput("category", "Slug danh mục");
    }
    if (!admin && ["variants", "inventory"].includes(area)) {
      addInput("sizeFilter", "Lọc size");
      addInput("color", "Lọc màu");
      addSelect("pending", "Yêu cầu chờ", [["true", "Đang chờ"], ["false", "Không có"]]);
    }
    if (["orders", "payments"].includes(area) || admin && !["users", "inventory", "variants", "reports"].includes(area)) {
      addInput("fromDate", "Từ ngày", "date");
      addInput("toDate", "Đến ngày", "date");
    }
    tools.append(button("Tải lại", load));
    if (admin && meta.fields[area]) tools.append(button("Thêm mới", () => editor(area, void 0, meta, load), "primary"));
    if (!admin && ["products", "variants"].includes(area)) tools.append(button("Yêu cầu thêm " + (area === "products" ? "sản phẩm" : "biến thể"), () => catalog(area === "products" ? "ADD_PRODUCT" : "ADD_VARIANT"), "primary"));
    if (!admin && ["products", "inventory", "orders", "payments"].includes(area)) tools.append(exportButtons(area.toUpperCase(), () => ({ ...query(), sort, direction }), () => area === "payments" ? visible : ["index", ...visible]));
    if (area === "payments") tools.prepend(el("p", { class: "alert alert-warning w-100" }, "Xác nhận thanh toán áp dụng cho toàn bộ đơn hàng. Chỉ xác nhận sau khi kiểm tra đã nhận tiền."));
    const choice = el("div", { class: "d-flex flex-wrap gap-3 p-3 border rounded bg-white" });
    for (const k of getColumns()) {
      const check = input(k, "checkbox", "", { checked: true, class: "form-check-input me-1", "aria-label": "Hiển thị cột " + columnLabel(k) });
      check.addEventListener("change", () => {
        visible = getColumns().filter((c) => c === k ? check.checked : visible.includes(c));
        render();
      });
      choice.append(el("label", {}, check, columnLabel(k)));
    }
    columns.append(choice);
    await load();
  }
  async function load() {
    const token = ++revision;
    loading(panel);
    try {
      const q = new URLSearchParams({ ...query(), page: String(page), size: "30", sort, direction });
      const result = initialData?.items ? initialData : await request(base + area + "?" + q);
      initialData = null;
      if (token !== revision) return;
      data = result;
      render();
    } catch (error) {
      if (token === revision) errorPanel(panel, error, load);
    }
  }
  function render() {
    panel.removeAttribute("aria-busy");
    const head = el("tr", {}, el("th", { scope: "col" }, "STT"), ...visible.map((k) => el("th", { scope: "col" }, button(columnLabel(k) + (sort === k ? direction === "asc" ? " ↑" : " ↓" : ""), () => {
      sort = k === "availability" ? "quantity" : !admin && k === "product" ? "name" : k;
      direction = direction === "asc" ? "desc" : "asc";
      const sortControl = filters.querySelector('[name="sort"]'), directionControl = filters.querySelector('[name="direction"]');
      if (sortControl) sortControl.value = sort;
      if (directionControl) directionControl.value = direction;
      page = 0;
      return load();
    }, "link"))), el("th", { scope: "col" }, "Thao tác")), tbody = el("tbody");
    for (const [i, row] of (data?.items || []).entries()) {
      tbody.append(el("tr", {}, tableCell("id", page * 30 + i + 1), ...visible.map((k) => tableCell(k, quantityCell(k,row[k],row,area,role) || (area === "inventory" && k === "status" || k === "replenishment_state" ? el("span", {class:"badge border text-dark bg-light"}, role === "manager" && area === "variants" && row.inventory_store_id == null ? "Không kinh doanh" : row[k] === "AVAILABLE" ? "Đủ ngưỡng nhập" : "Cần nhập hàng") : value(k, k === "status" ? row.display_status || row[k] : row[k], meta)))), el("td", {class:"tw-cell-actions"}, actions(row))));
    }
    if (!data?.items?.length) tbody.append(el("tr", {}, el("td", { class: "p-5 text-center text-secondary", colspan: visible.length + 2 }, "Không có dữ liệu phù hợp. Thử thay đổi tìm kiếm hoặc bộ lọc")));
    panel.replaceChildren(el("div", { class: "card table-responsive" }, el("table", { class: "table table-hover tw-console-table" }, el("thead", {}, head), tbody)));
    pager.replaceChildren(pagination(page, data?.total || 0, 30, (n) => {
      page = n;
      return load();
    }));
  }
  async function full(row) {
    if (admin && !["inventory", "payments", "reports"].includes(area) || !admin && ["products", "variants", "orders"].includes(area)) return request(base + area + "/" + encodeURIComponent(row.id));
    return row;
  }
  function actions(row) {
    const group = rowActions(button("Chi tiết", async () => {
      const record = await full(row), body = el("div", {}, details(record, meta));
      if (area === "orders") await orderActions(body, record);
      modal("Chi tiết " + (record.name || record.order_code || ""), body);
    }));
    const box = group.querySelector(".console-actions");
    if (admin && meta.fields[area]) box.append(button("Sửa", async () => editor(area, await full(row), meta, load)));
    if (area === "reports") box.append(el("a", { class: "btn btn-sm btn-outline-secondary", href: `/api/admin/reports/${row.id}/download` }, "Tải xuống"));
    if (admin && area === "users") box.append(button("Đặt lại mật khẩu mặc định", () => simpleAction(row, "reset-default-password")));
    if (admin && ["users", "stores", "products", "variants", "categories", "brands"].includes(area)) box.append(button("Xóa", () => simpleAction(row, "delete"), "outline-danger"));
    if (admin && ["promotions", "coupons"].includes(area)) box.append(button("Ngừng", () => simpleAction(row, "deactivate"), "outline-danger"));
    if (admin && area.includes("requests") && row.status === "PENDING" || area === "payments" && row.method === "BANKING" && row.status === "PENDING") box.append(button(area === "payments" ? "Xác minh" : "Duyệt", () => review(row, true), "primary"), button("Từ chối", () => review(row, false), "outline-danger", { disabled: area === "payments" && row.verification_status !== "PENDING" }));
    if (admin && area === "inventory") box.append(button("Điều chỉnh", () => confirmAction("Điều chỉnh tồn kho", [field("Số lượng", input("quantity", "number", row.quantity, { min: 0, required: true })), field("Lý do", el("textarea", { class: "form-control", name: "reason", maxlength: 1e3, required: true }))], async (f) => {
      await request(`/api/admin/inventory/${row.store_id}/${row.variant_id}/adjust`, { quantity: Number(f.get("quantity")), reason: f.get("reason"), type: "MANUAL_ADJUSTMENT" });
      await load();
    })));
    if (!admin && ["products", "variants"].includes(area)) box.append(button("Yêu cầu chỉnh sửa", () => catalog(area === "products" ? "UPDATE_PRODUCT" : "UPDATE_VARIANT", row)), button("Yêu cầu ngừng kinh doanh", () => catalog(area === "products" ? "REMOVE_PRODUCT" : "REMOVE_VARIANT", row)));
    if (!admin && area === "inventory" && row.replenishment_state !== "AVAILABLE") box.append(button("Báo Admin", () => confirmAction("Báo Admin nhập hàng", [el("p", {}, `${row.product} · ${row.sku} · Hiện có ${row.quantity} · Ngưỡng ${row.reorder_level}`), field("Số lượng đề nghị", input("requestedQuantity", "number", 20, { min: 1, max: 1e6, required: true })), field("Lý do", el("textarea", { class: "form-control", name: "reason", maxlength: 1e3, required: true })), field("Ghi chú", el("textarea", { class: "form-control", name: "note", maxlength: 1e3 }))], async (f) => {
      await request("/api/manager/restock-requests", { variantId: row.id, requestedQuantity: Number(f.get("requestedQuantity")), reason: f.get("reason"), note: f.get("note") });
      await load();
    }), "primary", { disabled: !!row.pending_request }));
    return compactActions(group);
  }
  async function simpleAction(row, kind) {
    await confirmAction(kind === "reset-default-password" ? "Đặt lại mật khẩu mặc định" : kind === "delete" ? "Xóa dữ liệu đã chọn" : "Ngừng hoạt động", [el("p", {}, row.name || row.email || row.id)], async () => {
      await request(base + area + "/" + encodeURIComponent(row.id) + "/" + kind, {});
      await load();
    });
  }
  async function review(row, approve) {
    await confirmAction(approve ? area === "payments" ? "Xác minh đã nhận tiền" : "Duyệt yêu cầu" : "Từ chối yêu cầu", [field("Ghi chú duyệt", el("textarea", { class: "form-control", name: "note", maxlength: 1e3, required: true }))], async (f) => {
      await request(base + area + "/" + row.id + "/review", { approve, note: f.get("note") });
      await load();
    });
  }
  async function catalog(requestType, row) {
    const fields = [], product = requestType.endsWith("PRODUCT"), remove = requestType.startsWith("REMOVE");
    if (requestType === "ADD_VARIANT") fields.push(field("Product ID", input("productId", "number", "", { required: true, min: 1 })));
    if (!remove) {
      if (product) {
        fields.push(field("Tên đề xuất", input("name", "text", "", { required: true, maxlength: 180 })), field("Giá cơ bản đề xuất", input("basePrice", "number", "", { min: 0, step: "any", required: requestType === "ADD_PRODUCT" })));
        for (const kind of ["brands", "categories"]) {
          const options = await request("/api/manager/catalog-options?kind=" + kind);
          fields.push(field(kind === "brands" ? "Thương hiệu" : "Danh mục", select(kind === "brands" ? "brandId" : "categoryId", [["", "Không đề xuất thay đổi"], ...options.map((o) => [o.id, o.name])])));
        }
        fields.push(field("Slug đề xuất", input("slug", "text", "", { maxlength: 180 })), field("Đường dẫn ảnh đề xuất", input("imageUrl", "text", "", { maxlength: 500 })), field("Mô tả", el("textarea", { class: "form-control", name: "description", maxlength: 4e3 })));
      } else {
        for (const [key, label] of [["size", "Size"], ["color", "Màu"], ["priceAdjustment", "Điều chỉnh giá"]]) fields.push(field(label, input(key, key === "priceAdjustment" ? "number" : "text", "", { required: requestType === "ADD_VARIANT" && key !== "priceAdjustment", min: key === "priceAdjustment" ? 0 : void 0, maxlength: key === "size" ? 50 : 80 })));
      }
    }
    fields.push(field("Lý do", el("textarea", { class: "form-control", name: "reason", required: true, maxlength: 1e3 })));
    await confirmAction(meta.states[requestType], fields, async (f) => {
      const body = { ...Object.fromEntries(f), requestType, productId: area === "products" ? row?.id : row?.product_id || Number(f.get("productId")) || void 0, variantId: requestType.endsWith("VARIANT") && !requestType.startsWith("ADD") ? row?.id : void 0 };
      for (const key of ["basePrice", "priceAdjustment", "brandId", "categoryId"]) if (key in body) body[key] = body[key] === "" ? void 0 : Number(body[key]);
      await request("/api/manager/catalog-requests", body);
      await load();
    });
  }
  async function orderActions(body, order) {
    const pending = order.cancellation?.some((c) => c.status === "PENDING"), refund = order.refunds?.some((r) => r.status === "PENDING");
    if (pending || refund) {
      const paid = order.payment_method === "BANKING" && (order.payment_status === "PAID" || order.payment?.some((p) => p.status === "PAID"));
      const decide = (approve) => {
        const fields = [field("Ghi chú xử lý hủy", el("textarea", { class: "form-control", name: "note", required: true, maxlength: 500 }))];
        if (approve && paid) fields.push(field("Tôi xác nhận đã chuyển khoản hoàn tiền cho khách hàng", input("refundTransferred", "checkbox", "true", { class: "form-check-input", required: refund })), field("Mã giao dịch hoàn tiền", input("reference", "text", "", { maxlength: 150 })));
        return confirmAction(approve ? "Xác nhận hủy / hoàn tiền" : "Từ chối yêu cầu hủy", fields, async (f) => {
          await request(base + "orders/" + order.id + "/cancellation", { approve, refundTransferred: f.get("refundTransferred") === "true", reference: f.get("reference") || "", note: f.get("note") });
          await load();
        });
      };
      body.append(el("div", { class: "border rounded p-3 my-3" }, el("p", {}, paid ? "Chuyển khoản được hoàn thủ công. Chỉ xác nhận sau khi đã thực hiện chuyển tiền." : "Hủy đơn sẽ hoàn lại tồn kho đúng một lần."), button(refund ? "Xác nhận hoàn tiền" : "Xác nhận hủy", () => decide(true), "primary"), pending ? button("Từ chối hủy", () => decide(false)) : null));
    }
    if (pending) return;
    const fulfillments = admin ? order.fulfillments || [] : [{ status: order.fulfillment_status }];
    for (const f of fulfillments) {
      const target = nextStatus(f.status, order.fulfillment_mode, order.payment_method, order.payment_status);
      if (target) body.append(button((f.store ? f.store + ": " : "") + target, () => confirmAction("Cập nhật giao hàng tại cửa hàng", [el("p", {}, target)], async () => {
        await request(base + "orders/" + order.id + (admin ? "/transition" : "/status"), admin ? { storeId: f.store_id, status: target } : { status: target });
        await load();
      }), "primary"));
    }
  }
  if (["products", "variants", "inventory"].includes(initial)) {
    const options = [initial, ...initial === "inventory" ? admin ? ["restock-requests", "inventory-movements"] : ["restock-requests"] : ["catalog-requests"]];
    for (const name of options) tabs.append(button({ [initial]: "Danh sách", "catalog-requests": "Yêu cầu danh mục", "restock-requests": "Yêu cầu nhập hàng", "inventory-movements": "Lịch sử tồn kho" }[name], async () => {
      area = name;
      await configure();
    }));
  }
  let timer;
  filters.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      page = 0;
      load();
    }, 300);
  });
  filters.addEventListener("submit", (e) => {
    e.preventDefault();
    clearTimeout(timer);
    page = 0;
    load();
  });
  await configure();
  const id = Number(location.pathname.split("/")[3]);
  if (id && ["products", "orders"].includes(initial)) {
    const record = await full({ id }), body = el("div", {}, details(record, meta));
    if (initial === "orders") await orderActions(body, record);
    modal("Chi tiết", body);
  }
}
async function storeProfile(root, meta) {
  const data = await request("/api/manager/store"), form = el("form", { class: "card p-4", style: "max-width:850px" });
  const fields = [["name", "Tên cửa hàng", 180], ["phone", "Số điện thoại", 20], ["addressLine", "Địa chỉ", 200], ["ward", "Phường", 100], ["district", "Quận", 100], ["city", "Thành phố", 100], ["imageUrl", "Đường dẫn ảnh (HTTPS hoặc nội bộ)", 500]];
  for (const [key, label, max] of fields) form.append(field(label, input(key, "text", data[key.replace(/[A-Z]/g, (c) => "_" + c.toLowerCase())] || "", { maxlength: max, required: ["name", "addressLine", "city"].includes(key) })));
  form.append(field("Mô tả", el("textarea", { class: "form-control", name: "description", maxlength: 500, rows: 5 }, data.description || "")), field("Trạng thái hoạt động", select("status", [["OPEN", "Đang mở"], ["CLOSED", "Đã đóng"]], data.status)), el("button", { type: "submit", class: "btn btn-primary" }, "Lưu hồ sơ"));
  root.replaceChildren(form, el("div", { class: "card p-4 mt-3" }, details({ store_id: data.store_id, slug: data.slug, manager_email: data.manager_email, rating_average: data.rating_average, review_count: data.review_count, created_at: data.created_at }, meta)));
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const b = $("button[type=submit]", form);
    b.disabled = true;
    try {
      const body = Object.fromEntries(new FormData(form)), status = body.status;
      delete body.status;
      await request("/api/manager/store", body);
      await request("/api/manager/store/status", { status });
      notice("Đã cập nhật hồ sơ cửa hàng");
    } catch (e2) {
      notice(e2.message, true);
    } finally {
      b.disabled = false;
    }
  });
}
export {
  dataPage,
  details,
  nextStatus,
  orderStatuses,
  value
};
