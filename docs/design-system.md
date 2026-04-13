# Design System — Nebula One

**Creative North Star:** "The Celestial Architect"  
Dark deep-space aesthetic with atmospheric layering, glassmorphism, and editorial typography.

---

## Fonts

Import in `app/layout.js`:
```js
import { Space_Grotesk, Work_Sans } from 'next/font/google'
```

| Role | Font | Usage |
|------|------|-------|
| `font-headline` | Space Grotesk | Page titles, section headings, card titles, planet names |
| `font-body` | Work Sans | All body text, paragraphs, descriptions (> 3 words) |
| `font-label` | Work Sans | Metadata, nav labels, badges, uppercase tags |

```jsx
// Page title
<h1 className="font-headline font-black text-3xl text-on-surface">

// Body
<p className="font-body text-on-surface-variant">

// Nav label
<span className="font-label text-xs uppercase tracking-widest">
```

---

## Colors

### Surfaces (use for layering, NOT borders)
| Token | Hex | Role |
|-------|-----|------|
| `bg-surface-container-lowest` | `#000f1f` | Deepest void — inputs, sidebars inner |
| `bg-surface-container-low` | `#0a1d2e` | Main page background sections |
| `bg-surface-container` | `#0f2132` | Mid-level containers |
| `bg-surface-container-high` | `#1a2b3d` | Cards, active zones |
| `bg-surface-container-highest` | `#253649` | Elevated cards, hover states |
| `bg-background` / `bg-surface` | `#021425` | Root background |

### Brand Colors
| Token | Hex | Meaning |
|-------|-----|---------|
| `text-primary` / `bg-primary` | `#acc7ff` | Starlight — primary actions, focus |
| `text-secondary` / `bg-secondary` | `#ffb2b9` | Solar Flare — gamification, urgency, CTAs |
| `text-tertiary` / `bg-tertiary` | `#c8bfff` | Nebula — progress, secondary accents |

### Text Colors
| Token | Usage |
|-------|-------|
| `text-on-surface` (`#d2e4fc`) | Primary text on dark backgrounds |
| `text-on-surface-variant` (`#c3c6d2`) | Secondary / muted text |
| `text-on-primary` (`#002f67`) | Text on primary-colored buttons |

---

## The "No-Line" Rule

**NEVER use `border` for sectioning.** Define boundaries through background color shifts.

```jsx
// ❌ Wrong
<div className="border border-gray-700">

// ✅ Correct — elevation via background tiers
<section className="bg-surface-container-low">
  <div className="bg-surface-container-high rounded-xl p-6">
```

The only allowed border is the **Ghost Border** fallback for accessibility:
```jsx
className="border border-outline-variant/15"  // outline-variant at 15% opacity
```

---

## Border Radius

| Class | Value | Use |
|-------|-------|-----|
| `rounded` | `0.25rem` | Avoid — too sharp |
| `rounded-lg` | `0.5rem` | Small chips, tags |
| `rounded-xl` | `0.75rem` | Cards, containers, inputs |
| `rounded-xxl` | `1.5rem` | Primary CTA buttons |
| `rounded-full` | `9999px` | Avatars, pill badges |

---

## Key Components

### Sidebar
```jsx
<aside className="h-screen w-64 fixed left-0 top-0 bg-[#021425] flex flex-col py-6 z-50">
  {/* No right border — background shift defines the edge */}

  {/* Active nav item */}
  <a className="border-l-4 border-secondary bg-white/5 text-on-surface font-bold 
                py-3 px-6 flex items-center gap-3 font-label text-xs uppercase tracking-widest">

  {/* Inactive nav item */}
  <a className="text-on-surface-variant hover:text-on-surface py-3 px-6 
                flex items-center gap-3 font-label text-xs uppercase tracking-widest 
                hover:bg-white/5 transition-all">
```

### Cards
```jsx
// Standard card
<div className="bg-surface-container-high rounded-xl p-6">

// Glass panel (floating elements, modals)
<div className="backdrop-blur-[12px] bg-surface-container-low/70 rounded-xl p-6">
```

### Celestial Background Glow
```jsx
// Put these in the page root behind content
<div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] 
                bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
<div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] 
                bg-tertiary/10 rounded-full blur-[120px] pointer-events-none" />
```

### Primary Button
```jsx
<button className="px-6 py-3 bg-primary text-on-primary rounded-xxl font-bold 
                   font-headline hover:scale-[1.02] active:scale-95 transition-transform
                   flex items-center gap-2">
```

### Tertiary Button (no background)
```jsx
<button className="px-6 py-3 text-primary font-bold font-headline 
                   hover:opacity-80 transition-opacity">
```

### Input
```jsx
<input className="w-full bg-surface-container-lowest rounded-xl px-4 py-3
                  text-on-surface font-body placeholder:text-on-surface-variant
                  border border-outline-variant/15 focus:border-primary/50 
                  focus:outline-none focus:ring-0 transition-colors" />
```

### Progress Bar
```jsx
<div className="w-full h-2 bg-surface-container-highest/20 rounded-full overflow-hidden">
  <div className="h-full bg-gradient-progress rounded-full" style={{ width: '72%' }} />
</div>
```

### Status Badge
```jsx
// Active / success
<span className="px-3 py-1 bg-primary-container text-primary rounded-full 
                 font-label text-xs uppercase tracking-widest">

// Warning / mission-critical
<span className="px-3 py-1 bg-secondary-container text-secondary rounded-full 
                 font-label text-xs uppercase tracking-widest">
```

### Top Header
```jsx
<header className="fixed top-0 right-0 left-64 z-40 h-16 
                   flex justify-between items-center px-8
                   bg-background/80 backdrop-blur-xl 
                   border-b border-white/10 shadow-ambient">
```

### Data Table Row
```jsx
<tr className="border-b border-outline-variant/10 hover:bg-surface-container-high 
               transition-colors">
```

---

## Icons

Material Symbols Outlined — already included via Google Fonts.

```jsx
// In JSX
<span className="material-symbols-outlined">dashboard</span>

// Sizing via text utilities
<span className="material-symbols-outlined text-base">rocket_launch</span>
```

Common icons used in screens:
- `dashboard` — Dashboard
- `rocket_launch` — Missions / Astronautes
- `public` — Planètes / Galactic Map
- `group` — Personnel
- `insights` — Analytics
- `settings` — Configuration
- `add` — Create actions
- `logout` — Sign out
- `help` — Support
- `edit` — Edit action
- `delete` — Delete action
- `filter_list` — Filters
- `sort` — Sort

---

## Do's and Don'ts

### Do
- Use 32px / 48px / 64px vertical white space to separate sections
- Use `Work Sans` for any text > 3 words
- Keep contrast ratio `on-surface` vs `surface` above 7:1
- Use background color shifts for section boundaries
- Apply `backdrop-blur` ≥ 12px for floating elements

### Don't
- Use pure black (`#000000`) or pure grey — all darks are cosmic blue variants
- Use `border` for layout sectioning
- Use standard `rounded` (4px) — minimum is `rounded-xl` (0.75rem)
- Use `box-shadow` that looks like ink — shadows must look like occluded light
- Use `NEXT_PUBLIC_` prefix for secret keys
