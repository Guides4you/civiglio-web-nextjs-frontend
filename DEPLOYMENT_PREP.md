# 🚀 Deployment Preparation - Checklist & Configuration

## 📋 Informazioni Backend Raccolte

Ho estratto tutte le configurazioni dal tuo backend Amplify esistente:

### ✅ GraphQL API (AppSync)
```
Endpoint: https://jrprvscsc5ffxmw6w3pg75else.appsync-api.eu-west-1.amazonaws.com/graphql
API Key: da2-5x54zel2gvcynha4qe7efn5us4
Region: eu-west-1
Auth Type: API_KEY
```

### ✅ Cognito Authentication
```
User Pool ID: eu-west-1_CKBuPpA2Z
Web Client ID: 3p47ofihslhosfpvs7grf4ij7v
Identity Pool ID: eu-west-1:0cbe8811-66d1-478e-af11-7b3a85f71ad7
Region: eu-west-1
OAuth Domain: civiglioweb90af3ccd-90af3ccd-test.auth.eu-west-1.amazoncognito.com
```

### ✅ S3 Storage
```
Bucket: civigliowebba8ebe1e07b047938f92b0cad411ac6f221800-test
Region: eu-west-1
CloudFront URL: https://d1eqtzn4fayhe0.cloudfront.net
```

### ✅ API Endpoints
```
POI API: https://bgsxzp0b7a.execute-api.eu-west-1.amazonaws.com/test
POI CRUD: https://bgsxzp0b7a.execute-api.eu-west-1.amazonaws.com/test/poicrud
GEO Search: https://bgsxzp0b7a.execute-api.eu-west-1.amazonaws.com/test/searchgeo
```

### ✅ Google Maps
```
API Key: AIzaSyCzhAJASoo4TQuH9tsKOL0zF1UzFgJUIs0
```

### ✅ Analytics
```
Pinpoint App ID: 78aa644faacd4d5bb9038654647b3ecf
Region: eu-west-1
```

---

## 🔐 Environment Variables per AWS Amplify

Quando crei la app Amplify Hosting, dovrai aggiungere queste variabili:

### File da copiare/incollare in Amplify Console

```bash
# AWS Region
NEXT_PUBLIC_AWS_REGION=eu-west-1

# AppSync GraphQL API
NEXT_PUBLIC_AWS_APPSYNC_GRAPHQL_ENDPOINT=https://jrprvscsc5ffxmw6w3pg75else.appsync-api.eu-west-1.amazonaws.com/graphql
NEXT_PUBLIC_AWS_APPSYNC_API_KEY=da2-5x54zel2gvcynha4qe7efn5us4
NEXT_PUBLIC_AWS_APPSYNC_REGION=eu-west-1
NEXT_PUBLIC_AWS_APPSYNC_AUTHENTICATION_TYPE=API_KEY

# Cognito Authentication
NEXT_PUBLIC_AWS_USER_POOLS_ID=eu-west-1_CKBuPpA2Z
NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID=3p47ofihslhosfpvs7grf4ij7v
NEXT_PUBLIC_AWS_IDENTITY_POOL_ID=eu-west-1:0cbe8811-66d1-478e-af11-7b3a85f71ad7
NEXT_PUBLIC_AWS_COGNITO_REGION=eu-west-1

# S3 Storage
NEXT_PUBLIC_AWS_STORAGE_BUCKET=civigliowebba8ebe1e07b047938f92b0cad411ac6f221800-test
NEXT_PUBLIC_CLOUDFRONT_URL=https://d1eqtzn4fayhe0.cloudfront.net

# API Endpoints
NEXT_PUBLIC_API_BASE_URL=https://dev.civiglio.it/
NEXT_PUBLIC_API_POI_ADD_UPDATE=https://bgsxzp0b7a.execute-api.eu-west-1.amazonaws.com/test/poicrud
NEXT_PUBLIC_API_GEO_SEARCH=https://bgsxzp0b7a.execute-api.eu-west-1.amazonaws.com/test/searchgeo
NEXT_PUBLIC_API_CIVIGLIO=https://api.civiglio.it:3443

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyCzhAJASoo4TQuH9tsKOL0zF1UzFgJUIs0

# Analytics (Pinpoint)
NEXT_PUBLIC_ANALYTICS_APP_ID=78aa644faacd4d5bb9038654647b3ecf
NEXT_PUBLIC_ANALYTICS_REGION=eu-west-1

# OAuth (se necessario)
NEXT_PUBLIC_OAUTH_DOMAIN=civiglioweb90af3ccd-90af3ccd-test.auth.eu-west-1.amazoncognito.com
NEXT_PUBLIC_OAUTH_REDIRECT_SIGN_IN=https://test.civiglio.it/
NEXT_PUBLIC_OAUTH_REDIRECT_SIGN_OUT=https://test.civiglio.it/

# Build Configuration
GENERATE_SOURCEMAP=false
```

