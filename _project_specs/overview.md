# Project Overview

## Vision
**Galaxy Master** is the back-office administration tool for "Le Site des Planètes" — the internal gamification platform for Eleven Labs employees.

The broader platform has 3 parts:
| Layer | Description | In scope? |
|-------|-------------|-----------|
| **Frontend** (site des planètes) | Trombinoscope, astronaut profiles, planet pages, public leaderboard | ❌ Separate product |
| **Galaxy Master** (back-office) | Full admin: planets, astronauts, seasons, contributions, trophies, events | ✅ THIS project |
| **Backend** | Supabase DB, Google OAuth, Slack webhooks | ✅ Part of this project |

## Goals
- [ ] Google OAuth 2.0 authentication (no email/password)
- [ ] Manage 6 planets (4 main + 1 newcomers + 1 arbiters)
- [ ] Full CRUD for astronauts (collaborators)
- [ ] Contribution recording with auto-calculated points (full point grid)
- [ ] Bonus points (challenge rankings, special events)
- [ ] Trophy management (assign trophies to astronauts and planets)
- [ ] Season management (planet points reset per season; astronaut points never reset)
- [ ] Grade auto-assignment (14-level system)
- [ ] Event participation interface (search + photo list, no point trigger)
- [ ] Slack webhook notifications (on point attribution and trophy assignment)
- [ ] Analytics dashboard
- [ ] Observer read-only role

## The 6 Planets
| # | Type | Notes |
|---|------|-------|
| 1–4 | Main planets | Compete in the global ranking |
| 5 | Newcomers | New arrivals before planet assignment, not in competition |
| 6 | Arbiters | Judges/arbiters, not in competition |

## Grade Levels (exhaustive, never change without explicit instruction)
| Points | Grade |
|--------|-------|
| 0 | Rookie |
| 50 | Ensign |
| 100 | Lieutenant |
| 200 | Lieutenant Commander |
| 300 | Commander |
| 500 | Captain |
| 750 | Fleet Captain |
| 1 000 | Commodore |
| 1 500 | Rear Admiral |
| 2 000 | Vice Admiral |
| 3 000 | Admiral |
| 5 000 | Fleet Admiral |
| 10 000 | Fleet Admiral ★★ |
| 15 000 | Fleet Admiral ★★★ |

## Contribution Point Grid (exhaustive)
| Action | Points |
|--------|--------|
| 1st place in a challenge | 100 |
| 2nd place in a challenge | 75 |
| 3rd place in a challenge | 50 |
| 4th place in a challenge | 25 |
| First contribution of the season | 25 (bonus) |
| First contribution ever | points × 2 (multiplier) |
| Blog article (solo) | 75 |
| Blog article (duo) | 40 |
| Tech interview | 25 |
| External talk | 150 |
| Internal talk | 100 |
| Workshop (solo) | 100 |
| Workshop (duo) | 50 |
| Demo / Open mic | 25 |
| Seniority points | TBD |
| Internal project (levels) | 100 / 250 / 500 / 750 |
| Podcast hosting | 100 |
| Podcast participation | 25 |
| Co-dev hosting | 25 |
| Event attendance | special interface (no points triggered) |

## Season Rules (critical)
- Each season runs September → September
- **Planet points reset to 0 at the start of each season**
- **Astronaut cumulative points are NEVER reset** (used for grade calculation)
- Only one active season at a time; activating a new season auto-deactivates the previous one

## Non-Goals
- Astronaut self-service profile editing (frontend feature, not back-office)
- Trombinoscope / public directory (frontend feature)
- Public-facing pages (everything requires auth)

## Success Metrics
- Admin can record a contribution in under 30 seconds
- Event participation bulk-entry via search + photo list in under 2 minutes
- Slack notification fires within 5 seconds of point/trophy attribution
- Grade recalculates in real-time on every contribution save/delete
