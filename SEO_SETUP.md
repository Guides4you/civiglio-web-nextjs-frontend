# Guida SEO e Indicizzazione Google Search Console

## ✅ Configurazioni Completate

### 1. Sitemap Dinamica
- **URL**: `https://www.civiglio.it/sitemap.xml`
- **Implementazione**: `/pages/api/sitemap.xml.js`
- **Caratteristiche**:
  - Generata dinamicamente da API GraphQL
  - Include homepage e tutti i POI pubblici
  - Cache di 1 ora (3600s) con revalidazione
  - Formato standard XML sitemap 0.9

### 2. Robots.txt
- **Posizione**: `/public/robots.txt`
- **Configurazione**:
  - Consente l'indicizzazione delle pagine pubbliche (`/guide/pub/*`)
  - Blocca sezioni private (admin, app, auth)
  - Blocca endpoint API
  - Riferimento alla sitemap

### 3. Meta Tag SEO

#### Meta Tag Globali (_document.js)
- Description, keywords, author
- Robots directive (index, follow)
- Open Graph base
- Twitter Card

#### Homepage (/guide/pub/home)
- Title, description personalizzati
- Canonical URL
- Open Graph completo
- Twitter Card completo
- Immagine social

#### Pagine POI (/guide/pub/detail/[...slug])
- Title e description dinamici dal contenuto
- Canonical URL
- Open Graph con immagine POI
- Twitter Card completo
- **Schema.org structured data** (Place schema con coordinate geografiche)

### 4. Configurazione Next.js
- Rewrite `/sitemap.xml` → `/api/sitemap.xml`
- SEO-friendly URLs

---

## 🚀 Passi per l'Indicizzazione su Google Search Console

### Passo 1: Verifica Proprietà del Sito

