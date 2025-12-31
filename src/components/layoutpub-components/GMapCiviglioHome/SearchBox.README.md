# SearchBox Component - Documentation

**Top-tier address search** con Google Places Autocomplete, design moderno e animazioni premium.

## 🎨 Design Specifications

### Visual Features

**Search Box**:
- Background: `#ffffff` (white card)
- Border Radius: `8px`
- Shadow Default: `0 2px 8px rgba(0, 0, 0, 0.15)`
- Shadow Focused: `0 4px 16px rgba(102, 126, 234, 0.25)`
- Position: Absolute overlay sulla mappa

**Icon**:
- Magnifying glass (Font Awesome)
- Color: `#667eea` (purple brand)
- Size: `16px`

**Clear Button**:
- X icon (Font Awesome)
- Appears only when input has text
- Hover: Background `#f7fafc`
- Circular: `border-radius: 50%`

### Layout Structure

```
┌─────────────────────────────────────┐
│ 🔍 [Input: Cerca...........] [X]   │
└─────────────────────────────────────┘
        ↓ (on type)
┌─────────────────────────────────────┐
│ 📍 Via Roma 1, Milano               │
│ 📍 Via Roma 2, Roma                 │
│ 📍 Via Roma 3, Napoli               │
└─────────────────────────────────────┘
```

## ✨ Features

### Google Places Autocomplete

1. **Real-time Suggestions**
   - Suggestions appear as you type
   - Filtered by Italy (componentRestrictions)
   - Includes addresses and establishments

2. **Auto-complete Types**
   - Geocode: Addresses (Via, Piazza, etc.)
   - Establishment: Businesses, landmarks, POIs

3. **Place Selection**
   - Click suggestion → Map centers on location
   - Zoom automatically set to 15
   - Callback to parent component

### Interactive Elements

