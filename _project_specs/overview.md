# Project Overview

## Vision
Galaxy Master is the back-office administration tool for the Planets gamification platform. Administrators track collaborator contributions, manage team performance, configure game rules, and analyze engagement in real-time.

## Goals
- [ ] Secure role-based access (Admin vs Observer)
- [ ] Analytics dashboard with real-time KPIs
- [ ] Full CRUD for teams (Planètes) and collaborators (Astronautes)
- [ ] Contribution tracking with automatic point calculation
- [ ] Event (Engagement) management with participation tracking
- [ ] Automatic grade assignment based on accumulated points
- [ ] Season-based filtering of all metrics
- [ ] Bulk import via Excel for collaborators and bonus points

## Non-Goals
- This is NOT the collaborator-facing app (that is nebula-react / black-hole)
- No public pages — everything requires authentication
- No manual point entry — always derived from contribution type

## Success Metrics
- Admins can onboard a new season in under 5 minutes
- Dashboard loads in under 2 seconds
- Zero data loss on collaborator/team deactivation
- Observer role cannot trigger any mutations (enforced server-side)
