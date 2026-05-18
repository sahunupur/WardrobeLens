const STORAGE_KEY = "wardrobe-stylist-state";

const categoryLabels = {
  tops: "top",
  shirts: "shirt",
  tshirts: "t-shirt",
  jackets: "jacket",
  skirts: "skirt",
  longSkirts: "long skirt",
  skorts: "skort",
  jeans: "jeans",
  onePieces: "one piece",
  innerwear: "innerwear",
  headbands: "headband",
  clips: "clips",
  clutches: "clutch",
  purses: "purse",
};

const outfitSlots = {
  upper: ["tops", "shirts", "tshirts"],
  lower: ["skirts", "longSkirts", "skorts", "jeans"],
  onePiece: ["onePieces"],
  layer: ["jackets"],
  accessory: ["headbands", "clips", "clutches", "purses"],
};

const defaultState = {
  profile: {
    name: "",
    photo: "",
    height: "",
    bust: "",
    waist: "",
    hips: "",
  },
  items: [
    { id: crypto.randomUUID(), name: "Ivory ribbed top", category: "tops", color: "#e9dfc9", vibe: "casual" },
    { id: crypto.randomUUID(), name: "Forest wrap shirt", category: "shirts", color: "#496b50", vibe: "office" },
    { id: crypto.randomUUID(), name: "Black long skirt", category: "longSkirts", color: "#252529", vibe: "formal" },
    { id: crypto.randomUUID(), name: "Blue straight jeans", category: "jeans", color: "#4f6f95", vibe: "travel" },
    { id: crypto.randomUUID(), name: "Wine evening one piece", category: "onePieces", color: "#783551", vibe: "party" },
    { id: crypto.randomUUID(), name: "Cropped denim jacket", category: "jackets", color: "#6683a5", vibe: "casual" },
    { id: crypto.randomUUID(), name: "Pearl headband", category: "headbands", color: "#f2ead8", vibe: "formal" },
    { id: crypto.randomUUID(), name: "Gold clutch", category: "clutches", color: "#c79a42", vibe: "party" },
  ],
  currentOutfit: [],
};

const elements = {
  profileForm: document.querySelector("#profileForm"),
  profileName: document.querySelector("#profileName"),
  profilePhoto: document.querySelector("#profilePhoto"),
  height: document.querySelector("#height"),
  bust: document.querySelector("#bust"),
  waist: document.querySelector("#waist"),
  hips: document.querySelector("#hips"),
  profileSummaryName: document.querySelector("#profileSummaryName"),
  profileSummaryMeasurements: document.querySelector("#profileSummaryMeasurements"),
  photoPreview: document.querySelector("#photoPreview"),
  itemForm: document.querySelector("#itemForm"),
  itemName: document.querySelector("#itemName"),
  itemCategory: document.querySelector("#itemCategory"),
  itemColor: document.querySelector("#itemColor"),
  itemVibe: document.querySelector("#itemVibe"),
  catalogList: document.querySelector("#catalogList"),
  itemCount: document.querySelector("#itemCount"),
  occasion: document.querySelector("#occasion"),
  weather: document.querySelector("#weather"),
  recommendButton: document.querySelector("#recommendButton"),
  recommendation: document.querySelector("#recommendation"),
  avatar: document.querySelector("#avatar"),
  rotateSlider: document.querySelector("#rotateSlider"),
  torsoWear: document.querySelector("#torsoWear"),
  jacketWear: document.querySelector("#jacketWear"),
  bottomWear: document.querySelector("#bottomWear"),
  hairBand: document.querySelector("#hairBand"),
  bagWear: document.querySelector("#bagWear"),
  resetApp: document.querySelector("#resetApp"),
};

