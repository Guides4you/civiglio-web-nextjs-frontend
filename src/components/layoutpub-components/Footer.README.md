# Footer Component - Documentation

**Top-tier footer design** con sfondo grigio scuro, layout professionale e animazioni fluide.

## 🎨 Design Specifications

### Color Palette

**Top Section (footer-top)**:
- Background: `linear-gradient(180deg, #2d3748 0%, #1e2936 100%)`
- Text Primary: `#e2e8f0`
- Text Secondary: `#cbd5e0`
- Brand Color: `#667eea` (purple gradient)

**Bottom Section (footer-bottom)**:
- Background: `#1a202c` (darker)
- Border: `rgba(255, 255, 255, 0.1)`
- Copyright Text: `#a0aec0`

### Layout Structure

```
┌─────────────────────────────────────────────────────┐
│                    TOP FOOTER                        │
│  ┌───────────────────┬──────────────────────────┐  │
│  │  Logo & Contacts  │     Navigation Links      │  │
│  │  (col-lg-6)       │     (col-lg-6)            │  │
│  └───────────────────┴──────────────────────────┘  │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│               BOTTOM FOOTER (Darker)                 │
│  Copyright © 2025         [FB] [TW] [LI] (Social)  │
└─────────────────────────────────────────────────────┘
```

## ✨ Features

### Interactive Elements

1. **Contact Icons**
   - Circular background with brand color
   - Hover: Scale 1.1 + background change to solid purple
   - Icon color changes from purple to white on hover

2. **Navigation Links**
   - Arrow indicator (▸) appears on hover
   - Slide animation: `translateX(5px)`
   - Color transition: gray → white

3. **Social Icons**
   - Circular buttons with semi-transparent purple background
   - Hover: Gradient background + lift effect
   - Transform: `translateY(-3px) scale(1.05)`
   - Box shadow: `0 8px 20px rgba(102, 126, 234, 0.3)`

### Responsive Behavior

| Breakpoint | Layout Changes |
|------------|---------------|
| **Desktop (>991px)** | 2 columns side by side, navigation padding-left 40px |
| **Tablet (768-991px)** | 2 columns stacked, navigation no padding, margin-top 40px |
| **Mobile (<767px)** | Single column, social centered, reduced spacing |
| **Small Mobile (<575px)** | Smaller logo (40px), smaller icons, smaller text |

## 🔧 Customization

### Change Background Colors

```jsx
// In Footer.jsx, modify:
.footer-top {
  background: linear-gradient(180deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
}

.footer-bottom {
  background: #YOUR_DARK_COLOR;
}
```

### Change Brand Color

```jsx
// Replace all instances of #667eea and #764ba2 with your brand colors:
.contact-icon {
  background: rgba(YOUR_BRAND_COLOR_RGB, 0.2);
}

.contact-icon i {
  color: #YOUR_BRAND_COLOR;
}

// Social links
.social-links li a:hover {
  background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
}
```

### Add More Navigation Items

```jsx
<ul className="nav-list">
  <li className="nav-item">
    <Link href="/your-page">
      Your Link Text
    </Link>
  </li>
  {/* Add more items */}
</ul>
```

### Add More Social Links

```jsx
<ul className="social-links">
  <li>
    <a href="your-url" target="_blank" rel="noopener noreferrer" aria-label="Platform Name">
      <i className="fa fa-your-icon" aria-hidden="true"></i>
    </a>
  </li>
  {/* Add more social links */}
</ul>
```

## 📱 Responsive Demo

### Desktop View (>991px)
```
┌──────────────────────────────────────────┐
│  Logo               Navigation            │
│  Description        • Home                │
│  📍 Address         • Contact             │
│  📞 Phone           • Scopri i POI        │
│  📧 Email           • Chi Siamo           │
└──────────────────────────────────────────┘
┌──────────────────────────────────────────┐
│  © 2025 Guides4You    [FB] [TW] [LI]     │
└──────────────────────────────────────────┘
```

### Mobile View (<767px)
```
┌──────────────────┐
│  Logo            │
│  Description     │
│  📍 Address      │
│  📞 Phone        │
│  📧 Email        │
│                  │
│  Navigation      │
│  • Home          │
│  • Contact       │
│  • Scopri i POI  │
│  • Chi Siamo     │
└──────────────────┘
┌──────────────────┐
│ © 2025 Guides4You│
│                  │
│  [FB] [TW] [LI]  │
└──────────────────┘
```

## 🎯 Accessibility

