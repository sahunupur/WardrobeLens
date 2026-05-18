# Wardrobe Stylist

A local-first wardrobe catalog, look builder, and outfit recommendation prototype.

## What it does

- Starts with a registration page for name, gender, measurements, units, decimals, and front/back/left/right photos.
- Opens to a dashboard with catalog stats, product guidance, and primary actions.
- Adds apparel through a modal with type, size, brand, unknown-brand option, optional price, color, style tag, and apparel photo.
- Builds a persistent catalog for dresses, hats, shoes, innerwear, jewelry, watches, purses, shirts, skorts, slit dresses, and more.
- Recommends a getup from the catalog based on occasion, weather, and notes.
- Lets the user manually create a look, preview it, rotate the view, and save it.
- Uses the registered four-angle photos as the background reference for the closest 360 preview angle.
- Generates a more realistic local try-on canvas by blending the user photo, apparel photos, garment masks, shadows, and fabric highlights.

## Storage

This prototype uses browser `localStorage` as the database so the catalog and saved looks appear on the next visit from the same browser. For production, the next upgrade should be IndexedDB for larger image storage or a cloud database such as Firebase/Supabase for account sync.

## Run

Open `index.html` in a browser, or run the included static server.

```powershell
node server.mjs
```

Then visit `http://localhost:4173`.

## Notes

The current prototype uses a free local rules-based recommender and a browser canvas try-on renderer. It does not call a paid image model. A production version can add:

- Login and cloud sync.
- Real garment photo uploads and segmentation.
- AI-generated user try-on images through a paid or self-hosted model.
- A true 3D avatar pipeline for full 360-degree try-on.
