# Copilot Instructions - Naty & Carlos Wedding Site

## Project Overview
This is a single-page wedding invitation website for Naty & Carlos (Feb 28, 2026) at Los Cedros Quinta. It features responsive design with elegant typography, dynamic content loading, QR code generation for guest passes, and smooth animations with a cohesive aesthetic.

## Architecture & Data Flow

### Core Components
- **index.html**: Single-page layout with 8 major sections (Hero, Gallery, Timeline, Location, Gifts, No Kids, RSVP Form, Footer)
- **CSS Structure**: 
  - `main.css` - Base styles with CSS variables for colors, fonts, spacing
  - `components.css` - Section-specific styling (~1000 lines) with gradients, animations, shadows
  - `responsive.css` - Mobile-first breakpoints (480px, 768px, 1024px, 1600px)
- **JavaScript**: `main-corregido.js` (266 lines) - Current implementation handling all functionality
  - Form validation & submission with QR generation
  - Gallery and timeline rendering from `APP_DATA`
  - QRCode.js library (CDN v1.0.0) for QR generation

### Design System - Cohesive Aesthetic
**Color Variables** (`main.css:root`):
- `--black` (#1a1a1a) - Primary text & buttons
- `--off-white` (#fafafa) - Backgrounds
- `--forest` (#3d5a4c) - Section titles, accents, gradients
- `--gold` (#b8956a) - Highlights, QR download button, dividers, timeline markers
- `--sage` (#8fa89f) - Subtle accents

**Typography** (all Google Fonts):
- `--font-cinzel` - Labels, buttons, uppercase text
- `--font-cormorant` - Body text, elegant sans-serif feel
- `--font-libre` - Large headers, h2/h3 elements

**Visual Effects** (consistent across sections):
- Gradient overlays: Forest + Gold + Sage (135deg diagonal)
- Box shadows: `0 8px 32px rgba(61, 90, 76, 0.08)`
- Transitions: cubic-bezier(0.34, 1.56, 0.64, 1) for bounce
- Animations: `fadeInUp`, `gentle-pulse`, `gentle-float` (smooth, elegant)

### Data Configuration
- **`APP_DATA` object** (main-corregido.js lines 2-38):
  - `photos`: Array of 3 images with fallback URLs to Unsplash
  - `timeline`: Array of 4 events (18:00 → 22:00) with Spanish time labels
- **`CONFIG` object** (main-corregido.js lines 40-45):
  - `maxGuests: 1` (single invitation, non-transferable)
  - Wedding date/location constants

## Critical Patterns

### Single Guest Constraint
- Form accepts **only 1 person** - no companion/guest count fields
- QR data includes "Esta es tu entrada. Preséntalo a la llegada"
- Unique pass message embedded in form with gold border styling

### Form → QR → Confirmation Flow
1. User submits `rsvpForm` (nombre, telefono, email optional, asistencia radio)
2. `handleFormSubmit()` prevents default, validates, disables button
3. `getFormData()` retrieves form values + generates confirmation ID (UUID-like: `NYC-{timestamp}-{random}`)
4. `generateQRCode()` creates QR canvas with user data
5. `formWrapper` hidden, `qrDisplay` shown with generated QR
6. `downloadQR()` (exposed to window) exports canvas as PNG
7. `successWrapper` displays after user closes QR section (manual close - NOT auto-triggered)

### QR Generation
- **Library**: QRCode.js (v1.0.0) from CDN in index.html
- **QR Content**: Formatted text with confirmation ID, name, date/location, entry instructions
- **Styling**: 200x200px, dark (#1a1a1a) on white background, High error correction
- **Download**: Extracts canvas from `#qrcode canvas`, converts to PNG with timestamp filename

## Aesthetic Cohesion Across Sections

### Gallery
- 3-column grid (responsive to 1 col on mobile)
- Each photo-card has: border-radius 8px, shadow hover effect, scale-up on hover, gold border accent
- Overlay gradient forest→transparent with text in `font-libre`
- Staggered fade-in animations (100ms each)

### Timeline
- **Desktop**: 2-column alternating layout with center vertical line (2px gold gradient)
- **Tablet/Mobile**: Single column with left border gold (3px) - simpler than desktop
- Items have: white background, box-shadow, gold dots at connection points
- Time in 48px gold, period uppercase in forest
- Hover: translate-y -4px with enhanced shadow

### Location & Gifts
- White backgrounds with diagonal gradient overlays (forest→gold)
- Border: 1px rgba(61, 90, 76, 0.12) - subtle forest hint
- Headers in `font-libre` 32-44px, color forest
- Sections have floating animations (gentle-float 3s infinite)

### Form & QR
- Input focus: forest border + gold glow effect
- Radio buttons: forest text, checked state→gradient forest bg with white text
- Submit button: gradient forest (135deg) with hover scale-up + enhanced shadow
- QR container: light gradient background with gold border
- Success message: gold download button with gradient, icon has gentle-pulse animation

### Buttons & Links
- All buttons use `font-cinzel` uppercase with letter-spacing 2-3px
- Primary buttons: `linear-gradient(135deg, forest 0%, #2f4a42 100%)`
- Secondary (downloads): `linear-gradient(135deg, gold 0%, #a0854a 100%)`
- Hover states: reverse gradient direction, translateY -3px, enhanced shadow

## Common Tasks

### Adding Timeline Events
Edit `APP_DATA.timeline` in main-corregido.js (lines 20-37):
```javascript
{ 
  time: '18:30', 
  period: 'Tarde', 
  title: 'Ceremonia Civil', 
  description: 'Acompáñanos a decir "Sí, acepto".' 
}
```
Timeline renders via `initTimeline()` (line 88).

### Adding Photos to Gallery
Add to `APP_DATA.photos` (lines 8-19):
```javascript
{ 
  src: 'assets/images/fotos/fotoN.jpg', 
  alt: 'Naty y Carlos', 
  caption: '...', 
  fallback: 'https://images.unsplash.com/...' 
}
```
Renders via `initGallery()` (line 60) with staggered animations.

### Styling Consistency
- All sections use `linear-gradient(135deg, rgba(...), rgba(...))` for backgrounds
- Border colors: `rgba(61, 90, 76, 0.12)` or gold (`var(--gold)`)
- Box shadows always: `0 8px 32px rgba(61, 90, 76, 0.08)` (or variations with different opacity)
- Font sizes use `clamp()` for fluid scaling: `clamp(32px, 5vw, 44px)`
- Border radius: consistently 8px or 6px (NO sharp corners)

### Form Field Validation
- `validateForm()` (line 134) checks: nombre, telefono, asistencia selected
- `getFormData()` (line 145) builds object with all fields + confirmation ID
- Confirmation ID format: `NYC-${timestamp}-${random}` (line 160)

## Integration Points

### External Dependencies
- **Google Fonts**: Preconnect links in index.html head
- **QRCode.js**: CDN v1.0.0 in index.html (loaded BEFORE main script)
- **No Firebase**: This version uses client-side only (localStorage ready but not implemented)

### Critical Element IDs
- `photoGrid` - Gallery container
- `timelineContainer` - Timeline items
- `rsvpForm` - Main form
- `submitBtn` - Submit button
- `formWrapper` / `qrDisplay` / `successWrapper` - Display sections
- `nombre`, `telefono`, `email` - Input fields
- `asistencia` - Radio buttons (name attribute)
- `mensaje` - Textarea
- `qrcode` - QR canvas container

## Development Workflow
- **No build process**: Static site, direct serve
- **Testing**: Open `index.html` or run `python3 -m http.server 8000`
- **Main script**: Use `main-corregido.js` (current, tested implementation)
- **Other files**: `main.js` (370 lines, experimental), `main-unificado.js` (data only)

## Mobile Responsiveness
- **1024px breakpoint**: Desktop timeline with alternating columns
- **768px breakpoint**: Timeline reverts to single column with left border
- **480px breakpoint**: Reduced spacing, single-column grids, fluid font sizes
- Gallery: Always responsive grid-template-columns repeat(auto-fit, minmax(...))

## Language
All content is in **Spanish (Mexico)** with Mexican date/time conventions (e.g., "28 de Febrero", "18:30" in 24-hour format).
