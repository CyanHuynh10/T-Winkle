import { $, el, request, button, field, input, select, modal, notice } from "./core.js";
const snake = (s) => s.replace(/[A-Z]/g, (c) => "_" + c.toLowerCase());
async function editor(area, row, meta, saved) {
  const definitions = meta.fields[area], values = {};
  for (const f of definitions) {
    let v = row?.[snake(f.key)] ?? (area === "stores" && f.key === "status" ? "OPEN" : meta.defaults[f.key]) ?? "";
    if (f.key === "enabled") v = row?.is_enabled ?? true;
    if (f.key === "active") v = row?.is_active ?? true;
    if (area === "brands" && f.key === "imageUrl") v = row?.logo_url ?? "";
    if (area === "products" && f.key === "imageUrl") v = row?.images?.find((i) => i.is_primary)?.image_url ?? "";
    if (f.key === "roles") v = typeof row?.roles === "string" ? row.roles.split(",") : meta.defaults.roles;
    if (f.key === "supportStoreIds") v = row?.support_store_ids ?? [];
    if (f.key === "targets") v = row?.targets ?? [];
    if (f.type === "datetime-local" && v) v = String(v).slice(0, 16);
    values[f.key] = Array.isArray(v) ? [...v] : v;
  }
  const form = el("form"), container = el("div");
  let close;
  async function choice(kind, key, multiple = false, required = false) {
    const known = /* @__PURE__ */ new Map(), wrap = el("div"), list = el("div", { class: "border rounded p-2 mt-2", style: "max-height:220px;overflow:auto" }), search = input("optionSearch", "search", "", { placeholder: "Tìm đối tượng…", "aria-label": "Tìm " + kind, maxlength: 150 });
    let revision = 0;
    if (kind !== "roles") wrap.append(search);
    wrap.append(list);
    for (const o of row?.support_stores || []) known.set(String(o.id), o);
    async function load() {
      const version = ++revision;
      try {
        const items = await request("/api/admin/options?" + new URLSearchParams({ kind, search: search.value }));
        if (version !== revision) return;
        items.forEach((o) => known.set(String(kind === "roles" ? o.name : o.id), o));
        list.replaceChildren();
        if (multiple) {
          const selected = (values[key] || []).map(String), all = [...items, ...[...known.values()].filter((o) => !items.some((n) => String(n.id) === String(o.id)) && selected.includes(String(o.id)))];
          for (const o of all) {
            const id = String(kind === "roles" ? o.name : o.id), check = input(key, "checkbox", id, { checked: selected.includes(id), class: "form-check-input me-2" });
            check.addEventListener("change", () => {
              const current = (values[key] || []).map(String);
              values[key] = check.checked ? [...current, id] : current.filter((v) => v !== id);
              if (key === "roles") updateVisibility();
            });
            list.append(el("label", { class: "d-block py-1" }, check, o.name));
          }
          for (const id of selected) if (!known.has(id)) list.append(el("p", { class: "small" }, "Đã chọn ID " + id));
        } else {
          const options = [["", "Chọn…"], ...items.map((o) => [o.id, o.name])];
          if (values[key] && !items.some((o) => String(o.id) === String(values[key]))) options.push([values[key], values[key]]);
          const control = select(key, options, values[key], { required });
          control.addEventListener("change", () => values[key] = control.value);
          list.append(control);
        }
      } catch (e) {
        list.replaceChildren(el("p", { role: "alert" }, e.message), button("Thử lại", load));
      }
    }
    let timer;
    search.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(load, 250);
    });
    await load();
    return wrap;
  }
  let supportWrap, targetWrap;
  function updateVisibility() {
    if (supportWrap) supportWrap.hidden = !(values.enabled && values.roles?.includes("ROLE_SUPPORT"));
  }
  async function draw() {
    container.replaceChildren();
    for (const f of definitions) {
      const wrap = el("div", { class: "mb-3" }, el("div", { class: "small fw-semibold mb-1" }, f.label + (f.required ? " *" : "")));
      container.append(wrap);
      if (f.type === "supportStores") {
        supportWrap = wrap;
        wrap.append(await choice("stores", f.key, true));
        updateVisibility();
        continue;
      }
      if (f.type === "roles") {
        wrap.append(await choice("roles", f.key, true, true));
        continue;
      }
      if (f.type === "targets") {
        targetWrap = wrap;
        await drawTargets();
        continue;
      }
      if (f.options) {
        wrap.append(await choice(f.options, f.key, false, f.required));
        continue;
      }
      let control;
      if (f.values) control = select(f.key, f.values.map((v) => [v, meta.states[v] || v]), values[f.key], { required: f.required });
      else if (f.key === "description") control = el("textarea", { class: "form-control", name: f.key, maxlength: f.max, rows: 4 }, values[f.key]);
      else control = input(f.key, f.type || "text", f.type === "checkbox" ? "true" : values[f.key], { required: f.required, maxlength: f.max, min: f.type === "number" ? 0 : void 0, step: f.type === "number" ? "any" : void 0, checked: f.type === "checkbox" ? !!values[f.key] : void 0, class: f.type === "checkbox" ? "form-check-input" : "form-control", disabled: !!row && (f.key === "email" || f.key === "productId") });
      control.addEventListener("input", () => {
        values[f.key] = f.type === "checkbox" ? control.checked : control.value;
        if (f.key === "enabled") updateVisibility();
      });
      control.addEventListener("change", async () => {
        values[f.key] = f.type === "checkbox" ? control.checked : control.value;
        if (f.key === "scope") {
          values.targets = [];
          await drawTargets();
        }
      });
      wrap.replaceChildren(field(f.label + (f.required ? " *" : ""), control));
    }
  }
  async function drawTargets() {
    if (!targetWrap) return;
    targetWrap.replaceChildren(el("div", { class: "small fw-semibold mb-1" }, "Đối tượng áp dụng"));
    if (values.scope === "GLOBAL") targetWrap.append(el("p", {}, "Tất cả mặt hàng."));
    else targetWrap.append(await choice({ STORE: "stores", CATEGORY: "categories", BRAND: "brands", PRODUCT: "products", VARIANT: "variants" }[values.scope] || "products", "targets", true, true));
  }
  form.append(el("p", { class: "text-secondary small" }, area === "users" && !row ? "Mật khẩu ban đầu của tài khoản là 123456" : "Kiểm tra thông tin trước khi lưu"), container);
  close = modal(row ? "Cập nhật" : "Thêm mới", form);
  await draw();
  const submit = el("button", { class: "btn btn-primary", type: "submit" }, "Lưu");
  form.append(submit);
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submit.disabled = true;
    try {
      const body = { ...values };
      for (const f of definitions) {
        if (f.type === "supportStores") body[f.key] = values.enabled && values.roles.includes("ROLE_SUPPORT") ? body[f.key].map(Number) : [];
        if (f.type === "number" || f.key.endsWith("Id")) body[f.key] = body[f.key] === "" ? null : Number(body[f.key]);
        if (f.type === "datetime-local" && body[f.key].length === 16) body[f.key] += ":00";
        if (f.type === "targets") body[f.key] = values.scope === "GLOBAL" ? [] : body[f.key].map(Number);
      }
      if (body.roles && !body.roles.length) throw Error("Cần chọn ít nhất một quyền");
      await request("/api/admin/" + area + (row ? "/" + encodeURIComponent(row.id) : ""), body);
      close();
      notice("Đã lưu");
      await saved();
    } catch (e2) {
      notice(e2.message, true);
    } finally {
      submit.disabled = false;
    }
  });
}
export {
  editor
};
