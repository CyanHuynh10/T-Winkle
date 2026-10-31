import { $, request, errorPanel } from "./core.js";
const root = $("#console-content"), role = document.body.dataset.role, page = document.body.dataset.page || "";
async function start() {
  if ($("#conversation-app")) {
    root?.replaceChildren();
    const { chat } = await import("./chat.js");
    await chat($("#conversation-app"), role);
    return;
  }
  if (!root) return;
  if (page === "reviews") {
    const { reviews } = await import("./reviews.js");
    await reviews(root, role);
    return;
  }
  const meta = await request("/js/console/metadata.json");
  if (page === "" || page === "dashboard") {
    const { dashboard } = await import("./dashboard.js");
    await dashboard(root, role, meta);
  } else {
    const { dataPage } = await import("./data.js");
    await dataPage(root, role, page, meta);
  }
}
start().catch((error) => root ? errorPanel(root, error, start) : console.error(error));
