# Design Rules — Heritage Health Design System

This document outlines the core visual and structural rules for the Heritage Health Services brand.

## 1. Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| **Navy (Primary)** | `#0A1F3A` | Main headers, text, dark backgrounds |
| **Gold (Accent)** | `#C9A84C` | Buttons, icons, labels, highlights |
| **Navy Deep** | `#06101F` | Hero overlays, footer background |
| **Off-White** | `#FAFAF8` | Section backgrounds, subtle cards |
| **Warm Gray** | `#F5F3EF` | Secondary background sections |

## 2. Typography

- **Headings (H1, H2, H3):** 
  - Font: `Playfair Display`, serif
  - Weight: 600 (Semi-bold)
  - Color: `--navy`
  - Style: Use *italic* spans (`<em>`) for emphasized keywords in titles.
  
- **Body & Controls:**
  - Font: `Inter`, sans-serif
  - Weight: 400 (Regular) / 600 (Bold)
  - Line-height: 1.7 - 1.85 for readability.

- **Section Labels:**
  - Always uppercase, letter-spacing `0.2em`, color `--gold`.
  - Prefix with a horizontal line (`--section-label::before`).

## 3. Spacing & Layout

- **Container:** Max-width `1280px` with `40px` side padding.
- **Section Padding:** Vertical padding of `140px` (`--section-py`) to provide significant "breathability."
- **Gaps:** Use variable-based gaps (`--gap-xl: 100px`, `--gap-lg: 60px`) for consistent alignment.

## 4. Components

### Buttons
- **Primary:** Gold background with Navy text.
- **Dark:** Navy background with White text.
- **Effect:** Subtle `translateY(-2px)` on hover with custom shadow.

### Cards (Services/Videos)
- Background: White.
- Border: Very subtle (`rgba(0,0,0,0.04)`).
- Hover: Elevation via `box-shadow` and `translateY(-8px)`.
- Highlight: Gold bottom border reveals on hover.

## 5. Visual Language

- **Imagery:** Use high-quality, professional photography focusing on caring interactions.
- **Shadows:** Use layered, soft shadows (`--shadow-lg`) for a premium depth effect.
- **Radii:** Standardized corners: `8px` for small items, `16px` for cards, `24px` for large sections.

## 6. Motion Guidelines

- **Transitions:** Use `cubic-bezier(0.16, 1, 0.3, 1)` for snappy yet smooth animations.
- **Scroll Reveal:** Elements should fade up from `40px` below their target position.
- **Sticky Header:** Blurs the background on scroll (`backdrop-filter: blur(20px)`).
