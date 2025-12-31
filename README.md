# Civiglio Web - Next.js

Applicazione web per guide audio interattive del territorio, migrata da React (Create React App) a Next.js 16.

## 📋 Indice

- [Caratteristiche](#caratteristiche)
- [Tecnologie](#tecnologie)
- [Prerequisiti](#prerequisiti)
- [Installazione](#installazione)
- [Configurazione](#configurazione)
- [Sviluppo](#sviluppo)
- [Build e Deploy](#build-e-deploy)
- [Struttura Progetto](#struttura-progetto)
- [Testing](#testing)
- [Documentazione](#documentazione)

---

## ✨ Caratteristiche

### Funzionalità Pubbliche
- **Homepage con SSG/ISR** - Lista POI con aggiornamento ogni ora
- **Dettaglio POI** - Pagine statiche pre-renderizzate con fallback
- **Google Maps** - Visualizzazione interattiva dei punti di interesse
- **Carousel Immagini** - Galleria immagini con Embla Carousel
- **Audio Player** - Riproduzione audio guide con funzionalità like
- **Multi-lingua** - Supporto IT, EN, FR con react-intl

### Area Utente Autenticato
- **Profilo Utente** - Gestione completa profilo e immagine
- **Gestione POI** - Creazione e modifica POI personali
- **Upload Media** - Caricamento immagini e audio su AWS S3
- **Dashboard** - Statistiche ascolti e like

### Area Admin
- **Validazione Media** - Approvazione/rifiuto contenuti
- **Modifica Coordinate** - Editor interattivo per posizionamento POI
- **Dashboard Statistiche** - Metriche e analytics

---

## 🛠 Tecnologie

### Core
- **Next.js 16.1.1** - Pages Router, SSG, ISR
- **React 18.2.0** - UI library
- **Redux Toolkit** - State management

### Backend & Auth
- **AWS Amplify 4.3.46** - Backend integration
- **AWS Cognito** - Authentication
- **AWS AppSync** - GraphQL API
- **AWS S3** - File storage

### UI & Styling
- **Ant Design 4.24** - Component library
- **Sass** - CSS preprocessing
- **Styled Components** - CSS-in-JS

### Maps & Media
- **google-map-react** - Maps integration
- **embla-carousel-react** - Image carousel
- **ApexCharts** - Data visualization

### Forms & Validation
- **Formik** - Form management
- **antd-img-crop** - Image cropping

### i18n & Utils
- **react-intl** - Internationalization
- **moment.js** - Date formatting
- **uuid** - Unique identifiers

---

## 📦 Prerequisiti

- **Node.js** >= 16.x
- **npm** >= 8.x o **yarn** >= 1.22
- **AWS Account** con Amplify configurato
- **Google Maps API Key**

---

## 🚀 Installazione

```bash
# Clone repository
git clone [repository-url]
cd civiglio-web-nextjs

# Installa dipendenze
npm install

# Copia file environment
cp .env.example .env.local

# Configura variabili ambiente (vedi sezione Configurazione)
```

---

## ⚙️ Configurazione

### File `.env.local`

Crea il file `.env.local` nella root del progetto:

```env
# AWS Amplify Configuration
NEXT_PUBLIC_AWS_REGION=eu-west-1
NEXT_PUBLIC_AWS_USER_POOL_ID=eu-west-1_XXXXXXXXX
NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_AWS_APPSYNC_GRAPHQL_ENDPOINT=https://xxxxx.appsync-api.eu-west-1.amazonaws.com/graphql
NEXT_PUBLIC_AWS_APPSYNC_API_KEY=da2-xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_AWS_S3_BUCKET=civiglioweb-bucket-name
NEXT_PUBLIC_CLOUDFRONT_URL=https://xxxxxx.cloudfront.net

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXX

# App Config
NEXT_PUBLIC_API_URL=/api
```

### AWS Amplify Setup

Se non hai già configurato Amplify:

```bash
# Installa Amplify CLI
npm install -g @aws-amplify/cli

# Configura Amplify
amplify configure

# Inizializza progetto (se necessario)
amplify init

# Pull configurazione esistente
amplify pull
```

---

## 💻 Sviluppo

### Avvio Server di Sviluppo

```bash
# Avvia development server con webpack (necessario per AWS Amplify)
npm run dev

# Il server sarà disponibile su http://localhost:3000
```

**Nota:** Usiamo `--webpack` invece di Turbopack per compatibilità con AWS Amplify SDK.

### Hot Reload

Next.js supporta Fast Refresh. Le modifiche a componenti React verranno applicate automaticamente.

### Testing GraphQL

Visita `http://localhost:3000/test/graphql-test` per testare le integrazioni GraphQL:
- Public queries (no auth)
- Authenticated queries (login required)
- Admin queries (admin role required)

---

## 📦 Build e Deploy

### Build Produzione

```bash
# Crea build ottimizzata
npm run build

# Output in: .next/
```

### Test Build Locale

```bash
# Dopo il build
npm start

# Server produzione su http://localhost:3000
```

### Deploy

#### Vercel (Consigliato)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy in produzione
vercel --prod
```

Configura le variabili ambiente nel dashboard Vercel.

#### AWS Amplify Hosting

```bash
# Configura hosting
amplify add hosting

# Publish
amplify publish
```

#### Deploy Manuale

```bash
npm run build
npm start
```

Usa PM2 o processo simile per produzione:

```bash
pm2 start npm --name "civiglio-web" -- start
```

---

## 📁 Struttura Progetto

```
civiglio-web-nextjs/
├── pages/                      # Next.js pages (routing)
│   ├── _app.js                 # App wrapper con providers
│   ├── _document.js            # HTML document structure
│   ├── index.js                # Homepage
│   ├── 404.js                  # Custom 404 page
│   ├── 500.js                  # Custom 500 page
│   ├── api/                    # API routes
│   │   └── sitemap.xml.js      # Dynamic sitemap
│   ├── auth/                   # Authentication pages
│   │   ├── login.js
│   │   ├── register.js
│   │   └── forgot-password.js
│   ├── guide/pub/              # Public guide pages (SSG/ISR)
│   │   ├── home.js
│   │   └── detail/[...slug].js
│   ├── app/                    # Authenticated user pages
│   │   ├── home.js
│   │   ├── profile/edit.js
│   │   └── poi/
│   ├── admin/                  # Admin pages
│   │   ├── home.js
│   │   ├── dashboards/default.js
│   │   └── poi/validazione.js
│   └── test/                   # Development test pages
│       └── graphql-test.js
├── src/
│   ├── components/             # React components
│   │   ├── layouts/            # Layout wrappers
│   │   ├── layout-components/  # Header, Footer, etc
│   │   ├── layoutpub-components/ # Public page components
│   │   ├── profile-components/
│   │   ├── poi-components/
│   │   └── util-components/    # Utilities (Loading, ErrorBoundary, SEOHead)
│   ├── graphql/                # GraphQL queries & mutations
│   │   ├── publicQueries.js
│   │   ├── publicMutations.js
│   │   ├── poiQueries.js
│   │   ├── poiMutations.js
│   │   ├── profileQueries.js
│   │   ├── profileMutations.js
│   │   ├── adminQueries.js
│   │   └── adminMutations.js
│   ├── redux/                  # Redux store
│   │   ├── store.js
│   │   └── reducers/
│   ├── utils/                  # Utility functions
│   │   ├── auth.js
│   │   └── GuidesAnalytics/
│   ├── hooks/                  # Custom hooks
│   │   └── useBodyClass.js
│   ├── constants/              # App constants
│   │   ├── ApiConstant.js
│   │   ├── MapConstant.js
│   │   ├── DateConstant.js
│   │   ├── ChartConstant.js
│   │   └── CiviglioConstants.js
│   └── lang/                   # i18n translations
│       ├── index.js
│       └── locales/
│           ├── it_IT.json
│           ├── en_US.json
│           └── fr_FR.json
├── public/                     # Static assets
│   ├── css/                    # Global CSS
│   │   └── colors/             # Theme color files
│   ├── fonts/                  # Icon fonts
│   ├── webfonts/               # Font Awesome
│   ├── img/                    # Images
│   ├── assets/                 # Additional assets
│   └── robots.txt              # SEO robots file
├── .env.local                  # Environment variables (git-ignored)
├── .gitignore
├── next.config.js              # Next.js configuration
├── amplify.config.js           # Amplify configuration
├── aws-exports.js              # AWS Amplify exports
├── package.json
├── MIGRATION_STATUS.md         # Migration progress
├── ASSETS_MIGRATION_GUIDE.md   # Assets migration guide
└── README.md
```

---

## 🧪 Testing

### GraphQL Tests

Accedi a `/test/graphql-test` per testare:
- ✅ Public API (queryLastPoiForHome, getGeoPoi, listLingue)
- ✅ Authenticated API (profile, user POIs)
- ✅ Admin API (media validation)

### Manual Testing Checklist

- [ ] Login/Register funziona
- [ ] Homepage mostra POI list
- [ ] Click su POI apre dettaglio
- [ ] Mappa mostra marker
- [ ] Audio player funziona
- [ ] Upload immagine profilo
- [ ] Creazione nuovo POI
- [ ] Admin validazione media
- [ ] Theme switcher (color CSS)
- [ ] Multi-lingua IT/EN/FR

### Performance Testing

```bash
# Lighthouse audit
npm install -g lighthouse
lighthouse http://localhost:3000 --view

# Bundle analyzer (installa prima)
npm install --save-dev @next/bundle-analyzer
```

---

## 📚 Documentazione

### File Documentazione

- **README.md** - Questo file
- **MIGRATION_STATUS.md** - Stato migrazione React → Next.js
- **ASSETS_MIGRATION_GUIDE.md** - Guida copia assets

### Route Structure

#### Public Routes (No Auth)
- `/` - Homepage (redirect to /guide/pub/home)
- `/guide/pub/home` - POI list with map (SSG, revalidate 1h)
- `/guide/pub/detail/[poiId]/[slug]` - POI detail (SSG with fallback)
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/auth/forgot-password` - Password reset

#### Authenticated Routes
- `/app/home` - User dashboard
- `/app/profile/edit` - Profile editor
- `/app/poi` - User's POI list
- `/app/poi/poidetail/[id]` - POI editor (create/edit)

#### Admin Routes (Admin Role Required)
- `/admin/home` - Admin dashboard
- `/admin/dashboards/default` - Statistics
- `/admin/poi/validazione` - Media validation list
- `/admin/poi/edit/[id]` - Media approval/rejection

### SSR/SSG Strategy

- **SSG (Static Site Generation)**: `/guide/pub/*`
  - Pre-rendered at build time
  - `getStaticProps` + `getStaticPaths`
  - ISR (Incremental Static Regeneration) con `revalidate: 3600`

- **CSR (Client-Side Rendering)**: `/auth/*`, `/app/*`, `/admin/*`
  - Dynamic content requiring authentication
  - Uses `useEffect` for data fetching

### GraphQL Auth Modes

```javascript
// Public pages - API Key
const result = await API.graphql({
  query: queryLastPoiForHome,
  authMode: GRAPHQL_AUTH_MODE.API_KEY
});

// Authenticated pages - Cognito
const result = await API.graphql(
  graphqlOperation(getProfileInfo, { PK: userId })
);
```

### Environment Variables

All public env vars must start with `NEXT_PUBLIC_`:

```javascript
// ✅ Accessible in browser
process.env.NEXT_PUBLIC_API_URL

// ❌ NOT accessible in browser (server-only)
process.env.SECRET_KEY
```

---

## 🔧 Troubleshooting

### Build Errors

**Error: Can't resolve 'child_process'**
```bash
# Assicurati di usare --webpack flag
npm run build
# Verifica next.config.js webpack fallback config
```

**Error: Module not found**
```bash
# Pulisci .next e node_modules
rm -rf .next node_modules
npm install
npm run build
```

### Runtime Errors

**Amplify not configured**
```javascript
// Controlla che .env.local sia presente
// Verifica che _app.js configuri Amplify in useEffect
```

**Google Maps not loading**
```bash
# Verifica NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local
# Controlla che Maps JavaScript API sia abilitata su Google Cloud Console
```

**Images not loading**
```bash
# Verifica NEXT_PUBLIC_CLOUDFRONT_URL
# Controlla configurazione S3 bucket CORS
# Verifica next.config.js images.remotePatterns
```

---

## 🚀 Performance Optimization

### Implemented

- ✅ SSG/ISR for public pages
- ✅ Webpack bundle optimization
- ✅ Image optimization with Next.js Image (remotePatterns configured)
- ✅ Code splitting automatic (Next.js default)
- ✅ Dynamic imports for heavy components (Maps, Carousel)
- ✅ Production source maps disabled
- ✅ Error boundary component
- ✅ Custom 404/500 pages
- ✅ SEO optimization (robots.txt, dynamic sitemap)

### To Consider

- [ ] Lazy load images below fold
- [ ] Implement next/image for all images
- [ ] Add service worker for offline support
- [ ] Implement CDN caching headers
- [ ] Optimize fonts with next/font

---

## 🔐 Security

### Implemented

- ✅ AWS Cognito authentication
- ✅ HTTPS only (CloudFront/Vercel)
- ✅ Environment variables for secrets
- ✅ Content Security Policy headers (to configure)
- ✅ XSS protection (React default escaping)

### Best Practices

- Never commit `.env.local`
- Rotate API keys regularly
- Use least privilege IAM roles
- Enable AWS WAF for production
- Regular dependency updates

---

## 📄 License

[Specificare licenza]

---

## 👥 Contributors

[Elenco contributors]

---

## 📞 Support

Per supporto:
- Email: [email]
- Issues: [GitHub Issues URL]
- Docs: Vedi `/docs` folder

---

## 🎯 Roadmap

### v1.0 (Current) ✅
- ✅ Migrazione da React completata
- ✅ SSG/ISR implementato
- ✅ Tutte le feature migrate
- ✅ Production build funzionante

### v1.1 (Next)
- [ ] PWA support
- [ ] Offline mode
- [ ] Push notifications
- [ ] Advanced analytics

### v2.0 (Future)
- [ ] Migration to App Router
- [ ] Server Components
- [ ] Streaming SSR
- [ ] Edge Runtime

---

**Ultimo aggiornamento:** 30 Dicembre 2025
**Versione:** 1.0.0
**Status:** ✅ Production Ready (15/15 step completati)