---

## 📝 STEP-BY-STEP: Deployment Checklist

### ⬜ STEP 1: Prepara Repository Git (5 minuti)

```bash
cd /Users/danielecarnovale/Claude-code/civiglio-web-nextjs

# 1.1 Inizializza Git
git init

# 1.2 Aggiungi .gitignore se non esiste
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env

# Vercel
.vercel

# Amplify (non includere la configurazione locale)
amplify/
.amplify/

# Cache
.next/cache/
EOF

# 1.3 Primo commit
git add .
git commit -m "feat: Next.js 16 migration

- Migrated from React to Next.js 16.1.1
- Implemented POI marker clustering with points-cluster
- Added auto-geolocation on map load
- Added single-dialog behavior for marker info windows
- Improved search functionality with debounce
- Fixed GraphQL query parameters
- Added comprehensive documentation
- Backend/Frontend separation ready"
```

### ⬜ STEP 2: Crea Repository Remoto (3 minuti)

**Opzione A: GitHub (consigliato)**

1. Vai su https://github.com/new
2. Nome: `civiglio-web-nextjs-frontend`
3. Private: ✅ (consigliato)
4. NON inizializzare con README
5. Click "Create repository"

```bash
# Collega repository
git remote add origin https://github.com/YOUR_USERNAME/civiglio-web-nextjs-frontend.git
git branch -M main
git push -u origin main
```

**Opzione B: AWS CodeCommit**

