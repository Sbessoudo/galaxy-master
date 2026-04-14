# CLAUDE.md

## Skills
Read and follow these skills before writing any code:
- .claude/skills/base/SKILL.md
- .claude/skills/security/SKILL.md
- .claude/skills/project-tooling/SKILL.md
- .claude/skills/session-management/SKILL.md
- .claude/skills/code-graph/SKILL.md
- .claude/skills/react-web/SKILL.md
- .claude/skills/nodejs-backend/SKILL.md
- .claude/skills/supabase-nextjs/SKILL.md
- .claude/skills/ui-web/SKILL.md
- .claude/skills/database-schema/SKILL.md

## Project Overview

**Galaxy Master** = back-office admin tool for Planets gamification platform. Admins and observers can:
- Record/track collaborator contributions (Astronaute actions)
- Manage internal events (Engagements), track team participation
- Auto-calculate points, grades, leaderboards
- Analyze engagement via real-time dashboard
- Configure game rules (contribution types, grade levels, seasons)

Galaxy Master = **living back-office** — data entry, rule config, result analysis.

### Domain Glossary
| Term | Definition |
|------|-----------|
| **Astronaute** | Eleven Labs employee |
| **Planète** | Team (6 total: 4 main + newcomers + arbiters) |
| **Contribution** | Astronaut action worth points (article, talk, workshop…) |
| **Type de contribution** | Category with fixed point value (see point grid in overview.md) |
| **Engagement** | Internal event; attendance tracked, does NOT trigger points |
| **Trophée** | Award assigned to astronaut or planet |
| **Grade** | Auto-assigned level based on total cumulative astronaut points (14 levels, see overview.md) |
| **Points bonus** | Challenge ranking points or special awards |
| **Saison** | September → September period; planet points reset each season, astronaut points never reset |

### User Roles
| Role | Permissions |
|------|-------------|
| **Administrateur** | Full CRUD, config management, user management |
| **Observateur** | Read-only across all data, no create/edit/delete UI |

**Critical rule**: App entirely private. No public pages.

### The 6 Planets
4 main planets compete in global ranking. Planet 5 = newcomers (pre-assignment). Planet 6 = arbiters (no competition).

### Authentication
**Google OAuth 2.0 only** — no email/password. Supabase Auth with Google provider.

## Tech Stack
- Language: JavaScript (JSX)
- Framework: Next.js (App Router)
- Database: Supabase (Postgres + Auth)
- Deployment: TBD
- Testing: Jest + React Testing Library
- Styling: Tailwind CSS

## Key Commands
```bash
# Verify all CLI tools are working
./scripts/verify-tooling.sh

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Lint
npm run lint

# Build for production
npm run build

# Database (Supabase)
npm run db:start     # Start local Supabase
npm run db:migrate   # Push migrations
supabase db reset    # Reset local DB
```

## Documentation
- `docs/` - Technical documentation
- `_project_specs/` - Project specifications and todos
- `cahier-des-charges-galaxymaster.md` - Full functional spec (source of truth)

## Atomic Todos
Work tracked in `_project_specs/todos/`:
- `active.md` - Current work
- `backlog.md` - Future work
- `completed.md` - Done (reference)

Every todo needs validation criteria and test cases.

## Session Management

### State Tracking
Session state in `_project_specs/session/`:
- `current-state.md` - Live session state (update every 15-20 tool calls)
- `decisions.md` - Key architectural/implementation decisions (append-only)
- `code-landmarks.md` - Important code locations for quick reference
- `archive/` - Past session summaries

### Automatic Updates
Update `current-state.md`:
- After completing any todo
- Every 15-20 tool calls during active work
- Before significant context shift
- When hitting blockers

### Decision Logging
Log to `decisions.md` when:
- Choosing between architectural approaches
- Selecting libraries or tools
- Making security-related choices
- Deviating from standard patterns

### Session Handoff
Before ending session or hitting context limits, update current-state.md with:
- What completed this session
- Current work state
- Immediate next steps (numbered, specific)
- Open questions or blockers
- Files to review first on resume

### Resuming Work
On new session:
1. Read `_project_specs/session/current-state.md`
2. Check `_project_specs/todos/active.md`
3. Review recent `decisions.md` entries if context needed
4. Continue from "Next Steps" in current-state.md

## Code Graph (MCP)

- **Tier 1** (always on): `codebase-memory-mcp` — AST graph, symbol lookup, blast radius
- MCP config: `.mcp.json` (project root, committed)
- Graph data: `.code-graph/` (gitignored, auto-updated)

**Usage Priority:**
1. Graph first — MCP graph tools for symbol search, dependency tracing, impact analysis
2. File read second — only read full files when modifying or needing full context
3. Grep last — avoid when graph tools answer faster

## Agent Teams (Default Workflow)

Project uses Claude Code Agent Teams as default dev workflow.

### Strict Pipeline (per feature)
Spec > Spec Review > Tests > RED Verify > Implement > GREEN Verify > Validate > Code Review > Security Scan > Branch + PR

### Required Environment
```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

## Project-Specific Patterns

### Authentication
- **Google OAuth 2.0 only** via Supabase Auth Google provider
- Server-side session management via Next.js middleware
- Role (`admin` | `observer`) stored in `profiles` table, checked server-side for all mutations
- Observers see read-only UI — no create/edit/delete buttons rendered at all

### Points Calculation
- Points NEVER manually entered — always derived from contribution type's base value
- Special multipliers: first-ever contribution = ×2; first contribution of season = +25 bonus
- **Astronaut points**: cumulative lifetime total, NEVER reset
- **Planet points**: sum of member contributions in current season, reset each new season
- Grade recalculates on every contribution create/delete (based on lifetime astronaut points)
- Challenge ranking points (1st=100, 2nd=75, 3rd=50, 4th=25) are contribution types
- Event attendance: tracked separately, does NOT generate points

### Season Rules
- Planet points reset to 0 at season start; astronaut lifetime points untouched
- Only one active season at a time; activating one auto-deactivates previous
- Active season cannot be deleted

### Grade System
- 14 grades from Rookie (0pts) to Fleet Admiral ★★★ (15000pts) — see `_project_specs/overview.md`
- Grade auto-assigned from astronaut's total lifetime points

### Trophy System
- Trophies assignable to astronaut or planet
- Trophy assignment triggers Slack webhook notification

### Slack Webhooks
- Fire on: contribution recorded, trophy assigned
- Configured via env var `SLACK_WEBHOOK_URL`

### Data Deletion Rules
- Deactivating astronaut or planet NEVER deletes historical data
- Active season cannot be deleted
- Newcomer planet (planet 5) and Arbiter planet (planet 6) not deletable

### Event Participation Interface
- Dedicated UI: search bar + photo list for astronaut selection
- Lives in back-office, does NOT trigger points — purely attendance tracking