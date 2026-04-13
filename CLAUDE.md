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

**Galaxy Master** is the back-office administration tool for the Planets gamification platform. It allows administrators and observers to:
- Record and track contributions (actions) of each collaborator (Astronaute)
- Manage internal events (Engagements) and track team participation
- Automatically calculate points, grades, and leaderboards
- Analyze engagement in real-time via an analytics dashboard
- Configure game rules (contribution types, grade levels, seasons)

Galaxy Master is the **living back-office** of the gamification system — where data is entered, rules are configured, and results are analyzed.

### Domain Glossary
| Term | Definition |
|------|-----------|
| **Astronaute** | An Eleven Labs employee |
| **Planète** | A team (6 total: 4 main + newcomers + arbiters) |
| **Contribution** | An action by an astronaut worth points (article, talk, workshop…) |
| **Type de contribution** | Category with its fixed point value (see point grid in overview.md) |
| **Engagement** | An internal event; attendance tracked but does NOT trigger points |
| **Trophée** | Award assigned to an astronaut or planet |
| **Grade** | Auto-assigned level based on total cumulative astronaut points (14 levels, see overview.md) |
| **Points bonus** | Challenge ranking points or special awards |
| **Saison** | September → September period; planet points reset each season, astronaut points never reset |

### User Roles
| Role | Permissions |
|------|-------------|
| **Administrateur** | Full CRUD, configuration management, user management |
| **Observateur** | Read-only across all data, no create/edit/delete UI |

**Critical rule**: The app is entirely private. No public pages exist.

### The 6 Planets
4 main planets compete in the global ranking. Planet 5 = newcomers (pre-assignment). Planet 6 = arbiters (no competition).

### Authentication
**Google OAuth 2.0 only** — no email/password login. Supabase Auth with Google provider.

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
All work is tracked in `_project_specs/todos/`:
- `active.md` - Current work
- `backlog.md` - Future work
- `completed.md` - Done (for reference)

Every todo must have validation criteria and test cases.

## Session Management

### State Tracking
Maintain session state in `_project_specs/session/`:
- `current-state.md` - Live session state (update every 15-20 tool calls)
- `decisions.md` - Key architectural/implementation decisions (append-only)
- `code-landmarks.md` - Important code locations for quick reference
- `archive/` - Past session summaries

### Automatic Updates
Update `current-state.md`:
- After completing any todo item
- Every 15-20 tool calls during active work
- Before any significant context shift
- When encountering blockers

### Decision Logging
Log to `decisions.md` when:
- Choosing between architectural approaches
- Selecting libraries or tools
- Making security-related choices
- Deviating from standard patterns

### Session Handoff
When ending a session or approaching context limits, update current-state.md with:
- What was completed this session
- Current state of work
- Immediate next steps (numbered, specific)
- Open questions or blockers
- Files to review first when resuming

### Resuming Work
When starting a new session:
1. Read `_project_specs/session/current-state.md`
2. Check `_project_specs/todos/active.md`
3. Review recent entries in `decisions.md` if context needed
4. Continue from "Next Steps" in current-state.md

## Code Graph (MCP)

- **Tier 1** (always on): `codebase-memory-mcp` — AST graph, symbol lookup, blast radius
- MCP config: `.mcp.json` (project root, committed)
- Graph data: `.code-graph/` (gitignored, auto-updated)

**Usage Priority:**
1. Graph first — use MCP graph tools for symbol search, dependency tracing, impact analysis
2. File read second — only read full files when modifying code or needing full context
3. Grep last — avoid grep when graph tools can answer faster

## Agent Teams (Default Workflow)

This project uses Claude Code Agent Teams as the default development workflow.

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
- Points are NEVER manually entered — always derived from the contribution type's base value
- Special multipliers: first-ever contribution = ×2; first contribution of season = +25 bonus
- **Astronaut points**: cumulative lifetime total, NEVER reset
- **Planet points**: sum of member contributions in current season, reset each new season
- Grade recalculates on every contribution create/delete (based on lifetime astronaut points)
- Challenge ranking points (1st=100, 2nd=75, 3rd=50, 4th=25) are contribution types
- Event attendance: tracked in separate interface, does NOT generate points

### Season Rules
- Planet points reset to 0 at season start; astronaut lifetime points are untouched
- Only one active season at a time; activating one auto-deactivates the previous
- Active season cannot be deleted

### Grade System
- 14 grades from Rookie (0pts) to Fleet Admiral ★★★ (15000pts) — see `_project_specs/overview.md`
- Grade is auto-assigned based on astronaut's total lifetime points

### Trophy System
- Trophies can be assigned to an astronaut or a planet
- Trophy assignment triggers a Slack webhook notification

### Slack Webhooks
- Fire on: contribution recorded, trophy assigned
- Configured via environment variable `SLACK_WEBHOOK_URL`

### Data Deletion Rules
- Deactivating an astronaut or planet NEVER deletes historical data
- Active season cannot be deleted
- Newcomer planet (planet 5) and Arbiter planet (planet 6) are not deletable

### Event Participation Interface
- Dedicated UI: search bar + photo list for selecting astronauts
- Lives in back-office but does NOT trigger points — purely attendance tracking
