# Stato Migrazione React → Next.js

**Progetto:** Civiglio Web Application
**Data ultimo aggiornamento:** 30 Dicembre 2025
**Stato completamento:** 87% (13/15 step completati)

---

## ✅ Step Completati

### Step 1-4: Setup e Configurazione Base ✅
- ✅ Next.js 16.1.1 configurato con Pages Router
- ✅ Struttura cartelle creata (`/pages`, `/src/components`, `/src/graphql`, `/src/utils`)
- ✅ Redux Toolkit configurato con SSR-safe setup
- ✅ AWS Amplify 4.3.46 configurato
- ✅ File di configurazione: `next.config.js`, `aws-exports.js`, `amplify.config.js`

### Step 5: Layout Components ✅
- ✅ `_app.js` con Redux Provider, IntlProvider, ConfigProvider
- ✅ `_document.js` con meta tags, CSS links, Google Maps script
- ✅ `Footer.jsx` (layout 3 colonne corretto)
- ✅ `HeaderNew.jsx` (jQuery rimosso, SSR-safe)
- ✅ `AuthLayout.jsx` per route protette
- ✅ `AdminLayout.jsx` per route admin

### Step 6: Shared Components ✅
- ✅ React Intl configurato con 3 lingue (IT, EN, FR)
- ✅ File di traduzione: `it_IT.json`, `en_US.json`, `fr_FR.json`
- ✅ Componenti UI migrati (Button, Card, Modal, ecc.)
- ✅ Ant Design integrato

### Step 7: Authentication Pages ✅
- ✅ `/auth/login` - Login con Cognito
- ✅ `/auth/register` - Registrazione utente
- ✅ `/auth/forgot-password` - Reset password
- ✅ Gestione errori e validazione form

### Step 8: Public Guide Pages (SSG/ISR) ✅
- ✅ `/guide/pub/home` - Homepage con lista POI e mappa
  - SSG con `getStaticProps`
  - ISR con `revalidate: 3600`
  - Google Maps integrata con marker multipli
- ✅ `/guide/pub/detail/[...slug]` - Dettaglio POI
  - Dynamic SSG con `getStaticPaths`
  - Fallback: 'blocking' per ISR
  - Carousel immagini con Embla
  - Audio player con like
  - Mappa dettaglio
  - POI popolari sidebar
- ✅ Componenti: `PicturesPoi`, `AudiosPoi`, `DescriptionPoi`, `GMapCiviglioHome`, `GMapCiviglioDetail`

### Step 9: Authenticated App Pages ✅
- ✅ `/app/home` - Welcome page utente
- ✅ `/app/profile/edit` - Modifica profilo completo
  - Info personali
  - Info canale
  - Info fatturazione
  - Metodo pagamento
  - Upload immagine profilo con S3
- ✅ `/app/poi/index` - Lista POI dell'utente
  - Tabella con filtri
  - Badge status
  - Statistiche (ascolti, like)
  - Modifica inline nome canale
- ✅ `/app/poi/poidetail/[id]` - Editor POI
  - Supporto multi-lingua
  - Upload immagine e audio
  - Google Maps per coordinate
  - Tags e pricing
  - Richiesta pubblicazione
- ✅ Componenti: `ProfileImage`, `POIImage`, `POIMap`

### Step 10: Admin Backend Pages ✅
- ✅ `/admin/home` - Homepage admin
- ✅ `/admin/dashboards/default` - Dashboard statistiche
- ✅ `/admin/poi/validazione` - Lista media da validare
  - Toggle tutti/pendenti
  - Tabella con status
  - Paginazione
- ✅ `/admin/poi/edit/[id]` - Validazione media
  - Mappa interattiva
  - Modifica coordinate
  - Audio player
  - Approva/Rifiuta con motivo

### Step 11: Custom Hooks e Utilities ✅
- ✅ `useBodyClass` - Hook SSR-safe per classi body
- ✅ `GuidesAnalytics` - Sistema analytics SSR-safe
- ✅ `auth.js` - Utility autenticazione
- ✅ `DateConstant.js` - 18 formati data
- ✅ `ChartConstant.js` - Configurazioni ApexCharts
- ✅ `CiviglioConstants.js` - Costanti app
- ✅ `ApiConstant.js` - URL CloudFront
- ✅ `MapConstant.js` - API Key Google Maps

