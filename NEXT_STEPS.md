# 🎉 Repository Git Pronto! - Prossimi Passi

## ✅ Completato

```
✓ Git repository inizializzato
✓ Branch 'main' creato
✓ Branch 'staging' creato
✓ Primo commit creato (226 files, 94,470 righe)
✓ Tutti i file documentazione inclusi
✓ .env.example preparato
✓ .gitignore configurato
```

**Commit ID:** `238f1fe`
**Messaggio:** "feat: Next.js 16 migration with advanced features"

---

## 📍 Sei Qui

```
┌─────────────────────────────────────┐
│  Repository Locale                  │
│  ✓ Git inizializzato                │
│  ✓ 2 branches (main, staging)       │
│  ✓ 1 commit                          │
│  ✓ Pronto per push                   │
└─────────────────────────────────────┘
           │
           │ PROSSIMO PASSO ↓
           ▼
┌─────────────────────────────────────┐
│  Repository Remoto (GitHub/CodeCommit)│
│  ⚪ Da creare                         │
└─────────────────────────────────────┘
           │
           │ POI ↓
           ▼
┌─────────────────────────────────────┐
│  AWS Amplify Hosting                │
│  ⚪ Da configurare                    │
└─────────────────────────────────────┘
```

---

## 🚀 STEP 2: Collega Repository Remoto

Scegli una delle due opzioni:

### OPZIONE A: GitHub (Consigliato - Più Popolare)

#### 2A.1 Crea Repository su GitHub

1. **Apri browser:** https://github.com/new

2. **Configura repository:**
   ```
   Owner: [TUO_USERNAME]
   Repository name: civiglio-web-nextjs-frontend
   Description: Civiglio Web - Next.js Frontend (Backend Amplify separato)
   Visibility: ⚫ Private (consigliato)

   ⚠️ NON selezionare:
   ❌ Add a README file
   ❌ Add .gitignore
   ❌ Choose a license
   ```

3. **Click "Create repository"**

#### 2A.2 Collega e Push

```bash
# 1. Collega il repository remoto
git remote add origin https://github.com/TUO_USERNAME/civiglio-web-nextjs-frontend.git

# 2. Verifica connessione
git remote -v

# 3. Push del branch main
git push -u origin main

# 4. Push del branch staging
git push -u origin staging

# 5. Verifica
git branch -a
```

**Risultato atteso:**
```
Enumerating objects: 234, done.
Counting objects: 100% (234/234), done.
Delta compression using up to 8 threads
Compressing objects: 100% (221/221), done.
Writing objects: 100% (234/234), 2.45 MiB | 1.85 MiB/s, done.
Total 234 (delta 39), reused 0 (delta 0), pack-reused 0
To https://github.com/TUO_USERNAME/civiglio-web-nextjs-frontend.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

### OPZIONE B: AWS CodeCommit (Se Preferisci Tutto in AWS)

#### 2B.1 Configura AWS CLI (se non già fatto)

```bash
# Verifica se AWS CLI è configurato
aws sts get-caller-identity

# Se non configurato:
aws configure
# Inserisci:
# AWS Access Key ID: [TUO_ACCESS_KEY]
# AWS Secret Access Key: [TUO_SECRET_KEY]
# Default region: eu-west-1
# Default output format: json
```

#### 2B.2 Crea Repository su CodeCommit

```bash
# Crea repository
aws codecommit create-repository \
  --repository-name civiglio-web-nextjs-frontend \
  --repository-description "Civiglio Web - Next.js Frontend" \
  --region eu-west-1

# Output:
# {
#     "repositoryMetadata": {
#         "repositoryName": "civiglio-web-nextjs-frontend",
#         "cloneUrlHttp": "https://git-codecommit.eu-west-1.amazonaws.com/v1/repos/civiglio-web-nextjs-frontend",
#         "cloneUrlSsh": "ssh://git-codecommit.eu-west-1.amazonaws.com/v1/repos/civiglio-web-nextjs-frontend",
#         ...
#     }
# }
```

#### 2B.3 Collega e Push

```bash
# 1. Collega il repository remoto (usa l'URL dall'output sopra)
git remote add origin https://git-codecommit.eu-west-1.amazonaws.com/v1/repos/civiglio-web-nextjs-frontend

