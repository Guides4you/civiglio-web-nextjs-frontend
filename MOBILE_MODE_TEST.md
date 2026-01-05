# 📱 Mobile Mode - Guida Test

## Problema Risolto

**Issue**: Quando l'app apre la webview con `?mobile=true`, durante la navigazione tra le pagine il parametro veniva perso e ricomparivano header e footer.

**Soluzione**: Implementata persistenza della modalità mobile usando `sessionStorage`. Una volta rilevato `?mobile=true`, lo stato viene salvato e mantenuto per tutta la sessione del browser.

---

## 🔧 Come Funziona

### 1. **Rilevamento Iniziale**
Quando l'app apre un URL con `?mobile=true`:
```
https://www.civiglio.it/guide/pub/home?mobile=true
```

Il sistema:
1. Rileva il parametro `mobile=true` nell'URL
2. Salva in `sessionStorage.setItem('civiglio_mobile_mode', 'true')`
3. Imposta lo stato interno `isMobileMode = true`

### 2. **Persistenza Durante la Navigazione**
Quando l'utente naviga tra le pagine (anche senza `?mobile=true` nell'URL):
```javascript
// In PubLayout.js
useEffect(() => {
  if (mobile === 'true') {
    sessionStorage.setItem('civiglio_mobile_mode', 'true');
    setIsMobileMode(true);
  } else {
    // Controlla se mobile mode era già attivo
    const storedMobileMode = sessionStorage.getItem('civiglio_mobile_mode');
    if (storedMobileMode === 'true') {
      setIsMobileMode(true);
    }
  }
}, [mobile]);
```

### 3. **Effetti della Mobile Mode**
Quando `isMobileMode = true`:
- ✅ **Header nascosto**: HeaderNew non viene renderizzato
- ✅ **Footer nascosto**: Footer non viene renderizzato
- ✅ **App Download Banner nascosto**: Non viene mostrato
- ✅ **Zoom disabilitato**: Meta viewport con `user-scalable=no`

---

## 🧪 Come Testare

### Test 1: URL Iniziale con mobile=true

1. Avvia il server:
   ```bash
   npm run dev
   ```

2. Apri nel browser:
   ```
   http://localhost:3000/guide/pub/home?mobile=true
   ```

3. **Verifica**:
   - [ ] Header non visibile
   - [ ] Footer non visibile
   - [ ] Zoom disabilitato (prova a fare pinch-to-zoom)
   - [ ] Controlla console: dovrebbe mostrare log di sessionStorage

4. **Naviga** ad un POI (clicca su qualsiasi punto di interesse)

5. **Verifica dopo navigazione**:
   - [ ] URL cambiato (es: `/guide/pub/detail/123/titolo`)
   - [ ] Header ANCORA non visibile (questo è il fix!)
   - [ ] Footer ANCORA non visibile (questo è il fix!)
   - [ ] Zoom ancora disabilitato

### Test 2: Navigazione Multipla

1. Parti da:
   ```
   http://localhost:3000/guide/pub/home?mobile=true
   ```

2. Sequenza di navigazioni:
   - Homepage → POI 1
   - POI 1 → POI 2
   - POI 2 → Canale utente
   - Canale utente → Homepage
   - Homepage → POI 3

3. **Verifica ad ogni step**:
   - [ ] Header/Footer rimangono nascosti
   - [ ] Zoom rimane disabilitato

### Test 3: Nuova Tab/Finestra (Stesso Browser)

1. Apri:
   ```
   http://localhost:3000/guide/pub/home?mobile=true
   ```

2. Apri una **nuova tab** nello stesso browser

3. Nella nuova tab, vai a:
   ```
   http://localhost:3000/guide/pub/home
   ```
   (senza `?mobile=true`)

4. **Verifica**:
   - [ ] Header/Footer SONO visibili (nuova sessione, diverso sessionStorage)

### Test 4: Chiusura e Riapertura Browser

1. Apri con `?mobile=true`
2. Naviga in diverse pagine
3. **Chiudi il browser completamente**
4. **Riapri il browser**
5. Vai a `http://localhost:3000/guide/pub/home` (senza parametro)

6. **Verifica**:
   - [ ] Header/Footer SONO visibili (sessionStorage cancellato alla chiusura)

### Test 5: URL Diretto Senza Parametro (Dopo mobile=true)

1. Apri:
   ```
   http://localhost:3000/guide/pub/home?mobile=true
   ```

2. Nella barra degli indirizzi, modifica manualmente in:
   ```
   http://localhost:3000/guide/pub/detail/123/titolo
   ```
   (senza `?mobile=true`)

3. Premi Invio

4. **Verifica**:
   - [ ] Header/Footer ANCORA nascosti (sessionStorage persiste)

---

## 🔍 Debug

### Controlla sessionStorage

Apri DevTools Console e digita:
```javascript
sessionStorage.getItem('civiglio_mobile_mode')
```