### Step 12: Assets e Global Styles ✅
- ✅ **CSS Colors** - 16 file copiati per theme switcher
- ✅ **CSS Critici** - 4 file copiati (index, layout, invoice, main-color)
- ✅ **Fonts** - 18 file copiati (FontAwesome, Iconsmind, Simple Line Icons, Fontello)
- ✅ **WebFonts** - 15 file copiati (Font Awesome moderno)
- ✅ **Immagini** - File PNG e JPG copiati da /public/img
- ✅ Documentazione completa in `ASSETS_MIGRATION_GUIDE.md`

---

## 🔄 Step In Corso

### Step 13: Test GraphQL Integration 🔄
- ✅ Pagina di test creata: `/test/graphql-test`
- ⏳ Test da eseguire:
  - [ ] Public queries (queryLastPoiForHome, getGeoPoi)
  - [ ] Auth queries (profile, POI list)
  - [ ] Admin queries (media validation)
  - [ ] Mutations (create/update POI, like, approve/reject)
  - [ ] Verifica API_KEY auth mode per public
  - [ ] Verifica Cognito auth per protected

**Pagina test accessibile su:** `http://localhost:3000/test/graphql-test`

---

## 📋 Step Rimanenti

### Step 14: Final Adjustments and Optimizations
- [ ] Performance audit con Lighthouse
- [ ] Ottimizzazione immagini (Next.js Image)
- [ ] Verificare bundle size
- [ ] Code splitting aggiuntivo se necessario
- [ ] SEO meta tags review
- [ ] Sitemap e robots.txt update
- [ ] Error boundary components
- [ ] Loading states consistency

### Step 15: Create Migration Documentation
- [ ] Documentazione deployment
- [ ] Guida ambiente di sviluppo
- [ ] Breaking changes da React a Next.js
- [ ] API documentation
- [ ] Troubleshooting guide

---

## 📊 GraphQL Files Status

### Public Queries/Mutations ✅
- ✅ `publicQueries.js` - queryLastPoiForHome, getGeoPoi, getAudiosByGeoPoi, checkLikeMedia
- ✅ `publicMutations.js` - addLikeMedia, removeLikeMedia

### Profile Queries/Mutations ✅
- ✅ `profileQueries.js` - getProfileInfo
- ✅ `profileMutations.js` - createProfileInfo, updateProfileInfo

### POI Queries/Mutations ✅
- ✅ `poiQueries.js` - listMediaByProprietario, getMedia, listLingue
- ✅ `poiMutations.js` - createPoi, updateAudioMedia, requestPublication

### Admin Queries/Mutations ✅
- ✅ `adminQueries.js` - adminGetMediaDaValidare, adminGetAllMedia, getMediaForAdmin
- ✅ `adminMutations.js` - adminApproveMedia, adminRejectMedia, changePoiCoords

### Legacy Files (da verificare) ⚠️
- ⚠️ `mutations.js` - File legacy React (29 KB)
- ⚠️ `queries.js` - File legacy React (19 KB)
- ⚠️ `subscriptions.js` - File legacy React
- ⚠️ `schema.json` - Schema GraphQL (135 KB)

---

## 🛠 Tecnologie Stack

**Framework & Runtime:**
- Next.js 16.1.1 (Pages Router)
- React 19.0.0
- Node.js (as specified in environment)

**State Management:**
- Redux Toolkit
- React Context (CiviglioContext)

**Backend & Auth:**
- AWS Amplify 4.3.46
- AWS Cognito (autenticazione)
- AWS AppSync (GraphQL API)
- AWS S3 (storage immagini)

**UI & Styling:**
- Ant Design (antd)
- CSS Modules
- SCSS support (next/plugin-scss)

**Maps & Media:**
- google-map-react
- embla-carousel-react
- HTML5 Audio API

**Forms & Validation:**
- Formik
- antd-img-crop (image cropping)

**i18n:**
- react-intl
- moment.js (date formatting)

**Utilities:**
- uuid (v4)
- axios (già presente)

---

## 🐛 Known Issues & Fixes

### ✅ RISOLTI

1. **React Intl Missing Provider**
   - ❌ Error: `Could not find required 'intl' object`
   - ✅ Fix: Aggiunto IntlProvider in `_app.js`

2. **Footer Layout Errato**
   - ❌ User: "diviso su due colonne invece che su tre"
   - ✅ Fix: Layout cambiato da 2 a 3 colonne

