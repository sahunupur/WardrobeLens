import {
  createReadStream,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { createServer } from "node:http";
import { basename, extname, join, resolve } from "node:path";
import { randomUUID } from "node:crypto";

const port = Number(process.env.PORT || 4173);
const root = resolve(process.cwd());
const dataDir = join(root, "data");
const uploadDir = join(root, "uploads");
const dbPath = join(dataDir, "wardrobelens.json");

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
  aiTryOnViews: {},
};

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

ensureStorage();

createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host}`);

    if (url.pathname.startsWith("/api/")) {
      await handleApi(request, response, url);
      return;
    }

    serveStatic(url.pathname, response);
  } catch (error) {
    sendJson(response, error.status || 500, {
      error: error.message || "Server error",
    });
  }
}).listen(port, () => {
  console.log(`WardrobeLens running at http://127.0.0.1:${port}`);
});

async function handleApi(request, response, url) {
  if (request.method === "GET" && url.pathname === "/api/health") {
    sendJson(response, 200, {
      ok: true,
      app: "WardrobeLens",
      aiTryOnConfigured: Boolean(process.env.OPENAI_API_KEY),
      imageModel: process.env.OPENAI_IMAGE_MODEL || "gpt-image-2",
    });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/state") {
    sendJson(response, 200, readState());
    return;
  }

  if (request.method === "PUT" && url.pathname === "/api/state") {
    const body = await readJsonBody(request);
    const nextState = sanitizeState(body);
    writeState(nextState);
    sendJson(response, 200, nextState);
    return;
  }

  if (request.method === "DELETE" && url.pathname === "/api/state") {
    writeState(defaultState);
    sendJson(response, 200, defaultState);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/uploads") {
    const body = await readJsonBody(request, 12 * 1024 * 1024);
    const upload = saveUpload(body);
    sendJson(response, 201, upload);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/try-on") {
    const body = await readJsonBody(request);
    const output = await createAiTryOn(String(body.view || "front"));
    sendJson(response, 201, output);
    return;
  }

  sendJson(response, 404, { error: "API route not found" });
}

