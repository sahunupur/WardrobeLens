# WardrobeLens

A local-first wardrobe catalog, look builder, and outfit recommendation prototype.

## What it does

- Starts with a registration page for name, gender, measurements, units, decimals, and front/back/left/right photos.
- Opens to a dashboard with catalog stats, product guidance, and primary actions.
- Adds apparel through a modal with type, size, brand, unknown-brand option, optional price, color, style tag, and apparel photo.
- Builds a persistent catalog for dresses, hats, shoes, innerwear, jewelry, watches, purses, shirts, skorts, slit dresses, and more.
- Recommends a getup from the catalog based on occasion, weather, and notes.
- Lets the user manually create a look, preview it, rotate the view, and save it.
- Uses the registered four-angle photos as the background reference for the closest 360 preview angle.
- Generates AI try-on views from uploaded person/apparel photos when an OpenAI API key is configured.
- Falls back to a local try-on canvas when AI generation is not configured.

## Storage

This project now includes a small Node.js backend. It stores app data in `data/wardrobelens.json` and uploaded images in `uploads/`. Browser `localStorage` remains as a fallback if the frontend is opened without the backend server.

For production, the next upgrade should be authentication plus a managed database/storage layer such as Supabase, Firebase, or a custom PostgreSQL API.

## Run

Open `index.html` in a browser, or run the included static server.

```powershell
node server.mjs
```

Then visit `http://localhost:4173`.

Backend endpoints:

- `GET /api/health`
- `GET /api/state`
- `PUT /api/state`
- `DELETE /api/state`
- `POST /api/uploads`
- `POST /api/try-on`

## AI Try-On Setup

Photorealistic try-on generation needs an image model API. WardrobeLens uses the OpenAI Image Edit API with `gpt-image-2` by default, sending the chosen body-angle photo and selected apparel photos as references.

In PowerShell, set your API key before starting the server:

```powershell
$env:OPENAI_API_KEY="your_api_key_here"
node server.mjs
```

Optional model override:

```powershell
$env:OPENAI_IMAGE_MODEL="gpt-image-2"
```

Click **Generate AI 360 views** after selecting a look. The app generates one photographic try-on image for each body angle you uploaded and displays those images as you rotate the preview.

## Notes

The local recommendation engine remains free. AI try-on requests use a paid image API when configured. The generated front/right/back/left views simulate a 360 review; they are not a true continuous 3D avatar or mesh. A production version can add:

- Login and cloud sync.
- Real garment photo uploads and segmentation.
- A true 3D avatar pipeline for full 360-degree try-on.
