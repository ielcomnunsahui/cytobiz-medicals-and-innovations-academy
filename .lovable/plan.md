

# Progressive Web App (PWA) Setup for Cytobiz Medical Academy

## What This Does
Your website will become installable as a mobile app directly from the browser. Users visiting your site on their phone will see an "Install" prompt or can use their browser menu to add it to their home screen. It will have your logo as the app icon, work offline, and feel like a native app.

## Implementation Steps

### 1. Install PWA Plugin
Add the `vite-plugin-pwa` package to handle service worker generation and manifest configuration automatically.

### 2. Configure PWA in Vite
Update `vite.config.ts` to include the PWA plugin with:
- App name: "Cytobiz Medical Academy"
- Theme color: #0D9488 (your existing teal)
- Icons using your existing `/favicon.png`
- Offline caching strategy for assets
- OAuth route exclusion (`/~oauth`) from service worker cache

### 3. Create PWA Icons
Generate multiple icon sizes (192x192, 512x512) from your existing favicon for proper home screen display on all devices.

### 4. Update index.html
Add mobile-optimized meta tags:
- `apple-mobile-web-app-capable`
- `apple-mobile-web-app-status-bar-style`
- Apple touch icon references

### 5. Create Install Page (`/install`)
A dedicated page at `/install` with:
- Instructions for installing on iOS (Share > Add to Home Screen) and Android (browser menu)
- A "Install App" button that triggers the browser's native install prompt
- Visual step-by-step guide for both platforms
- Benefits of installing (offline access, faster loading, app-like experience)

### 6. Add Install Route
Register the `/install` route in `App.tsx` as a public route.

---

### Technical Details

**Files to create:**
- `src/pages/Install.tsx` -- Install guide page with platform-specific instructions

**Files to modify:**
- `vite.config.ts` -- Add `vite-plugin-pwa` plugin configuration with manifest, icons, and workbox settings
- `index.html` -- Add Apple-specific PWA meta tags
- `src/App.tsx` -- Add `/install` route

**Key configuration (vite.config.ts):**
- `registerType: 'autoUpdate'` for seamless updates
- `navigateFallbackDenylist: [/^\/~oauth/]` to protect auth flows
- Manifest with app name, colors, and icon references
- Runtime caching for API calls and images

