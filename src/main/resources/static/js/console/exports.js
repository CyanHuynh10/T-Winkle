import { el, request, button, modal, field, input, notice } from "./core.js";
function fileReady(file) {
  const body = el("div", {}, el("p", {}, `${file.filename} · ${file.rowCount ?? ""} dòng · ${Math.ceil(file.fileSize / 1024)} KB`), el("a", { class: "btn btn-outline-secondary me-2", href: `/api/manager/exports/${file.id}/download` }, "Tải xuống"));
  body.append(button("Gửi cho Admin", async (e) => {
    const target = e.currentTarget;
    await request(`/api/manager/exports/${file.id}/send`, {});
    notice("Đã gửi báo cáo cho Admin");
    target.textContent = "Đã gửi cho Admin";
  }, "primary"));
  modal("Báo cáo đã sẵn sàng", body);
}
function exportButtons(type, query, columns) {
  return el("div", { class: "console-actions" }, button("Xuất Excel", async () => fileReady(await request("/api/manager/exports/prepare", { type, query: query(), columns: columns() }))), button("Xuất hóa đơn", () => {
    let close;
    const code = input("orderCode", "text", "", { required: true, maxlength: 50, placeholder: "Nhập mã đơn hàng…" }), form = el("form", {}, el("p", { class: "small text-secondary" }, "Chỉ xuất phần hàng đã giao thuộc cửa hàng bạn quản lý."), field("Mã đơn hàng", code), el("button", { class: "btn btn-primary", type: "submit" }, "Xuất"));
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submit = form.querySelector("button");
      submit.disabled = true;
      try {
        const file = await request("/api/manager/invoices/prepare", { orderCode: code.value.trim() });
        fileReady(file);
      } catch (e2) {
        notice(e2.message, true);
      } finally {
        submit.disabled = false;
      }
    });
    close = modal("Xuất hóa đơn PDF", form);
  }));
}
export {
  exportButtons,
  fileReady
};
