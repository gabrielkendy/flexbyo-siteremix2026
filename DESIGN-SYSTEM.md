# FlexByo Design System

Reference for all pages in the FlexByo Academy website.

## Color Tokens

| Token          | Value     | Usage                        |
|----------------|-----------|------------------------------|
| `--teal-deep`  | `#0E6A75` | Primary dark, CTAs, headings |
| `--teal-bright`| `#00A8AD` | Accent, links, highlights    |
| `--teal-ink`   | `#083940` | Darkest teal, hero overlays  |
| `--glow`       | `#00D4DA` | Glow effects, kickers        |
| `--off-white`  | `#F5F1EA` | Page background              |
| `--cream`      | `#EDE7DB` | Card backgrounds, alt bg     |
| `--ink`        | `#0A0A0A` | Body text                    |
| `--ink-2`      | `#1A1A1A` | Secondary dark               |
| `--gold`       | `#C9A86B` | Accent secondary, ornaments  |

## Typography

| Token            | Family                  | Usage               |
|------------------|-------------------------|----------------------|
| `--font-display` | Fraunces (variable)     | Headings, hero, logo |
| `--font-body`    | Inter                   | Body text            |
| `--font-mono`    | JetBrains Mono          | Labels, eyebrows, UI |

### Display Sizes

- Hero h1: `clamp(40px, 6.4vw, 104px)`, weight 300, opsz 144
- Section h2: `clamp(38px, 5.5vw, 88px)`, weight 300
- Eyebrow: 11px, mono, `.4em` letter-spacing, uppercase

## Spacing

- Section padding: `160px 40px` (desktop), `120px 24px` (mobile)
- Max content width: `1440px` (`--max`)
- Grid gaps: 80-120px between major elements, 24px between cards

## Components

### `.btn` — Primary button
Pill shape, teal-bright bg, ink fg. Hover: slides teal-deep from bottom.
Variants: `.ghost` (transparent border), `.btn-shine` (animated glow).

### `.eyebrow` — Section label
Mono 11px, uppercase, teal-deep, with left line pseudo-element.
Variant: `.on-dark` for dark backgrounds.

### `.reveal` — Scroll animation
Fades up (translateY 36px). Add `.d1`-`.d6` for stagger delays.
Variant: `.clip` for image clip-path reveal.

### `.magnetic` — Hover effect
JS-driven: element follows cursor within bounds.

## File Structure

```
assets/
  css/
    shared.css       — Tokens, reset, nav, footer, buttons, reveals
    components.css   — Section components (manifesto, modgrid, quotes, etc.)
    home.css         — Homepage-only styles (hero, studio image)
  js/
    shared.js        — Scroll, reveals, nav drawer, cursor, magnetic
    home.js          — Hero parallax, testimonials, form handler
  fonts/             — (reserved for self-hosted fonts)
  images/            — (reserved for optimized images)
project/
  assets/            — Original design assets (images, home-v2.css)
```

## Nav Structure

Desktop: horizontal links + CTA pill. Mobile (<860px): hamburger toggle + fullscreen drawer.

## Footer

4-column grid: Brand | Navigate | Modalidades | Contact.
Megaword between grid and bottom bar.

## Pages (planned)

| Route               | Status      |
|----------------------|-------------|
| `/index.html`        | Done        |
| `/sobre.html`        | Planned     |
| `/modalidades.html`  | Planned     |
| `/planos.html`       | Planned     |
| `/contato.html`      | Planned     |