1. **Search Icon**
   - Visual indicator of search functionality
   - Purple brand color (#667eea)
   - Always visible

2. **Input Field**
   - Ant Design Input component
   - Placeholder text customizable
   - Focus state with shadow effect
   - Value controlled by React state

3. **Clear Button**
   - Appears when input has text
   - X icon (Font Awesome)
   - Click → Clears input + refocus
   - Hover effect with background

### Responsive Behavior

| Breakpoint | Layout Changes |
|------------|-----------------|
| **Desktop (>768px)** | Max-width 400px, top 20px, left 20px |
| **Tablet (768px)** | Full width with margins, top 15px |
| **Mobile (<575px)** | Full width, top 10px, smaller fonts |

## 🔧 Usage

### Basic Usage

```jsx
import SearchBox from '@/components/layoutpub-components/GMapCiviglioHome/SearchBox';

function MapComponent() {
  const [map, setMap] = useState(null);
  const [maps, setMaps] = useState(null);

  const handleApiLoaded = ({ map, maps }) => {
    setMap(map);
    setMaps(maps);
  };

  const handlePlaceSelected = (location) => {
    console.log('Selected:', location);
    // location = { lat, lng, name, address }
  };

  return (
    <GoogleMapReact onGoogleApiLoaded={handleApiLoaded}>
      {map && maps && (
        <SearchBox
          map={map}
          maps={maps}
          onPlaceSelected={handlePlaceSelected}
        />
      )}
    </GoogleMapReact>
  );
}
```

### With Custom Placeholder

```jsx
<SearchBox
  map={map}
  maps={maps}
  onPlaceSelected={handlePlaceSelected}
  placeholder="Cerca un indirizzo..."
/>
```

### Full Example

```jsx
const GMapWithSearch = ({ pois }) => {
  const [map, setMap] = useState(null);
  const [maps, setMaps] = useState(null);
  const [center, setCenter] = useState({ lat: 45.4642, lng: 9.19 });
  const [zoom, setZoom] = useState(12);

  const handleApiLoaded = ({ map, maps }) => {
    setMap(map);
    setMaps(maps);
  };

  const handlePlaceSelected = (location) => {
    setCenter({ lat: location.lat, lng: location.lng });
    setZoom(15);
  };

  return (
    <div style={{ height: '500px', position: 'relative' }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: API_KEY,
          libraries: ['places'] // REQUIRED
        }}
        center={center}
        zoom={zoom}
        onGoogleApiLoaded={handleApiLoaded}
      >
        {/* POI markers */}
      </GoogleMapReact>

      {map && maps && (
        <SearchBox
          map={map}
          maps={maps}
          onPlaceSelected={handlePlaceSelected}
          placeholder="Cerca..."
        />
      )}
    </div>
  );
};
```

## 🎯 Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `map` | Object | ✅ Yes | Google Maps instance from `onGoogleApiLoaded` |
| `maps` | Object | ✅ Yes | Google Maps API object from `onGoogleApiLoaded` |
| `onPlaceSelected` | Function | ❌ No | Callback when place is selected. Receives `{ lat, lng, name, address }` |
| `placeholder` | String | ❌ No | Input placeholder text. Default: "Cerca un indirizzo o luogo..." |

### onPlaceSelected Callback

```javascript
const handlePlaceSelected = (location) => {
  // location object:
  {
    lat: 45.4642,            // Latitude
    lng: 9.1900,             // Longitude
    name: "Duomo di Milano", // Place name
    address: "Piazza del Duomo, Milano, Italy" // Formatted address
  }
};
```

## 🎨 Customization

### Change Search Box Position

```jsx
// In SearchBox.jsx, modify:
.search-box-container {
  top: 20px;    // Change vertical position
  left: 20px;   // Change horizontal position
  right: 20px;  // Or use right for right-aligned
}
```

### Change Colors

```jsx
// Change brand color (purple → your color)
.search-box-icon {
  color: #YOUR_BRAND_COLOR;
}

.search-box-container.focused {
  box-shadow: 0 4px 16px rgba(YOUR_R, YOUR_G, YOUR_B, 0.25);
}

:global(.pac-matched) {
  color: #YOUR_BRAND_COLOR;
}
```

### Change Size

```jsx
.search-box-container {
  max-width: 500px; // Change max width
  padding: 0 16px;  // Change padding
}

:global(.search-box-input) {
  font-size: 16px;  // Change font size
  padding: 14px 0;  // Change vertical padding
}
```

### Limit Search to Specific Area

```javascript
// In SearchBox.jsx, modify Autocomplete options:
autocompleteRef.current = new maps.places.Autocomplete(input, {
  types: ['geocode', 'establishment'],
  componentRestrictions: { country: 'it' }, // Italy only
  bounds: {
    north: 46.0,
    south: 36.0,
    east: 18.0,
    west: 6.0
  },
  strictBounds: true // Restrict to bounds only
});
```

## 📱 Responsive Demo

### Desktop View (>768px)
```
┌────────────────────────────────────┐
│ 🔍 [Cerca un indirizzo....... ] [X]│  ← 400px max-width
└────────────────────────────────────┘
```

### Mobile View (<575px)
```
┌────────────────────────────────┐
│ 🔍 [Cerca...........] [X]      │  ← Full width
└────────────────────────────────┘
```

## 🎯 Accessibility

### ARIA Labels

```jsx
// Clear button
<button aria-label="Cancella ricerca">
  <i className="fa fa-times" />
</button>

// Input has implicit label from placeholder
```

### Keyboard Navigation

- Tab: Focus on input
- Type: Show autocomplete dropdown
- Arrow Up/Down: Navigate suggestions
- Enter: Select highlighted suggestion
- Escape: Close dropdown
- Tab from input: Focus clear button (if visible)

### Screen Reader Support

- Input is announced with placeholder text
- Autocomplete suggestions are announced
- Clear button is announced as "Cancella ricerca"

## 🚀 Performance

### Optimizations

- Conditional rendering (only when API ready)
- Event listener cleanup on unmount
- Debounced autocomplete (Google default)
- Minimal re-renders

### Bundle Impact

- Component: ~1KB gzipped
- Styles: ~1.5KB gzipped
- **Total: ~2.5KB**

### Best Practices

```jsx
// ✅ GOOD: Render only when API is ready
{map && maps && (
  <SearchBox map={map} maps={maps} />
)}

// ❌ BAD: Render before API is ready
<SearchBox map={map} maps={maps} /> // Will error if null
```

## 🐛 Troubleshooting

### Autocomplete Not Working

```javascript
// 1. Check that 'places' library is loaded
<GoogleMapReact
  bootstrapURLKeys={{
    libraries: ['places'] // ✅ REQUIRED
  }}
/>

// 2. Check console for errors
// Google Maps console might show API key errors

// 3. Verify API key has Places API enabled
// Go to: https://console.cloud.google.com/apis/library
```

### Dropdown Not Styled

```css
/* Google creates .pac-container outside React tree */
/* Must use :global() in styled-jsx */

:global(.pac-container) {
  border-radius: 8px; /* ✅ Works */
}

.pac-container {
  border-radius: 8px; /* ❌ Won't work (scoped) */
}
```

### Clear Button Not Showing

```javascript
// Clear button shows only when searchValue has text
const [searchValue, setSearchValue] = useState('');

{searchValue && (
  <button onClick={handleClear}>X</button>
)}

// Make sure onChange updates searchValue
<Input
  value={searchValue}
  onChange={(e) => setSearchValue(e.target.value)} // ✅
/>
```

### Map Not Centering

```javascript
const handlePlaceSelected = (location) => {
  // Check if map is defined
  console.log('Map:', map); // Should be object

  if (map) {
    map.setCenter(location); // ✅
    map.setZoom(15);
  } else {
    console.error('Map not ready'); // ❌
  }
};
```

## 📊 Comparison: Before vs After

| Feature | Before (React) | After (Next.js - Top-Tier) |
|---------|---------------|----------------------------|
| Autocomplete | Basic input | Google Places Autocomplete ✅ |
| Design | Plain white input | Modern card with shadow ✅ |
| Icon | None | Search icon + clear button ✅ |
| Focus Effect | None | Shadow + lift animation ✅ |
| Dropdown | Default Google | Styled with brand colors ✅ |
| Mobile | Not optimized | Full width, touch-friendly ✅ |
| Clear Button | None | Animated X button ✅ |
| Accessibility | Basic | ARIA + keyboard support ✅ |

## ✅ Testing Checklist

- [ ] Search box appears on map load
- [ ] Input accepts text
- [ ] Autocomplete suggestions appear
- [ ] Clicking suggestion centers map
- [ ] Map zooms to 15 on selection
- [ ] Clear button appears with text
- [ ] Clear button empties input
- [ ] Focus shows shadow effect
- [ ] Hover on clear button works
- [ ] Mobile: Full width layout
- [ ] Mobile: Touch-friendly
- [ ] Keyboard: Tab navigation works
- [ ] Keyboard: Arrow keys in dropdown
- [ ] Keyboard: Enter selects suggestion
- [ ] Screen reader announces input

## 🎯 Future Enhancements

- [ ] Recent searches history
- [ ] Search within radius filter
- [ ] Custom place types filter
- [ ] Voice search integration
- [ ] Geolocation "Near me" button
- [ ] Save favorite places
- [ ] Share search location
- [ ] Export search results

---

**Version**: 1.0.0 (Initial release)
**Last Updated**: 2025-12-30
**Component**: SearchBox for GMapCiviglioHome
**Design**: Modern Google Places Autocomplete integration
**Bundle Size**: ~2.5KB gzipped