### ARIA Labels
```jsx
// All social links have aria-label
<a aria-label="Facebook">...</a>

// Decorative icons use aria-hidden
<i aria-hidden="true"></i>
```

### Keyboard Navigation
- All links are keyboard accessible
- Focus states with 2px purple outline
- Outline offset: 2px for better visibility

### Screen Reader Support
- Semantic HTML5 `<footer>` element
- Proper heading hierarchy
- Link text is descriptive

## 🚀 Performance

### Optimizations
- CSS-in-JS with Next.js styled-jsx (scoped, no conflicts)
- No external CSS dependencies
- Minimal JavaScript (only dynamic year)
- No images except logo (uses existing asset)

### Bundle Impact
- Component: ~1KB gzipped
- Styles: ~2KB gzipped
- **Total: ~3KB** (extremely lightweight)

## 🔍 SEO Considerations

### Structured Data (Future Enhancement)
```jsx
// Add to Footer component
<script type="application/ld+json">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Guides4You",
  "url": "https://www.guides4you.it",
  "logo": "/img/civiglio/logo-civiglio-200-white.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+39-0984-404-470",
    "contactType": "Customer Service"
  },
  "sameAs": [
    "https://www.facebook.com/Guides4youSrls",
    "https://twitter.com/Guides4youSrls",
    "https://www.linkedin.com/company/guides4you/"
  ]
})}
</script>
```

## 🎨 Animation Timeline

All hover animations use `cubic-bezier(0.4, 0, 0.2, 1)` for smooth, professional feel:

1. **Contact Item Hover** (300ms)
   - Icon scale: 1 → 1.1
   - Icon background: transparent purple → solid purple
   - Icon color: purple → white
   - Container: translateX(0) → translateX(5px)

2. **Navigation Link Hover** (300ms)
   - Arrow opacity: 0 → 1
   - Arrow position: translateX(-5px) → translateX(0)
   - Link color: gray → white
   - Link position: translateX(0) → translateX(5px)

3. **Social Icon Hover** (300ms cubic-bezier)
   - Background: semi-transparent → gradient
   - Transform: scale(1) → scale(1.05)
   - Position: translateY(0) → translateY(-3px)
   - Shadow: none → 0 8px 20px purple glow

## 🐛 Troubleshooting

### Logo Not Showing
```bash
# Ensure logo exists at:
/public/img/civiglio/logo-civiglio-200-white.png

# Check file permissions:
ls -la /public/img/civiglio/
```

### Translations Missing
```javascript
// Check that these i18n keys exist:
- footer.message
- sidenav.components.navigation
- home
- header.contact

// In: src/lang/locales/*.json
```

### Layout Breaking on Mobile
```css
/* Ensure Bootstrap grid CSS is loaded */
/* Check in _document.js or global CSS */
@import 'bootstrap/dist/css/bootstrap-grid.css';
```

### Social Icons Not Aligned
```jsx
// Ensure Font Awesome is loaded globally
// Check in _document.js:
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
```

## 📊 Comparison: Before vs After

| Feature | Before (3 columns) | After (2 columns + dark) |
|---------|-------------------|-------------------------|
| Layout | 3 equal columns | 2 columns (6-6 split) |
| Background | White/light gray | Dark gray gradient |
| Social | Top footer (3rd col) | Bottom footer (right side) |
| Contact Icons | Plain text | Circular with background |
| Nav Arrows | None | Animated arrows on hover |
| Hover Effects | Basic | Advanced with transforms |
| Responsive | Basic | Fully optimized |
| Text Color | Dark | Light (for dark bg) |

## ✅ Testing Checklist

- [ ] Footer appears on all pages
- [ ] Logo loads correctly
- [ ] All links are clickable
- [ ] Social links open in new tab
- [ ] Hover effects work smoothly
- [ ] Mobile layout is correct
- [ ] Icons display properly
- [ ] Copyright year is dynamic
- [ ] Translations work (IT/EN/FR)
- [ ] Keyboard navigation works
- [ ] Focus states are visible
- [ ] Print version is clean

## 🎯 Future Enhancements

- [ ] Add newsletter signup form
- [ ] Add sitemap links section
- [ ] Add payment method icons
- [ ] Add language switcher in footer
- [ ] Add back-to-top button
- [ ] Add cookie consent banner integration
- [ ] Add trust badges (SSL, etc.)

---

**Version**: 2.0.0 (Top-tier dark design)
**Last Updated**: 2025-12-30
**Migrated From**: React CRA original footer
**Design**: Matches React layout with enhanced dark theme
