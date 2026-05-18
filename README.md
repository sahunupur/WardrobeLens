# Wardrobe Stylist

A local-first wardrobe catalog and outfit recommendation prototype.

## What it does

- Stores a user's profile, measurements, and profile photo in browser storage.
- Maintains a clothing catalog for tops, shirts, t-shirts, jackets, skirts, long skirts, skorts, jeans, one pieces, innerwear, headbands, clips, clutches, and purses.
- Recommends an outfit from owned items based on occasion and weather.
- Shows a generated outfit preview with a 360-degree rotation control.

## Run

Open `index.html` in a browser, or run the included static server.

```powershell
node server.mjs
```

Then visit `http://localhost:4173`.

## Notes

The current prototype uses an illustrated local preview rather than a real image-generation backend. A production version can add:

- Login and cloud sync.
- Real garment photo uploads and segmentation.
- AI-generated user try-on images.
- A true 3D avatar pipeline for full 360-degree try-on.
