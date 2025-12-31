# POICarousel Component

**Top-tier carousel component** per visualizzare i POI (Points of Interest) con animazioni fluide e UX ottimale.

## 🎯 Features

### Core Functionality
- ✅ **Auto-play** con pausa automatica on hover
- ✅ **Touch/Swipe support** per mobile
- ✅ **Keyboard navigation** (frecce sinistra/destra)
- ✅ **Responsive** - 3 colonne desktop, 2 tablet, 1 mobile
- ✅ **Loop infinito** - continua a scorrere senza fine
- ✅ **SSR-safe** - compatibile con Next.js

### UI/UX
- ✅ **Navigation arrows** con hover effects
- ✅ **Pagination dots** interattivi
- ✅ **Smooth animations** - cubic-bezier easing
- ✅ **Image hover effects** - zoom on hover
- ✅ **Overlay effect** - "Scopri" overlay on card hover
- ✅ **Loading state** - skeleton durante il caricamento
- ✅ **Empty state** - messaggio quando non ci sono POI

### Performance
- ✅ **Lazy loading** - immagini caricate on-demand
- ✅ **Dynamic import** - code splitting automatico
- ✅ **Optimized re-renders** - useCallback per funzioni
- ✅ **CSS-in-JS** - styled-jsx per performance

## 📦 Usage

```jsx
import POICarousel from '@/components/layoutpub-components/POICarousel';

function HomePage({ pois }) {
  return (
    <POICarousel
      pois={pois}
      title="Ultimi POI Inseriti"
      subtitle="Scopri gli ultimi luoghi inseriti"
      autoplayDelay={5000}
    />
  );
}
```

## 🔧 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pois` | `Array` | `[]` | Array di oggetti POI da visualizzare |
| `title` | `ReactNode` | - | Titolo del carousel |
| `subtitle` | `ReactNode` | - | Sottotitolo del carousel |
| `autoplayDelay` | `number` | `4000` | Delay in ms per auto-play (0 = disabled) |

## 📊 POI Object Structure

```javascript
{
  rangeKey: "poi-id",
  title: "POI Title",
  immagine: "image-filename.jpg",
  likes: 42,
  audioMediaItems: {
    items: [
      {
        PK: "audio-id",
        audioTitle: "Audio Title",
        abstract: "Audio description..."
      }
    ]
  }
}
```

## 🎨 Customization

### Responsive Breakpoints

- **Desktop** (> 1024px): 3 cards per view
- **Tablet** (640px - 1024px): 2 cards per view
- **Mobile** (< 640px): 1 card per view

### Animation Timing

- **Slide transition**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **Hover effects**: `0.3s ease`
- **Image zoom**: `0.6s cubic-bezier(0.4, 0, 0.2, 1)`

### Colors

Modifica i colori editando le variabili styled-jsx:

```jsx
// Primary color
background: #1a3353;

// Hover overlay
background: rgba(0, 0, 0, 0.7);

// Card shadow
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
```

## 🔑 Keyboard Shortcuts

- **←** Slide precedente
- **→** Slide successivo
- **Space** Pausa/riprendi auto-play (TODO)
- **Home** Prima slide (TODO)
- **End** Ultima slide (TODO)

## 🎯 Accessibility

- ✅ ARIA labels per navigation buttons
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Screen reader friendly
- ⚠️ TODO: Announce slide changes to screen readers

## 🚀 Performance Tips

1. **Image Optimization**: Usa immagini ottimizzate (WebP, dimensioni corrette)
2. **Lazy Loading**: Le immagini vengono caricate solo quando visibili
3. **Auto-play Pause**: Si ferma on hover per ridurre CPU usage
4. **Dynamic Import**: Il componente viene caricato solo quando necessario

## 🐛 Known Issues

- Nessun issue conosciuto al momento

## 📝 TODO / Future Improvements

- [ ] Add zoom modal on card click
- [ ] Add share buttons
- [ ] Add favorite/like functionality inline
- [ ] Add filter by category
- [ ] Add search functionality
- [ ] Add keyboard shortcut for pause (Space)
- [ ] Add voice announcement for screen readers
- [ ] Add progress bar for auto-play
- [ ] Add parallax effect on scroll

## 🔗 Dependencies

- `embla-carousel-react` - Carousel engine
- `next/link` - Client-side navigation
- Font Awesome icons (assumed available globally)

## 📄 License

Parte del progetto Civiglio Web
