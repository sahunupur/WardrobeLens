const STORAGE_KEY = "wardrobe-stylist-v2";

const measurementDefs = [
  { key: "height", label: "Height", units: ["cm", "in", "ft", "m"] },
  { key: "weight", label: "Weight", units: ["kg", "lb"] },
  { key: "bust", label: "Bust / chest", units: ["cm", "in"] },
  { key: "waist", label: "Waist", units: ["cm", "in"] },
  { key: "hips", label: "Hips", units: ["cm", "in"] },
  { key: "shoulder", label: "Shoulder", units: ["cm", "in"] },
  { key: "inseam", label: "Inseam", units: ["cm", "in"] },
  { key: "shoe", label: "Shoe size", units: ["US", "UK", "EU", "cm"] },
];

const apparelTypes = [
  { value: "dress", label: "Dress", slot: "dress" },
  { value: "slitDress", label: "Slit dress", slot: "dress" },
  { value: "onePiece", label: "One piece", slot: "dress" },
  { value: "shirt", label: "Shirt", slot: "upper" },
  { value: "tshirt", label: "T-shirt", slot: "upper" },
  { value: "top", label: "Top", slot: "upper" },
  { value: "jacket", label: "Jacket", slot: "layer" },
  { value: "coat", label: "Coat", slot: "layer" },
  { value: "skirt", label: "Skirt", slot: "bottom" },
  { value: "longSkirt", label: "Long skirt", slot: "bottom" },
  { value: "skort", label: "Skort", slot: "bottom" },
  { value: "jeans", label: "Jeans", slot: "bottom" },
  { value: "trouser", label: "Trouser", slot: "bottom" },
  { value: "shorts", label: "Shorts", slot: "bottom" },
  { value: "innerwear", label: "Innerwear", slot: "innerwear" },
  { value: "bra", label: "Bra", slot: "innerwear" },
  { value: "panty", label: "Panty", slot: "innerwear" },
  { value: "underwear", label: "Underwear", slot: "innerwear" },
  { value: "hat", label: "Hat", slot: "head" },
  { value: "headband", label: "Headband", slot: "head" },
  { value: "clip", label: "Hair clip", slot: "head" },
  { value: "shoe", label: "Shoe", slot: "shoe" },
  { value: "jewelry", label: "Jewelry", slot: "jewelry" },
  { value: "watch", label: "Watch", slot: "watch" },
  { value: "purse", label: "Purse", slot: "bag" },
  { value: "clutch", label: "Clutch", slot: "bag" },
  { value: "bag", label: "Bag", slot: "bag" },
];

const defaultState = {
  registered: false,
  profile: {
    name: "",
    gender: "",
    measurements: {},
    photos: { front: "", back: "", left: "", right: "" },
  },
  catalog: [],
  currentLook: [],
  savedLooks: [],
};

const demoCatalog = [
  makeItem("Forest wrap shirt", "shirt", "#496b50", "office", "M", "Local boutique", "", ""),
  makeItem("Black long skirt", "longSkirt", "#242429", "formal", "M", "Unknown", "", ""),
  makeItem("Cropped denim jacket", "jacket", "#6683a5", "casual", "M", "Levi style", "", ""),
  makeItem("Wine slit dress", "slitDress", "#7b3150", "party", "S", "Unknown", "", ""),
  makeItem("Gold clutch", "clutch", "#c39742", "party", "", "Unknown", "", ""),
  makeItem("Pearl headband", "headband", "#f2ead8", "formal", "", "Unknown", "", ""),
  makeItem("White sneakers", "shoe", "#ece8dd", "travel", "7", "Unknown", "", ""),
  makeItem("Silver watch", "watch", "#b7bec2", "office", "", "Unknown", "", ""),
];

