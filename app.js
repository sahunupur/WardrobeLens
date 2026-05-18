const STORAGE_KEY = "wardrobelens-v1";

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
  tryOnCanvas: document.querySelector("#tryOnCanvas"),
  tryOnEmpty: document.querySelector("#tryOnEmpty"),
  tryOnStatus: document.querySelector("#tryOnStatus"),
  photoLayer: document.querySelector("#photoLayer"),
  avatar: document.querySelector("#avatar"),
  rotateSlider: document.querySelector("#rotateSlider"),
  generateTryOnButton: document.querySelector("#generateTryOnButton"),
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
let renderToken = 0;

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
  const price = item.price ? ` - ${formatCurrency(item.price)}` : "";
  const visual = item.photo
    ? `<span class="thumb" style="background-image:url('${item.photo}')"></span>`
    : `<span class="swatch" style="background:${item.color}"></span>`;

  return `
    <article class="catalog-card">
      <div class="catalog-main">
        ${visual}
        <div>
          <h3>${escapeHtml(item.name)}</h3>
          <p>${type.label} - ${item.vibe} - Size ${escapeHtml(item.size || "not set")}</p>
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
            <p>${look.items.length} items - ${new Date(look.createdAt).toLocaleDateString()}</p>
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
          <p>${getType(item.type).label} - ${item.vibe}</p>
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
  markTryOnStale();
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
  markTryOnStale();
}

function markTryOnStale() {
  const stage = el.tryOnCanvas.closest(".preview-stage");
  stage.classList.remove("has-render");
  el.tryOnStatus.textContent = state.currentLook.length
    ? "Look ready. Generate a realistic local try-on when you want to preview it."
    : "Select apparel or ask for a recommendation before generating a try-on.";
}

async function generateTryOn() {
  const token = ++renderToken;
  const stage = el.tryOnCanvas.closest(".preview-stage");
  const context = el.tryOnCanvas.getContext("2d");
  const view = getViewFromAngle(Number(el.rotateSlider.value));
  const userPhoto = state.profile.photos?.[view] || state.profile.photos?.front || "";
  const slots = Object.fromEntries(state.currentLook.map((item) => [getType(item.type).slot, item]));

  el.tryOnStatus.innerHTML = "<strong>Generating local try-on...</strong> Blending your photo with selected apparel.";
  context.clearRect(0, 0, el.tryOnCanvas.width, el.tryOnCanvas.height);

  await drawStudioBase(context, userPhoto);
  if (token !== renderToken) return;

  drawBodyGuide(context, Boolean(userPhoto));
  await drawLookLayers(context, slots);
  if (token !== renderToken) return;

  drawFinish(context);
  stage.classList.add("has-render");
  el.tryOnStatus.innerHTML = userPhoto
    ? "<strong>Try-on generated.</strong> This is a local visual composite. A production AI model can replace this renderer for photorealistic output."
    : "<strong>Try-on generated with a model guide.</strong> Add your front/back/side photos for a more personal preview.";
}

async function drawStudioBase(context, userPhoto) {
  const { width, height } = context.canvas;
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#faf8f3");
  gradient.addColorStop(0.55, "#f3f6f1");
  gradient.addColorStop(1, "#eee7dd");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  if (!userPhoto) return;

  const image = await loadImage(userPhoto);
  if (!image) return;
  drawImageCover(context, image, 0, 0, width, height);
  context.fillStyle = "rgba(250, 248, 243, 0.24)";
  context.fillRect(0, 0, width, height);
}

function drawBodyGuide(context, hasPhoto) {
  const alpha = hasPhoto ? 0.18 : 0.86;
  context.save();
  context.globalAlpha = alpha;
  context.fillStyle = "#d6a17d";
  roundedPath(context, 392, 105, 116, 132, 54);
  context.fill();

  context.fillStyle = "#b97855";
  roundedPath(context, 370, 820, 58, 238, 26);
  context.fill();
  roundedPath(context, 472, 820, 58, 238, 26);
  context.fill();

  context.fillStyle = "rgba(28, 35, 31, 0.16)";
  ellipse(context, 450, 1084, 190, 28);
  context.fill();
  context.restore();
}

async function drawLookLayers(context, slots) {
  const dress = slots.dress;
  const upper = dress || slots.upper;
  const bottom = slots.bottom;

  if (dress) {
    await drawGarment(context, dress, dressPath, "#7b3150");
  } else {
    if (upper) await drawGarment(context, upper, upperPath, "#496b50");
    if (bottom) await drawGarment(context, bottom, (ctx) => bottomPath(ctx, bottom.type), "#242429");
  }

  if (slots.layer) await drawGarment(context, slots.layer, jacketPath, "#6683a5", 0.82);
  if (slots.head) await drawGarment(context, slots.head, headPath, "#f2ead8", 0.9);
  if (slots.jewelry) await drawAccessory(context, slots.jewelry, "jewelry");
  if (slots.watch) await drawAccessory(context, slots.watch, "watch");
  if (slots.bag) await drawAccessory(context, slots.bag, "bag");
  if (slots.shoe) await drawAccessory(context, slots.shoe, "shoe");
}

async function drawGarment(context, item, pathBuilder, fallback, opacity = 0.9) {
  context.save();
  context.shadowColor = "rgba(28, 35, 31, 0.24)";
  context.shadowBlur = 28;
  context.shadowOffsetY = 18;
  pathBuilder(context);
  context.fillStyle = item.color || fallback;
  context.globalAlpha = opacity;
  context.fill();
  context.restore();

  context.save();
  pathBuilder(context);
  context.clip();
  const image = item.photo ? await loadImage(item.photo) : null;
  if (image) {
    context.globalAlpha = 0.74;
    drawImageCover(context, image, 235, 260, 430, 610);
  }
  context.globalCompositeOperation = "soft-light";
  const sheen = context.createLinearGradient(245, 250, 625, 830);
  sheen.addColorStop(0, "rgba(255, 255, 255, 0.55)");
  sheen.addColorStop(0.42, "rgba(255, 255, 255, 0.04)");
  sheen.addColorStop(1, "rgba(0, 0, 0, 0.36)");
  context.fillStyle = sheen;
  context.fillRect(200, 220, 500, 690);
  context.restore();

  context.save();
  context.globalAlpha = 0.28;
  context.strokeStyle = "rgba(255, 255, 255, 0.8)";
  context.lineWidth = 2;
  pathBuilder(context);
  context.stroke();
  context.restore();
}

async function drawAccessory(context, item, slot) {
  context.save();
  context.fillStyle = item.color || "#c39742";
  context.strokeStyle = item.color || "#c39742";
  context.lineWidth = 12;
  context.shadowColor = "rgba(28, 35, 31, 0.2)";
  context.shadowBlur = 16;
  context.shadowOffsetY = 8;

  if (slot === "jewelry") {
    context.beginPath();
    context.arc(450, 277, 64, 0.2, Math.PI - 0.2);
    context.stroke();
  }
  if (slot === "watch") {
    ellipse(context, 645, 518, 26, 26);
    context.fill();
  }
  if (slot === "bag") {
    roundedPath(context, 628, 500, 118, 154, 22);
    context.fill();
  }
  if (slot === "shoe") {
    roundedPath(context, 322, 1040, 128, 34, 18);
    context.fill();
    roundedPath(context, 452, 1040, 128, 34, 18);
    context.fill();
  }
  context.restore();

  if (item.photo && ["bag", "shoe"].includes(slot)) {
    const image = await loadImage(item.photo);
    if (!image) return;
    context.save();
    context.globalAlpha = 0.68;
    if (slot === "bag") drawImageCover(context, image, 628, 500, 118, 154);
    if (slot === "shoe") drawImageCover(context, image, 322, 1018, 258, 70);
    context.restore();
  }
}

function drawFinish(context) {
  const { width, height } = context.canvas;
  const vignette = context.createRadialGradient(width / 2, height / 2, 200, width / 2, height / 2, 720);
  vignette.addColorStop(0, "rgba(255,255,255,0)");
  vignette.addColorStop(1, "rgba(28,35,31,0.16)");
  context.fillStyle = vignette;
  context.fillRect(0, 0, width, height);
}

function dressPath(context) {
  context.beginPath();
  context.moveTo(334, 278);
  context.bezierCurveTo(380, 246, 522, 246, 566, 278);
  context.lineTo(645, 840);
  context.bezierCurveTo(560, 900, 340, 900, 255, 840);
  context.closePath();
}

function upperPath(context) {
  roundedPath(context, 318, 282, 264, 258, 72);
}

function jacketPath(context) {
  context.beginPath();
  context.moveTo(284, 275);
  context.bezierCurveTo(325, 236, 575, 236, 616, 275);
  context.lineTo(642, 602);
  context.lineTo(562, 620);
  context.lineTo(544, 336);
  context.lineTo(356, 336);
  context.lineTo(338, 620);
  context.lineTo(258, 602);
  context.closePath();
}

function bottomPath(context, type) {
  context.beginPath();
  context.moveTo(318, 530);
  context.lineTo(582, 530);
  if (["jeans", "trouser"].includes(type)) {
    context.lineTo(548, 1015);
    context.lineTo(466, 1015);
    context.lineTo(450, 646);
    context.lineTo(432, 1015);
    context.lineTo(350, 1015);
    context.closePath();
    return;
  }
  const hem = type === "longSkirt" ? 920 : type === "skort" || type === "shorts" ? 675 : 820;
  context.lineTo(650, hem);
  context.bezierCurveTo(565, hem + 42, 335, hem + 42, 250, hem);
  context.closePath();
}

function headPath(context) {
  roundedPath(context, 356, 92, 188, 54, 28);
}

function roundedPath(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.lineTo(x + width - r, y);
  context.quadraticCurveTo(x + width, y, x + width, y + r);
  context.lineTo(x + width, y + height - r);
  context.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  context.lineTo(x + r, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - r);
  context.lineTo(x, y + r);
  context.quadraticCurveTo(x, y, x + r, y);
  context.closePath();
}

function ellipse(context, x, y, width, height) {
  context.beginPath();
  context.ellipse(x, y, width / 2, height / 2, 0, 0, Math.PI * 2);
}

function drawImageCover(context, image, x, y, width, height) {
  const scale = Math.max(width / image.width, height / image.height);
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  const sourceX = (image.width - sourceWidth) / 2;
  const sourceY = (image.height - sourceHeight) / 2;
  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
}

function loadImage(source) {
  return new Promise((resolve) => {
    if (!source) {
      resolve(null);
      return;
    }
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () => resolve(null));
    image.src = source;
  });
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
  closeDialog(el.wearDialog);
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
          <p>${getType(item.type).label} - ${item.vibe} - ${escapeHtml(item.size || "size not set")}</p>
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
  el.generateTryOnButton.addEventListener("click", generateTryOn);
  el.saveLookButton.addEventListener("click", saveCurrentLook);
  el.unknownBrand.addEventListener("change", () => {
    el.itemBrand.disabled = el.unknownBrand.checked;
    if (el.unknownBrand.checked) el.itemBrand.value = "";
  });
}

init();
