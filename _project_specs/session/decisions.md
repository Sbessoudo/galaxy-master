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
