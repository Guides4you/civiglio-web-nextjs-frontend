# 🔄 Guida Test Redirect URL Vecchi → Nuovi

## Panoramica

La vecchia versione di Civiglio usava **React Router con hash routing**, generando URL con `#/` nel path.
La nuova versione Next.js usa **URL puliti senza hash**.

Per garantire che link vecchi, bookmark e URL condivisi continuino a funzionare, è stato implementato un **redirect automatico client-side**.

---

## 📋 Esempi di Redirect

### Homepage
```
VECCHIO: https://www.civiglio.it/#/guide/pub/home
NUOVO:   https://www.civiglio.it/guide/pub/home
```

### Pagina POI
```
VECCHIO: https://www.civiglio.it/#/guide/pub/detail/2700de67-bbc6-4e58-a3b0-63ce336a5591/Myth-of-Alaric
NUOVO:   https://www.civiglio.it/guide/pub/detail/2700de67-bbc6-4e58-a3b0-63ce336a5591/Myth-of-Alaric
```

### Pagina Canale
```
VECCHIO: https://www.civiglio.it/#/guide/pub/canale/62a2571c-9b36-4e70-9ec6-19a91f9e91a1
NUOVO:   https://www.civiglio.it/guide/pub/canale/62a2571c-9b36-4e70-9ec6-19a91f9e91a1
```

### Con parametri mobile
```
VECCHIO: https://www.civiglio.it/#/guide/pub/home?mobile=true
NUOVO:   https://www.civiglio.it/guide/pub/home?mobile=true
```

---

## 🧪 Come Testare

### Metodo 1: Pagina di Test Integrata

1. Avvia il server:
   ```bash
   npm run dev
   ```

2. Apri nel browser:
   ```
   http://localhost:3000/test-redirect.html
   ```

3. Clicca sui vari link di test

4. Verifica che:
   - ✅ L'URL nella barra del browser cambi (rimuove `#`)
   - ✅ La pagina si carichi correttamente
   - ✅ Nessun errore 404
   - ✅ I parametri query vengano preservati

### Metodo 2: Test Manuale Diretto

Inserisci direttamente nella barra del browser:

```
http://localhost:3000/#/guide/pub/home
```

**Risultato atteso**:
1. La pagina si carica
2. L'URL cambia automaticamente in: `http://localhost:3000/guide/pub/home`
3. Nessun flash o ricaricamento visibile
4. Console del browser mostra: `🔄 Redirecting from old hash route: #/guide/pub/home → /guide/pub/home`

### Metodo 3: Test con DevTools

1. Apri DevTools (F12)
2. Vai alla tab **Console**
3. Inserisci un URL vecchio nella barra del browser
4. Controlla il log di redirect nella console
5. Vai alla tab **Network** e verifica:
   - Nessuna richiesta HTTP extra (il redirect è solo client-side)
   - La pagina si carica normalmente

---

## ✅ Checklist Test Completa

### Homepage
- [ ] `/#/guide/pub/home` → `/guide/pub/home`
- [ ] `/#/guide/pub/home?mobile=true` → `/guide/pub/home?mobile=true`

### Pagine POI (da sitemap vecchia)
- [ ] `/#/guide/pub/detail/2700de67-bbc6-4e58-a3b0-63ce336a5591/Myth-of-Alaric`
- [ ] `/#/guide/pub/detail/6b8bf50c-f2a2-445a-9c17-650fbc153b0e/Gioaccchino-Greco`
- [ ] `/#/guide/pub/poiandmedia/eb979477-0bb9-4f70-b16b-1c1f5ba4a7d8/Castell-Dell-ovo`
- [ ] Con `?mobile=true` su almeno 2 POI

### Pagine Canale (da sitemap vecchia)
- [ ] `/#/guide/pub/canale/62a2571c-9b36-4e70-9ec6-19a91f9e91a1`
- [ ] `/#/guide/pub/canale/efa80750-977d-43c6-93a5-669ef71c31b6`
- [ ] `/#/guide/pub/canale/18bce374-b723-4f2f-ba18-5fef3e550e03`

