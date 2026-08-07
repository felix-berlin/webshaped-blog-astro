---
name: webshaped blog
description: Felix Scholze's personal blog — a halftone-textured, sunset-gradient editorial shell over WordPress content.
colors:
  night-navy: "#303956"
  night-navy-deep: "#272e46"
  night-navy-light: "#384263"
  coral-accent: "#ed3c63"
  amber-accent: "#e88923"
  gold-accent: "#e8a023"
  sky-blue: "#24b4e9"
  periwinkle: "#b0bada"
  paper: "#eeeeee"
  danger: "#f33b1d"
  success: "#35a672"
typography:
  display:
    fontFamily: "Source Sans Pro, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
  headline:
    fontFamily: "Source Sans Pro, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Source Sans Pro, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Source Sans Pro, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "normal"
rounded:
  sm: "3px"
spacing:
  edge: "15px"
  outer: "40px"
  base: "1rem"
components:
  button-primary:
    backgroundColor: "{colors.amber-accent}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "0.5rem 1rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "0.5rem 1rem"
  input:
    backgroundColor: "#ffffff"
    textColor: "{colors.night-navy}"
    rounded: "{rounded.sm}"
    padding: "0.55rem"
  post-card:
    backgroundColor: "#24b4e914"
    rounded: "{rounded.sm}"
    padding: "2rem"
  modal:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.sm}"
---

# Design System: webshaped blog

## 1. Overview

**Creative North Star: "The Sunset Halftone"**

The blog reads as a printed halftone sheet lit from behind by a sunset. Every page sits on a fine dot-grid texture (a tiled SVG halftone pattern, not a flat color), with two soft diagonal gradient glows — warm amber-to-coral in light mode, navy-to-coral in dark mode — washing across the top and bottom of the viewport behind the content. The UI itself stays deliberately quiet and near-flat (3px corners, thin borders, translucent tints) so the textured background and the accent color do the visual work, not the chrome.

The system explicitly rejects glossy card-heavy SaaS staging: no drop shadows stacked for hierarchy, no rounded-pill everything, no neutral-gray flatness. Depth and mood come from texture and color wash, not elevation.

**Key Characteristics:**
- Halftone dot-grid background texture on every page, both themes.
- Diagonal warm-gradient glow blobs behind main content, theme-aware.
- Near-flat geometry: a single 3px radius used everywhere, never fully rounded.
- One accent color per theme: amber/gold in light mode, coral-red in dark mode.
- Single sans-serif family (Source Sans Pro) carries the entire type system.

## 2. Colors

The palette is a navy/paper base with exactly one hot accent per theme — the accent itself is the thing that changes between light and dark, not just the background.