**Risultati attesi**:
- Se mobile mode attivo: `"true"`
- Se mobile mode non attivo: `null`

### Pulisci sessionStorage Manualmente

Per testare un reset:
```javascript
sessionStorage.removeItem('civiglio_mobile_mode')
// Poi ricarica la pagina
location.reload()
```

### Log in Console

Il sistema logga automaticamente:
```javascript
// In AppDownloadBanner.jsx
console.log('mobile session:', isMobileSession);

// Verifica che mostri:
// mobile session: true  (quando mobile mode attivo)
// mobile session: false (quando mobile mode non attivo)
```

---

## 📊 Test Matrix

| Scenario | URL Iniziale | Azione | Header Visibile? | Footer Visibile? |
|----------|--------------|--------|------------------|------------------|
| 1 | `/home?mobile=true` | Carica pagina | ❌ No | ❌ No |
| 2 | `/home?mobile=true` | Naviga → POI | ❌ No | ❌ No |
| 3 | `/home?mobile=true` | Naviga → Canale | ❌ No | ❌ No |
| 4 | `/home` (no param) | Carica pagina | ✅ Si | ✅ Si |
| 5 | `/home` (no param) | Naviga → POI | ✅ Si | ✅ Si |
| 6 | `/home?mobile=true` + chiudi browser | Riapri → `/home` | ✅ Si | ✅ Si |

---

## 🚀 Test in Produzione (App Webview)

### Setup App

Configura l'app per aprire:
```
https://www.civiglio.it/guide/pub/home?mobile=true
```

### Test Flow

1. **Apri app** → Webview carica con `?mobile=true`
2. **Verifica**: Header/Footer nascosti
3. **Naviga** tra POI, canali, homepage
4. **Verifica**: Header/Footer rimangono nascosti in tutte le pagine
5. **Chiudi app** e riapri
6. **Verifica**: Header/Footer ancora nascosti (sessionStorage persiste finché webview è aperta)

### Test Zoom Mobile

Su dispositivo mobile reale:
1. Apri URL con `?mobile=true`
2. Prova a fare **pinch-to-zoom**
3. **Verifica**: Zoom disabilitato
4. Naviga ad altra pagina
5. Prova ancora **pinch-to-zoom**
6. **Verifica**: Zoom ancora disabilitato

---

## 🐛 Troubleshooting

### Header/Footer ricompaiono dopo navigazione

**Controlla**:
1. DevTools Console → Errori JavaScript?
2. sessionStorage è supportato dal browser?
3. Browser in modalità privata? (sessionStorage funziona ma si cancella)

**Soluzione**:
```javascript
// Testa in console
if (typeof sessionStorage !== 'undefined') {
  console.log('sessionStorage supportato');
} else {
  console.log('sessionStorage NON supportato');
}
```

### sessionStorage non si cancella mai

Se vuoi forzare la cancellazione (utile per test):
```javascript
sessionStorage.clear()
location.reload()
```

### Mobile mode attivo anche senza parametro

Se sessionStorage è settato, la mobile mode rimane attiva.

**Per resetare**:
1. Chiudi completamente il browser (tutte le tab)
2. Oppure usa modalità incognito per test puliti

---

## 📝 Note Tecniche

### Durata sessionStorage
- **Persiste**: Durante tutta la sessione del browser (anche con navigazioni)
- **Cancella**: Quando chiudi tutte le tab di quel dominio
- **Non condiviso**: Tra tab diverse (ogni tab ha il suo sessionStorage)

### localStorage vs sessionStorage
Usiamo **sessionStorage** e non localStorage perché:
- ✅ Si cancella automaticamente quando chiudi il browser
- ✅ Più appropriato per stato "temporaneo" legato alla sessione
- ✅ Non persiste tra sessioni diverse del browser

Se servisse persistenza permanente, si potrebbe usare localStorage.

---

## ✅ Checklist Pre-Deploy

Prima di deployare in produzione:

- [ ] Testato URL con `?mobile=true` in locale
- [ ] Testato navigazione multipla mantiene mobile mode
- [ ] Testato su browser mobile (Chrome/Safari iOS/Android)
- [ ] Testato pinch-to-zoom disabilitato
- [ ] Testato in webview reale dell'app
- [ ] Verificato che header/footer rimangono nascosti in tutte le pagine
- [ ] Testato chiusura e riapertura app
- [ ] Nessun errore in console

---

## 🔗 File Modificati

1. **`/src/components/layouts/PubLayout.js`**
   - Aggiunto state `isMobileMode`
   - Implementato salvataggio in sessionStorage
   - Lettura da sessionStorage su ogni render
   - Usato `isMobileMode` invece di controllare solo query param

2. **`/src/components/util-components/AppDownloadBanner.jsx`**
   - Aggiunto controllo sessionStorage
   - Banner non mostrato se mobile mode attivo

---

**Data creazione**: Gennaio 2025
**Versione**: 1.0
**Compatibilità**: Tutti i browser moderni con sessionStorage support
