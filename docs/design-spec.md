# Cambric AI — Design Specification

Reference document for the Cambric AI website design system.
Use this to recreate the design in Figma or any other design tool.

---

## Color Palettes

### Tokyo Night (Dark Zones: Header, Hero, Footer)

| Token           | Hex       | Usage                        |
|-----------------|-----------|------------------------------|
| `--bg`          | `#1a1b26` | Primary background           |
| `--bg-dark`     | `#16161e` | Deepest background (hero)    |
| `--panel`       | `#1f2335` | Card/panel backgrounds       |
| `--panel-2`     | `#24283b` | Input/secondary panels       |
| `--surface`     | `#292e42` | Elevated surfaces            |
| `--text`        | `#c0caf5` | Body text                    |
| `--text-bright` | `#e0e4ff` | Headings / emphasis          |
| `--muted`       | `#565f89` | Secondary text / captions    |
| `--brand`       | `#bb9af7` | Primary brand (purple)       |
| `--brand-dim`   | `#9d7cd8` | Brand dimmed variant         |
| `--accent`      | `#7aa2f7` | Links / accents (blue)       |
| `--cyan`        | `#7dcfff` | Cyan accent                  |
| `--green`       | `#9ece6a` | Success / checkmarks         |
| `--orange`      | `#ff9e64` | Warning accent               |
| `--red`         | `#f7768e` | Error / danger               |
| `--yellow`      | `#e0af68` | Yellow accent                |

### Parchment (Light Content Zones)

| Token                | Hex       | Usage                        |
|----------------------|-----------|------------------------------|
| `--parchment`        | `#f0ebe1` | Light zone background        |
| `--parchment-panel`  | `#ffffff` | Card/panel on light bg       |
| `--parchment-input`  | `#faf8f4` | Input fields on light bg     |
| `--parchment-text`   | `#3a3632` | Body text on light bg        |
| `--parchment-bright` | `#1a1815` | Headings on light bg         |
| `--parchment-muted`  | `#7a756e` | Secondary text on light bg   |
| `--parchment-brand`  | `#8b6cc7` | Brand purple on light bg     |
| `--parchment-accent` | `#4a7ae0` | Link blue on light bg        |
| `--parchment-green`  | `#4a8a3a` | Checkmarks on light bg       |

---

## Typography

**Font Family:** Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif
**Font Weights:** 400 (regular), 500 (medium), 600 (semibold), 800 (extrabold)

| Element     | Size                               | Weight | Letter-spacing | Line-height |
|-------------|-------------------------------------|--------|----------------|-------------|
| H1          | `clamp(2.2rem, 4vw, 3.8rem)`       | —      | `-0.03em`      | `1.15`      |
| H2          | `clamp(1.5rem, 2.5vw, 2.4rem)`     | —      | `-0.03em`      | `1.15`      |
| H3          | `1.2rem`                            | —      | `-0.03em`      | `1.15`      |
| Body (p)    | inherited                           | 400    | —              | `1.7`       |
| Lead        | `clamp(1.05rem, 1.3vw, 1.25rem)`   | 400    | —              | `1.7`       |
| Nav links   | `0.92rem`                           | 400    | —              | —           |
| Buttons     | `0.92rem`                           | 500    | —              | —           |
| Button (lg) | `1rem`                              | 600    | —              | —           |
| Badge       | `0.78rem`                           | —      | —              | —           |
| Small       | `0.88rem`                           | —      | —              | —           |

---

## Spacing & Layout

| Token          | Value    | Usage                          |
|----------------|----------|--------------------------------|
| `--max-w`      | `1200px` | Max content width              |
| Container      | `min(1200px, 92vw)` | Centered container    |
| Section pad    | `80px 0` | Vertical section spacing       |
| Section head   | `mb 32px`| Heading bottom margin          |
| Grid gap       | `20px`   | Default grid gap               |
| Card padding   | `24px`   | Standard card internal padding |
| Product card   | `28px`   | Product card internal padding  |

---

## Border Radius

| Token          | Value  | Usage                    |
|----------------|--------|--------------------------|
| `--radius`     | `16px` | Cards, panels            |
| `--radius-sm`  | `10px` | Inputs, nav items        |
| Buttons (pill) | `999px`| Fully rounded buttons    |
| Badges         | `999px`| Pill-shaped badges       |

