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
| **Astronaute** | A company collaborator |
| **Planète** | A team or squad |
| **Contribution** | An action by a collaborator worth points (article, conference, workshop…) |
| **Type de contribution** | Category of a contribution, with its point value |
| **Engagement** | An internal event collaborators can attend |
| **Grade** | Recognition level auto-assigned based on accumulated points |
| **Points bonus** | Manually added/removed points for a team |
| **Saison** | A defined period (e.g. a quarter) for calculating metrics |
| **KPI** | Contribution types flagged for inclusion in performance reports |

### User Roles
| Role | Permissions |
|------|-------------|
| **Administrateur** | Full CRUD, configuration management, user management |
| **Observateur** | Read-only across all data, no create/edit/delete UI |

**Critical rule**: The app is entirely private. No public pages exist.

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
- Use Supabase Auth (email/password)
- Server-side session management via Next.js middleware
- Role stored in `profiles` table, checked server-side for all mutations
- Observers see read-only UI — no create/edit/delete buttons rendered at all

### Points Calculation
- Points are NEVER manually entered — always derived from `contribution_type.points`
- Team total = sum of member contributions + bonus points
- Grade calculated automatically on every contribution create/delete
- Season filter applied automatically when a season is active

### Data Deletion Rules
- Deactivating a collaborator or team NEVER deletes historical data
- Active season cannot be deleted
- Only one season can be active at a time (activating one auto-deactivates previous)