# 2. Configura credential helper (per autenticazione)
git config --global credential.helper '!aws codecommit credential-helper $@'
git config --global credential.UseHttpPath true

# 3. Push del branch main
git push -u origin main

# 4. Push del branch staging
git push -u origin staging

# 5. Verifica
git branch -a
```

---

## 🎯 STEP 3: Crea App AWS Amplify Hosting

### 3.1 Accedi ad AWS Console

**URL diretto:** https://eu-west-1.console.aws.amazon.com/amplify/home?region=eu-west-1

### 3.2 Crea Nuova App

1. **Click "New app" → "Host web app"**

2. **Scegli Git provider:**
   - Se hai usato GitHub → Seleziona "GitHub"
   - Se hai usato CodeCommit → Seleziona "AWS CodeCommit"

3. **Autorizza (solo per GitHub):**
   - Click "Authorize AWS Amplify"
   - Login su GitHub se richiesto
   - Concedi permessi

4. **Seleziona repository:**
   - Repository: `civiglio-web-nextjs-frontend`
   - Branch: `staging` (per iniziare con test)
   - Click "Next"

### 3.3 Configura Build

1. **App name:**
   ```
   civiglio-web-frontend
   ```

2. **Environment name:**
   ```
   staging
   ```

3. **Build settings:**

   Amplify dovrebbe auto-rilevare Next.js. Verifica che sia:

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

4. **Click "Next"**

### 3.4 Aggiungi Environment Variables (IMPORTANTE!)

**Click "Add environment variable"** e aggiungi TUTTE queste variabili:

```bash
NEXT_PUBLIC_AWS_REGION=eu-west-1
NEXT_PUBLIC_AWS_APPSYNC_GRAPHQL_ENDPOINT=https://jrprvscsc5ffxmw6w3pg75else.appsync-api.eu-west-1.amazonaws.com/graphql
NEXT_PUBLIC_AWS_APPSYNC_API_KEY=da2-5x54zel2gvcynha4qe7efn5us4
NEXT_PUBLIC_AWS_APPSYNC_REGION=eu-west-1
NEXT_PUBLIC_AWS_APPSYNC_AUTHENTICATION_TYPE=API_KEY
NEXT_PUBLIC_AWS_USER_POOLS_ID=eu-west-1_CKBuPpA2Z
NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID=3p47ofihslhosfpvs7grf4ij7v
NEXT_PUBLIC_AWS_IDENTITY_POOL_ID=eu-west-1:0cbe8811-66d1-478e-af11-7b3a85f71ad7
NEXT_PUBLIC_AWS_COGNITO_REGION=eu-west-1
NEXT_PUBLIC_AWS_STORAGE_BUCKET=civigliowebba8ebe1e07b047938f92b0cad411ac6f221800-test
NEXT_PUBLIC_CLOUDFRONT_URL=https://d1eqtzn4fayhe0.cloudfront.net
NEXT_PUBLIC_API_BASE_URL=https://dev.civiglio.it/
NEXT_PUBLIC_API_POI_ADD_UPDATE=https://bgsxzp0b7a.execute-api.eu-west-1.amazonaws.com/test/poicrud
NEXT_PUBLIC_API_GEO_SEARCH=https://bgsxzp0b7a.execute-api.eu-west-1.amazonaws.com/test/searchgeo
NEXT_PUBLIC_API_CIVIGLIO=https://api.civiglio.it:3443
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyCzhAJASoo4TQuH9tsKOL0zF1UzFgJUIs0
NEXT_PUBLIC_ANALYTICS_APP_ID=78aa644faacd4d5bb9038654647b3ecf
NEXT_PUBLIC_ANALYTICS_REGION=eu-west-1
NEXT_PUBLIC_OAUTH_DOMAIN=civiglioweb90af3ccd-90af3ccd-test.auth.eu-west-1.amazoncognito.com
NEXT_PUBLIC_OAUTH_REDIRECT_SIGN_IN=https://test.civiglio.it/
NEXT_PUBLIC_OAUTH_REDIRECT_SIGN_OUT=https://test.civiglio.it/
GENERATE_SOURCEMAP=false
```

**💡 Tip:** Puoi copiare/incollare dall'editor in blocco! Ogni variabile su una riga separata.

### 3.5 Review and Deploy

1. **Review:**
   - Repository: ✓
   - Branch: ✓
   - Build settings: ✓
   - Environment variables: ✓ (21 variabili)

2. **Click "Save and deploy"**

3. **Attendi 5-10 minuti** ⏱️

   Vedrai le fasi:
   ```
   ⚙️ Provision → Build → Deploy → Verify
   ```

4. **Quando vedi "Deployed":**
   - ✅ Deploy completato!
   - Copia l'URL: `https://staging.d[APP_ID].amplifyapp.com`

