<!--
CHECKPOINT RULES (from session-management.md):
- Quick update: After any todo completion
- Full checkpoint: After ~20 tool calls or decisions
- Archive: End of session or major feature complete
-->

# Current Session State

*Last updated: 2026-04-13*

## Active Task
Project initialized — ready to start Next.js app scaffold.

## Current Status
- **Phase**: planning
- **Progress**: Project setup complete, no code written yet
- **Blocking Issues**: None

## Context Summary
Galaxy Master is a Next.js + Supabase back-office app for gamification management. The project spec (cahier-des-charges-galaxymaster.md) is the source of truth. Skills, CLAUDE.md, and project specs structure have been initialized.

## Files Being Modified
| File | Status | Notes |
|------|--------|-------|
| - | - | Not started yet |

## Next Steps
1. [ ] Initialize Next.js app: `npx create-next-app@latest . --js --tailwind --app --no-src-dir`
2. [ ] Set up Supabase project and connect
3. [ ] Design database schema (tables: profiles, planets, astronauts, contribution_types, contributions, event_types, engagements, engagement_participants, grades, seasons, bonus_points)
4. [ ] Implement auth (F-01 to F-04)
5. [ ] Build sidebar navigation layout (F-41)

## Key Context to Preserve
- App is entirely private — all routes require auth
- Observer role = read-only, enforced server-side AND by hiding mutation UI
- Points always come from contribution_type, never manually entered
- One active season at a time; activating one auto-deactivates others
- Deactivating a team/collaborator preserves all historical data

## Resume Instructions
To continue this work:
1. Read this file + _project_specs/todos/backlog.md
2. Check if Next.js app is initialized (look for package.json + app/ directory)
3. Pick up from Next Steps above
