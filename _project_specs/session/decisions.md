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

## [2026-04-13] Scope Correction — Auth, Grades, Points, Trophies

**Decision**: Major scope update based on detailed product brief
**Changes**:
1. **Auth**: Google OAuth 2.0 only (no email/password). Supabase Google provider.
2. **Grades**: Fixed 14-level system from Rookie (0) to Fleet Admiral ★★★ (15000). Values in overview.md. Never change without explicit instruction.
3. **Points**: Detailed point grid with multipliers (first-ever ×2, first-of-season +25). Values in overview.md.
4. **Trophies**: New feature — assign to astronaut or planet, triggers Slack webhook.
5. **Events**: Attendance tracked in dedicated interface (search + photo), does NOT trigger points.
6. **Seasons**: Planet points reset each season; astronaut lifetime points NEVER reset.
7. **Planets**: 6 total — 4 main (compete) + 1 newcomers + 1 arbiters (last two don't compete).
8. **Slack webhooks**: Fire on contribution recorded + trophy assigned.
9. **Frontend vs back-office**: Trombinoscope and astronaut self-edit are FRONTEND features, out of scope for Galaxy Master.
**References**: `_project_specs/overview.md`, `CLAUDE.md`
