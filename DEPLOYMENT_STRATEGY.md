# 🚀 Deployment Strategy - Backend/Frontend Separati

## 📋 Panoramica

Questa strategia separa completamente il **backend Amplify** dal **frontend Next.js**, permettendo:
- ✅ CI/CD indipendenti
- ✅ Backend stabile, non toccato durante lo sviluppo frontend
- ✅ Frontend può essere ri-deployato infinite volte senza rischi
- ✅ Architettura scalabile e manutenibile

---

## 🏗️ Architettura

```
Backend Amplify (Esistente)
└─ Repository: 90-CiviglioWeb24 (branch: test)
   ├─ AppSync GraphQL API
   ├─ Cognito Authentication
   ├─ DynamoDB Tables
   ├─ Lambda Functions
   ├─ S3 Media Storage
   └─ Deploy: Manuale (NON toccare)

Frontend Next.js (Nuovo)
└─ Repository: civiglio-web-nextjs-frontend (da creare)
   ├─ Next.js 16.1.1
   ├─ Pages Router + SSG/ISR
   ├─ Amplify JS Client
   └─ Deploy: AWS Amplify Hosting (CI/CD automatico)

Comunicazione: Frontend → Backend via GraphQL Endpoint
```

---

## 📦 STEP 1: Preparazione Repository Frontend

### 1.1 Inizializza Git

```bash
cd /Users/danielecarnovale/Claude-code/civiglio-web-nextjs

# Inizializza repository
git init

# Aggiungi tutto il codice
git add .

# Primo commit
git commit -m "feat: Next.js 16 migration with clustering and auto-geolocation

- Migrated from React to Next.js 16.1.1
- Implemented POI marker clustering
- Added auto-geolocation on map load
- Added single-dialog behavior for markers
- Improved search functionality
- Comprehensive documentation included"
```

### 1.2 Crea Repository su GitHub/GitLab/Bitbucket

**Opzione A: GitHub (consigliato)**

1. Vai su https://github.com/new
2. Nome repository: `civiglio-web-nextjs-frontend`
3. Description: "Civiglio Web - Next.js Frontend (Backend su Amplify separato)"
4. Privacy: Private (consigliato)
5. **NON** inizializzare con README/LICENSE (hai già il codice)
6. Click "Create repository"

**Opzione B: AWS CodeCommit**

```bash
# Se preferisci tenere tutto in AWS
aws codecommit create-repository \
  --repository-name civiglio-web-nextjs-frontend \
  --repository-description "Civiglio Web Next.js Frontend"
```

### 1.3 Push del Codice

**Per GitHub:**

```bash
# Collega il repository remoto
git remote add origin https://github.com/TUO_USERNAME/civiglio-web-nextjs-frontend.git

# Rinomina branch principale in main (se preferisci)
git branch -M main

# Push
git push -u origin main
```

**Per AWS CodeCommit:**

```bash
git remote add origin https://git-codecommit.eu-west-1.amazonaws.com/v1/repos/civiglio-web-nextjs-frontend
git push -u origin main
```

---

## 🎯 STEP 2: Deploy su AWS Amplify Hosting

### 2.1 Crea Nuova App Amplify (Solo Frontend)

**Via Console AWS:**