---

## Shadows

| Context        | Value                                    |
|----------------|------------------------------------------|
| Dark zones     | `0 18px 50px rgba(0,0,0,.4)`             |
| Light zones    | `0 4px 20px rgba(0,0,0,.04), 0 12px 40px rgba(0,0,0,.03)` |
| Card hover (dark)  | `0 22px 60px rgba(0,0,0,.35)`       |
| Card hover (light) | `0 20px 50px rgba(0,0,0,.07)`       |
| Button primary | `0 10px 30px color-mix(brand 20%, black)`|

---

## Breakpoints

| Name    | Max-width | Changes                                         |
|---------|-----------|--------------------------------------------------|
| Desktop | > 900px   | Default: 3-col grids, side-by-side layouts       |
| Tablet  | ≤ 900px   | Grids collapse to 1-col, mission stack           |
| Nav     | ≤ 860px   | Hamburger menu, dropdown nav                     |
| Entries | ≤ 700px   | Research/news entries stack (no date column)      |

---

## Component Anatomy

### Header
- **Position:** Sticky, top: 0, z-index: 100
- **Background:** `color-mix(bg 82%, transparent)` with `backdrop-filter: saturate(180%) blur(16px)`
- **Border-bottom:** 1px solid `color-mix(text 6%, transparent)`
- **Inner:** Flex, space-between, padding 14px 0
- **Brand:** Logo (32px height) + text, font-weight 800, 1.1rem
- **Nav links:** Flex row, gap 4px, rounded hover backgrounds

### Hero
- **Background:** `--bg-dark` (#16161e)
- **Min-height:** 100vh
- **Content:** Centered, max-width 720px, z-index 2
- **Announcement pill:** Rounded, brand-tinted background, 0.85rem
- **CTA row:** Flex, gap 12px, centered
- **Planet:** Absolute bottom, translateX(-50%), width clamp(480px, 55vw, 820px)
- **Stars:** Positioned pseudo-elements with box-shadow star patterns
- **Gradient fade:** Bottom 30%, linear gradient to --bg

### Product Cards
- **Grid:** 3-column on desktop, 1-column on mobile
- **Card:** Flex column, gap 16px, 28px padding, 16px radius
- **Icon:** 44x44px, 12px radius, colored background per product
- **Hover:** translateY(-3px), enhanced shadow, brand border glow

### Umbra Gradients
- **Height:** `clamp(120px, 18vw, 260px)`
- **To light:** 9-stop gradient from `#1a1b26` to `#f0ebe1`
- **To dark:** Reverse of above

### Buttons
- **Primary:** Brand bg, dark text, pill shape, shadow, brightness hover
- **Ghost:** Transparent bg, subtle border, panel-2 hover fill
- **Sizes:** Default 12px 18px, Large 14px 24px
- **Active:** translateY(1px)

### Footer
- **Grid:** 3 columns (1.4fr .8fr 1fr)
- **Border-top:** 1px solid text 6%
- **Padding:** 40px 0

---

## Animations

| Animation      | Properties                              | Duration   |
|----------------|-----------------------------------------|------------|
| Planet float   | margin-top: 0 → -10px → 0              | 8s infinite|
| Reveal         | opacity 0→1, translateY(12px→0)         | 0.5s ease  |
| Button hover   | transform, box-shadow, background       | 0.2s ease  |
| Card hover     | transform translateY(-2..3px), shadow   | 0.12-0.15s |
| Link color     | color transition                        | 0.15s ease |
| Nav toggle     | display none/flex                       | instant    |

---

## Page Structure

All pages follow: Header → [Hero on home] → [Umbra-to-light on home] → Main Content (light-content) → [Umbra-to-dark on home] → [Dark sections on home] → Footer

### Pages
1. **Home** (`/`) — Hero + products grid + mission + capabilities + CTA
2. **Products** (`/products.html`) — Page header + product grid
3. **About** (`/about.html`) — Split layout with principles panel
4. **Research** (`/research.html`) — Timeline entries
5. **News** (`/news.html`) — Timeline entries with dates
6. **Contact** (`/contact.html`) — Form (Formspree) + direct email
7. **Privacy** (`/privacy.html`) — Legal content, narrow container
8. **Terms** (`/terms.html`) — Legal content, narrow container