### Edge Cases
- [ ] URL senza trailing slash: `/#/guide/pub/home`
- [ ] URL con trailing slash: `/#/guide/pub/home/`
- [ ] URL con multipli parametri query: `/#/guide/pub/home?mobile=true&lang=it`
- [ ] URL homepage root: `/` (non dovrebbe redirigere, è già corretto)
- [ ] URL senza hash: `/guide/pub/home` (non dovrebbe redirigere, è già corretto)

---

## 🔍 Cosa Verificare

### Browser
- **Chrome/Edge**: Verifica redirect su desktop e mobile view (DevTools)
- **Firefox**: Verifica compatibilità
- **Safari**: Verifica su macOS e iOS
- **Mobile Browsers**: Test su dispositivi reali se possibile

### Comportamento Atteso
1. **Performance**: Il redirect deve essere istantaneo (< 100ms)
2. **User Experience**: Nessun flash o schermata bianca
3. **Browser History**: Usa `router.replace()` quindi non crea nuove entry nella history
4. **Back Button**: Funziona correttamente (non torna all'URL con hash)
5. **Bookmark**: Se un utente aveva salvato un bookmark con hash, funziona ancora

### Console Logs
Quando avviene un redirect, dovresti vedere:
```
🔄 Redirecting from old hash route: #/guide/pub/home → /guide/pub/home
```

---

## 🐛 Troubleshooting

### Il redirect non funziona
**Possibili cause**:
1. JavaScript disabilitato nel browser
2. Errori nella console che bloccano l'esecuzione
3. Il router Next.js non è pronto

**Verifica**:
```javascript
// Apri console del browser e digita:
console.log(window.location.hash);  // Deve mostrare l'hash
console.log(window.location.href);  // Deve mostrare l'URL completo
```

### Redirect in loop infinito
**Non dovrebbe succedere** perché il redirect usa `router.replace()` e controlla solo se l'hash inizia con `#/`.

Se succede, controlla che non ci siano altri redirect configurati.

### Query parameters persi
Il codice gestisce i query parameters:
```javascript
const [pathPart, queryPart] = newPath.split('?');
if (queryPart) {
  router.replace(`${pathPart}?${queryPart}`);
}
```

Se i parametri vengono persi, controlla la console per errori.

---

## 📊 Statistiche di Redirect (Post-Deploy)

Dopo il deploy, puoi monitorare l'utilizzo dei vecchi URL:

### Google Analytics (se installato)
1. Imposta un evento custom per i redirect
2. Traccia quanti utenti usano ancora vecchi URL
3. Identifica quali pagine hanno più redirect

### Esempio tracking (opzionale):
```javascript
// In _app.js, dopo il redirect
if (typeof window !== 'undefined' && window.gtag) {
  window.gtag('event', 'hash_redirect', {
    'event_category': 'navigation',
    'event_label': hash,
    'value': 1
  });
}
```

---

## 🚀 Deploy Checklist

Prima di deployare in produzione:

- [ ] Tutti i test di redirect passano in locale
- [ ] Testato su almeno 3 browser diversi
- [ ] Testato su mobile (responsive + mobile view)
- [ ] Nessun errore nella console
- [ ] Performance verificata (redirect < 100ms)
- [ ] Documentazione aggiornata
- [ ] Team informato del cambio URL

Dopo il deploy:

- [ ] Testare URL vecchi su produzione
- [ ] Verificare redirect su almeno 5 pagine diverse
- [ ] Monitorare Google Search Console per errori 404
- [ ] Controllare che i motori di ricerca non indicizzino URL con hash

---

## 💡 Best Practices

1. **Non rimuovere il redirect**: Anche dopo mesi/anni, mantieni il redirect attivo per utenti con vecchi bookmark

2. **Monitora i 404**: Se vedi molti 404 su URL specifici, potrebbero esserci pattern di URL vecchi non coperti

3. **Comunica il cambio**: Informa utenti abituali del cambio URL (newsletter, social media)

4. **Google Search Console**: Richiedi rimozione degli URL vecchi indicizzati (se presenti)

---

## 📞 Supporto

Per problemi o domande sul redirect:
1. Controlla i log della console del browser
2. Verifica che `_app.js` contenga il codice di redirect
3. Testa con la pagina `/test-redirect.html`
4. Consulta questo documento

---

**Data creazione**: Gennaio 2025
**Versione**: 1.0
**Compatibilità**: Next.js 16.1.1
