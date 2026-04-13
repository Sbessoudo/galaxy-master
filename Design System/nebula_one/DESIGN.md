# Design System Strategy: Galactic Professionalism

## 1. Overview & Creative North Star
**Creative North Star: "The Celestial Architect"**
This design system moves away from the flat, uninspired grids of traditional HR software. Instead, it adopts a high-end editorial feel that mimics the depth of deep space and the precision of a high-tech observatory. We achieve this through "Atmospheric Layering"—a technique where UI elements don’t just sit on a screen; they orbit and float within a cohesive, luminous environment. 

The aesthetic breaks the "template" look by utilizing intentional asymmetry in card layouts, overlapping celestial gradients, and a high-contrast typography scale that feels both authoritative and exploratory. We are building a workspace that feels like a journey, not a task list.

---

## 2. Colors & Atmospheric Tones
The palette is rooted in the infinite depth of `#021425`, using vibrant coral and cool blue accents to guide the user’s eye like stars in a nebula.

*   **Primary (`#ACC7FF`):** Our "Starlight." Used for primary actions and focused states.
*   **Secondary (`#FFB2B9` / `#DD3156`):** Our "Solar Flare." Reserved for high-energy gamification moments, urgency, and mission-critical CTAs.
*   **Tertiary (`#C8BFFF`):** Our "Nebula." Used for secondary progression and deep-space accents.

**The "No-Line" Rule**
Traditional 1px solid borders are strictly prohibited for sectioning. We define boundaries through **Background Color Shifts**. For example, a `surface-container-low` section should sit against a `surface` background to create a natural, soft-edge distinction. 

**Surface Hierarchy & Nesting**
Treat the UI as a series of physical layers. 
- **The Void (`surface-container-lowest`):** The deepest background.
- **The Atmosphere (`surface-container-low`):** Main content areas.
- **The Vessel (`surface-container-high`):** Active cards and interaction zones.
Each inner container must use a slightly higher or lower tier to define its importance, creating a "stacked glass" effect.

**The "Glass & Gradient" Rule**
For floating elements (modals, tooltips, or mission cards), use **Glassmorphism**. Apply a semi-transparent surface color with a `backdrop-blur` (minimum 12px). 
*   **Signature Textures:** Use subtle linear gradients (e.g., `primary` to `primary-container`) for main CTAs to provide a "soul" and professional polish that flat hex codes cannot achieve.

---

## 3. Typography: Editorial Authority
We utilize a mix of **Space Grotesk** for technical, high-impact headlines and **Work Sans** for human-centric, readable body copy.

*   **Display (Space Grotesk):** Massive, bold scales (`3.5rem`) used for planet names or milestone achievements. This provides the "editorial" punch.
*   **Headlines (Space Grotesk):** Used for mission titles. High tracking (letter-spacing) should be avoided; keep them tight and impactful.
*   **Body (Work Sans):** The workhorse. It provides a clean, professional contrast to the "space-tech" feel of the headers.
*   **Labels (Work Sans):** Small-caps or tight-bold styles for technical metadata (e.g., "ORBITAL PERIOD: 12 DAYS").

The contrast between the futuristic Grotesk and the approachable Work Sans mirrors the "Professional yet Playful" balance required for HR gamification.

---

## 4. Elevation & Depth
In "The Celestial Architect," depth is a functional tool, not a decoration.

*   **The Layering Principle:** Stack `surface-container` tiers. Place a `surface-container-highest` card on a `surface-container-low` section. This creates a soft, natural lift without the "dirty" look of heavy shadows.
*   **Ambient Shadows:** When a card must float, use a shadow with a 24px–48px blur, but keep opacity between 4% and 8%. The shadow color should be tinted with `on-surface` (a deep blue-white) rather than black.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use the `outline-variant` token at **15% opacity**. A 100% opaque border is a failure of the system's "Atmospheric" goal.

---

## 5. Components

### Planet & Mission Cards
*   **Structure:** No dividers. Use `surface-container-high` for the card body. 
*   **Visuals:** Use an overlapping "Planet" asset that breaks the top-left boundary of the card (Asymmetry).
*   **Interaction:** On hover, increase the `backdrop-blur` and shift the background to a subtle gradient.

### Galactic Progress Bars
*   **Track:** Use `surface-container-highest` with a 20% opacity.
*   **Indicator:** A gradient transition from `primary` to `tertiary`. For 100% completion, add a "glow" using a soft shadow of the `primary` color.

### The Back-Office Sidebar
*   **Style:** `surface-container-low`. No border on the right side. 
*   **Active State:** Instead of a full-color box, use a vertical "light-beam" (a 4px rounded line) in `secondary` color on the left edge of the active menu item.

### Inputs & Buttons
*   **Inputs:** `surface-container-lowest` backgrounds with a "Ghost Border." 
*   **Buttons:** `XL` roundedness (`1.5rem`). Primary buttons use a high-contrast `on-primary` text on a `primary` background. Tertiary buttons have no background—only a bold `primary` text label.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use vertical white space (32px, 48px, 64px) to separate "Planets" instead of lines.
*   **Do** use "Work Sans" for any text longer than three words.
*   **Do** embrace the dark. Ensure the contrast ratio between `on-surface` and `surface` remains above 7:1 for elite readability.

### Don't:
*   **Don't** use pure black (`#000000`) or pure grey. Every dark tone must be a variant of our deep cosmic blue.
*   **Don't** use "Drop Shadows" that look like ink. Shadows must look like light being occluded.
*   **Don't** use standard 4px border radii. This system requires the sophistication of `md` (`0.75rem`) and `xl` (`1.5rem`) for a premium, custom feel.