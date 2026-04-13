<!--
UPDATE WHEN:
- Adding new entry points or key files
- Introducing new patterns
- Discovering non-obvious behavior
-->

# Code Landmarks

## Entry Points
| Location | Purpose |
|----------|---------|
| app/layout.js | Root layout, auth provider |
| app/(auth)/login/page.js | Login page (public) |
| app/(dashboard)/page.js | Dashboard (protected) |
| middleware.js | Auth guard — redirects unauthenticated users |

## Core Business Logic
| Location | Purpose |
|----------|---------|
| lib/supabase/ | Supabase client setup (server + client) |
| lib/auth.js | Auth helpers, role checking |
| lib/points.js | Points calculation logic |
| lib/grades.js | Grade assignment logic |

## Configuration
| Location | Purpose |
|----------|---------|
| .env.local | Environment variables (gitignored) |
| .env.example | Template for env vars |
| .mcp.json | MCP server config for code graph |

## Key Patterns
| Pattern | Example Location | Notes |
|---------|------------------|-------|
| Server Component auth check | app/(dashboard)/layout.js | Uses Supabase server client |
| Role-based UI | components/ui/AdminOnly.jsx | Wraps mutation buttons |
| Auto point calculation | app/contributions/actions.js | Server action, reads contribution_type |

## Gotchas & Non-Obvious Behavior
| Location | Issue | Notes |
|----------|-------|-------|
| seasons | Only one active at a time | Activating one auto-deactivates others via DB trigger or server action |
| collaborators/teams | Deactivation ≠ deletion | `active = false` filter in queries, history always preserved |
| contributions | Points not in form | Derived from contribution_type on save, never user-input |