---

## 🧪 STEP 4: Test dell'App Deployata

### 4.1 Apri l'App

```
URL: https://staging.d[APP_ID].amplifyapp.com
```

### 4.2 Checklist Test

Apri la Console del browser (F12) e testa:

- [ ] **Home page carica**
  - Aspettato: Nessun errore 500/404

- [ ] **Mappa si visualizza**
  - Aspettato: Google Maps caricata

- [ ] **Geolocalizzazione richiede permesso**
  - Aspettato: Browser chiede "Consentire geolocalizzazione?"

- [ ] **Se permetti geolocalizzazione:**
  - [ ] Marker blu appare sulla tua posizione
  - [ ] Mappa si centra sulla posizione
  - [ ] POI vicini vengono caricati
  - [ ] Badge mostra "X POI trovati"

- [ ] **Ricerca indirizzo:**
  - [ ] Autocomplete funziona
  - [ ] Click su suggerimento centra mappa
  - [ ] POI nel raggio vengono caricati

- [ ] **Clustering:**
  - [ ] A zoom basso vedi cluster con numeri
  - [ ] Click su cluster → zoom in
  - [ ] A zoom alto vedi marker singoli

- [ ] **Marker dialog:**
  - [ ] Click su marker → dialog si apre
  - [ ] Dialog ha pulsante X in alto a destra
  - [ ] Click su X → dialog si chiude
  - [ ] Click su altro marker → precedente si chiude
  - [ ] "Vai al dettaglio" naviga alla pagina POI

### 4.3 Console Browser

Apri Console (F12) e verifica:

```
✅ Nessun errore rosso
✅ API calls ritornano 200
✅ GraphQL queries funzionano
✅ Log: "🔍 API_GEO_SEARCH Response: [...]"
✅ Log: "📊 Number of POIs found: X"
```

### 4.4 Test Mobile (Opzionale)

Apri da smartphone e verifica:
- Touch gestures funzionano
- Dialog responsive
- Geolocalizzazione GPS

---

## 🎯 STEP 5: Deploy su Produzione (Main Branch)

Dopo che staging funziona perfettamente:

### 5.1 Collega Branch Main

1. **In Amplify Console:**
   - Click app name (civiglio-web-frontend)
   - Click "Connect branch"

2. **Seleziona branch:**
   - Branch: `main`
   - Click "Next"

3. **Configurazione:**
   - Usa stesse impostazioni di staging
   - Click "Save and deploy"

4. **Risultato:**
   ```
   Staging:    https://staging.d[APP_ID].amplifyapp.com
   Production: https://main.d[APP_ID].amplifyapp.com
   ```

### 5.2 Workflow Futuro

```bash
# Sviluppo locale
npm run dev

# Commit e push su staging
git checkout staging
git add .
git commit -m "feat: nuova feature"
git push origin staging
# → Auto-deploy su staging URL

# Test su staging

# Quando ok, merge su main
git checkout main
git merge staging
git push origin main
# → Auto-deploy su production URL
```

