# POICarousel - Examples & Best Practices

Esempi pratici e best practices per utilizzare POICarousel.

## 📋 Table of Contents

1. [Basic Usage](#basic-usage)
2. [Advanced Usage](#advanced-usage)
3. [Custom Styling](#custom-styling)
4. [Performance Optimization](#performance-optimization)
5. [Accessibility](#accessibility)
6. [Common Patterns](#common-patterns)
7. [Troubleshooting](#troubleshooting)

---

## Basic Usage

### Minimal Example

```jsx
import dynamic from 'next/dynamic';

const POICarousel = dynamic(
  () => import('@/components/layoutpub-components/POICarousel'),
  { ssr: false }
);

function HomePage({ pois }) {
  return (
    <POICarousel pois={pois} />
  );
}
```

### With Title and Subtitle

```jsx
<POICarousel
  pois={pois}
  title="Scopri i Nostri POI"
  subtitle="Luoghi interessanti da visitare"
  autoplayDelay={4000}
/>
```

### With i18n (React Intl)

```jsx
import IntlMessage from '@/components/util-components/IntlMessage';

<POICarousel
  pois={pois}
  title={<IntlMessage id="home.carousel.title" />}
  subtitle={<IntlMessage id="home.carousel.subtitle" />}
  autoplayDelay={5000}
/>
```

---

## Advanced Usage

### Using POICarouselAdvanced

```jsx
import dynamic from 'next/dynamic';

const POICarousel = dynamic(
  () => import('@/components/layoutpub-components/POICarousel/POICarouselAdvanced'),
  { ssr: false }
);

<POICarousel
  pois={pois}
  title="Featured Places"
  subtitle="Explore our top destinations"
  autoplayDelay={6000}
  showProgress={true}
  showCounter={true}
  showThumbnails={true}
/>
```

### Disable Autoplay

```jsx
<POICarousel
  pois={pois}
  autoplayDelay={0}  // 0 = disabled
/>
```

### Fast Autoplay

```jsx
<POICarousel
  pois={pois}
  autoplayDelay={2000}  // 2 seconds (quick)
/>
```

### Slow Autoplay

```jsx
<POICarousel
  pois={pois}
  autoplayDelay={10000}  // 10 seconds (slow)
/>
```

---

## Custom Styling

### Override Background

```jsx
<div style={{ background: 'linear-gradient(to bottom, #e0f2fe, #fff)' }}>
  <POICarousel pois={pois} />
</div>
```

### Add Custom Wrapper

```jsx
<section className="featured-section">
  <POICarousel
    pois={pois}
    title="Featured Destinations"
  />

  <style jsx>{`
    .featured-section {
      background: #f7fafc;
      padding: 80px 0;
      border-top: 4px solid #3182ce;
    }
  `}</style>
</section>
```

### Dark Theme

```jsx
// Create a wrapper component
function DarkPOICarousel({ pois }) {
  return (
    <div className="dark-carousel-wrapper">
      <POICarousel pois={pois} />

      <style jsx global>{`
        .dark-carousel-wrapper .poi-card {
          background: #2d3748 !important;
          color: white !important;
        }
        .dark-carousel-wrapper .poi-card__title {
          color: white !important;
        }
      `}</style>
    </div>
  );
}
```

---

## Performance Optimization

### Lazy Load Images

```javascript
// Already implemented in POICarousel
<img
  src={imageUrl}
  alt={title}
  loading="lazy"  // ✅ Browser native lazy loading
/>
```

### Limit Number of POIs

```jsx
// Only show top 10 POIs
<POICarousel
  pois={pois.slice(0, 10)}
  autoplayDelay={5000}
/>
```

### Preload First Image

```jsx
import Head from 'next/head';

function HomePage({ pois }) {
  const firstImage = pois[0]?.immagine;

  return (
    <>
      <Head>
        {firstImage && (
          <link
            rel="preload"
            href={`${CLOUDFRONT_URL}/images/${firstImage}`}
            as="image"
          />
        )}
      </Head>

      <POICarousel pois={pois} />
    </>
  );
}
```

### Optimize Image Sizes

```javascript
// Use next/image for automatic optimization
import Image from 'next/image';

// In POICarousel component, replace:
<img src={url} alt={alt} />

// With:
<Image
  src={url}
  alt={alt}
  width={400}
  height={300}
  quality={85}
  placeholder="blur"
/>
```

---

## Accessibility

### ARIA Labels

```jsx
// Already implemented
<button
  aria-label="Previous slide"
  onClick={scrollPrev}
>
  <i className="fa fa-chevron-left"></i>
</button>
```

### Keyboard Navigation

```javascript
// Add keyboard support
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') scrollPrev();
    if (e.key === 'ArrowRight') scrollNext();
    if (e.key === ' ') toggleAutoplay();
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

### Screen Reader Announcements

```jsx
import { useEffect, useState } from 'react';

function POICarousel({ pois }) {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    setAnnouncement(`Showing slide ${selectedIndex + 1} of ${pois.length}`);
  }, [selectedIndex]);

  return (
    <>
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>
      {/* Carousel content */}
    </>
  );
}
```

---

## Common Patterns

### With Loading State

```jsx
import { Spin } from 'antd';

function HomePage({ pois, loading }) {
  if (loading) {
    return (
      <div style={{ padding: '100px 0', textAlign: 'center' }}>
        <Spin size="large" />
        <p>Caricamento POI...</p>
      </div>
    );
  }

  return <POICarousel pois={pois} />;
}
```

### With Empty State

```jsx
function HomePage({ pois }) {
  if (!pois || pois.length === 0) {
    return (
      <div style={{ padding: '100px 0', textAlign: 'center' }}>
        <h3>Nessun POI disponibile</h3>
        <p>Torna più tardi per nuovi contenuti!</p>
      </div>
    );
  }

  return <POICarousel pois={pois} />;
}
```

### With Error Boundary

```jsx
import ErrorBoundary from '@/components/util-components/ErrorBoundary';

<ErrorBoundary>
  <POICarousel pois={pois} />
</ErrorBoundary>
```

### With Analytics Tracking

```jsx
import { useEffect } from 'react';
import GuidesAnalytics from '@/utils/GuidesAnalytics';

function POICarousel({ pois }) {
  useEffect(() => {
    // Track carousel view
    GuidesAnalytics.recordEvent('CAROUSEL_VIEW', {
      poiCount: pois.length,
      timestamp: Date.now()
    });
  }, [pois]);

  return (
    // Carousel JSX
  );
}
```

### Multiple Carousels on Same Page

```jsx
function HomePage({ featuredPois, recentPois, popularPois }) {
  return (
    <>
      <POICarousel
        pois={featuredPois}
        title="Featured"
        autoplayDelay={5000}
      />

      <POICarousel
        pois={recentPois}
        title="Recently Added"
        autoplayDelay={6000}
      />

      <POICarousel
        pois={popularPois}
        title="Most Popular"
        autoplayDelay={4000}
      />
    </>
  );
}
```

---

## Troubleshooting

### Carousel Not Showing

**Problem**: Carousel appears empty or doesn't render.

**Solutions**:
```jsx
// 1. Check data structure
console.log('POIs:', pois);
console.log('First POI:', pois[0]);

// 2. Ensure audioMediaItems exist
const validPois = pois.filter(poi =>
  poi.audioMediaItems?.items?.length > 0
);

// 3. Check dynamic import
const POICarousel = dynamic(
  () => import('@/components/layoutpub-components/POICarousel'),
  {
    ssr: false,
    loading: () => <div>Loading carousel...</div>
  }
);
```

### Images Not Loading

**Problem**: Images show placeholder or broken image icon.

**Solutions**:
```jsx
// 1. Check CLOUDFRONT_URL
console.log('CloudFront URL:', CLOUDFRONT_URL);

// 2. Check image path
console.log('Image path:', `${CLOUDFRONT_URL}/images/${poi.immagine}`);

// 3. Add fallback image
const imageUrl = poi.immagine
  ? `${CLOUDFRONT_URL}/images/${poi.immagine}`
  : '/img/placeholder.jpg';
```

### Autoplay Not Working

**Problem**: Slides don't auto-advance.

**Solutions**:
```jsx
// 1. Check autoplayDelay prop
<POICarousel autoplayDelay={5000} /> // Must be > 0

// 2. Check embla initialization
useEffect(() => {
  if (emblaApi) {
    console.log('Embla initialized');
  }
}, [emblaApi]);

// 3. Disable hover pause temporarily
// Comment out onMouseEnter/onMouseLeave
```

### Navigation Buttons Disabled

**Problem**: Prev/Next buttons are grayed out.

**Solutions**:
```jsx
// 1. Check loop prop
const [emblaRef, emblaApi] = useEmblaCarousel({
  loop: true,  // ✅ Enable loop
});

// 2. Check number of slides
console.log('Slides:', pois.length); // Need at least 2

// 3. Check canScroll states
console.log('Can scroll prev:', canScrollPrev);
console.log('Can scroll next:', canScrollNext);
```

### Performance Issues

**Problem**: Carousel is slow or laggy.

**Solutions**:
```jsx
// 1. Limit number of POIs
<POICarousel pois={pois.slice(0, 10)} />

// 2. Optimize images
// Use WebP format, compress images

// 3. Disable autoplay on slow devices
const autoplayDelay = navigator.hardwareConcurrency < 4 ? 0 : 5000;

// 4. Use POICarousel instead of Advanced
import POICarousel from '@/components/.../POICarousel'; // Not Advanced
```

---

## Best Practices

### ✅ DO

```jsx
// Use semantic HTML
<section aria-label="Featured POI Carousel">
  <POICarousel pois={pois} />
</section>

// Provide meaningful alt text
alt={firstAudio.audioTitle || poi.title || 'POI Image'}

// Handle empty states
if (!pois.length) return <EmptyState />;

// Optimize images
<img loading="lazy" />

// Use reasonable autoplay delays
autoplayDelay={5000} // 5 seconds is good
```

### ❌ DON'T

```jsx
// Don't use too fast autoplay
autoplayDelay={500} // ❌ Too fast, annoying

// Don't show too many slides
<POICarousel pois={allPois} /> // ❌ If allPois.length > 50

// Don't forget SSR safety
import POICarousel from '...' // ❌ Must use dynamic import

// Don't nest carousels
<POICarousel>
  <POICarousel /> // ❌ Don't nest
</POICarousel>

// Don't block main thread
// ❌ Heavy calculations during render
```

---

## Integration Examples

### With Next.js ISR

```jsx
export async function getStaticProps() {
  const pois = await fetchPOIs();

  return {
    props: { pois },
    revalidate: 3600, // Revalidate every hour
  };
}

export default function HomePage({ pois }) {
  return <POICarousel pois={pois} />;
}
```

### With React Query

```jsx
import { useQuery } from 'react-query';

function HomePage() {
  const { data: pois, isLoading } = useQuery('pois', fetchPOIs);

  if (isLoading) return <Spin />;

  return <POICarousel pois={pois} />;
}
```

### With Redux

```jsx
import { useSelector } from 'react-redux';

function HomePage() {
  const pois = useSelector(state => state.poi.featured);

  return <POICarousel pois={pois} />;
}
```

---

## Testing

### Unit Test Example

```jsx
import { render, screen } from '@testing-library/react';
import POICarousel from './POICarousel';

describe('POICarousel', () => {
  const mockPois = [
    { id: 1, title: 'POI 1', audioMediaItems: { items: [{}] } },
    { id: 2, title: 'POI 2', audioMediaItems: { items: [{}] } },
  ];

  it('renders carousel with POIs', () => {
    render(<POICarousel pois={mockPois} />);
    expect(screen.getByText('POI 1')).toBeInTheDocument();
  });

  it('shows empty state when no POIs', () => {
    render(<POICarousel pois={[]} title="Test" />);
    expect(screen.getByText(/nessun POI/i)).toBeInTheDocument();
  });
});
```

---

## 📚 Resources

- [Embla Carousel Docs](https://www.embla-carousel.com/)
- [Next.js Dynamic Import](https://nextjs.org/docs/advanced-features/dynamic-import)
- [Web.dev: Carousel Best Practices](https://web.dev/carousel-best-practices/)
- [ARIA Carousel Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)

---

**Last Updated**: 2025-12-30
**Component Version**: 1.0.0
