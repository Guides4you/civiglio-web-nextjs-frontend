# Guida alla Migrazione degli Assets

Questo documento descrive gli assets che devono essere copiati dal progetto React al progetto Next.js per completare la migrazione.

## 🔴 CRITICI - Da copiare immediatamente

### 1. CSS Colors (Theme Switcher)
**Sorgente:** `/Users/danielecarnovale/Claude-code/90-CiviglioWeb24/public/css/colors/`
**Destinazione:** `/Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/css/colors/`

```bash
mkdir -p /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/css/colors
cp -r /Users/danielecarnovale/Claude-code/90-CiviglioWeb24/public/css/colors/* /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/css/colors/
```

**File da copiare (19 file):**
- beige.css, blue.css, brown.css, celadon.css, cherry.css
- cyan.css, gray.css, green.css, main.css, navy.css
- olive.css, orange.css, peach.css, purple.css, red.css, yellow.css
- E altri varianti colore

### 2. CSS Mancanti
**Sorgente:** `/Users/danielecarnovale/Claude-code/90-CiviglioWeb24/public/css/`
**Destinazione:** `/Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/css/`

```bash
cp /Users/danielecarnovale/Claude-code/90-CiviglioWeb24/public/css/index.css /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/css/
cp /Users/danielecarnovale/Claude-code/90-CiviglioWeb24/public/css/layout.css /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/css/
cp /Users/danielecarnovale/Claude-code/90-CiviglioWeb24/public/css/invoice.css /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/css/
cp /Users/danielecarnovale/Claude-code/90-CiviglioWeb24/public/css/main-color.css /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/css/
```

### 3. Fonts (CRITICO per icone)
**Sorgente:** `/Users/danielecarnovale/Claude-code/90-CiviglioWeb24/src/assets/fonts/`
**Destinazione:** `/Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/fonts/`

```bash
mkdir -p /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/fonts
cp /Users/danielecarnovale/Claude-code/90-CiviglioWeb24/src/assets/fonts/* /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/fonts/
```

**File da copiare (18 file):**
- fontawesome-webfont.eot, .svg, .ttf, .woff, .woff2
- FontAwesome.otf
- fontello.eot, .svg, .ttf, .woff
- iconsmind.eot, .svg, .ttf, .woff
- simple-line-icons.eot, .svg, .ttf, .woff

### 4. WebFonts (Font Awesome moderno)
**Sorgente:** `/Users/danielecarnovale/Claude-code/90-CiviglioWeb24/src/assets/webfonts/`
**Destinazione:** `/Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/webfonts/`

```bash
mkdir -p /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/webfonts
cp /Users/danielecarnovale/Claude-code/90-CiviglioWeb24/src/assets/webfonts/* /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/webfonts/
```

---

## 🟡 IMPORTANTI - Da copiare per feature complete

### 5. Immagini di Supporto
**Sorgente:** `/Users/danielecarnovale/Claude-code/90-CiviglioWeb24/public/img/`
**Destinazione:** `/Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/img/`

```bash
# Avatars
mkdir -p /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/img/avatars
cp /Users/danielecarnovale/Claude-code/90-CiviglioWeb24/public/img/thumb-*.jpg /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/img/avatars/

# Altre immagini
cp /Users/danielecarnovale/Claude-code/90-CiviglioWeb24/public/img/*.png /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/img/
cp /Users/danielecarnovale/Claude-code/90-CiviglioWeb24/public/img/*.jpg /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/img/
```

**File importanti:**
- blank-profile.png (profilo vuoto)
- uploadimage.png (placeholder upload)
- marker.png, mapc.png, mapcn.png, mapcw.png (mappa)
- logo varianti

### 6. Immagini Assets
**Sorgente:** `/Users/danielecarnovale/Claude-code/90-CiviglioWeb24/src/assets/images/`
**Destinazione:** `/Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/assets/images/`

```bash
mkdir -p /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/assets/images
cp -r /Users/danielecarnovale/Claude-code/90-CiviglioWeb24/src/assets/images/* /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/assets/images/
```

---

## 🟢 OPZIONALI - Per design system avanzato

### 7. SCSS System (se si vuole mantenere)
**Sorgente:** `/Users/danielecarnovale/Claude-code/90-CiviglioWeb24/src/assets/scss/`
**Destinazione:** `/Users/danielecarnovale/Claude-code/civiglio-web-nextjs/src/assets/scss/`

