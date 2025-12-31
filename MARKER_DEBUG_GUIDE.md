# 🔍 Marker Display Debug Guide

## ✅ Problemi Risolti

I marker non venivano visualizzati sulla mappa dopo la ricerca per **DUE bug**:

### 1. ❌ GraphQL Query con Parametri Errati (CRITICO)

**Errore:** La query GraphQL usava `$PK` invece di `$rangeKey`

**Sintomo:** Console error: `{data: null, errors: Array(1)}`

**Fix:**
- Query: `$rangeKey: String!` invece di `$PK: String!`
- getGeoPoi: `rangeKey: $rangeKey` invece di `rangeKey: $PK`
- Variables: `{ rangeKey: "...", SK: "..." }` invece di `{ PK: "...", SK: "..." }`

📖 Vedi dettagli completi in: `GRAPHQL_QUERY_FIX.md`

### 2. ❌ Bug nel Parsing delle Coordinate

**Errore:** Il codice cercava di usare `geoPoiData.geoJson.S` invece di `result.data.getGeoPoi.geoJson`

**Fix:** Usa il geoJson dal risultato GraphQL con fallback

## ✅ Modifiche Apportate

### 1. Corretto il Parsing del GeoJson

**Prima:**
```javascript
const coords = JSON.parse(geoPoiData.geoJson.S).coordinates;
```

**Dopo:**
```javascript
// Usa il geoJson dal risultato GraphQL, non da geoPoiData
const geoJsonString = result.data.getGeoPoi.geoJson || geoPoiData.geoJson?.S;

if (!geoJsonString) {
  console.error('❌ No geoJson found for POI:', geoPoiData.rangeKey.S);
  return null;
}

const geoJsonParsed = JSON.parse(geoJsonString);
const coords = geoJsonParsed.coordinates;
```

**Perché**: Il geoJson corretto viene restituito dalla query GraphQL `getGeoPoi`, non dall'API GEO_SEARCH. Ora c'è anche un fallback e un controllo di validità.

### 2. Aggiunto Logging Dettagliato

#### A. Nella funzione searchNearbyPOIs:

```javascript
// Log iniziale della risposta API
console.log('🔍 API_GEO_SEARCH Response:', response.data);
console.log('📊 Number of POIs found:', response.data?.length || 0);

// Log per ogni POI processato
console.log(`🔄 Processing POI ${index + 1}/${response.data.length}`);
console.log('📍 GeoPoiData:', geoPoiData);
console.log('✅ GraphQL Result:', result.data);
console.log('📍 Coordinates:', { lat: coords[1], lng: coords[0] });
console.log('✅ POI Object created:', poiObject);

// Log finale
console.log('📦 Valid POIs:', validPois);
console.log('📊 Valid POIs count:', validPois.length);
console.log('✅ nearbyPois state updated with', validPois.length, 'POIs');
```

#### B. Nel rendering:

```javascript
// Log markers da renderizzare
console.log('🗺️ Rendering markers - Total:', allMarkers.length);
console.log('🗺️ nearbyPois.length:', nearbyPois.length);
console.log('🗺️ initialPois.length:', initialPois.length);
console.log('🗺️ All markers:', allMarkers.map(...));
```

#### C. useEffect per tracking state:

```javascript
useEffect(() => {
  console.log('🔄 nearbyPois state changed:', nearbyPois);
  console.log('📊 nearbyPois count:', nearbyPois.length);
  if (nearbyPois.length > 0) {
    console.log('📍 First nearby POI:', nearbyPois[0]);
    console.log('📍 Coordinates of first POI:', {
      lat: nearbyPois[0].lat,
      lng: nearbyPois[0].lng
    });
  }
}, [nearbyPois]);
```

---

## 🧪 Come Testare

### 1. Avvia il server di sviluppo
```bash
npm run dev
```

### 2. Apri il browser
```
http://localhost:3000/guide/pub/home
```

### 3. Apri la Console del browser
- Chrome/Edge: F12 → Tab "Console"
- Firefox: F12 → Tab "Console"
- Safari: Cmd+Option+C

### 4. Cerca un indirizzo

Nella search box sulla mappa, digita un indirizzo (es. "Milano, Italia") e seleziona un suggerimento.

---

## 📊 Console Log - Cosa Aspettarsi

### Sequenza Corretta dei Log:

```
1. Place selected: { lat: 45.4642, lng: 9.1900 }

2. 🔍 API_GEO_SEARCH Response: [Array di POI]
   📊 Number of POIs found: 15

3. Per ogni POI:
   🔄 Processing POI 1/15
   📍 GeoPoiData: { rangeKey: { S: "..." }, ... }
   ✅ GraphQL Result: { getPoi: {...}, getGeoPoi: {...} }
   📍 Coordinates: { lat: 45.4650, lng: 9.1895 }
   ✅ POI Object created: { rangeKey: "...", titolo: "...", lat: 45.4650, lng: 9.1895 }

4. 📦 Valid POIs: [Array di POI completi]
   📊 Valid POIs count: 15
   ✅ nearbyPois state updated with 15 POIs

5. 🔄 nearbyPois state changed: [Array di 15 POI]
   📊 nearbyPois count: 15
   📍 First nearby POI: { rangeKey: "...", titolo: "...", lat: 45.4650, lng: 9.1895 }

6. 🗺️ Rendering markers - Total: 15
   🗺️ nearbyPois.length: 15
   🗺️ initialPois.length: 0
   🗺️ All markers: [Array di marker con id, lat, lng, title]
```

---

## 🚨 Possibili Problemi e Soluzioni

### Problema 1: "Number of POIs found: 0"

