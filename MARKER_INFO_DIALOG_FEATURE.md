# 🎯 Marker Info Dialog - Top-Tier Implementation

## ✨ Nuove Funzionalità

Il dialog dei marker POI ora include:
1. ✅ **Pulsante di chiusura (X)** in alto a destra
2. ✅ **Single-dialog behavior** - Solo un dialog aperto alla volta
3. ✅ **Design migliorato** con effetti hover e transizioni smooth

---

## 🎯 Funzionamento

### Single-Dialog Behavior

```
Utente clicca Marker A
  ↓
Dialog A si apre
  ↓
Utente clicca Marker B
  ↓
Dialog A si chiude automaticamente
  ↓
Dialog B si apre
  ↓
Solo il Dialog B è visibile
```

### Close Button

```
Dialog aperto
  ↓
Utente clicca X (top-right)
  ↓
Dialog si chiude
  ↓
Nessun dialog aperto
```

### Alternative per Chiudere

1. **Click sul pulsante X** - Chiude il dialog
2. **Click sullo stesso marker** - Toggle (apre/chiude)
3. **Click su un altro marker** - Apre nuovo dialog, chiude il precedente

---

## 🔧 Implementazione Tecnica

### 1. State Management

#### Stato a Livello Parent (GMapCiviglioHome)

```javascript
const [openMarkerId, setOpenMarkerId] = useState(null);
```

**Spiegazione:**
- `null` = Nessun dialog aperto
- `"nearby-uuid-123"` = Dialog del marker con ID "nearby-uuid-123" aperto
- Solo UN marker può avere dialog aperto (single source of truth)

### 2. Marker Component Props

#### Nuove Props

```javascript
const Marker = ({
  lat,
  lng,
  poi,
  onClick,
  isNew,
  isUser,
  isOpen,        // ← NUOVO: True se questo marker ha dialog aperto
  onToggleInfo   // ← NUOVO: Callback per aprire/chiudere dialog
}) => {
  // ...
};
```

**Prima (locale state):**
```javascript
// ❌ Ogni marker aveva il suo state indipendente
const [showInfo, setShowInfo] = useState(false);
```

**Dopo (controlled component):**
```javascript
// ✅ State gestito dal parent
// isOpen viene passato come prop
// onToggleInfo callback notifica il parent
```

### 3. onToggleInfo Callback

```javascript
onToggleInfo={() => {
  // Toggle: se già aperto, chiudi; altrimenti apri e chiudi gli altri
  setOpenMarkerId(openMarkerId === point.id ? null : point.id);
}}
```

**Logica:**
- Se `openMarkerId === point.id` → Questo marker è già aperto → Chiudi (set to null)
- Altrimenti → Apri questo marker (set to point.id) → Chiude automaticamente gli altri

### 4. Close Button Design

```javascript
{/* Close button (X) - Top right */}
<button
  onClick={(e) => {
    e.stopPropagation();
    onToggleInfo && onToggleInfo();
  }}
  style={{
    position: 'absolute',
    top: '6px',
    right: '6px',
    width: '24px',
    height: '24px',
    border: 'none',
    background: 'rgba(0, 0, 0, 0.05)',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    lineHeight: '1',
    color: '#666',
    transition: 'all 0.2s ease',
    padding: '0'
  }}
  onMouseEnter={(e) => {
    e.target.style.background = 'rgba(0, 0, 0, 0.1)';
    e.target.style.color = '#333';
  }}
  onMouseLeave={(e) => {
    e.target.style.background = 'rgba(0, 0, 0, 0.05)';
    e.target.style.color = '#666';
  }}
  title="Chiudi"
>
  ×
</button>
```

**Design features:**
- Cerchio rotondo 24x24px
- Background semi-trasparente
- Icona × (HTML entity)
- Hover: Background più scuro, colore più intenso
- Smooth transition (0.2s)
- `e.stopPropagation()` previene click-through

### 5. Dialog Padding Adjustment

```javascript
style={{
  // ...
  padding: '12px',
  paddingTop: '24px',  // ← Spazio extra per il pulsante X
  // ...
}}
```

**Perché `paddingTop: '24px'`:**
- Il pulsante X è posizionato `top: 6px`
- Altezza pulsante: 24px
- Padding extra evita che il titolo si sovrapponga al pulsante

### 6. Title Padding

```javascript
<h6 style={{
  margin: '0 0 8px 0',
  fontSize: '14px',
  paddingRight: '8px'  // ← Evita sovrapposizione con X
}}>
  {poi.titolo}
</h6>
```

