# Galaxy Master

> Back-office admin tool for the **Planets** gamification platform at Eleven Labs.
> Built for speed, designed to last.

Galaxy Master is the operational command center behind *Le Site des Planètes* — an internal gamification system where Eleven Labs collaborators earn points, unlock grades, compete as planet-based teams, and get recognized with trophies. Administrators record contributions, manage events, run the planet assignment wheel, and configure every game rule — all in one place.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Authentication & Roles](#authentication--roles)
- [Points System](#points-system)
- [Grade System](#grade-system)
- [Planet System](#planet-system)
- [Hub (Astronaut Portal)](#hub-astronaut-portal)
- [Slack Webhooks](#slack-webhooks)
- [Theme System](#theme-system)
- [Accessibility](#accessibility)
- [Project Structure](#project-structure)
- [Scripts Reference](#scripts-reference)

---

## Overview

| | |
|---|---|
| **Type** | Internal back-office + astronaut portal |
| **Company** | Eleven Labs |
| **Audience** | Admins, Observers, Collaborators (Astronauts) |
| **Auth** | Google OAuth 2.0 only — no email/password |
| **Database** | Supabase (Postgres + Row Level Security) |
| **Deployment** | Vercel / Supabase Cloud |

---

## Features

### Back-Office (Admin & Observer)

| Module | Description |
|--------|-------------|
| **Dashboard** | Live season KPIs: active astronauts, contribution count, engagement rate, planet leaderboard, top 5 contributors, contribution breakdown by type |
| **Astronautes** | Full employee directory — grades, lifetime points, season stats, photo upload, hobbies, skills, trophy history, contribution log |
| **Planètes** | 6 teams (4 competing + newcomers + arbiters), season point tracking, mantra, bonus points management, trophy history, member roster |
| **Affectation** | Weighted random planet assignment wheel with Framer Motion animation and multi-split support for newcomers |
| **Contributions** | Record astronaut actions (articles, talks, workshops…) with auto point calculation, first-ever ×2 multiplier, first-of-season bonus |
| **Events** | Internal events with photo-based attendance tracking UI — no points generated, purely organizational |
| **Trophées** | Awards assignable to astronauts or planets, with Slack webhook notifications on assignment |
| **Configuration** | Collapsible sidebar config section covering: contribution types, event types, grade levels, trophy types, seasons, user management, webhooks |

### Astronaut Hub (Self-Service Portal)

| Module | Description |
|--------|-------------|
| **Hub Home** | Personalized dashboard — grade, lifetime points, progress to next grade, planet membership, recent contributions |
| **My Profile** | Edit first name, last name, role title, photo, hobbies (tags), skills (tags) |
| **Solar System** | Visual planet overview with live season standings |
| **Astronaut Directory** | Browse all active team members |
| **Planet Detail** | Team page with members, season score, trophies, mantra |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org) — App Router, React Server Components |
| **UI Library** | [React 19](https://react.dev) |
| **Database** | [Supabase](https://supabase.com) — Postgres 15, Row Level Security, Realtime |
| **Auth** | Supabase Auth — Google OAuth 2.0 via `@supabase/ssr` |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) + CSS custom properties design token system |
| **Animation** | [Framer Motion 12](https://www.framer.com/motion/) |
| **Fonts** | Google Material Symbols (icons), system font stack |
| **Lint** | ESLint 9 with `eslint-config-next` |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js App Router                        │
│                                                                  │
│  middleware.js ──── auth guard + role-based routing              │
│                                                                  │
│  app/                                                            │
│  ├── (dashboard)/   Admin back-office — RSC, force-dynamic       │
│  ├── (front)/hub/   Astronaut portal — RSC                       │
│  ├── api/           Next.js Route Handlers (REST API)            │
│  ├── auth/          OAuth callback + signout                     │
│  └── login/         Login page                                   │
│                                                                  │
│  components/        Client components, forms, UI atoms           │
│  lib/               Supabase helpers, auth utils, constants      │
│  supabase/          Migrations (SQL), seed data                  │
└─────────────────────────────────────────────────────────────────┘
         │                         │
         ▼                         ▼
  Supabase Auth             Supabase Postgres
  Google OAuth 2.0          14 tables, RLS policies,
  JWT sessions              DB triggers, PG functions
```

### Key Patterns

**Server-first rendering** — all pages are React Server Components fetching directly from Supabase. Client components are used only for interactive UI (forms, wheels, panels).

**Dual security** — permissions are enforced at two levels:
1. **Application layer** — `requireAdmin()` middleware in every mutating API route
2. **Database layer** — Postgres Row Level Security policies block unauthorized writes even if the API is bypassed

**Role routing** — `middleware.js` inspects every request and routes users to the correct area based on their role (`admin` / `observer` → back-office, `astronaut` → hub).

**Observer read-only** — observers see the full back-office but mutation UI (create/edit/delete buttons) is conditionally rendered server-side based on the `isAdmin` flag.

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **Docker** (required for local Supabase)
- **Supabase CLI** — `npm install -g supabase`
- A Supabase project with **Google OAuth** configured (see below)

### 1. Clone & Install

```bash
git clone https://github.com/eleven-labs/galaxy-master.git
cd galaxy-master
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` — see [Environment Variables](#environment-variables) for details.

### 3. Start Local Supabase

```bash
npm run db:start    # starts local Supabase stack via Docker
npm run db:migrate  # applies all migrations in order
```

Supabase Studio is available at `http://localhost:54323` once started.

### 4. Seed Initial Data *(optional)*

```bash
supabase db reset   # reset + re-run all migrations (includes seed.sql if present)
```

### 5. Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in with a Google account matching `ALLOWED_EMAIL_DOMAIN` (or any Google account if that env var is unset).

### 6. Set Your Account as Admin

After first login, your profile is created with role `observer` by default. Promote yourself via Supabase Studio or SQL:

```sql
update profiles set role = 'admin' where email = 'you@eleven-labs.com';
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key (server-only, never exposed to browser) |
| `NEXT_PUBLIC_APP_URL` | ✅ | Base URL of the app (e.g. `https://galaxy-master.eleven-labs.com`) |
| `ALLOWED_EMAIL_DOMAIN` | ⬜ | Restrict logins to this domain (e.g. `eleven-labs.com`). Omit to allow any Google account. |
| `SLACK_WEBHOOK_URL` | ⬜ | Slack incoming webhook URL. Fires on contributions and trophy assignments. |

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create an OAuth 2.0 Client ID (Web application)
3. Add authorized redirect URI: `https://<your-supabase-ref>.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret into your Supabase project → Authentication → Providers → Google

---

## Database

### Schema Overview

```
profiles              id, email, full_name, avatar_url, role
planets               id, name, description, mantra, color, type, sort_order, photo_url, active
astronauts            id, first_name, last_name, role_title, planet_id, arrival_date, active,
                      photo_url, total_points, grade_id, user_id, hobbies[], skills[]
grades                id, name, min_points, color, icon, sort_order
seasons               id, name, start_date, end_date, active
contribution_types    id, name, description, base_points, category, active
contributions         id, astronaut_id, type_id, season_id, date, location, duration_min,
                      notes, points_awarded, is_first_ever, is_first_season
planet_season_points  planet_id, season_id, total_points
bonus_points          id, planet_id, season_id, points, label, date, created_by
event_types           id, name, description, active
events                id, name, date, type_id, season_id, description
event_participants    event_id, astronaut_id
trophy_types          id, name, description, icon, active
trophies              id, type_id, astronaut_id?, planet_id?, season_id, notes, awarded_at
```

### Automatic Behaviors (DB Triggers & Functions)

| Trigger | What it does |
|---------|-------------|
| `contributions_recalculate_points` | On every contribution INSERT / UPDATE / DELETE — recalculates the astronaut's `total_points` and `grade_id` from scratch |
| `seasons_enforce_single_active` | On season ACTIVATE — auto-deactivates all other seasons before applying |
| `on_auth_user_created` | On Google OAuth first login — auto-inserts a `profiles` row with role `observer` |
| `*_updated_at` triggers | Keeps `updated_at` fresh on `profiles`, `planets`, `astronauts`, `contributions`, `events` |

### Row Level Security

All 14 tables have RLS enabled. The policy model is:

| Policy | Who | Tables |
|--------|-----|--------|
| `authenticated read` | Any logged-in user | All tables |
| `admin write` | `role = 'admin'` only | All mutable tables |
| `own profile read` | Own row only | `profiles` |
| `own astronaut write` | `user_id = auth.uid()` | `astronauts` (for self-edit from hub) |

The `current_user_role()` PG function (security definer) is used inside policies to avoid N+1 permission lookups.

### Migrations

```bash
npm run db:migrate   # push pending migrations (supabase db push)
supabase db reset    # full reset — drops and re-applies everything (local only)
npm run db:studio    # open Supabase Studio at localhost:54323
```

Migrations are in `supabase/migrations/` and applied in chronological order:

| Migration | Description |
|-----------|-------------|
| `20260413090848_init_schema` | Full initial schema — 14 tables, triggers, functions, RLS, seed grades + contribution types |
| `20260413120000_planets_photo` | `photo_url` column on planets + Supabase Storage bucket |
| `20260413130000_bonus_points_rls` | RLS policies for bonus_points |
| `20260413150000_scope_column` | `scope` column on contribution_types |
| `20260414000000_webhook_config` | `webhook_configs` table for Slack settings |
| `20260414010000_astronaut_account` | `user_id` FK on astronauts (links auth user to astronaut record) |
| `20260414200000_maintainability_fixes` | Index improvements, cascade rules |
| `20260415000000_astronaut_photo` | Photo upload for astronauts + Storage bucket |
| `20260415010000_event_participation_points` | Event participant count view |
| `20260416000000_mantra_hobbies_skills` | `mantra` on planets, `hobbies[]` + `skills[]` on astronauts |

---

## Authentication & Roles

### Login Flow

1. User hits any protected route → middleware redirects to `/login`
2. `/login` initiates Google OAuth via `app/auth/google/route.js`
3. Google redirects back to `app/auth/callback/route.js` → Supabase exchanges the code for a session
4. Supabase `on_auth_user_created` trigger creates a `profiles` row if first login
5. Middleware checks profile role and routes to the correct area

### Roles

| Role | Access |
|------|--------|
| `admin` | Full CRUD across all back-office — can create, edit, delete everything |
| `observer` | Read-only back-office — sees all data, zero mutation UI |
| `astronaut` | Hub portal only — can edit own profile (name, photo, hobbies, skills) |

Role is stored in `profiles.role` and checked:
- Server-side in every API route via `requireAdmin(supabase)`
- In middleware for routing
- In RSC pages for conditional UI rendering
- At DB level via RLS policies (defense in depth)

### Astronaut Account Linking

An astronaut record (`astronauts` table) is linked to an auth user via `user_id`. Admins can trigger an invite email from the astronaut detail page — once the astronaut logs in via Google, their `user_id` is populated and they get routed to the hub.

---

## Points System

### How Points Are Calculated

Points are **never manually entered**. They are always derived from the contribution type's `base_points` value, with two automatic modifiers:

| Modifier | Condition | Effect |
|----------|-----------|--------|
| **First ever** | Astronaut's very first contribution (lifetime) | `base_points × 2` |
| **First of season** | Astronaut's first contribution in the current season | `+25 bonus points` added |

The `points_awarded` field stores the final computed value at record time. If a contribution is deleted, a DB trigger recalculates the astronaut's total from scratch.

### Planet Points

Planet season points = sum of `points_awarded` for all contributions by planet members in the current season + any `bonus_points` assigned directly to the planet.

- **Astronaut points**: cumulative lifetime total — **never reset**
- **Planet points**: season-scoped — **reset to 0 when a new season is activated**

### Seeded Contribution Types

| Category | Name | Points |
|----------|------|--------|
| Challenge | 1er d'un challenge | 100 |
| Challenge | 2ème d'un challenge | 75 |
| Challenge | 3ème d'un challenge | 50 |
| Challenge | 4ème d'un challenge | 25 |
| Content | Article de blog (solo) | 75 |
| Content | Article de blog (duo) | 40 |
| Content | Animation podcast | 100 |
| Content | Participation podcast | 25 |
| Speaking | Talk externe | 150 |
| Speaking | Talk interne | 100 |
| Teaching | Workshop (solo) | 100 |
| Teaching | Workshop (duo) | 50 |
| Community | Entretien tech | 25 |
| Community | Demo / Open mic | 25 |
| Community | Animation co-dev | 25 |
| Project | Projet interne — niveau 1 | 100 |
| Project | Projet interne — niveau 2 | 250 |
| Project | Projet interne — niveau 3 | 500 |
| Project | Projet interne — niveau 4 | 750 |

---

## Grade System

14 grades auto-assigned based on **lifetime astronaut points**. Grade recalculates on every contribution save or delete via a DB trigger.

| # | Grade | Min Points | Icon |
|---|-------|-----------|------|
| 1 | Rookie | 0 | 🪐 |
| 2 | Ensign | 50 | ⭐ |
| 3 | Lieutenant | 100 | 🌟 |
| 4 | Lieutenant Commander | 200 | 💫 |
| 5 | Commander | 300 | 🚀 |
| 6 | Captain | 500 | 🛸 |
| 7 | Fleet Captain | 750 | 🌌 |
| 8 | Commodore | 1 000 | 🔭 |
| 9 | Rear Admiral | 1 500 | 🪖 |
| 10 | Vice Admiral | 2 000 | 🎖️ |
| 11 | Admiral | 3 000 | ⚡ |
| 12 | Fleet Admiral | 5 000 | 🏅 |
| 13 | Fleet Admiral ★★ | 10 000 | 🥇 |
| 14 | Fleet Admiral ★★★ | 15 000 | 👑 |

Grades are configurable by admins via `/config/grades`.

---

## Planet System

### The 6 Planets

| Type | Count | Competing | Notes |
|------|-------|-----------|-------|
| `main` | 4 | ✅ | Participate in the global season leaderboard |
| `newcomers` | 1 | ❌ | Holding zone for unassigned new hires |
| `arbiters` | 1 | ❌ | Out-of-competition planet (judges, managers…) |

### Rules

- The `newcomers` and `arbiters` planets cannot be deleted (enforced in API)
- Deactivating a planet preserves all historical contribution and trophy data
- Each planet has: name, description, mantra (italic quote), color, icon/photo, sort order
- Planet season points reset to 0 when a new season is activated (astronaut lifetime points untouched)

### Planet Assignment Wheel

The `/affectation` page features an animated weighted random wheel (Framer Motion) for assigning newcomers to main planets. Supports:
- Single astronaut assignment
- Multi-astronaut batch split across planets
- Weight distribution based on current planet member counts

---

## Hub (Astronaut Portal)

Astronauts access a separate front-end portal at `/hub` (role-gated — only `role = 'astronaut'` users can access it; admins can preview via `?preview`).

### Hub Pages

| Route | Content |
|-------|---------|
| `/hub` | Personal dashboard — grade card, lifetime points, progress to next grade, planet, recent contributions |
| `/hub/profil` | Edit profile — name, role title, photo URL, hobbies (tag input), skills (tag input) |
| `/hub/astronautes` | Browse all active astronauts with grade badges |
| `/hub/astronautes/[id]` | Public astronaut profile — grade, points, hobbies, skills, planet |
| `/hub/planetes/[id]` | Planet detail — members, season score, mantra, trophies |

### Self-Edit Permissions

Astronauts can edit their own row via the `PATCH /api/profil` endpoint. RLS enforces `user_id = auth.uid()` so they can only modify their own record.

---

## Slack Webhooks

Galaxy Master fires Slack notifications on two events:

| Event | Payload |
|-------|---------|
| **Contribution recorded** | Astronaut name, contribution type, points awarded, planet |
| **Trophy assigned** | Astronaut or planet name, trophy type, notes |

### Configuration

Set `SLACK_WEBHOOK_URL` in your environment, or configure per-channel webhooks via the admin settings page at `/config/webhooks`. The admin UI supports:
- Custom webhook URL
- Enable/disable toggle
- Test fire button

---

## Theme System

Three modes: **dark** (default) / **light** / **system** (follows OS `prefers-color-scheme`).

- Persisted in `localStorage` under key `theme`
- An inline script in `app/layout.js` applies `data-theme` attribute before first paint — zero flash on load
- Toggle available in the top-right header on every page
- All colors defined as CSS custom properties using the `data-theme` attribute selector

The design token system uses `color-mix(in srgb, ...)` for adaptive tints that work correctly across both themes without hardcoded light/dark overrides.

---

## Accessibility

RGAA-compliant implementation:

- **Skip-to-content** link as first focusable element on every page
- **Focus trap** + Escape key on mobile sidebar drawer
- `aria-current="page"` on active navigation items
- `aria-label` on all icon-only controls (buttons, links)
- `aria-hidden="true"` on all decorative Material Symbols icons
- `aria-busy` on async participation chips during API calls
- `role="status"` on toast notification container
- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<aside>`
- WCAG AA contrast ratios verified for all color combinations in both light and dark themes

---

## Project Structure

```
galaxy-master/
│
├── app/
│   ├── (dashboard)/              # Admin back-office (auth required)
│   │   ├── page.js               # Dashboard — KPIs, leaderboard, top contributors
│   │   ├── astronautes/          # List, detail, new, edit
│   │   ├── planetes/             # List, detail
│   │   ├── affectation/          # Planet assignment wheel
│   │   ├── contributions/        # List, new, edit
│   │   ├── engagements/          # Event list, detail, new, edit
│   │   ├── trophees/             # Trophy list, new
│   │   └── config/               # Admin-only configuration
│   │       ├── planetes/         # Edit planets (name, color, mantra, photo)
│   │       ├── contributions/    # Manage contribution types
│   │       ├── engagements/      # Manage event types
│   │       ├── grades/           # Manage grade levels
│   │       ├── trophees/         # Manage trophy types
│   │       ├── saisons/          # Manage seasons
│   │       ├── utilisateurs/     # User management (role assignment)
│   │       └── webhooks/         # Slack webhook configuration
│   │
│   ├── (front)/hub/              # Astronaut self-service portal
│   │   ├── page.js               # Hub home — personal dashboard
│   │   ├── profil/               # Edit own profile
│   │   ├── astronautes/          # Browse astronauts
│   │   └── planetes/             # View planet details
│   │
│   ├── api/                      # REST API route handlers
│   │   ├── astronautes/          # CRUD + photo upload + invite + impersonate
│   │   ├── planetes/             # CRUD + photo upload + bonus points
│   │   ├── contributions/        # CRUD with auto point calculation
│   │   ├── engagements/          # CRUD + participant management
│   │   ├── contribution-types/   # CRUD
│   │   ├── event-types/          # CRUD
│   │   ├── grades/               # CRUD
│   │   ├── trophy-types/         # CRUD
│   │   ├── trophees/             # CRUD + Slack webhook on assign
│   │   ├── saisons/              # CRUD + activate (triggers season reset)
│   │   ├── utilisateurs/         # User role management
│   │   ├── webhooks/             # Webhook config + test endpoint
│   │   ├── profil/               # GET/PATCH own astronaut profile
│   │   └── health/               # Health check
│   │
│   ├── auth/
│   │   ├── google/route.js       # Initiates Google OAuth flow
│   │   ├── callback/route.js     # Handles OAuth redirect, creates session
│   │   └── signout/route.js      # Clears session
│   │
│   ├── login/page.js             # Login page
│   ├── hub-auth/page.js          # Hub authentication entry
│   ├── layout.js                 # Root layout — theme script, fonts, providers
│   └── globals.css               # Design system (CSS custom properties, Tailwind base)
│
├── components/
│   ├── layout/
│   │   ├── DashboardShell.jsx    # Authenticated layout wrapper
│   │   ├── Sidebar.jsx           # Collapsible sidebar with config group
│   │   └── Header.jsx            # Top bar — user avatar, theme toggle
│   ├── ui/
│   │   ├── TagInput.jsx          # Free-text tag array input (Enter/Backspace)
│   │   ├── FormInput.jsx         # Shared labeled input atom
│   │   ├── ThemeToggle.jsx       # Dark / light / system switcher
│   │   └── ThemeProvider.jsx     # localStorage theme persistence
│   ├── affectation/
│   │   └── PlanetWheel.jsx       # Animated assignment wheel (Framer Motion canvas)
│   ├── astronautes/
│   │   └── AstronauteForm.jsx    # Create/edit astronaut form with photo + tag inputs
│   ├── contributions/
│   │   └── ContributionForm.jsx  # Record contribution with auto point preview
│   ├── engagements/
│   │   ├── EngagementForm.jsx    # Create/edit event form
│   │   ├── EngagementActions.jsx # Edit/delete action buttons
│   │   └── ParticipationPanel.jsx # Photo-based bulk attendance UI
│   ├── grades/
│   │   └── GradeForm.jsx
│   ├── hub/
│   │   ├── SolarSystem.jsx       # SVG/canvas solar system visualization
│   │   └── ProfilForm.jsx        # Self-edit profile form (hub)
│   ├── planetes/
│   │   ├── PlaneteEditForm.jsx   # Planet config form
│   │   └── BonusPointsSection.jsx # Bonus points UI on planet detail
│   ├── trophees/
│   │   ├── TropheeForm.jsx       # Assign trophy form
│   │   └── TropheeActions.jsx    # Edit/delete buttons
│   └── utilisateurs/
│       └── UserRoleForm.jsx      # Change user role
│
├── lib/
│   ├── supabase/
│   │   ├── client.js             # Browser Supabase client
│   │   └── server.js             # Server Supabase client (cookies)
│   ├── auth.js                   # requireAdmin(), parseBody() helpers
│   ├── constants.js              # GRADE_LEVELS, PRESET_COLORS, PLANET_TYPE_OPTIONS…
│   ├── slack.js                  # Slack webhook fire helper
│   └── toast.js                  # Client-side toast notification helper
│
├── supabase/
│   ├── migrations/               # Versioned SQL migrations (applied in order)
│   ├── seed.sql                  # Optional seed data
│   └── config.toml               # Local Supabase config
│
├── middleware.js                 # Edge auth guard + role-based routing
├── next.config.mjs               # Next.js config
├── tailwind.config.js            # Tailwind v4 config
└── package.json
```

---

## Scripts Reference

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check

# Database (local Supabase — requires Docker)
npm run db:start     # Start local Supabase stack
npm run db:stop      # Stop local Supabase stack
npm run db:reset     # Drop all tables, re-apply all migrations from scratch
npm run db:migrate   # Push pending migrations to local Supabase
npm run db:studio    # Open Supabase Studio UI at http://localhost:54323
```

---

## License

Private — internal tool for Eleven Labs. Not open source.