1. Vai su [AWS CodeCommit Console](https://eu-west-1.console.aws.amazon.com/codesuite/codecommit/repositories)
2. Click "Create repository"
3. Nome: `civiglio-web-nextjs-frontend`
4. Description: "Civiglio Web - Next.js Frontend"
5. Click "Create"

```bash
# Collega repository (sostituisci con il tuo URL)
git remote add origin https://git-codecommit.eu-west-1.amazonaws.com/v1/repos/civiglio-web-nextjs-frontend
git push -u origin main
```

### ⬜ STEP 3: Crea Branch Staging (2 minuti)

```bash
# Crea branch staging per test
git checkout -b staging
git push -u origin staging

# Torna su main
git checkout main
```

### ⬜ STEP 4: Crea App AWS Amplify Hosting (10 minuti)

1. **Vai su [AWS Amplify Console](https://eu-west-1.console.aws.amazon.com/amplify/home?region=eu-west-1)**

2. **Click "New app" → "Host web app"**

3. **Scegli Git provider:**
   - GitHub → Autorizza AWS Amplify se richiesto
   - CodeCommit → Seleziona repository

4. **Configura repository:**
   - Repository: `civiglio-web-nextjs-frontend`
   - Branch: `staging` (per iniziare con test)
   - Click "Next"

5. **App name:**
   - Nome: `civiglio-web-frontend`
   - Environment: `staging`

6. **Build settings:**

   Verifica che la configurazione sia così:

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

   Click "Next"

7. **Environment variables:**

   Click "Add environment variable" e aggiungi TUTTE le variabili dal box sopra ☝️

   **IMPORTANTE:** Copia/incolla tutto il blocco da qui sopra!

8. **Review and Deploy:**

   - Controlla tutto
   - Click "Save and deploy"
   - ⏱️ Attendi 5-10 minuti

### ⬜ STEP 5: Verifica Deploy (5 minuti)

Una volta completato il deploy:

1. **Copia l'URL generato:**
   ```
   https://staging.d[APP_ID].amplifyapp.com
   ```

2. **Testa le funzionalità:**
   - [ ] Home page carica
   - [ ] Mappa si visualizza
   - [ ] Geolocalizzazione richiede permesso
   - [ ] Ricerca indirizzo funziona
   - [ ] POI vengono caricati
   - [ ] Clustering funziona allo zoom
   - [ ] Click su marker apre dialog
   - [ ] Click su X chiude dialog
   - [ ] Click su altro marker chiude il precedente

3. **Controlla logs:**
   - In Amplify Console → Build history
   - Verifica che non ci siano errori

### ⬜ STEP 6: Collega Branch Main per Produzione (5 minuti)

Dopo che staging funziona:

1. **In Amplify Console:**
   - Click "Connect branch"
   - Seleziona `main`
   - Usa stesse configurazioni di staging
   - Click "Save and deploy"

2. **Risultato:**
   - Staging: `https://staging.d[APP_ID].amplifyapp.com`
   - Production: `https://main.d[APP_ID].amplifyapp.com`

### ⬜ STEP 7: Configura Custom Domain (Opzionale - 10 minuti)

Solo se vuoi usare il tuo dominio:

1. **In Amplify Console → Domain management**

2. **Click "Add domain"**

3. **Inserisci dominio:**
   - Domain: `civiglio.it` (o il tuo)
   - Click "Configure domain"

4. **Configura sottodomini:**
   - `staging.civiglio.it` → staging branch
   - `www.civiglio.it` → main branch
   - `civiglio.it` → redirect to www

5. **Amplify creerà automaticamente:**
   - ✅ SSL certificate
   - ✅ CloudFront distribution
   - ✅ DNS records (se usi Route 53)

6. **Se DNS è esterno a AWS:**

   Copia i record CNAME forniti e aggiungili al tuo provider DNS:
   ```
   CNAME staging → [ID].cloudfront.net
   CNAME www → [ID].cloudfront.net
   ```

7. **Attendi 15-30 minuti** per propagazione DNS

### ⬜ STEP 8: Configura CORS su Backend (IMPORTANTE!)

Il frontend ora sarà su un dominio diverso, devi permettere CORS:

1. **Vai su [AWS AppSync Console](https://eu-west-1.console.aws.amazon.com/appsync/home?region=eu-west-1)**

2. **Seleziona API: `civiglioweb`**

3. **Settings → Additional Settings → CORS**

4. **Aggiungi i nuovi domini:**
   ```
   https://staging.d[APP_ID].amplifyapp.com
   https://main.d[APP_ID].amplifyapp.com
   https://staging.civiglio.it
   https://www.civiglio.it
   ```

5. **Save**

### ⬜ STEP 9: Test Completo (10 minuti)

1. **Apri staging URL nel browser**

2. **Test funzionalità:**
   - [ ] Geolocalizzazione automatica
   - [ ] Marker utente blu con animazione pulse
   - [ ] Ricerca indirizzo con autocomplete
   - [ ] POI caricati nel raggio selezionato
   - [ ] Clustering funziona (zoom in/out)
   - [ ] Click su cluster → zoom in
   - [ ] Click su marker → dialog si apre
   - [ ] Click su X → dialog si chiude
   - [ ] Click su altro marker → precedente si chiude
   - [ ] Vai al dettaglio POI funziona
   - [ ] Autenticazione funziona (se applicabile)

3. **Controlla Console Browser:**
   - Non devono esserci errori rossi
   - API calls devono ritornare 200
   - GraphQL queries devono funzionare

4. **Test su Mobile:**
   - Responsive design
   - Touch gestures funzionano
   - Geolocalizzazione mobile

---

## 🎯 Workflow di Sviluppo Continuo

### Sviluppo Quotidiano

```bash
# 1. Sviluppo locale
cd /Users/danielecarnovale/Claude-code/civiglio-web-nextjs
npm run dev
# → http://localhost:3000

# 2. Modifica codice
# ... fai le tue modifiche ...

# 3. Test locale
npm run build
npm run start

# 4. Commit
git add .
git commit -m "feat: nuova funzionalità X"

# 5. Push su staging per test online
git push origin staging
# → Auto-deploy su https://staging.d[APP_ID].amplifyapp.com
# → Attendi 3-5 minuti

# 6. Test su staging URL

# 7. Se tutto ok, merge su main
git checkout main
git merge staging
git push origin main
# → Auto-deploy su https://main.d[APP_ID].amplifyapp.com (PRODUZIONE)
```

### Hotfix Urgente

```bash
# 1. Crea branch hotfix
git checkout -b hotfix/nome-fix main

# 2. Fix il bug
# ... modifica ...

# 3. Commit e push
git add .
git commit -m "fix: risolto bug X"
git push origin hotfix/nome-fix

# 4. Merge diretto su main (se urgente)
git checkout main
git merge hotfix/nome-fix
git push origin main

# 5. Merge anche su staging
git checkout staging
git merge hotfix/nome-fix
git push origin staging

# 6. Elimina branch
git branch -d hotfix/nome-fix
git push origin --delete hotfix/nome-fix
```

---

## 📊 Monitoring Post-Deploy

### AWS Amplify Console

- **Build logs:** Verifica ogni deploy
- **Metrics:** Traffico, response time
- **Alarms:** Configura notifiche per errori

### CloudWatch

1. Vai su CloudWatch Console
2. Log groups → `/aws/amplify/[APP_ID]`
3. Monitora errori e performance

### AppSync Metrics

1. Vai su AppSync Console
2. Metrics tab
3. Monitora:
   - Request count
   - Latency
   - Errors

---

## ⚠️ Troubleshooting Comune

### Build Fallisce

**Errore:** "npm ERR! Missing script: build"
```bash
# Verifica package.json contenga:
"scripts": {
  "build": "next build",
  "start": "next start"
}
```

**Errore:** "Module not found"
```bash
# Reinstalla dipendenze localmente
npm install
git add package-lock.json
git commit -m "fix: update dependencies"
git push
```

### API Calls Falliscono

**Errore:** "CORS error" nella console
```bash
# Soluzione: Aggiungi dominio in AppSync CORS settings (vedi Step 8)
```

**Errore:** "Unauthorized"
```bash
# Verifica che API Key sia corretta nelle Environment Variables
# In Amplify Console → App settings → Environment variables
# Controlla: NEXT_PUBLIC_AWS_APPSYNC_API_KEY
```

### Mappa Non Si Carica

**Errore:** "Google Maps JavaScript API error"
```bash
# Verifica che NEXT_PUBLIC_GOOGLE_MAPS_API_KEY sia corretta
# Controlla console browser per errore specifico
```

### Deploy Lento (>10 minuti)

```yaml
# In amplify.yml, abilita cache aggressive:
cache:
  paths:
    - node_modules/**/*
    - .next/cache/**/*
    - ~/.npm/**/*
```

---

## ✅ Checklist Completa

### Preparazione
- [ ] Repository Git inizializzato
- [ ] Primo commit creato
- [ ] Repository remoto creato (GitHub/CodeCommit)
- [ ] Codice pushato su remote
- [ ] Branch staging creato

### Amplify Setup
- [ ] Nuova app Amplify creata
- [ ] Repository collegato
- [ ] Build settings configurati
- [ ] Environment variables aggiunte (TUTTE!)
- [ ] Branch staging collegato
- [ ] Primo deploy completato

### Testing
- [ ] Build completa con successo
- [ ] URL staging accessibile
- [ ] Home page carica correttamente
- [ ] Mappa funziona
- [ ] Geolocalizzazione funziona
- [ ] API calls funzionano
- [ ] POI si caricano
- [ ] Clustering funziona
- [ ] Dialog marker funziona

### Produzione
- [ ] Branch main collegato
- [ ] Deploy produzione completato
- [ ] URL produzione testato
- [ ] Custom domain configurato (opzionale)
- [ ] SSL attivo
- [ ] CORS configurato su AppSync
- [ ] Monitoring attivo

---

## 📞 Supporto

Se incontri problemi:

1. **Controlla Build Logs** in Amplify Console
2. **Controlla Browser Console** per errori JavaScript
3. **Verifica Environment Variables** - devono essere ESATTAMENTE come sopra
4. **Controlla CORS** in AppSync settings
5. **Test API calls** manualmente (Postman/curl)

---

**Versione:** 1.0.0
**Data:** 2025-12-31
**Status:** 📋 Ready to Deploy

**Tempo stimato totale:** 45-60 minuti (incluso test)