---

## 📊 Confronto Prima vs Dopo

### Prima (Multiple Dialogs)

```
User clicca Marker A → Dialog A aperto
User clicca Marker B → Dialog B aperto
User clicca Marker C → Dialog C aperto

Risultato: 3 dialog aperti contemporaneamente ❌
```

**Problemi:**
- Mappa affollata di dialog
- Difficile leggere informazioni
- Nessun modo di chiudere tranne click su marker

### Dopo (Single Dialog)

```
User clicca Marker A → Dialog A aperto
User clicca Marker B → Dialog A chiuso, Dialog B aperto
User clicca X su B  → Dialog B chiuso

Risultato: Max 1 dialog aperto ✅
```

**Benefici:**
- UX pulita e chiara
- Facile chiudere con pulsante X
- Comportamento standard (come Google Maps)

---

## 🎨 Design Details

### Close Button

```
┌─────────────────────┐
│ ┌─────────────────┐ │
│ │                X │ │  ← Pulsante X (top-right)
│ │                 │ │
│ │   [Immagine]    │ │
│ │                 │ │
│ │   Titolo POI    │ │
│ │                 │ │
│ │ [Vai al dettaglio] │
│ └─────────────────┘ │
└─────────────────────┘
```

### States

```
Normal:
  Background: rgba(0, 0, 0, 0.05) (grigio chiaro)
  Color: #666 (grigio medio)
  Size: 24x24px

Hover:
  Background: rgba(0, 0, 0, 0.1) (grigio più scuro)
  Color: #333 (nero)
  Transition: 0.2s ease

Active (Click):
  Chiude il dialog
```

---

## 🧪 Test Cases

### Test 1: Single Dialog Behavior

1. Apri http://localhost:3000/guide/pub/home
2. Cerca "Milano, Italia"
3. Click su Marker A → ✅ Dialog A si apre
4. Click su Marker B → ✅ Dialog A si chiude, Dialog B si apre
5. Click su Marker C → ✅ Dialog B si chiude, Dialog C si apre
6. Verifica: Solo 1 dialog visibile alla volta

### Test 2: Close Button

1. Click su un marker → Dialog si apre
2. Click sul pulsante X (top-right) → ✅ Dialog si chiude
3. Verifica: Nessun dialog aperto

### Test 3: Toggle Behavior

1. Click su Marker A → Dialog A si apre
2. Click di nuovo su Marker A → ✅ Dialog A si chiude (toggle)
3. Click su Marker A di nuovo → ✅ Dialog A si riapre

### Test 4: Close Button Hover

1. Apri un dialog
2. Passa il mouse sopra il pulsante X
3. Verifica:
   - ✅ Background diventa più scuro
   - ✅ Colore diventa più intenso
   - ✅ Transizione smooth (0.2s)

### Test 5: Multi-Marker Stress Test

1. Cerca area con molti POI (es. "Roma, Italia")
2. Click rapidamente su 5-6 marker diversi
3. Verifica:
   - ✅ Solo l'ultimo dialog cliccato resta aperto
   - ✅ Nessun glitch o sovrapposizione
   - ✅ Performance fluida

---

## 🐛 Troubleshooting

### Problema 1: Multiple dialogs aperti

**Causa**: State non sincronizzato

**Debug:**
```javascript
console.log('Open Marker ID:', openMarkerId);
console.log('Current point.id:', point.id);
console.log('isOpen:', openMarkerId === point.id);
```

**Soluzione**: Verifica che `openMarkerId` sia aggiornato correttamente

### Problema 2: Close button non funziona

**Causa**: `onToggleInfo` non chiamato

**Debug:**
```javascript
onToggleInfo={() => {
  console.log('Toggle info called for:', point.id);
  setOpenMarkerId(openMarkerId === point.id ? null : point.id);
}}
```

**Soluzione**: Verifica che callback sia passato correttamente

### Problema 3: Dialog non si chiude al click su altro marker

**Causa**: Logica toggle errata

**Verifica:**
```javascript
// Deve essere:
setOpenMarkerId(openMarkerId === point.id ? null : point.id);

// NON:
setOpenMarkerId(prev => !prev); // ❌ SBAGLIATO
```

### Problema 4: Pulsante X troppo piccolo su mobile

**Soluzione**: Aumenta dimensioni per touch targets

```javascript
style={{
  width: '32px',   // Invece di 24px
  height: '32px',  // Migliore per touch
  // ...
}}
```

---

## ⚙️ Configurazione

### Cambia Dimensioni Close Button