const el = {
  registrationView: document.querySelector("#registrationView"),
  dashboardView: document.querySelector("#dashboardView"),
  registrationForm: document.querySelector("#registrationForm"),
  measurementInputs: document.querySelector("#measurementInputs"),
  regName: document.querySelector("#regName"),
  regGender: document.querySelector("#regGender"),
  photoFront: document.querySelector("#photoFront"),
  photoBack: document.querySelector("#photoBack"),
  photoLeft: document.querySelector("#photoLeft"),
  photoRight: document.querySelector("#photoRight"),
  loadDemo: document.querySelector("#loadDemo"),
  welcomeTitle: document.querySelector("#welcomeTitle"),
  editProfileButton: document.querySelector("#editProfileButton"),
  resetApp: document.querySelector("#resetApp"),
  catalogCount: document.querySelector("#catalogCount"),
  savedLookCount: document.querySelector("#savedLookCount"),
  profileCompleteness: document.querySelector("#profileCompleteness"),
  catalogList: document.querySelector("#catalogList"),
  savedLooksList: document.querySelector("#savedLooksList"),
  currentLookList: document.querySelector("#currentLookList"),
  previewTitle: document.querySelector("#previewTitle"),
  photoLayer: document.querySelector("#photoLayer"),
  avatar: document.querySelector("#avatar"),
  rotateSlider: document.querySelector("#rotateSlider"),
  angleLabel: document.querySelector("#angleLabel"),
  saveLookButton: document.querySelector("#saveLookButton"),
  apparelDialog: document.querySelector("#apparelDialog"),
  apparelForm: document.querySelector("#apparelForm"),
  itemName: document.querySelector("#itemName"),
  itemType: document.querySelector("#itemType"),
  itemSize: document.querySelector("#itemSize"),
  itemColor: document.querySelector("#itemColor"),
  itemBrand: document.querySelector("#itemBrand"),
  unknownBrand: document.querySelector("#unknownBrand"),
  itemPrice: document.querySelector("#itemPrice"),
  itemVibe: document.querySelector("#itemVibe"),
  itemPhoto: document.querySelector("#itemPhoto"),
  wearDialog: document.querySelector("#wearDialog"),
  wearForm: document.querySelector("#wearForm"),
  occasion: document.querySelector("#occasion"),
  weather: document.querySelector("#weather"),
  occasionNotes: document.querySelector("#occasionNotes"),
  recommendationText: document.querySelector("#recommendationText"),
  lookDialog: document.querySelector("#lookDialog"),
  lookForm: document.querySelector("#lookForm"),
  lookPicker: document.querySelector("#lookPicker"),
  hatWear: document.querySelector("#hatWear"),
  headWear: document.querySelector("#headWear"),
  jewelryWear: document.querySelector("#jewelryWear"),
  upperWear: document.querySelector("#upperWear"),
  jacketWear: document.querySelector("#jacketWear"),
  dressWear: document.querySelector("#dressWear"),
  bottomWear: document.querySelector("#bottomWear"),
  watchWear: document.querySelector("#watchWear"),
  bagWear: document.querySelector("#bagWear"),
  shoeWear: document.querySelector("#shoeWear"),
};

let state = loadState();