**Causa**: Nessun POI nell'area selezionata o raggio troppo piccolo

**Soluzione**:
- Aumenta il raggio di ricerca usando il RadiusSelector (bottone in alto a destra)
- Cerca un'area con più POI (es. centro città)

---

### Problema 2: GraphQL Query fallisce

**Log visto**:
```
❌ Error fetching POI details: [Error message]
⚠️ Missing getPoi or getGeoPoi data
```

**Possibili Cause**:
1. POI non ha la traduzione italiana (SK: '_it_POI' non esiste)
2. POI cancellato dal database
3. Errore di rete

**Soluzione**:
- Controlla che il POI esista nel database
- Verifica la connessione di rete
- Controlla che Amplify sia configurato correttamente

---

### Problema 3: Coordinate non valide

**Log visto**:
```
❌ No geoJson found for POI: [POI ID]
```

**Causa**: Il POI non ha coordinate geografiche

**Soluzione**: Questo POI verrà filtrato automaticamente (return null). Non è un errore critico.

---

### Problema 4: Marker non appaiono sulla mappa

**Verifica**:

1. Controlla che `allMarkers.length > 0` nei log
2. Verifica che le coordinate siano valide:
   ```javascript
   lat: deve essere tra -90 e 90
   lng: deve essere tra -180 e 180
   ```
3. Controlla che il centro della mappa sia corretto:
   ```javascript
   // Nel log, cerca:
   Place selected: { lat: ..., lng: ... }
   ```

**Se le coordinate sono fuori vista**:
- Fai zoom out sulla mappa manualmente
- I marker potrebbero essere lontani dal centro

---

### Problema 5: Marker appaiono ma poi scompaiono

**Causa**: nearbyPois viene resettato a `[]` per qualche motivo

**Verifica**:
```javascript
// Cerca nei log:
🔄 nearbyPois state changed: []
```

**Possibili cause**:
- Errore durante la ricerca successiva
- Re-render che resetta lo state
- Problema con handleRadiusChange

---

## 🎯 Test Cases

### Test 1: Ricerca Milano
```
1. Cerca "Milano, Italia"
2. Aspettati: 10-20 POI nel raggio di 5km
3. Verifica che i marker appaiano sulla mappa
4. Clicca su un marker → Dovrebbe aprire l'info window
```

### Test 2: Cambio Raggio
```
1. Cerca "Roma, Italia"
2. Clicca sul RadiusSelector (top-right)
3. Cambia da 5km a 10km
4. Aspettati: Più POI vengono aggiunti
5. Verifica nei log: "nearbyPois state updated with X POIs"
```

### Test 3: Area senza POI
```
1. Cerca "Sahara Desert" (area remota)
2. Aspettati: Message "Nessun POI trovato in questa area"
3. Verifica nei log: "Number of POIs found: 0"
4. I marker iniziali NON devono scomparire
```

---

## 🔧 Debugging Avanzato

### Ispeziona un marker specifico

Nel browser console, dopo la ricerca:

```javascript
// Vedi tutti i marker
console.table(allMarkers.map(m => ({
  id: m.id,
  lat: m.lat,
  lng: m.lng,
  title: m.poi?.titolo
})));

// Vedi un marker specifico
console.log(allMarkers[0].poi);

// Verifica coordinate
allMarkers.forEach((m, i) => {
  if (m.lat < -90 || m.lat > 90 || m.lng < -180 || m.lng > 180) {
    console.error(`❌ Invalid coordinates for marker ${i}:`, m);
  }
});
```

### Force re-render

Se i marker non appaiono, prova a forzare un re-render:

```javascript
// Nel browser console:
window.location.reload(); // Ricarica la pagina
```

---

## 📝 Prossimi Passi

Una volta confermato che i marker vengono visualizzati correttamente:

### 1. Rimuovi i console.log verbose (Opzionale)

Mantieni solo i log essenziali per errori:
```javascript
// Mantieni questi:
console.error('❌ Error fetching POI details:', error);
console.error('❌ No geoJson found for POI:', id);

// Rimuovi questi (debug):
console.log('🔍 API_GEO_SEARCH Response:', ...);
console.log('🔄 Processing POI', ...);
console.log('🗺️ Rendering markers', ...);
```

### 2. Ottimizzazioni Performance

- Limita il numero massimo di POI da mostrare (es. 50)
- Implementa clustering per tanti marker vicini
- Cache delle query GraphQL

### 3. UX Enhancements

- Mostra distanza da ogni POI
- Aggiungi filtri per categoria
- Aggiungi ordinamento per distanza

---

## ✅ Checklist Debug

- [ ] Server di sviluppo avviato (`npm run dev`)
- [ ] Browser aperto su http://localhost:3000/guide/pub/home
- [ ] Console del browser aperta
- [ ] Ricerca indirizzo effettuata
- [ ] Log "API_GEO_SEARCH Response" visibile
- [ ] Log "nearbyPois state updated" visibile
- [ ] Log "Rendering markers - Total: X" visibile con X > 0
- [ ] Marker visibili sulla mappa
- [ ] Click su marker apre info window
- [ ] Cambio raggio aggiorna i marker

---

## 🆘 Se il Problema Persiste

1. **Cattura screenshot della console** con tutti i log
2. **Verifica la versione dei pacchetti**:
   ```bash
   npm list google-map-react aws-amplify axios antd
   ```
3. **Controlla errori di rete** nel tab Network del browser
4. **Verifica API_GEO_SEARCH endpoint** in `/src/constants/ApiConstant.js`

---

**Version**: 1.0.0
**Date**: 2025-12-31
**Status**: 🔍 Debug Mode Active
