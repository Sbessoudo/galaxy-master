# Backlog

Future work, prioritized. Move to active.md when starting.

---

## Lot 0 — Foundation
- [ ] Initialize Next.js app (`create-next-app`)
- [ ] Configure Tailwind with Nebula One tokens
- [ ] Set up Supabase project (local + remote)
- [ ] Database schema (all tables — see schema spec below)
- [ ] Supabase Google OAuth provider setup
- [ ] Next.js middleware for auth guard (all routes private)

## Lot 1 — Auth
- [ ] F-01: Google OAuth login page (no email/password)
- [ ] F-02: Logout
- [ ] F-03: Session persistence
- [ ] F-04: Personal settings page (email, role display)

## Lot 2 — Dashboard
- [ ] F-05: Global KPI indicators (active astronauts, contributions this season, avg per astronaut)
- [ ] F-06: Global engagement rate (events attended)
- [ ] F-07: Planet leaderboard bar chart (season points)
- [ ] F-08: Contribution breakdown by type (donut chart)
- [ ] F-09: Top 5 contributors (season)
- [ ] F-10: Active season auto-filter badge

## Lot 3 — Planètes (Teams)
- [ ] F-11: Planets overview list (with points, member count, season vs total)
- [ ] F-12: Planet detail page (members, points, trophy history, activity log)
- [ ] F-13: Add bonus points to a planet (challenge ranking: 1st/2nd/3rd/4th)
- [ ] F-14: Bulk import bonus points via Excel
- [ ] F-15: Create a planet (name, description, color, type: main|newcomers|arbiters)
- [ ] F-16: Edit / deactivate a planet
- [ ] F-RULE: Newcomer (planet 5) and Arbiter (planet 6) cannot be deleted

## Lot 4 — Astronautes (Collaborators)
- [ ] F-17: Astronaut list (name, planet, total pts, season pts, grade badge, status filter)
- [ ] F-18: Astronaut detail page (profile, grade + points to next grade, contribution history, trophies)
- [ ] F-19: Add an astronaut (first/last name, role, planet, arrival date)
- [ ] F-20: Edit an astronaut
- [ ] F-21: Deactivate an astronaut (history preserved)
- [ ] F-22: Bulk import astronauts via Excel
- [ ] F-RULE: Grade based on LIFETIME points (never reset)

## Lot 5 — Contributions
- [ ] F-23: Contributions list (search by astronaut, type, date)
- [ ] F-24: Record a contribution (astronaut, type, date, optional: location/duration/notes)
- [ ] F-24b: Apply multipliers automatically:
  - First-ever contribution → points × 2
  - First contribution of season → +25 bonus
- [ ] F-25: Edit a contribution
- [ ] F-26: Delete a contribution (recalculates grade + planet season points)
- [ ] F-27: Configure contribution types (name, base points, category)
- [ ] F-27b: Seed default contribution types from point grid (see overview.md)

## Lot 6 — Engagements (Events)
- [ ] F-28: Events list (name, date, type, participant count)
- [ ] F-29: Create an event (name, date, type, optional description)
- [ ] F-30: Event participation interface — dedicated UI:
  - Search bar by name
  - Photo + name list for easy bulk selection
  - Lives in back-office, does NOT trigger points
- [ ] F-31: Edit / delete an event
- [ ] F-32: Configure event types (name, description, active/inactive)

## Lot 7 — Trophées (Trophies)
- [ ] F-33: Trophy list (name, description, icon/emoji, assignment history)
- [ ] F-34: Configure trophies (create/edit/delete trophy types)
- [ ] F-35: Assign trophy to astronaut (triggers Slack webhook)
- [ ] F-36: Assign trophy to planet (triggers Slack webhook)
- [ ] F-37: Display trophies on astronaut and planet detail pages

## Lot 8 — Grades
- [ ] F-38: Grade auto-assignment on every contribution save/delete
- [ ] F-39: Configure grades (14-level system — see overview.md for defaults)
- [ ] F-40: "Next grade" progress display on astronaut detail

## Lot 9 — Saisons (Seasons)
- [ ] F-41: Season list (name, start date, end date, status)
- [ ] F-42: Create a season (start/end: September → September)
- [ ] F-43: Activate a season → auto-deactivates previous → resets planet season points
- [ ] F-44: Delete an inactive season
- [ ] F-RULE: Planet points reset on activation; astronaut lifetime points untouched

## Lot 10 — Webhooks
- [ ] F-45: Slack webhook on contribution recorded (astronaut name, type, points, planet)
- [ ] F-46: Slack webhook on trophy assigned (astronaut/planet name, trophy name)
- [ ] F-47: Webhook config in admin settings (URL, enable/disable)

## Lot 11 — Admin
- [ ] F-48: User management (list Galaxy Master users, set role admin|observer)
- [ ] F-49: Sidebar navigation (admin-only: config section hidden from observers)
- [ ] F-50: Mobile responsive navigation (collapse on small screens)
- [ ] F-51: Toast notifications for all CRUD operations

---

## Database Schema (reference)

```
profiles          id, email, full_name, role (admin|observer), avatar_url, created_at
planets           id, name, description, color, type (main|newcomers|arbiters), active, created_at
astronauts        id, first_name, last_name, role_title, planet_id, arrival_date, active, photo_url, created_at
contribution_types id, name, description, base_points, category, active
contributions     id, astronaut_id, type_id, date, location, duration_min, notes, points_awarded, season_id, created_at
event_types       id, name, description, active
events            id, name, date, type_id, description, created_at
event_participants event_id, astronaut_id, created_at
trophy_types      id, name, description, icon, created_at
trophies          id, type_id, astronaut_id (nullable), planet_id (nullable), awarded_at, notes
grades            id, name, min_points, color, icon, sort_order
seasons           id, name, start_date, end_date, active, created_at
planet_season_points  planet_id, season_id, total_points (computed or cached)
bonus_points      id, planet_id, season_id, points, label, date, created_at
```