function makeItem(name, type, color, vibe, size, brand, price, photo) {
  return {
    id: crypto.randomUUID(),
    name,
    type,
    color,
    vibe,
    size,
    brand,
    price,
    photo,
    createdAt: new Date().toISOString(),
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...structuredClone(defaultState), ...JSON.parse(raw) } : structuredClone(defaultState);
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getType(type) {
  return apparelTypes.find((item) => item.value === type) || apparelTypes[0];
}

function getItemsBySlot(slot) {
  return state.catalog.filter((item) => getType(item.type).slot === slot);
}

function init() {
  renderMeasurementInputs();
  renderTypeOptions();
  bindEvents();
  render();
}

function renderMeasurementInputs() {
  el.measurementInputs.innerHTML = measurementDefs
    .map((measurement) => `
      <label>
        ${measurement.label}
        <span class="measurement-row">
          <input id="measure-${measurement.key}" type="number" step="0.01" min="0" placeholder="0.00" />
          <select id="unit-${measurement.key}">
            ${measurement.units.map((unit) => `<option value="${unit}">${unit}</option>`).join("")}
          </select>
        </span>
      </label>
    `)
    .join("");
}

function renderTypeOptions() {
  el.itemType.innerHTML = apparelTypes
    .map((type) => `<option value="${type.value}">${type.label}</option>`)
    .join("");
}

function render() {
  renderShell();
  if (state.registered) {
    renderDashboard();
  }
}

function renderShell() {
  el.registrationView.classList.toggle("hidden", state.registered);
  el.dashboardView.classList.toggle("hidden", !state.registered);
}

function renderDashboard() {
  el.welcomeTitle.textContent = `${state.profile.name || "Your"} wardrobe`;
  el.catalogCount.textContent = state.catalog.length;
  el.savedLookCount.textContent = state.savedLooks.length;
  el.profileCompleteness.textContent = `${getProfileCompleteness()}%`;
  renderCatalog();
  renderSavedLooks();
  renderCurrentLook();
  renderPreview();
}

function getProfileCompleteness() {
  const measurements = Object.values(state.profile.measurements || {}).filter((value) => value?.amount).length;
  const photos = Object.values(state.profile.photos || {}).filter(Boolean).length;
  const base = state.profile.name && state.profile.gender ? 25 : 0;
  return Math.min(100, base + measurements * 6 + photos * 7);
}

function renderCatalog() {
  if (!state.catalog.length) {
    el.catalogList.innerHTML = `<p class="empty-state">No apparel yet. Add your first item to build the catalog.</p>`;
    return;
  }

  el.catalogList.innerHTML = state.catalog
    .map((item) => catalogCard(item))
    .join("");

  el.catalogList.querySelectorAll("[data-remove-item]").forEach((button) => {
    button.addEventListener("click", () => removeItem(button.dataset.removeItem));
  });
}

function catalogCard(item) {
  const type = getType(item.type);
  const brand = item.brand || "Brand not known";
  const price = item.price ? ` · ${formatCurrency(item.price)}` : "";
  const visual = item.photo
    ? `<span class="thumb" style="background-image:url('${item.photo}')"></span>`
    : `<span class="swatch" style="background:${item.color}"></span>`;

  return `
    <article class="catalog-card">
      <div class="catalog-main">
        ${visual}
        <div>
          <h3>${escapeHtml(item.name)}</h3>
          <p>${type.label} · ${item.vibe} · Size ${escapeHtml(item.size || "not set")}</p>
          <p>${escapeHtml(brand)}${price}</p>
        </div>
      </div>
      <button class="small-danger" type="button" data-remove-item="${item.id}" aria-label="Remove ${escapeHtml(item.name)}">X</button>
    </article>
  `;
}

function renderSavedLooks() {
  if (!state.savedLooks.length) {
    el.savedLooksList.innerHTML = `<p class="empty-state">Saved outfits will appear here.</p>`;
    return;
  }

  el.savedLooksList.innerHTML = state.savedLooks
    .map((look) => `
      <article class="saved-card">
        <div class="saved-main">
          <span class="swatch" style="background:${look.color || "#6f8f72"}"></span>
          <div>
            <h3>${escapeHtml(look.name)}</h3>
            <p>${look.items.length} items · ${new Date(look.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <button class="ghost-button" type="button" data-load-look="${look.id}">Use</button>
      </article>
    `)
    .join("");

  el.savedLooksList.querySelectorAll("[data-load-look]").forEach((button) => {
    button.addEventListener("click", () => {
      const look = state.savedLooks.find((saved) => saved.id === button.dataset.loadLook);
      state.currentLook = look ? look.items.map((id) => state.catalog.find((item) => item.id === id)).filter(Boolean) : [];
      saveState();
      renderDashboard();
    });
  });
}

function renderCurrentLook() {
  if (!state.currentLook.length) {
    el.currentLookList.innerHTML = `<p class="empty-state">No active look. Ask for a recommendation or create your own.</p>`;
    return;
  }

  el.currentLookList.innerHTML = state.currentLook
    .map((item) => `
      <article class="look-row">
        <span class="swatch" style="background:${item.color}"></span>
        <div>
          <h3>${escapeHtml(item.name)}</h3>
          <p>${getType(item.type).label} · ${item.vibe}</p>
        </div>
      </article>
    `)
    .join("");
}

function renderPreview() {
  const slots = Object.fromEntries(state.currentLook.map((item) => [getType(item.type).slot, item]));
  const dress = slots.dress;
  const upper = dress || slots.upper;
  const bottom = slots.bottom;

  el.previewTitle.textContent = state.currentLook.length ? "Current look" : "Preview";
  el.upperWear.style.background = upper?.color || "#6f8f72";
  el.upperWear.style.opacity = dress ? "0" : "1";
  el.bottomWear.style.background = bottom?.color || "#8d3f5e";
  el.bottomWear.style.opacity = dress ? "0" : "1";
  el.bottomWear.style.height = bottom ? bottomHeight(bottom.type) : "122px";
  el.bottomWear.style.clipPath = bottomClip(bottom?.type);

  el.dressWear.style.opacity = dress ? "1" : "0";
  el.dressWear.style.background = dress?.color || "#8d3f5e";
  el.jacketWear.style.opacity = slots.layer ? "1" : "0";
  el.jacketWear.style.borderColor = slots.layer?.color || "#6d91af";
  el.hatWear.style.opacity = slots.head && slots.head.type === "hat" ? "1" : "0";
  el.hatWear.style.background = slots.head?.color || "#c39742";
  el.headWear.style.opacity = slots.head && slots.head.type !== "hat" ? "1" : "0";
  el.headWear.style.background = slots.head?.color || "#c39742";
  el.jewelryWear.style.opacity = slots.jewelry ? "1" : "0";
  el.jewelryWear.style.borderColor = slots.jewelry?.color || "#c39742";
  el.watchWear.style.opacity = slots.watch ? "1" : "0";
  el.watchWear.style.borderColor = slots.watch?.color || "#c39742";
  el.bagWear.style.opacity = slots.bag ? "1" : "0";
  el.bagWear.style.background = slots.bag?.color || "#c39742";
  el.shoeWear.style.opacity = slots.shoe ? "1" : "0";
  el.shoeWear.style.background = slots.shoe?.color || "#1c231f";
  updateRotation();
}

function bottomHeight(type) {
  if (type === "longSkirt") return "156px";
  if (type === "jeans" || type === "trouser") return "142px";
  if (type === "shorts" || type === "skort") return "88px";
  return "122px";
}

function bottomClip(type) {
  if (type === "jeans" || type === "trouser") {
    return "polygon(8% 0, 92% 0, 84% 100%, 58% 100%, 50% 28%, 42% 100%, 16% 100%)";
  }
  return "polygon(13% 0, 87% 0, 100% 100%, 0 100%)";
}

function updateRotation() {
  const angle = Number(el.rotateSlider.value);
  el.avatar.style.transform = `rotateY(${angle}deg)`;
  const view = getViewFromAngle(angle);
  el.angleLabel.textContent = view[0].toUpperCase() + view.slice(1);
  const photo = state.profile.photos?.[view];
  el.photoLayer.style.backgroundImage = photo ? `url("${photo}")` : "";
}

function getViewFromAngle(angle) {
  const normalized = ((angle % 360) + 360) % 360;
  if (normalized >= 315 || normalized < 45) return "front";
  if (normalized >= 45 && normalized < 135) return "right";
  if (normalized >= 135 && normalized < 225) return "back";
  return "left";
}

async function registerUser(event) {
  event.preventDefault();
  state.profile.name = el.regName.value.trim();
  state.profile.gender = el.regGender.value;
  state.profile.measurements = readMeasurements();
  state.profile.photos = {
    front: await readFile(el.photoFront.files?.[0]),
    back: await readFile(el.photoBack.files?.[0]),
    left: await readFile(el.photoLeft.files?.[0]),
    right: await readFile(el.photoRight.files?.[0]),
  };
  state.registered = true;
  if (!state.catalog.length) {
    state.catalog = structuredClone(demoCatalog);
  }
  saveState();
  render();
}

function readMeasurements() {
  return Object.fromEntries(
    measurementDefs.map((measurement) => {
      const amount = document.querySelector(`#measure-${measurement.key}`).value;
      const unit = document.querySelector(`#unit-${measurement.key}`).value;
      return [measurement.key, { amount, unit }];
    })
  );
}

async function addApparel(event) {
  event.preventDefault();
  const photo = await readFile(el.itemPhoto.files?.[0]);
  const item = makeItem(
    el.itemName.value.trim(),
    el.itemType.value,
    el.itemColor.value,
    el.itemVibe.value,
    el.itemSize.value.trim(),
    el.unknownBrand.checked ? "Unknown" : el.itemBrand.value.trim(),
    el.itemPrice.value,
    photo
  );
  state.catalog.unshift(item);
  saveState();
  el.apparelForm.reset();
  el.itemColor.value = "#6f8f72";
  closeDialog(el.apparelDialog);
  renderDashboard();
}

function recommendLook(event) {
  event.preventDefault();
  const occasion = el.occasion.value;
  const weather = el.weather.value;
  const notes = el.occasionNotes.value.toLowerCase();
  const scored = state.catalog
    .map((item) => ({ item, score: scoreItem(item, occasion, weather, notes) }))
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);

  const dress = scored.find((item) => getType(item.type).slot === "dress");
  const upper = scored.find((item) => getType(item.type).slot === "upper");
  const bottom = scored.find((item) => getType(item.type).slot === "bottom");
  const useDress = Boolean(dress && ["party", "formal", "date", "festive"].includes(occasion));
  const look = [];

  if (useDress) {
    look.push(dress);
  } else {
    if (upper) look.push(upper);
    if (bottom) look.push(bottom);
  }

  ["layer", "head", "jewelry", "watch", "bag", "shoe"].forEach((slot) => {
    const item = scored.find((candidate) => getType(candidate.type).slot === slot);
    if (item && shouldIncludeSlot(slot, occasion, weather)) look.push(item);
  });

  state.currentLook = uniqueItems(look);
  el.recommendationText.textContent = buildRecommendationText(state.currentLook, occasion, weather);
  saveState();
  renderDashboard();
}