function serveStatic(pathname, response) {
  const filePathCandidate = resolve(root, `.${decodeURIComponent(pathname)}`);
  let filePath = filePathCandidate;

  if (!filePath.startsWith(root)) {
    response.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  if (!existsSync(filePath)) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  if (statSync(filePath).isDirectory()) {
    filePath = join(filePath, "index.html");
  }

  response.writeHead(200, {
    "content-type": mimeTypes[extname(filePath).toLowerCase()] || "application/octet-stream",
  });
  createReadStream(filePath).pipe(response);
}

function ensureStorage() {
  mkdirSync(dataDir, { recursive: true });
  mkdirSync(uploadDir, { recursive: true });
  if (!existsSync(dbPath)) {
    writeState(defaultState);
  }
}

function readState() {
  try {
    return sanitizeState(JSON.parse(readFileSync(dbPath, "utf8")));
  } catch {
    return structuredClone(defaultState);
  }
}

function writeState(state) {
  writeFileSync(dbPath, `${JSON.stringify(sanitizeState(state), null, 2)}\n`);
}

function sanitizeState(value) {
  const state = typeof value === "object" && value ? value : {};
  return {
    registered: Boolean(state.registered),
    profile: {
      ...defaultState.profile,
      ...(typeof state.profile === "object" && state.profile ? state.profile : {}),
      photos: {
        ...defaultState.profile.photos,
        ...(typeof state.profile?.photos === "object" && state.profile.photos ? state.profile.photos : {}),
      },
    },
    catalog: Array.isArray(state.catalog) ? state.catalog : [],
    currentLook: Array.isArray(state.currentLook) ? state.currentLook : [],
    savedLooks: Array.isArray(state.savedLooks) ? state.savedLooks : [],
    aiTryOnViews: typeof state.aiTryOnViews === "object" && state.aiTryOnViews ? state.aiTryOnViews : {},
  };
}

async function readJsonBody(request, limit = 2 * 1024 * 1024) {
  let size = 0;
  const chunks = [];

  for await (const chunk of request) {
    size += chunk.length;
    if (size > limit) {
      throw new Error("Request body is too large");
    }
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function saveUpload(body) {
  const dataUrl = String(body.dataUrl || "");
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error("Upload must include a dataUrl");
  }

  const mimeType = match[1];
  if (!mimeType.startsWith("image/")) {
    throw new Error("Only image uploads are supported");
  }

  const extension = extensionFromMime(mimeType);
  const originalName = basename(String(body.name || `upload.${extension}`))
    .replace(/\.[^.]+$/, "")
    .replace(/[^\w.-]/g, "_");
  const filename = `${Date.now()}-${randomUUID()}-${originalName || "upload"}.${extension}`;
  const filePath = join(uploadDir, filename);
  writeFileSync(filePath, Buffer.from(match[2], "base64"));

  return {
    url: `/uploads/${filename}`,
    filename,
    mimeType,
  };
}

function extensionFromMime(mimeType) {
  const known = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  return known[mimeType] || "img";
}

async function createAiTryOn(view) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new HttpError(503, "Set OPENAI_API_KEY on the server to generate AI try-on photos.");
  }

  const validViews = new Set(["front", "back", "left", "right"]);
  const selectedView = validViews.has(view) ? view : "front";
  const state = readState();
  const personPhoto = state.profile.photos[selectedView] || state.profile.photos.front;
  if (!personPhoto) {
    throw new HttpError(400, "Upload a profile photo before generating a try-on.");
  }

  if (!state.currentLook.length) {
    throw new HttpError(400, "Select a look before generating a try-on.");
  }

  const references = [
    { source: personPhoto, label: `person-${selectedView}` },
    ...state.currentLook
      .filter((item) => item.photo)
      .map((item) => ({ source: item.photo, label: item.name || item.type || "apparel" })),
  ];

  const form = new FormData();
  form.append("model", process.env.OPENAI_IMAGE_MODEL || "gpt-image-2");
  form.append("size", "1024x1536");
  form.append("quality", "medium");
  form.append("prompt", buildTryOnPrompt(state, selectedView));

  for (const [index, reference] of references.entries()) {
    const asset = readAsset(reference.source, reference.label);
    if (!asset) continue;
    form.append("image[]", new Blob([asset.bytes], { type: asset.mimeType }), `${index}-${asset.name}`);
  }

  const apiResponse = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
    },
    body: form,
  });

  const result = await apiResponse.json();
  if (!apiResponse.ok) {
    throw new HttpError(apiResponse.status, result.error?.message || "Image generation failed.");
  }

  const imageBase64 = result.data?.[0]?.b64_json;
  if (!imageBase64) {
    throw new HttpError(502, "Image generation returned no output.");
  }

  const filename = `${Date.now()}-${randomUUID()}-try-on-${selectedView}.png`;
  writeFileSync(join(uploadDir, filename), Buffer.from(imageBase64, "base64"));
  const url = `/uploads/${filename}`;
  state.aiTryOnViews[selectedView] = url;
  writeState(state);
  return { url, view: selectedView, model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-2" };
}

function buildTryOnPrompt(state, view) {
  const apparel = state.currentLook
    .map((item) => `${item.name || item.type} (${item.type}, ${item.color || "original color"})`)
    .join(", ");
  return [
    `Create a photorealistic full-body ${view} view fashion try-on image.`,
    "The first reference image is the same adult person. Preserve their recognizable identity, face, body proportions, skin tone, hair, and pose as closely as possible.",
    `Dress that person in this selected outfit: ${apparel}.`,
    "Additional reference images, when supplied, are the actual clothing or accessories and should be faithfully preserved in color, texture, cut, and detailing.",
    "Keep the result realistic and tasteful, fully clothed, with natural fabric draping and studio lighting on a clean neutral background.",
    `The visible body orientation must match a ${view} camera view so it aligns with the other try-on angles.`,
  ].join(" ");
}

function readAsset(source, label) {
  const dataUrl = String(source || "");
  const dataMatch = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (dataMatch) {
    return {
      bytes: Buffer.from(dataMatch[2], "base64"),
      mimeType: dataMatch[1],
      name: `${safeName(label)}.${extensionFromMime(dataMatch[1])}`,
    };
  }

  if (dataUrl.startsWith("/uploads/")) {
    const filename = basename(dataUrl);
    const filePath = join(uploadDir, filename);
    if (!existsSync(filePath)) return null;
    return {
      bytes: readFileSync(filePath),
      mimeType: mimeTypes[extname(filename).toLowerCase()]?.split(";")[0] || "image/png",
      name: filename,
    };
  }

  return null;
}

function safeName(value) {
  return String(value || "reference").replace(/[^\w.-]/g, "_");
}

function sendJson(response, status, payload) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
