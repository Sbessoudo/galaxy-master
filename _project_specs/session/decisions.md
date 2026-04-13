<!--
LOG DECISIONS WHEN:
- Choosing between architectural approaches
- Selecting libraries or tools
- Making security-related choices
- Deviating from standard patterns

This is append-only. Never delete entries.
-->

# Decision Log

---

## [2026-04-13] Project Stack Selection

**Decision**: JavaScript (not TypeScript), Next.js App Router, Supabase, Tailwind CSS
**Context**: Hackathon project — user chose these during /initialize-project setup
**Options Considered**: TypeScript vs JavaScript, Vite vs Next.js, Vercel vs other deployment
**Choice**: JS + Next.js + Supabase
**Reasoning**: User preference; Next.js App Router gives server components for auth-gated routes; Supabase provides auth + database in one
**Trade-offs**: No static typing (JavaScript) — will rely on JSDoc where helpful
**References**: CLAUDE.md tech stack section

## [2026-04-13] Design System: Nebula One

**Decision**: Adopt the Stitch "Nebula One" design system for all UI
**Context**: User provided Stitch project with 5 screens + DESIGN.md spec
**Choice**: Encode all tokens into `tailwind.config.js`, document in `docs/design-system.md`
**Key rules**:
- Background `#021425`, fonts: Space Grotesk (headlines) + Work Sans (body)
- Primary `#acc7ff` / Secondary `#ffb2b9` / Tertiary `#c8bfff`
- No 1px borders for sectioning — background color tier shifts instead
- Glassmorphism: `backdrop-blur(12px)` + `rgba(10,29,46,0.7)`
- Border radius minimum `rounded-xl` (0.75rem), CTA buttons `rounded-xxl` (1.5rem)
- Sidebar active: `border-l-4 border-secondary` coral left beam
- Icons: Material Symbols Outlined
**References**: `tailwind.config.js`, `docs/design-system.md`, `Design System/nebula_one/DESIGN.md`