1. Vai su [Google Search Console](https://search.google.com/search-console)
2. Clicca su "Aggiungi proprietà"
3. Scegli il tipo di proprietà:
   - **Opzione A: Dominio** (consigliata)
     - Inserisci `civiglio.it`
     - Segui le istruzioni per verificare tramite DNS (aggiungi record TXT)

   - **Opzione B: Prefisso URL**
     - Inserisci `https://www.civiglio.it`
     - Metodi di verifica disponibili:
       - File HTML (crea file nella cartella `public/`)
       - Meta tag HTML (aggiungi in `_document.js`)
       - Google Analytics (se già installato)
       - Google Tag Manager (se già installato)

#### Metodo File HTML (più semplice)
```bash
# Google fornirà un file tipo: google1234abcd.html
# Crealo in /public/google1234abcd.html con il contenuto fornito
# Esempio:
echo "google-site-verification: google1234abcd.html" > public/google1234abcd.html
```

#### Metodo Meta Tag
Aggiungi in `/pages/_document.js` nel tag `<Head>`:
```html
<meta name="google-site-verification" content="CODICE_FORNITO_DA_GOOGLE" />
```

### Passo 2: Invia la Sitemap

1. Dopo la verifica, vai su **Sitemaps** nel menu laterale
2. Clicca su "Aggiungi una nuova sitemap"
3. Inserisci: `sitemap.xml`
4. Clicca "Invia"

### Passo 3: Richiedi Indicizzazione delle Pagine Principali

1. Vai su **Controllo URL** in alto
2. Inserisci gli URL principali:
   - `https://www.civiglio.it/guide/pub/home`
   - `https://www.civiglio.it/guide/pub/detail/[ID-POI-IMPORTANTE]`
3. Clicca "Richiedi indicizzazione" per ciascuno

### Passo 4: Monitora l'Indicizzazione

- **Copertura**: Controlla quante pagine sono state indicizzate
- **Prestazioni**: Visualizza impressioni, clic, posizione media
- **Usabilità mobile**: Verifica che non ci siano problemi
- **Core Web Vitals**: Monitora le performance (LCP, FID, CLS)

---

## 📊 Structured Data (Schema.org)

Le pagine POI includono structured data in formato JSON-LD per migliorare l'indicizzazione:

```json
{
  "@context": "https://schema.org",
  "@type": "Place",
  "name": "Nome POI",
  "description": "Descrizione POI",
  "image": "URL immagine",
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 41.89,
    "longitude": 12.49
  }
}
```

**Test Structured Data**:
- Usa [Rich Results Test](https://search.google.com/test/rich-results)
- Inserisci URL della pagina POI
- Verifica che lo schema sia valido

---

## 🔍 Checklist Pre-Deploy

- [ ] Verificare che la sitemap sia accessibile: `https://www.civiglio.it/sitemap.xml`
- [ ] Verificare robots.txt: `https://www.civiglio.it/robots.txt`
- [ ] Testare meta tag su homepage
- [ ] Testare meta tag su almeno 2 pagine POI diverse
- [ ] Verificare che le immagini social siano visibili
- [ ] Testare structured data con Rich Results Test
- [ ] Configurare reindirizzamento da vecchio dominio/route se necessario

---

## 🔄 Redirect dalla Vecchia Versione

### ✅ Implementato - Hash URL Redirect

La vecchia versione usava **React Router con hash routing**, generando URL come:
- `https://www.civiglio.it/#/guide/pub/home`
- `https://www.civiglio.it/#/guide/pub/detail/[id]/[slug]`
- `https://www.civiglio.it/#/guide/pub/canale/[id]`

**Soluzione implementata**: Redirect automatico client-side in `_app.js`

**Come funziona**:
1. Al caricamento della pagina, controlla se c'è un hash nell'URL
2. Se l'hash inizia con `#/`, estrae il path
3. Usa `router.replace()` per redirigere al nuovo URL pulito
4. Preserva i query parameters (es. `?mobile=true`)

**Codice** (`pages/_app.js`):
```javascript
useEffect(() => {
  if (typeof window === 'undefined') return;

  const hash = window.location.hash;

  if (hash && hash.startsWith('#/')) {
    const newPath = hash.substring(1);
    const [pathPart, queryPart] = newPath.split('?');

    console.log('🔄 Redirecting from old hash route:', hash, '→', pathPart);

    if (queryPart) {
      router.replace(`${pathPart}?${queryPart}`);
    } else {
      router.replace(pathPart);
    }
  }
}, [router]);
```

### 🧪 Test del Redirect

**Pagina di test**: `http://localhost:3000/test-redirect.html`

Questa pagina HTML contiene link a tutti i vecchi URL per testare il redirect:
- Homepage con hash
- Pagine POI con hash
- Pagine canale con hash
- URL con parametro `?mobile=true`

**Test manuali**:
```bash
# Avvia il server
npm run dev

# Apri nel browser
http://localhost:3000/#/guide/pub/home
→ Dovrebbe redirigere a: http://localhost:3000/guide/pub/home

http://localhost:3000/#/guide/pub/detail/123/titolo
→ Dovrebbe redirigere a: http://localhost:3000/guide/pub/detail/123/titolo

http://localhost:3000/#/guide/pub/home?mobile=true
→ Dovrebbe redirigere a: http://localhost:3000/guide/pub/home?mobile=true
```

### 📊 Impatto SEO

**Vantaggi**:
- ✅ Google indicizzerà solo i nuovi URL puliti (senza `#`)
- ✅ Link vecchi condivisi dagli utenti continueranno a funzionare
- ✅ Nessun errore 404 per bookmark vecchi
- ✅ Trasparente per l'utente finale

**Note**:
- Il redirect è **client-side** perché gli hash (#) non vengono inviati al server
- I motori di ricerca ignoreranno gli hash e indicizzeranno gli URL puliti
- Non serve configurare redirect 301 lato server

---

## 📈 Monitoraggio Post-Deploy

### Primi 7 giorni
- Controlla Google Search Console per errori di crawling
- Verifica che la sitemap venga processata
- Monitora le impression su Google

### Primi 30 giorni
- Analizza le query di ricerca
- Identifica pagine con problemi di performance
- Ottimizza meta description per pagine con basso CTR

### Continuo
- Monitora Core Web Vitals
- Aggiorna sitemap quando aggiungi nuovi POI
- Controlla broken link periodicamente

---

## 🛠️ Comandi Utili

### Test in locale
```bash
# Avvia il server di sviluppo
npm run dev

# Testa la sitemap
curl http://localhost:3000/sitemap.xml

# Testa robots.txt
curl http://localhost:3000/robots.txt
```

### Build e Deploy
```bash
# Build di produzione
npm run build

# Avvia in produzione (locale)
npm start

# Deploy (dipende dalla piattaforma)
# Vercel: vercel --prod
# AWS Amplify: amplify publish
```

---

## 📞 Supporto

Per problemi o domande:
- Verifica i log di Google Search Console
- Usa [PageSpeed Insights](https://pagespeed.web.dev/) per performance
- Consulta [documentazione Next.js SEO](https://nextjs.org/learn/seo/introduction-to-seo)

---

**Data setup**: Gennaio 2025
**Versione Next.js**: 16.1.1