let state = loadState();

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return structuredClone(defaultState);

  try {
    const parsed = JSON.parse(raw);
    return {
      profile: { ...defaultState.profile, ...parsed.profile },
      items: Array.isArray(parsed.items) ? parsed.items : defaultState.items,
      currentOutfit: Array.isArray(parsed.currentOutfit) ? parsed.currentOutfit : [],
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function render() {
  renderProfile();
  renderCatalog();
  renderRecommendation();
  renderOutfitPreview();
}

function renderProfile() {
  const { profile } = state;
  elements.profileName.value = profile.name;
  elements.height.value = profile.height;
  elements.bust.value = profile.bust;
  elements.waist.value = profile.waist;
  elements.hips.value = profile.hips;
  elements.profileSummaryName.textContent = profile.name || "Guest";

  const measurements = [
    profile.height && `${profile.height} cm`,
    profile.bust && `B ${profile.bust}`,
    profile.waist && `W ${profile.waist}`,
    profile.hips && `H ${profile.hips}`,
  ].filter(Boolean);

  elements.profileSummaryMeasurements.textContent = measurements.length
    ? measurements.join(" · ")
    : "Measurements pending";

  elements.photoPreview.style.backgroundImage = profile.photo
    ? `url("${profile.photo}")`
    : "";
}

function renderCatalog() {
  elements.itemCount.textContent = state.items.length;
  elements.catalogList.innerHTML = "";

  const grouped = [...state.items].sort((a, b) => a.category.localeCompare(b.category));
  grouped.forEach((item) => {
    const row = document.createElement("article");
    row.className = "item-row";
    row.innerHTML = `
      <div class="item-main">
        <span class="swatch" style="background:${item.color}"></span>
        <div>
          <p class="item-name">${escapeHtml(item.name)}</p>
          <p class="item-meta">${categoryLabels[item.category]} · ${item.vibe}</p>
        </div>
      </div>
      <button class="chip-button" type="button" title="Remove ${escapeHtml(item.name)}" aria-label="Remove ${escapeHtml(item.name)}">×</button>
    `;
    row.querySelector("button").addEventListener("click", () => removeItem(item.id));
    elements.catalogList.appendChild(row);
  });
}

function renderRecommendation() {
  if (!state.currentOutfit.length) {
    elements.recommendation.innerHTML = `
      <div class="recommendation-item">
        <div>
          <strong>No outfit selected</strong>
          <p>Choose an occasion and run the stylist.</p>
        </div>
      </div>
    `;
    return;
  }

  elements.recommendation.innerHTML = state.currentOutfit
    .map((item) => `
      <div class="recommendation-item">
        <div>
          <strong>${escapeHtml(item.name)}</strong>
          <p>${categoryLabels[item.category]} · ${item.vibe}</p>
        </div>
        <span class="swatch" style="background:${item.color}"></span>
      </div>
    `)
    .join("");
}

function renderOutfitPreview() {
  const outfit = state.currentOutfit;
  const upper = findFirst(outfit, [...outfitSlots.upper, ...outfitSlots.onePiece]);
  const lower = findFirst(outfit, outfitSlots.lower);
  const jacket = findFirst(outfit, outfitSlots.layer);
  const accessory = findFirst(outfit, outfitSlots.accessory);
  const hasOnePiece = outfit.some((item) => outfitSlots.onePiece.includes(item.category));

  elements.torsoWear.style.background = upper?.color || "#6f8f72";
  elements.bottomWear.style.background = hasOnePiece ? upper?.color || "#8d3f5e" : lower?.color || "#8d3f5e";
  elements.bottomWear.style.height = hasOnePiece ? "146px" : getLowerHeight(lower?.category);
  elements.bottomWear.style.borderRadius = lower?.category === "jeans" ? "12px 12px 24px 24px" : "14px 14px 42px 42px";
  elements.bottomWear.style.clipPath = lower?.category === "jeans"
    ? "polygon(8% 0, 92% 0, 84% 100%, 58% 100%, 50% 28%, 42% 100%, 16% 100%)"
    : "polygon(13% 0, 87% 0, 100% 100%, 0 100%)";

  elements.jacketWear.style.opacity = jacket ? "1" : "0";
  elements.jacketWear.style.borderColor = jacket?.color || "#6d91af";
  elements.hairBand.style.opacity = accessory && ["headbands", "clips"].includes(accessory.category) ? "1" : "0";
  elements.hairBand.style.background = accessory?.color || "#c39742";
  elements.bagWear.style.opacity = accessory && ["clutches", "purses"].includes(accessory.category) ? "1" : "0";
  elements.bagWear.style.background = accessory?.color || "#c39742";
  updateRotation();
}

function getLowerHeight(category) {
  if (category === "longSkirts") return "146px";
  if (category === "skorts") return "82px";
  if (category === "jeans") return "136px";
  return "116px";
}

function findFirst(items, categories) {
  return items.find((item) => categories.includes(item.category));
}

function recommendOutfit() {
  const occasion = elements.occasion.value;
  const weather = elements.weather.value;
  const candidates = state.items
    .map((item) => ({ item, score: scoreItem(item, occasion, weather) }))
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);

  const onePiece = firstByCategory(candidates, outfitSlots.onePiece);
  const upper = firstByCategory(candidates, outfitSlots.upper);
  const lower = firstByCategory(candidates, outfitSlots.lower);
  const layer = firstByCategory(candidates, outfitSlots.layer);
  const accessories = candidates.filter((item) => outfitSlots.accessory.includes(item.category)).slice(0, 2);

  const outfit = [];
  if (onePiece && (occasion === "party" || occasion === "formal" || !upper || !lower)) {
    outfit.push(onePiece);
  } else {
    if (upper) outfit.push(upper);
    if (lower) outfit.push(lower);
  }

  if ((weather === "cool" || weather === "rain" || occasion === "office") && layer) {
    outfit.push(layer);
  }

  outfit.push(...accessories);
  state.currentOutfit = uniqueItems(outfit);
  saveState();
  render();
}

function scoreItem(item, occasion, weather) {
  let score = 0;
  if (item.vibe === occasion) score += 8;
  if (item.vibe === "formal" && occasion === "office") score += 3;
  if (item.vibe === "party" && occasion === "formal") score += 2;
  if (weather === "cool" && item.category === "jackets") score += 6;
  if (weather === "rain" && ["jackets", "jeans", "purses"].includes(item.category)) score += 4;
  if (weather === "hot" && ["tops", "tshirts", "skirts", "skorts"].includes(item.category)) score += 3;
  if (["innerwear"].includes(item.category)) score -= 5;
  return score + colorHarmonyScore(item.color, occasion);
}

function colorHarmonyScore(color, occasion) {
  const value = Number.parseInt(color.replace("#", ""), 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  const brightness = (r + g + b) / 3;

  if (occasion === "formal" || occasion === "office") return brightness < 150 ? 2 : 1;
  if (occasion === "party") return r > g && r > b ? 2 : 0;
  if (occasion === "travel") return b > r ? 2 : 0;
  return 1;
}

function firstByCategory(items, categories) {
  return items.find((item) => categories.includes(item.category));
}

function uniqueItems(items) {
  return [...new Map(items.filter(Boolean).map((item) => [item.id, item])).values()];
}

function removeItem(id) {
  state.items = state.items.filter((item) => item.id !== id);
  state.currentOutfit = state.currentOutfit.filter((item) => item.id !== id);
  saveState();
  render();
}

function updateRotation() {
  elements.avatar.style.transform = `rotateY(${elements.rotateSlider.value}deg)`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

elements.profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.profile = {
    ...state.profile,
    name: elements.profileName.value.trim(),
    height: elements.height.value,
    bust: elements.bust.value,
    waist: elements.waist.value,
    hips: elements.hips.value,
  };
  saveState();
  render();
});

elements.profilePhoto.addEventListener("change", () => {
  const file = elements.profilePhoto.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    state.profile.photo = reader.result;
    saveState();
    renderProfile();
  });
  reader.readAsDataURL(file);
});

elements.itemForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.items.unshift({
    id: crypto.randomUUID(),
    name: elements.itemName.value.trim(),
    category: elements.itemCategory.value,
    color: elements.itemColor.value,
    vibe: elements.itemVibe.value,
  });
  elements.itemForm.reset();
  elements.itemColor.value = "#6f8f72";
  saveState();
  render();
});

elements.recommendButton.addEventListener("click", recommendOutfit);
elements.rotateSlider.addEventListener("input", updateRotation);
elements.resetApp.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  state = structuredClone(defaultState);
  saveState();
  render();
});

render();