```bash
mkdir -p /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/src/assets/scss
cp -r /Users/danielecarnovale/Claude-code/90-CiviglioWeb24/src/assets/scss/* /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/src/assets/scss/
```

**Nota:** Richiede configurazione di SASS in Next.js (già supportato out-of-the-box)

### 8. JSON Data Files
**Sorgente:** `/Users/danielecarnovale/Claude-code/90-CiviglioWeb24/src/assets/data/`
**Destinazione:** `/Users/danielecarnovale/Claude-code/civiglio-web-nextjs/src/assets/data/`

```bash
mkdir -p /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/src/assets/data
cp /Users/danielecarnovale/Claude-code/90-CiviglioWeb24/src/assets/data/* /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/src/assets/data/
```

### 9. SVG Personalizzati
**Sorgente:** `/Users/danielecarnovale/Claude-code/90-CiviglioWeb24/src/assets/svg/`
**Destinazione:** `/Users/danielecarnovale/Claude-code/civiglio-web-nextjs/src/assets/svg/`

```bash
mkdir -p /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/src/assets/svg
cp /Users/danielecarnovale/Claude-code/90-CiviglioWeb24/src/assets/svg/* /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/src/assets/svg/
cp /Users/danielecarnovale/Claude-code/90-CiviglioWeb24/src/logo.svg /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/
```

---

## 📋 Checklist di Verifica

### Dopo aver copiato i file, verifica:

- [ ] I font vengono caricati correttamente (controlla in DevTools Network)
- [ ] Le icone vengono visualizzate (Font Awesome, Iconsmind, ecc.)
- [ ] Il theme switcher funziona (se implementato)
- [ ] Le immagini di profilo vengono visualizzate
- [ ] I marker della mappa sono visibili
- [ ] Gli stili globali sono applicati

### Riferimenti nei file HTML/JSX:

Assicurati che questi file CSS siano importati in `_document.js` o `_app.js`:

```jsx
// In pages/_document.js
<link rel="stylesheet" href="/css/bootstrap-grid.css" />
<link rel="stylesheet" href="/css/style.css" />
<link rel="stylesheet" href="/css/icons.css" />
<link rel="stylesheet" href="/css/main-color.css" />
```

---

## 🚀 Script di Migrazione Automatica

Per copiare tutti gli assets critici in una volta:

```bash
#!/bin/bash

# CSS Colors
mkdir -p /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/css/colors
cp -r /Users/danielecarnovale/Claude-code/90-CiviglioWeb24/public/css/colors/* /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/css/colors/

# CSS Files
cp /Users/danielecarnovale/Claude-code/90-CiviglioWeb24/public/css/index.css /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/css/
cp /Users/danielecarnovale/Claude-code/90-CiviglioWeb24/public/css/layout.css /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/css/
cp /Users/danielecarnovale/Claude-code/90-CiviglioWeb24/public/css/invoice.css /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/css/
cp /Users/danielecarnovale/Claude-code/90-CiviglioWeb24/public/css/main-color.css /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/css/

# Fonts
mkdir -p /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/fonts
cp /Users/danielecarnovale/Claude-code/90-CiviglioWeb24/src/assets/fonts/* /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/fonts/

# WebFonts
mkdir -p /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/webfonts
cp /Users/danielecarnovale/Claude-code/90-CiviglioWeb24/src/assets/webfonts/* /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/webfonts/

# Immagini
cp /Users/danielecarnovale/Claude-code/90-CiviglioWeb24/public/img/*.png /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/img/ 2>/dev/null || true
cp /Users/danielecarnovale/Claude-code/90-CiviglioWeb24/public/img/*.jpg /Users/danielecarnovale/Claude-code/civiglio-web-nextjs/public/img/ 2>/dev/null || true

echo "✅ Assets critici migrati con successo!"
```

Salva questo script come `migrate-assets.sh` e eseguilo con:
```bash
chmod +x migrate-assets.sh
./migrate-assets.sh
```

---

## 📊 Riepilogo

**Assets da migrare:**
- ✅ CSS base (già presenti)
- 🔴 CSS colors (19 file)
- 🔴 CSS mancanti (4 file)
- 🔴 Fonts (33 file)
- 🟡 Immagini (110 file)
- 🟢 SCSS (116 file - opzionale)
- 🟢 JSON data (11 file - opzionale)
- 🟢 SVG (7 file - opzionale)

**Totale file da migrare: ~300 file critici e importanti**