### Primary
- **Night Navy** (#303956): The dark-mode surface color and the light-mode text/ink color. Anchors both themes as the "base" hue.

### Secondary
- **Coral Accent** (#ed3c63): The active accent color in dark mode — primary buttons, active nav links, hover states, focus rings.
- **Amber Accent** (#e88923): The active accent color in light mode, same role as Coral Accent but swapped in via the `.dark` class toggle.

### Neutral
- **Paper** (#eeeeee): Near-white, used as the light-mode document background and as button/text-on-accent color. Never pure `#fff` for large surfaces.
- **Night Navy Deep** (#272e46): Darkened navy for dark-mode background layering.
- **Night Navy Light** (#384263): Input borders and secondary dark-mode surfaces.
- **Periwinkle** (#b0bada): Dark-mode text-selection highlight only.
- **Sky Blue** (#24b4e9): Low-opacity tint (~5–8% alpha) behind post cards and as the icon-button accent; never used at full opacity for large areas.

### Named Rules
**The One Accent Rule.** Only one hot accent color is live at a time — amber in light mode, coral in dark mode. They never appear together on the same render; the `.dark` class swap on `<html>` is the single source of truth for which one is active.

## 3. Typography

**Display Font:** Source Sans Pro (with system sans-serif fallback)
**Body Font:** Source Sans Pro (with system sans-serif fallback)

**Character:** One typeface for everything. Hierarchy comes entirely from weight (headings are always 700) and the size scale, not from font pairing.

### Hierarchy
- **Display** (700, ~1.75rem+, 1.2 line-height): Page-level headings (h1).
- **Headline** (700, ~1.5rem, 1.3 line-height): Section headings (h2–h3), post-card titles.
- **Title** (700, 1rem–1.2rem, 1.3 line-height): Card and component titles, e.g. post excerpts' "read more" label.
- **Body** (400, 1rem, 1.6 line-height): Article and paragraph text; 65–75ch max line length in content columns.
- **Label** (400, 0.875rem, 1.35 line-height): Form labels, checkbox/radio text, small UI copy.

### Named Rules
**The One Family Rule.** No second typeface is introduced for contrast; every weight and size step comes from Source Sans Pro's own range.

## 4. Elevation

Flat-by-default, blur for depth: the system carries almost no `box-shadow`. Instead, depth is conveyed through translucent tinted backgrounds (post cards sit on an 8%-opacity blue tint with a blurred, hue-rotated pseudo-element behind them), through `backdrop-filter: blur()` on hover states and modal backdrops, and — most distinctively — through motion: the modal's native `<dialog>` enters with a dramatic 3D `translateZ`/`translateY` slide from off-screen, which does more perceptual "lifting" work than any shadow would.

### Shadow Vocabulary
- **Ambient icon glow** (`filter: drop-shadow(0 0 4px rgba(238,238,238,0.35))`): Soft white glow under icon-button SVGs only, not used as a general elevation tool.
- **Outline-button hover glow** (`box-shadow: 0 0 15px 1px rgba(255,180,51,0.5)` + `backdrop-filter: blur(3px) hue-rotate(21deg)`): A one-off hover accent on outline buttons, not a repeatable elevation step.

### Named Rules
**The No-Stack Rule.** Never stack multiple box-shadows to fake elevation tiers (card < modal < tooltip). If something needs to feel "above" the page, use blur/tint or motion, not a heavier shadow.

## 5. Components

Quiet and glassy, loud on accent: most components stay understated and semi-transparent at rest; the accent color is spent deliberately, on primary actions, active states, and hover feedback — never on idle surfaces.

### Buttons
- **Shape:** 3px radius (`border-radius: 3px`), applied uniformly — never pill-shaped, never square.
- **Primary:** Solid accent-color background (`var(--accent-color)`), paper-colored text, `0.5rem 1rem` padding, no border. Darkens the accent by ~8% on hover.
- **Outline:** Transparent background, 1px accent-colored border, paper text. On hover (motion enabled): glowing `box-shadow` plus a `blur(3px) hue-rotate(21deg)` backdrop-filter — the one intentionally playful hover moment in an otherwise restrained system.
- **Icon:** No background or border (`.u-button-reset`), icon-centered layout; SVG carries a soft ambient drop-shadow that swaps to the accent color on hover.
- **Like-link:** Zero padding, no background — reads as inline text with an icon, not a button.

### Cards / Containers
- **Corner Style:** 3px radius, matching buttons and inputs.
- **Background:** Sky Blue at ~8% opacity (`#24b4e914`), layered over a second blurred, hue-rotated pseudo-element at ~5% opacity for texture.
- **Shadow Strategy:** None — see Elevation. Depth reads from the tint + blur layering instead.
- **Border:** None.
- **Internal Padding:** `2rem`.
- **State:** On hover, the title shifts to the theme's accent color and a trailing arrow fades in and slides `0.15rem` right — motion carries the interaction, not shadow or scale.

### Inputs / Fields
- **Style:** 1px solid border in Night Navy Light (#384263), white background, 3px radius, `~0.55rem` internal padding.
- **Focus:** Border shifts to the accent color; a soft coral/amber `box-shadow` ring (`0 0 0 3px`, 30% opacity) appears alongside a matching `outline`. No glow or scale effect — a controlled, quiet focus state.
- **Checkbox / Radio / Switch:** Custom-built (native input hidden via `appearance: none`), accent-colored when checked, with a `cubic-bezier(0.2, 0.85, 0.32, 1.2)` spring-like transform on the check/thumb — the single place a bouncier easing curve is allowed.
- **Disabled:** Background swaps to a muted gray token; cursor becomes `not-allowed`.

### Navigation
- **Style:** CSS grid layout (logo / menu / toggle areas), 3px radius on the nav shell itself, `20px`/`15px` padding.
- **Desktop:** Horizontal row, links at 18px, active link colored with the accent.
- **Mobile:** Full-screen flyout with its own diagonal gradient overlay (coral-to-blue-to-navy), independent of the page background gradients.
- **Active/Hover:** Underline on hover; top-level active links take the accent color directly rather than a background change.

### Modal (Signature Component)
Backed by the native `<dialog>` element. Backdrop uses `backdrop-filter: blur(4px)` with a 1s fade-in. The dialog itself enters with a 0.4s `translateZ(-1400px) translateY(-800px) → translateZ(0) translateY(0)` animation — a literal "flying in from a distance" effect that is the system's one deliberately theatrical motion moment, deployed only here.

## 6. Do's and Don'ts

### Do:
- **Do** keep the halftone dot-grid background and diagonal gradient glows on every page — they are the system's signature, not decoration to be dropped on busy pages.
- **Do** use exactly one accent color at a time (amber in light mode, coral in dark mode), driven only by the `.dark` class on `<html>`.
- **Do** use the 3px radius (`base.$border-radius`) on every rounded surface — buttons, inputs, cards, modal, nav shell. Never introduce a second radius scale.
- **Do** convey depth through translucent tint + blur (`backdrop-filter`) or through motion (the modal's 3D entrance), not through stacked box-shadows.
- **Do** respect the `motion` / `no-motion` feature toggle already wired through `sass-butler`'s `feature()` mixin — every hover/transition effect must have a static fallback for `prefers-reduced-motion`.

### Don't:
- **Don't** stack multiple box-shadows to simulate elevation tiers (card < modal < tooltip); this system does not have an elevation ladder.
- **Don't** introduce a second typeface for "contrast" — hierarchy comes from weight and size within Source Sans Pro only.
- **Don't** use pure `#fff` as a large-surface background; the system's near-white is Paper (`#eeeeee`).
- **Don't** show both accent colors (amber and coral) at once on the same render — only one is ever "live," matching the current theme.
- **Don't** round corners beyond 3px, and don't leave any interactive surface (button, input, card) with square corners either — the 3px radius is a fixed, uniform choice, not a per-component decision.