function scoreItem(item, occasion, weather, notes) {
  const slot = getType(item.type).slot;
  let score = 0;
  if (item.vibe === occasion) score += 9;
  if (occasion === "office" && ["formal", "casual"].includes(item.vibe)) score += 3;
  if (occasion === "date" && ["party", "formal"].includes(item.vibe)) score += 4;
  if (occasion === "gym" && item.vibe === "sport") score += 10;
  if (weather === "cool" && slot === "layer") score += 7;
  if (weather === "rain" && ["layer", "shoe", "bag"].includes(slot)) score += 4;
  if (weather === "hot" && ["upper", "bottom", "dress"].includes(slot)) score += 2;
  if (notes && `${item.name} ${item.type} ${item.vibe}`.toLowerCase().includes(notes)) score += 5;
  if (slot === "innerwear") score -= 10;
  return score + colorScore(item.color, occasion);
}

function colorScore(color, occasion) {
  const value = Number.parseInt(color.replace("#", ""), 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  const brightness = (r + g + b) / 3;
  if (["formal", "office"].includes(occasion)) return brightness < 155 ? 3 : 1;
  if (["party", "date"].includes(occasion)) return r > g ? 2 : 0;
  if (occasion === "travel") return b > r ? 2 : 0;
  return 1;
}

function shouldIncludeSlot(slot, occasion, weather) {
  if (slot === "layer") return weather !== "hot" || occasion === "office";
  if (slot === "jewelry" || slot === "watch") return occasion !== "gym";
  if (slot === "head") return occasion !== "office" || weather === "hot";
  return true;
}

function buildRecommendationText(look, occasion, weather) {
  if (!look.length) return "Add apparel first so the stylist can recommend a complete look.";
  return `Recommended ${look.length} item look for ${occasion} in ${weather} weather: ${look.map((item) => item.name).join(", ")}.`;
}

function renderLookPicker() {
  if (!state.catalog.length) {
    el.lookPicker.innerHTML = `<p class="empty-state">Add apparel first, then build a look.</p>`;
    return;
  }

  const activeIds = new Set(state.currentLook.map((item) => item.id));
  el.lookPicker.innerHTML = state.catalog
    .map((item) => `
      <label class="apparel-option ${activeIds.has(item.id) ? "selected" : ""}">
        <input type="checkbox" value="${item.id}" ${activeIds.has(item.id) ? "checked" : ""} />
        <span class="swatch" style="background:${item.color}"></span>
        <span>
          <h3>${escapeHtml(item.name)}</h3>
          <p>${getType(item.type).label} · ${item.vibe} · ${escapeHtml(item.size || "size not set")}</p>
        </span>
      </label>
    `)
    .join("");

  el.lookPicker.querySelectorAll(".apparel-option input").forEach((input) => {
    input.addEventListener("change", () => {
      input.closest(".apparel-option").classList.toggle("selected", input.checked);
    });
  });
}

function useSelectedLook(event) {
  event.preventDefault();
  const selectedIds = [...el.lookPicker.querySelectorAll("input:checked")].map((input) => input.value);
  state.currentLook = selectedIds.map((id) => state.catalog.find((item) => item.id === id)).filter(Boolean);
  saveState();
  closeDialog(el.lookDialog);
  renderDashboard();
}

function saveCurrentLook() {
  if (!state.currentLook.length) return;
  const name = `Look ${state.savedLooks.length + 1}`;
  state.savedLooks.unshift({
    id: crypto.randomUUID(),
    name,
    items: state.currentLook.map((item) => item.id),
    color: state.currentLook[0]?.color,
    createdAt: new Date().toISOString(),
  });
  saveState();
  renderDashboard();
}

function removeItem(id) {
  state.catalog = state.catalog.filter((item) => item.id !== id);
  state.currentLook = state.currentLook.filter((item) => item.id !== id);
  state.savedLooks = state.savedLooks
    .map((look) => ({ ...look, items: look.items.filter((itemId) => itemId !== id) }))
    .filter((look) => look.items.length);
  saveState();
  renderDashboard();
}

function loadDemoProfile() {
  el.regName.value = "Maya";
  el.regGender.value = "female";
  const demoMeasurements = {
    height: ["168", "cm"],
    weight: ["58", "kg"],
    bust: ["86", "cm"],
    waist: ["68", "cm"],
    hips: ["94", "cm"],
    shoulder: ["38", "cm"],
    inseam: ["76", "cm"],
    shoe: ["7", "UK"],
  };
  Object.entries(demoMeasurements).forEach(([key, [amount, unit]]) => {
    document.querySelector(`#measure-${key}`).value = amount;
    document.querySelector(`#unit-${key}`).value = unit;
  });
}

function editProfile() {
  state.registered = false;
  saveState();
  renderShell();
  el.regName.value = state.profile.name;
  el.regGender.value = state.profile.gender;
  Object.entries(state.profile.measurements || {}).forEach(([key, value]) => {
    const amount = document.querySelector(`#measure-${key}`);
    const unit = document.querySelector(`#unit-${key}`);
    if (amount) amount.value = value.amount || "";
    if (unit) unit.value = value.unit || unit.value;
  });
}

function resetApp() {
  localStorage.removeItem(STORAGE_KEY);
  state = structuredClone(defaultState);
  renderMeasurementInputs();
  render();
}

function readFile(file) {
  return new Promise((resolve) => {
    if (!file) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.readAsDataURL(file);
  });
}

function uniqueItems(items) {
  return [...new Map(items.filter(Boolean).map((item) => [item.id, item])).values()];
}

function formatCurrency(value) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function openDialog(dialog) {
  if (typeof dialog.showModal === "function") dialog.showModal();
}

function closeDialog(dialog) {
  if (typeof dialog.close === "function") dialog.close();
}

function bindEvents() {
  el.registrationForm.addEventListener("submit", registerUser);
  el.loadDemo.addEventListener("click", loadDemoProfile);
  el.editProfileButton.addEventListener("click", editProfile);
  el.resetApp.addEventListener("click", resetApp);
  document.querySelector("#openAddApparel").addEventListener("click", () => openDialog(el.apparelDialog));
  document.querySelector("#openAddApparelSmall").addEventListener("click", () => openDialog(el.apparelDialog));
  document.querySelector("#openDecideWear").addEventListener("click", () => openDialog(el.wearDialog));
  document.querySelector("#openCreateLook").addEventListener("click", () => {
    renderLookPicker();
    openDialog(el.lookDialog);
  });
  document.querySelectorAll("[data-close-dialog]").forEach((button) => {
    button.addEventListener("click", () => closeDialog(button.closest("dialog")));
  });
  el.apparelForm.addEventListener("submit", addApparel);
  el.wearForm.addEventListener("submit", recommendLook);
  el.lookForm.addEventListener("submit", useSelectedLook);
  el.rotateSlider.addEventListener("input", updateRotation);
  el.saveLookButton.addEventListener("click", saveCurrentLook);
  el.unknownBrand.addEventListener("change", () => {
    el.itemBrand.disabled = el.unknownBrand.checked;
    if (el.unknownBrand.checked) el.itemBrand.value = "";
  });
}

init();