1. Vai su [AWS Amplify Console](https://eu-west-1.console.aws.amazon.com/amplify/home?region=eu-west-1)
2. Click **"New app"** → **"Host web app"**
3. Scegli il tuo provider Git:
   - GitHub → Autorizza AWS Amplify
   - CodeCommit → Seleziona repository
4. Seleziona repository: `civiglio-web-nextjs-frontend`
5. Seleziona branch: `main`
6. Click **Next**

### 2.2 Configura Build Settings

AWS dovrebbe auto-rilevare Next.js. Verifica questa configurazione:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

**Se usi SSG/ISR (consigliato):**

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

Click **Next**

### 2.3 Configura Environment Variables

**CRITICO:** Aggiungi TUTTE le variabili d'ambiente dal tuo `.env.local`

Nella schermata "Environment variables", click **"Add environment variable"** per ciascuna:

```bash
# AWS Configuration
NEXT_PUBLIC_AWS_REGION=eu-west-1
NEXT_PUBLIC_AWS_APPSYNC_GRAPHQL_ENDPOINT=[YOUR_GRAPHQL_ENDPOINT]
NEXT_PUBLIC_AWS_APPSYNC_API_KEY=[YOUR_API_KEY]
NEXT_PUBLIC_AWS_APPSYNC_REGION=eu-west-1
NEXT_PUBLIC_AWS_APPSYNC_AUTHENTICATION_TYPE=API_KEY

# Cognito (se usato)
NEXT_PUBLIC_AWS_USER_POOLS_ID=[YOUR_USER_POOL_ID]
NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID=[YOUR_CLIENT_ID]

# S3/CloudFront
NEXT_PUBLIC_AWS_STORAGE_BUCKET=[YOUR_BUCKET]
NEXT_PUBLIC_CLOUDFRONT_URL=[YOUR_CLOUDFRONT_URL]

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=[YOUR_MAPS_KEY]

# API Endpoints
NEXT_PUBLIC_API_GEO_SEARCH=[YOUR_GEO_SEARCH_ENDPOINT]

# Altre variabili dal tuo .env.local
```

**💡 Come trovare i valori:**

Dal tuo progetto corrente:
```bash
cat .env.local
```

Dal backend Amplify:
```bash
cd /Users/danielecarnovale/Claude-code/90-CiviglioWeb24
amplify status
amplify env get --name test
```

GraphQL Endpoint:
```bash
cat amplify/backend/api/civiglioweb/parameters.json
# Oppure dalla AWS Console: AppSync → civiglioweb → Settings
```

### 2.4 Deploy!

1. Rivedi la configurazione
2. Click **"Save and deploy"**
3. Attendi 3-5 minuti
4. ✅ Il tuo frontend Next.js sarà live!

**URL di test:** Sarà del tipo:
```
https://main.d[APP_ID].amplifyapp.com
```

---

## 🔧 STEP 3: Configurazione CI/CD

### 3.1 Auto-Deploy on Push

Amplify Hosting configurerà automaticamente:
- ✅ Deploy automatico quando push su `main`
- ✅ Preview per ogni Pull Request
- ✅ Build logs e error tracking
- ✅ SSL certificate automatico

### 3.2 Crea Branch di Staging (Consigliato)

**Nel repository frontend:**

```bash
# Crea branch staging
git checkout -b staging
git push -u origin staging
```

**In Amplify Console:**

1. Vai alla tua app Amplify
2. Click **"Connect branch"**
3. Seleziona `staging`
4. Usa stesse configurazioni del `main`
5. Deploy!

**Risultato:**
- URL produzione: `https://main.d[APP_ID].amplifyapp.com`
- URL staging: `https://staging.d[APP_ID].amplifyapp.com`

### 3.3 Workflow di Sviluppo

```bash
# Sviluppo locale
npm run dev

# Quando pronto per test
git checkout staging
git merge dev
git push origin staging
# → Auto-deploy su URL staging

# Quando testato e approvato
git checkout main
git merge staging
git push origin main
# → Auto-deploy su URL produzione
```

---

## 🔐 STEP 4: Connessione Sicura al Backend

Il frontend Next.js si collegherà al backend Amplify esistente via:

### 4.1 Amplify JS Configuration

Il file `src/aws-exports.js` o `amplifyconfiguration.json` dovrebbe contenere:

```javascript
const awsConfig = {
  aws_project_region: process.env.NEXT_PUBLIC_AWS_REGION,

  // AppSync GraphQL
  aws_appsync_graphqlEndpoint: process.env.NEXT_PUBLIC_AWS_APPSYNC_GRAPHQL_ENDPOINT,
  aws_appsync_region: process.env.NEXT_PUBLIC_AWS_APPSYNC_REGION,
  aws_appsync_authenticationType: process.env.NEXT_PUBLIC_AWS_APPSYNC_AUTHENTICATION_TYPE,
  aws_appsync_apiKey: process.env.NEXT_PUBLIC_AWS_APPSYNC_API_KEY,

  // Cognito
  aws_cognito_identity_pool_id: process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID,
  aws_user_pools_id: process.env.NEXT_PUBLIC_AWS_USER_POOLS_ID,
  aws_user_pools_web_client_id: process.env.NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID,

  // S3 Storage
  Storage: {
    AWSS3: {
      bucket: process.env.NEXT_PUBLIC_AWS_STORAGE_BUCKET,
      region: process.env.NEXT_PUBLIC_AWS_REGION,
    }
  }
};

export default awsConfig;
```

### 4.2 Verifica Permessi CORS

Il backend AppSync deve permettere richieste dal nuovo dominio Amplify.

**In AWS AppSync Console:**

1. Vai su AppSync → civiglioweb API
2. Settings → CORS
3. Aggiungi il nuovo dominio:
   ```
   https://main.d[APP_ID].amplifyapp.com
   https://staging.d[APP_ID].amplifyapp.com
   ```

---

## 🌐 STEP 5: Custom Domain (Opzionale ma Consigliato)

### 5.1 Aggiungi Dominio Personalizzato

**In Amplify Console:**

1. Vai su **Domain management**
2. Click **"Add domain"**
3. Inserisci il tuo dominio (es. `civiglio.com`)
4. Scegli sottodomini:
   - `www.civiglio.com` → main branch
   - `staging.civiglio.com` → staging branch
5. Amplify creerà automaticamente:
   - ✅ SSL certificate
   - ✅ CloudFront distribution
   - ✅ DNS records (se usi Route 53)

### 5.2 Configura DNS

Se il dominio è fuori Route 53, aggiungi questi record:

```
CNAME www → [AMPLIFY_DOMAIN].cloudfront.net
CNAME staging → [AMPLIFY_DOMAIN].cloudfront.net
```

---

## 📊 STEP 6: Monitoraggio e Ottimizzazione

### 6.1 Amplify Monitoring

In Amplify Console puoi monitorare:
- ✅ Build status
- ✅ Deploy history
- ✅ Traffic metrics
- ✅ Error logs

### 6.2 CloudWatch Logs

Per log più dettagliati:
1. Vai su CloudWatch
2. Cerca log group: `/aws/amplify/[APP_ID]`
3. Analizza errori e performance

### 6.3 Performance Optimization

**Build Time Optimization:**

Nel file `amplify.yml`, abilita cache:

```yaml
cache:
  paths:
    - node_modules/**/*
    - .next/cache/**/*
    - ~/.npm/**/*
```

**Runtime Optimization:**

Nel `next.config.js`:

```javascript
module.exports = {
  // ... existing config

  // Ottimizzazioni
  swcMinify: true,
  compress: true,

  // Image optimization
  images: {
    domains: [
      'd3vhc53cl8e8km.cloudfront.net',
      // altri domini
    ],
    minimumCacheTTL: 60,
  },

  // Output standalone per deploy più piccoli
  output: 'standalone',
};
```

---

## 🧪 STEP 7: Testing

### 7.1 Test del Deploy

```bash
# Build locale per verificare
npm run build
npm run start

# Se ok, push
git push origin main
```

### 7.2 Test delle API

Verifica che il frontend si colleghi correttamente al backend:

```bash
# In browser console, sulla tua app deployata
console.log(window.AWS_CONFIG);
// Dovrebbe mostrare la configurazione corretta
```

### 7.3 Test End-to-End

Checklist:
- [ ] Home page carica correttamente
- [ ] Mappa si visualizza
- [ ] Geolocalizzazione funziona
- [ ] Ricerca indirizzo funziona
- [ ] POI vengono caricati
- [ ] Clustering funziona
- [ ] Click su marker apre dialog
- [ ] Navigazione al dettaglio POI funziona
- [ ] Autenticazione funziona (se applicabile)

---

## 🔄 STEP 8: Continuous Delivery Workflow

### 8.1 Workflow Consigliato

```
Developer → Push to 'staging' branch
              ↓
          Amplify Auto-Build
              ↓
          Deploy to staging.civiglio.com
              ↓
          QA Testing
              ↓
          ✅ Approved
              ↓
          Merge 'staging' → 'main'
              ↓
          Amplify Auto-Build
              ↓
          Deploy to www.civiglio.com (PRODUCTION)
```

### 8.2 Protezione Branch Main

In GitHub/GitLab, configura branch protection:

1. Settings → Branches → Add rule
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass
   - ✅ Include administrators

### 8.3 Automated Testing (Opzionale)

Aggiungi GitHub Actions per test automatici:

`.github/workflows/test.yml`:

```yaml
name: Test

on:
  push:
    branches: [staging, main]
  pull_request:
    branches: [staging, main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Build
        run: npm run build
        env:
          # Variabili d'ambiente per test
          NEXT_PUBLIC_AWS_REGION: ${{ secrets.AWS_REGION }}
          # ... altre variabili
```

---

## 🎯 Risultato Finale

### Architettura Deployata

```
┌─────────────────────────────────────────────────────────────┐
│                         AWS CLOUD                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────┐    ┌────────────────────────┐ │
│  │   BACKEND (Amplify)      │    │  FRONTEND (Amplify)    │ │
│  │  App: civiglioweb        │    │  App: frontend         │ │
│  ├──────────────────────────┤    ├────────────────────────┤ │
│  │  - AppSync (GraphQL)     │◄───│  - Next.js 16          │ │
│  │  - Cognito               │    │  - CloudFront          │ │
│  │  - DynamoDB              │    │  - CI/CD Auto          │ │
│  │  - Lambda                │    │                        │ │
│  │  - S3 Media              │    │  URLs:                 │ │
│  │                          │    │  - staging.civiglio.com│ │
│  │  Deploy: Manual          │    │  - www.civiglio.com    │ │
│  │  (stabile, non toccare)  │    │                        │ │
│  └──────────────────────────┘    └────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Benefici

✅ **Backend sicuro**: Nessun rischio di rompere il backend
✅ **CI/CD automatico**: Push → Build → Deploy
✅ **Staging environment**: Test prima di produzione
✅ **Indipendenza**: Frontend e backend evolvono separatamente
✅ **Scalabilità**: Facile aggiungere più frontend (mobile app, admin panel)
✅ **Costi ottimizzati**: Pay only for what you use

---

## 📝 Checklist Completa

### Preparazione
- [ ] Repository frontend creato su GitHub/CodeCommit
- [ ] Codice pushato su repository
- [ ] `.env.local` copiato per reference

### Amplify Setup
- [ ] Nuova app Amplify creata (solo hosting)
- [ ] Repository collegato
- [ ] Branch `main` collegato
- [ ] Branch `staging` collegato (opzionale)
- [ ] Build settings configurati
- [ ] Environment variables aggiunte

### Testing
- [ ] Build completa con successo
- [ ] Deploy completo con successo
- [ ] Home page accessibile
- [ ] Mappa funzionante
- [ ] API calls al backend funzionanti
- [ ] Autenticazione funzionante

### Produzione
- [ ] Custom domain configurato
- [ ] SSL attivo
- [ ] DNS puntato correttamente
- [ ] Monitoring configurato
- [ ] Branch protection attiva

---

## 🆘 Troubleshooting

### Build Fails

**Errore:** "Module not found"
```bash
# Verifica che tutte le dipendenze siano in package.json
npm install
git add package.json package-lock.json
git commit -m "fix: update dependencies"
git push
```

**Errore:** "Environment variable missing"
```bash
# Aggiungi la variabile in Amplify Console
# App → Build settings → Environment variables
```

### API Calls Fail

**Errore:** "CORS error"
```bash
# In AppSync Console:
# Settings → CORS → Aggiungi il dominio Amplify
```

**Errore:** "Unauthorized"
```bash
# Verifica che NEXT_PUBLIC_AWS_APPSYNC_API_KEY sia corretto
# In AppSync Console: Settings → API Keys
```

### Deploy Lento

**Soluzione:**
```yaml
# In amplify.yml, abilita cache
cache:
  paths:
    - node_modules/**/*
    - .next/cache/**/*
```

---

**Versione:** 1.0.0
**Data:** 2025-12-31
**Status:** 📋 Ready for Implementation