3. **Next.js Link with <a> child**
   - ❌ Error: `Invalid <Link> with <a> child`
   - ✅ Fix: Rimosso wrapper `<a>` da Link

4. **POI Detail URL Errato**
   - ❌ URL: `/guide/detail/...` invece di `/guide/pub/detail/...`
   - ✅ Fix: Aggiunto `/pub` nell'URL construction

5. **Google Maps Marker Error**
   - ❌ Error: `Cannot read properties of undefined (reading 'x')`
   - ✅ Fix: Aggiunto props `lat, lng` a Marker component

6. **Module Not Found: auth utility**
   - ❌ Error: `Can't resolve '../../utils/auth'`
   - ✅ Fix: Creato `/src/utils/auth.js` SSR-safe

7. **Amplify Turbopack Incompatibility**
   - ❌ Error: `Can't resolve 'child_process'`
   - ✅ Fix: Usare `npm run dev -- --webpack`

### ⚠️ DA MONITORARE

1. **Theme Switcher**
   - I file CSS colors sono stati copiati ma il theme switcher va testato
   - Verificare che i link ai CSS siano corretti in `_document.js`

2. **Legacy GraphQL Files**
   - `mutations.js`, `queries.js`, `subscriptions.js` sono ancora presenti
   - Potenzialmente rimovibili dopo verifica completa

3. **Channel Profile Page**
   - Referenziata in POI list ma non ancora implementata
   - Link: `/app/channel/profile/${proprietario_uuid}`

---

## 📈 Performance Metrics

**Target Metrics (da verificare in Step 14):**
- Lighthouse Performance: > 90
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

---

## 🔐 Environment Variables

**File:** `.env.local`

Variabili richieste:
```
NEXT_PUBLIC_AWS_REGION=
NEXT_PUBLIC_AWS_USER_POOL_ID=
NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID=
NEXT_PUBLIC_AWS_APPSYNC_GRAPHQL_ENDPOINT=
NEXT_PUBLIC_AWS_APPSYNC_API_KEY=
NEXT_PUBLIC_AWS_S3_BUCKET=
NEXT_PUBLIC_CLOUDFRONT_URL=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

---

## 🚀 Run Commands

```bash
# Development
npm run dev -- --webpack

# Production Build
npm run build

# Production Start
npm start

# Linting
npm run lint

# Test GraphQL
# Browser: http://localhost:3000/test/graphql-test
```

---

## 📝 Notes

### SSR Safety Pattern
Tutti i componenti che usano browser APIs o librerie client-side seguono questo pattern:

```javascript
// Check in component
if (typeof window === 'undefined') return null;

// Dynamic import
const Component = dynamic(() => import('./Component'), { ssr: false });

// useEffect for client-only code
useEffect(() => {
  if (typeof window === 'undefined') return;
  // browser code
}, []);
```

### GraphQL Auth Modes
- **Public pages:** `GRAPHQL_AUTH_MODE.API_KEY`
- **Authenticated pages:** Default Cognito auth (da graphqlOperation)
- **Admin pages:** Cognito con role check (da implementare)

### File Structure
```
civiglio-web-nextjs/
├── pages/
│   ├── _app.js
│   ├── _document.js
│   ├── index.js
│   ├── auth/
│   ├── guide/pub/
│   ├── app/
│   ├── admin/
│   └── test/
├── src/
│   ├── components/
│   ├── graphql/
│   ├── utils/
│   ├── constants/
│   ├── hooks/
│   ├── lang/
│   └── redux/
├── public/
│   ├── css/
│   ├── fonts/
│   ├── webfonts/
│   ├── img/
│   └── assets/
├── amplify.config.js
├── aws-exports.js
└── next.config.js
```

---

## ✅ Checklist Pre-Deploy

- [ ] Tutti i test GraphQL passano
- [ ] Theme switcher funziona
- [ ] Font e icone caricano correttamente
- [ ] Immagini ottimizzate
- [ ] Bundle size accettabile
- [ ] Lighthouse score > 90
- [ ] SEO meta tags completi
- [ ] Error handling completo
- [ ] Variabili ambiente production configurate
- [ ] Amplify backend deployment configurato
- [ ] DNS e dominio configurati

---

**Ultimo aggiornamento:** Step 13 in corso - Test GraphQL
**Prossimo step:** Completare test GraphQL, poi Step 14 (Optimizations)
