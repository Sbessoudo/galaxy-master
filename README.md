# Galaxy Master 🚀

Back-office admin tool for the **Planets** gamification platform at Eleven Labs. Admins track contributions, manage events, run the planet assignment wheel, and configure the game rules — all in one place.

---

## Features

| Module | Description |
|--------|-------------|
| **Dashboard** | Live leaderboard with season standings, solar system visualization, planet rankings |
| **Astronautes** | Employee directory with grades, lifetime points, photos and planet membership |
| **Planètes** | 6 teams (4 competing + newcomers + arbiters), season point tracking |
| **Roue des planètes** | Weighted random wheel to assign newcomers to planets (multi-split, animated) |
| **Contributions** | Record astronaut actions (articles, talks, workshops…) with auto point calculation |
| **Engagements** | Internal events with attendance tracking — no points, purely organizational |
| **Trophées** | Awards assignable to astronauts or planets, triggers Slack notifications |
| **Configuration** | Contribution types, grade levels, seasons, webhooks, user management |

### Key Rules
- **Astronaut points** accumulate lifetime — never reset
- **Planet points** are season-scoped — reset every September
- **Grades** auto-calculated from lifetime points (14 levels: Rookie → Fleet Admiral ★★★)
- **Authentication**: Google OAuth only — no email/password
- **Roles**: `admin` (full CRUD) or `observer` (read-only)

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router) + React 19
- **Database / Auth**: [Supabase](https://supabase.com) (Postgres + Row Level Security + Google OAuth)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) + CSS custom properties design system
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Lint**: ESLint 9

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- A Supabase project with **Google OAuth** configured

### 1. Clone & install

```bash
git clone https://github.com/<your-org>/galaxy-master.git
cd galaxy-master
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional — restrict login to your company domain
ALLOWED_EMAIL_DOMAIN=eleven-labs.com

# Optional — Slack webhook for contribution/trophy notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

### 3. Start local Supabase

```bash
npm run db:start    # starts local Supabase stack (Docker required)
npm run db:migrate  # applies all migrations
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Login requires a Google account matching `ALLOWED_EMAIL_DOMAIN` (or any Google account if the env var is unset).

---

## Project Structure

```
app/
├── (dashboard)/          # Authenticated admin back-office
│   ├── page.js           # Main dashboard
│   ├── astronautes/
│   ├── planetes/
│   ├── affectation/      # Roue des planètes
│   ├── contributions/
│   ├── engagements/
│   ├── trophees/
│   └── config/           # Admin-only configuration routes
├── (front)/              # Public-facing pages (hub / solar system)
├── auth/                 # OAuth callback + signout handlers
└── globals.css           # Design system (CSS custom properties + Tailwind)

components/
├── layout/               # DashboardShell, Sidebar, Header
├── ui/                   # ThemeToggle, ThemeProvider, shared atoms
├── hub/                  # SolarSystem visualization
├── affectation/          # PlanetWheel canvas component
├── contributions/        # ContributionForm
├── engagements/          # ParticipationPanel
└── trophees/             # TropheeForm

supabase/
├── migrations/           # Versioned SQL migrations
└── seed.sql              # Optional seed data

lib/                      # Supabase client helpers, server utilities
middleware.js             # Auth guard — redirects unauthenticated users
```

---

## Database Migrations

Migrations live in `supabase/migrations/` and are applied in order.

```bash
npm run db:migrate   # push pending migrations to local Supabase
supabase db reset    # reset local DB and re-apply all migrations (destructive)
npm run db:studio    # open Supabase Studio UI at localhost:54323
```

For production, push via the Supabase dashboard or CI:

```bash
supabase db push --db-url "$SUPABASE_DB_URL"
```

---

## Theme System

Three modes: **dark** (default) / **light** / **system** (follows OS preference).

- Persisted in `localStorage` under key `theme`
- Inline script in `app/layout.js` applies `data-theme` before first paint (no flash)
- Toggle available in the top-right header on every page

---

## Accessibility

RGAA-compliant implementation:

- Skip-to-content link
- Focus trap + Escape key on mobile sidebar drawer
- `aria-current="page"` on active nav items
- `aria-label` on all icon-only controls
- `aria-hidden="true"` on decorative icons
- `aria-busy` on async participation chips
- WCAG AA contrast ratios verified for all theme modes

---

## Scripts Reference

```bash
npm run dev          # Development server (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check

npm run db:start     # Start local Supabase (Docker)
npm run db:stop      # Stop local Supabase
npm run db:reset     # Reset + re-migrate local DB
npm run db:migrate   # Push pending migrations
npm run db:studio    # Open Supabase Studio
```

---

## Slack Webhooks

Fires on:
- **Contribution recorded** — posts to configured channel
- **Trophy assigned** — posts to configured channel

Configure `SLACK_WEBHOOK_URL` in env or via the admin webhook settings page (`/config/webhooks`).

---

## Contributing

1. Branch from `main`
2. Follow the existing JSX patterns (no TypeScript migration planned)
3. Run `npm run lint` before opening a PR
4. All mutations require admin role — check `role === 'admin'` before adding any write UI

---

## License

Private — internal tool for Eleven Labs. Not open source.
