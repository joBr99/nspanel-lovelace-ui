"use strict";
const $ = id => document.getElementById(id);
let config = null, revision, selected, cardTypes = [], dirty = false, yamlMode = false, preview;
const unsafeKeys = new Set(["__proto__", "constructor", "prototype"]);
function element(tag, text, cls) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (cls) node.className = cls;
  return node;
}
function message(text, error = false) { $("message").textContent = text; $("message").classList.toggle("error", error); }
function changed() { dirty = true; $("dirty").textContent = "Unsaved changes"; }
async function api(path, body) {
  const response = await fetch(`api/${path}`, body === undefined ? {} : {
    method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(body)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
  return data;
}
function action(text, callback, cls) {
  const button = element("button", text, cls);
  button.type = "button";
  button.onclick = async () => {
    button.disabled = true;
    try { await callback(); } catch (error) { message(error.message, true); }
    finally { button.disabled = false; }
  };
  return button;
}
function field(parent, object, key, title, options) {
  const label = element("label", title);
  const input = element(options ? "select" : "input");
  if (options) for (const value of options) {
    const option = element("option", value); option.value = value; input.append(option);
  }
  input.value = object[key] ?? (options ? options[0] : "");
  input.onchange = () => { if (input.value === "") delete object[key]; else object[key] = input.value; changed(); };
  label.append(input); parent.append(label);
}
function advanced(parent, object, title = "Advanced options (JSON)") {
  const details = element("details"), summary = element("summary", title), input = element("textarea");
  input.setAttribute("aria-label", title);
  details.append(summary, input);
  details.ontoggle = () => { if (details.open) input.value = JSON.stringify(object, null, 2); };
  details.append(action("Apply advanced options to draft", () => {
    const replacement = JSON.parse(input.value);
    if (!replacement || Array.isArray(replacement) || typeof replacement !== "object") throw new Error("Expected a JSON object.");
    if (Object.keys(replacement).some(key => unsafeKeys.has(key))) throw new Error("Reserved property name.");
    for (const key of Object.keys(object)) delete object[key];
    Object.assign(object, replacement); changed(); render();
  }));
  parent.append(details);
}
function entities(parent, card) {
  const list = element("div"); parent.append(list);
  for (const [index, entity] of (card.entities || []).entries()) {
    const row = element("div", undefined, "entity-row");
    field(row, entity, "entity", "Entity ID"); field(row, entity, "name", "Display name");
    row.append(action("Remove", () => { card.entities.splice(index, 1); changed(); render(); }));
    list.append(row);
  }
  parent.append(action("+ Add entity", () => { (card.entities ||= []).push({entity: ""}); changed(); render(); }));
}
function renderCards(parent, panel, key, title) {
  parent.append(element("h2", title));
  for (const [index, card] of (panel[key] || []).entries()) {
    const box = element("article", undefined, "card"), heading = element("div", undefined, "card-heading");
    heading.append(element("h3", card.title || card.type));
    const controls = element("div", undefined, "actions");
    if (index) controls.append(action("↑", () => {
      [panel[key][index - 1], panel[key][index]] = [panel[key][index], panel[key][index - 1]]; changed(); render();
    }));
    controls.append(action("Delete card", () => {
      if (confirm("Remove this card from the draft?")) { panel[key].splice(index, 1); changed(); render(); }
    }));
    heading.append(controls); box.append(heading);
    const fields = element("div", undefined, "fields");
    field(fields, card, "type", "Card type", cardTypes); field(fields, card, "title", "Title");
    field(fields, card, "key", "Navigation key"); field(fields, card, "entity", "Main entity (media, climate, alarm)");
    box.append(fields); entities(box, card); advanced(box, card); parent.append(box);
  }
  parent.append(action("+ Add card", () => { (panel[key] ||= []).push({type: "cardEntities", title: "New card", entities: []}); changed(); render(); }));
}
function render() {
  const nav = $("panels"), view = $("visual"); nav.replaceChildren(); view.replaceChildren();
  if (!config || !config.nspanels || Array.isArray(config.nspanels) || typeof config.nspanels !== "object") {
    view.append(element("p", "Use the YAML editor or import a configuration to get started.")); return;
  }
  const names = Object.keys(config.nspanels);
  if (!Object.hasOwn(config.nspanels, selected)) selected = names[0];
  for (const name of names) {
    const button = action(name, () => { selected = name; render(); });
    button.setAttribute("aria-pressed", String(name === selected)); nav.append(button);
  }
  if (!selected) { view.append(element("h2", "A home for every panel"), element("p", "Add a panel or import your existing configuration.")); return; }
  const panel = config.nspanels[selected];
  if (!panel || typeof panel !== "object" || Array.isArray(panel)) { view.append(element("p", "Invalid panel. Fix it in the YAML editor.")); return; }
  const heading = element("div", undefined, "section-title"); heading.append(element("h2", selected));
  heading.append(action("Delete panel", () => {
    if (confirm(`Remove ${selected} from the draft?`)) { delete config.nspanels[selected]; changed(); render(); }
  })); view.append(heading);
  const fields = element("div", undefined, "fields");
  for (const [key, title] of [["panelRecvTopic", "Receive topic"], ["panelSendTopic", "Send topic"], ["locale", "Locale"], ["timeZone", "Time zone"], ["timeFormat", "Time format"], ["dateFormat", "Date format"]]) field(fields, panel, key, title);
  field(fields, panel, "model", "Panel model", ["eu", "us-p", "us-l"]); view.append(fields);
  advanced(view, panel, "All panel options (JSON)");
  renderCards(view, panel, "cards", "Cards"); renderCards(view, panel, "hiddenCards", "Hidden cards");
  view.append(element("h2", "Screensaver"));
  const screen = element("div", undefined, "card"); panel.screensaver ||= {};
  entities(screen, panel.screensaver); advanced(screen, panel.screensaver); view.append(screen);
}
async function draftYaml() { return yamlMode ? $("yaml").value : (await api("serialize", {config})).yaml; }
async function visualMode() {
  if (yamlMode) config = (await api("parse", {yaml: $("yaml").value})).config;
  yamlMode = false; $("yaml-view").hidden = true; $("visual").hidden = false;
  $("visual-tab").setAttribute("aria-pressed", "true"); $("yaml-tab").setAttribute("aria-pressed", "false"); render();
}
async function load() {
  const data = await api("config"); revision = data.revision; cardTypes = data.cardTypes;
  $("yaml").value = data.yaml; yamlMode = true;
  try { await visualMode(); } catch (error) {
    $("yaml-view").hidden = false; $("visual").hidden = true;
    message(`Configuration needs repair: ${error.message}`, true); return;
  }
  dirty = false; $("dirty").textContent = ""; message("Configuration loaded. Changes stay in your draft until saved.");
}
function bind(id, fn) { $(id).onclick = async () => { try { await fn(); } catch (error) { message(error.message, true); } }; }
bind("visual-tab", visualMode);
bind("yaml-tab", async () => {
  $("yaml").value = await draftYaml(); yamlMode = true; $("visual").hidden = true; $("yaml-view").hidden = false;
  $("visual-tab").setAttribute("aria-pressed", "false"); $("yaml-tab").setAttribute("aria-pressed", "true");
});
$("yaml").oninput = changed;
bind("reload", async () => { if (!dirty || confirm("Discard unsaved changes and reload?")) await load(); });
bind("save", async () => {
  $("save").disabled = true;
  try {
    const data = await api("config", {yaml: await draftYaml(), revision}); revision = data.revision;
    dirty = false; $("dirty").textContent = ""; message("Saved. The panel backend will reload. Previous configuration: panels.yaml.bak.");
  } finally { $("save").disabled = false; }
});
bind("export", async () => {
  const url = URL.createObjectURL(new Blob([await draftYaml()], {type: "text/yaml"}));
  const link = element("a"); link.href = url; link.download = "panels.yaml"; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
});
bind("add-panel", async () => {
  await visualMode(); const name = prompt("Panel name"); if (!name) return;
  if (unsafeKeys.has(name) || Object.hasOwn(config.nspanels || {}, name)) throw new Error("Choose a unique panel name.");
  (config.nspanels ||= {})[name] = {panelRecvTopic: `tele/${name}/RESULT`, panelSendTopic: `cmnd/${name}/CustomSend`, model: "eu", locale: "en_US", timeZone: "Europe/Berlin", timeFormat: "%H:%M", dateFormat: "full", cards: [], screensaver: {entities: []}};
  selected = name; changed(); render();
});
function clearPreview() { preview = null; $("import-result").textContent = ""; $("import-merge").hidden = true; $("import-replace").hidden = true; }
bind("import-open", () => { clearPreview(); $("import-dialog").showModal(); });
bind("import-cancel", () => $("import-dialog").close());
$("import-yaml").oninput = clearPreview;
$("file").onchange = async event => {
  const file = event.target.files[0]; if (!file) return; clearPreview();
  if (file.size > 1024 * 1024) { $("import-result").textContent = "File exceeds 1 MiB."; return; }
  $("import-yaml").value = await file.text();
};
bind("preview-import", async () => {
  clearPreview();
  try {
    preview = await api("import", {yaml: $("import-yaml").value});
    $("import-result").textContent = `${preview.format}: ${Object.keys(preview.config.nspanels || {}).join(", ")}\n${preview.warnings.join("\n")}\n${preview.errors.map(e => `Fix before saving: ${e}`).join("\n")}`;
    $("import-merge").hidden = false; $("import-replace").hidden = false;
  } catch (error) { $("import-result").textContent = error.message; }
});
async function applyImport(merge) {
  if (!preview) return;
  let next = structuredClone(preview.config);
  if (merge) {
    const existing = yamlMode ? (await api("parse", {yaml: $("yaml").value})).config : config;
    const collisions = Object.keys(next.nspanels).filter(name => Object.hasOwn(existing.nspanels || {}, name));
    if (collisions.length) throw new Error(`Panel names already exist: ${collisions.join(", ")}. Rename them in the import YAML or replace the draft.`);
    next = {...existing, nspanels: {...existing.nspanels, ...next.nspanels}};
  } else if (!confirm("Replace the entire draft, including connection settings, with this import?")) return;
  config = next; $("yaml").value = (await api("serialize", {config})).yaml; yamlMode = true;
  // Keep migration errors editable without requiring the visual form to understand invalid values.
  $("yaml-view").hidden = false; $("visual").hidden = true;
  $("visual-tab").setAttribute("aria-pressed", "false"); $("yaml-tab").setAttribute("aria-pressed", "true");
  changed(); $("import-dialog").close(); message("Import added to draft. Review YAML and migration warnings before saving.");
}
for (const [id, merge] of [["import-merge", true], ["import-replace", false]]) {
  bind(id, async () => {
    try { await applyImport(merge); }
    catch (error) { $("import-result").textContent = error.message; }
  });
}
window.addEventListener("beforeunload", event => { if (dirty) { event.preventDefault(); event.returnValue = ""; } });
load().catch(error => message(error.message, true));