---

## ⚙️ STEP 6: Configurazione CORS (IMPORTANTE!)

Il frontend ora è su un nuovo dominio. Devi aggiornare CORS su AppSync:

### 6.1 Vai su AppSync Console

**URL:** https://eu-west-1.console.aws.amazon.com/appsync/home?region=eu-west-1

### 6.2 Seleziona API

- Click su `civiglioweb`

### 6.3 Aggiungi Domini CORS

1. **Settings → Additional settings**

2. **CORS configuration:**

   Aggiungi questi domini:
   ```
   https://staging.d[APP_ID].amplifyapp.com
   https://main.d[APP_ID].amplifyapp.com
   ```

   Sostituisci `[APP_ID]` con il tuo ID reale (lo trovi nell'URL Amplify)

3. **Save**

---

## 📊 Monitoring & Logs

### In Amplify Console

- **Build history:** Ogni deploy
- **Logs:** Build logs e deploy logs
- **Metrics:** Traffico e performance

### CloudWatch Logs

- Log group: `/aws/amplify/[APP_ID]`
- Contiene errori runtime e access logs

---

## 🎉 Risultato Finale

```
┌────────────────────────────────────────────────────────────┐
│                      AWS CLOUD                              │
├────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐          ┌─────────────────────────┐ │
│  │  BACKEND         │          │  FRONTEND               │ │
│  │  (Esistente)     │          │  (Nuovo)                │ │
│  ├──────────────────┤          ├─────────────────────────┤ │
│  │  AppSync GraphQL │◄─────────│  Next.js 16             │ │
│  │  Cognito Auth    │   API    │  ├─ staging branch      │ │
│  │  DynamoDB        │  calls   │  │  staging.d[ID]...    │ │
│  │  Lambda          │          │  └─ main branch         │ │
│  │  S3 Storage      │          │     main.d[ID]...       │ │
│  │                  │          │                         │ │
│  │  NON TOCCATO     │          │  CI/CD ATTIVO ✓         │ │
│  └──────────────────┘          └─────────────────────────┘ │
│                                                              │
└────────────────────────────────────────────────────────────┘
```

**Vantaggi:**
- ✅ Backend sicuro e stabile
- ✅ Frontend deploy automatico
- ✅ Test su staging prima di produzione
- ✅ Rollback immediato se problemi
- ✅ Scalabilità indipendente

---

## 🆘 Troubleshooting Rapido

### Deploy Fallisce

**Controlla Build Logs in Amplify Console**

Errore comune: "Module not found"
```bash
# Locale:
npm install
git add package-lock.json
git commit -m "fix: update dependencies"
git push origin staging
```

### API Calls Falliscono

**Errore CORS in console browser**

Soluzione: Aggiungi dominio in AppSync CORS (vedi Step 6)

### Mappa Non Si Carica

**Controlla Environment Variables in Amplify**

Verifica che `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` sia presente.

---

## ✅ Checklist Completa

### Git Setup
- [x] Git inizializzato
- [x] Branch main creato
- [x] Branch staging creato
- [x] Primo commit creato
- [ ] Repository remoto collegato
- [ ] Push completato

### Amplify Setup
- [ ] App Amplify creata
- [ ] Branch staging collegato
- [ ] Environment variables aggiunte
- [ ] Primo deploy completato
- [ ] Test su staging URL
- [ ] Branch main collegato
- [ ] Deploy produzione completato

### Backend Configuration
- [ ] CORS aggiornato su AppSync

### Testing
- [ ] Home page funziona
- [ ] Mappa funziona
- [ ] Geolocalizzazione funziona
- [ ] API calls funzionano
- [ ] Clustering funziona
- [ ] Dialog marker funziona

---

**Tempo stimato totale:** 30-45 minuti

**Sei pronto!** 🚀

Procedi con lo Step 2 (scegli GitHub o CodeCommit) e poi segui gli step successivi.

Buon deploy! 🎉