```javascript
style={{
  width: '28px',   // Default: 24px
  height: '28px',
  fontSize: '18px', // Default: 16px
  // ...
}}
```

### Cambia Colori

```javascript
// Normal state
background: 'rgba(255, 0, 0, 0.1)',  // Rosso chiaro
color: '#ff0000',                     // Rosso

// Hover state
onMouseEnter={(e) => {
  e.target.style.background = 'rgba(255, 0, 0, 0.2)';
  e.target.style.color = '#cc0000';
}}
```

### Cambia Posizione

```javascript
style={{
  top: '8px',    // Più in basso (default: 6px)
  right: '8px',  // Più a sinistra (default: 6px)
  // ...
}}
```

### Disabilita Single-Dialog Behavior

Se vuoi permettere multiple dialogs (sconsigliato):

```javascript
// Rimuovi la logica di chiusura automatica
onToggleInfo={() => {
  // Toggle solo questo marker, senza chiudere gli altri
  if (openMarkerId === point.id) {
    setOpenMarkerId(null);
  } else {
    // NON settare a point.id, usa array di IDs invece
  }
}}
```

---

## 🎯 Codice Completo

### Parent Component (GMapCiviglioHome)

```javascript
const GMapCiviglioHome = ({ pois: initialPois = [] }) => {
  // State per tracciare quale marker ha dialog aperto
  const [openMarkerId, setOpenMarkerId] = useState(null);

  // ... altri stati ...

  return (
    <GoogleMapReact>
      {clusters.map((cluster) => {
        if (cluster.numPoints > 1) {
          return <ClusterMarker {...} />;
        }

        const point = cluster.points[0];
        return (
          <Marker
            key={point.id}
            lat={point.lat}
            lng={point.lng}
            poi={point.poi}
            onClick={handleMarkerClick}
            isNew={point.isNew}
            isUser={false}
            isOpen={openMarkerId === point.id}
            onToggleInfo={() => {
              setOpenMarkerId(openMarkerId === point.id ? null : point.id);
            }}
          />
        );
      })}
    </GoogleMapReact>
  );
};
```

### Marker Component

```javascript
const Marker = ({ lat, lng, poi, onClick, isNew, isUser, isOpen, onToggleInfo }) => {
  const [animate, setAnimate] = useState(isNew);

  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => setAnimate(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  if (isUser) {
    return <div>{/* User marker */}</div>;
  }

  return (
    <div>
      <img
        src="/img/civiglio/pinrol.png"
        onClick={(e) => {
          e.stopPropagation();
          onToggleInfo && onToggleInfo();
        }}
      />
      {isOpen && poi && (
        <div style={{ paddingTop: '24px' }}>
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleInfo && onToggleInfo();
            }}
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '24px',
              height: '24px',
              // ... altri stili ...
            }}
          >
            ×
          </button>

          {/* Contenuto dialog */}
          {poi.immagine && <img src={...} />}
          <h6>{poi.titolo}</h6>
          <button onClick={...}>Vai al dettaglio</button>
        </div>
      )}
    </div>
  );
};
```

---

## ✅ Checklist Implementazione

- [x] State management a livello parent (`openMarkerId`)
- [x] Marker component accetta `isOpen` e `onToggleInfo` props
- [x] Single-dialog behavior implementato
- [x] Close button (X) in top-right corner
- [x] Hover effects sul close button
- [x] Padding adjustments per evitare sovrapposizioni
- [x] Toggle behavior (click su stesso marker chiude)
- [x] `e.stopPropagation()` per prevenire click-through
- [x] Smooth transitions (0.2s)
- [x] Accessibilità (`title="Chiudi"`)
- [x] Build compila senza errori
- [x] Testing su browser

---

## 🎯 Risultato Finale

### UX Top-Tier

1. **Intuitivo**: Pulsante X universalmente riconosciuto
2. **Pulito**: Solo un dialog alla volta (no clutter)
3. **Responsive**: Hover effects e transizioni smooth
4. **Accessibile**: Title tooltip e large touch target
5. **Performante**: Controlled component pattern efficiente

### Codice Top-Tier

1. **Clean**: State management centralizzato
2. **Maintainable**: Controlled component pattern
3. **Scalable**: Facile aggiungere funzionalità
4. **Debuggable**: Single source of truth per state
5. **Best Practices**: React patterns moderni

---

**Version**: 1.0.0
**Date**: 2025-12-31
**Status**: ✅ Production Ready
**Impact**: 🚀 UX migliorata per info dialogs dei marker
