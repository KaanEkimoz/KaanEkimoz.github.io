---
title: "Patimania"
platform: Web
genres: ["Marketplace", "SaaS", "Pet-tech"]
year: 2026
duration: "3 months (ongoing)"
role: "Solo engineer"
description: "A multi-sided marketplace for pet-hotel, grooming, and pet-taxi services in Türkiye. Payments sit in escrow via iyzico and are only released when the service is confirmed complete. Web + iOS + Android — solo build."
techStack:
  - "Next.js 15"
  - "React 19"
  - "NestJS"
  - "TypeScript"
  - "PostgreSQL + PostGIS"
  - "Prisma"
  - "React Native + Expo"
  - "iyzico (escrow)"
  - "MinIO S3"
  - "Docker"
  - "Nginx"
links:
  website: "https://patimania.com"
featured: true
published: false
coverImage: "../../assets/projects/patimania/cover.jpg"
gallery:
  - "../../assets/projects/patimania/gallery/01-home.png"
  - "../../assets/projects/patimania/gallery/02-search.png"
  - "../../assets/projects/patimania/gallery/03-business-profile.png"
  - "../../assets/projects/patimania/gallery/04-business-panel.png"
  - "../../assets/projects/patimania/gallery/05-room-calendar.png"
  - "../../assets/projects/patimania/gallery/06-admin-stats.png"
  - "../../assets/projects/patimania/gallery/07-mobile-home.png"
  - "../../assets/projects/patimania/gallery/08-mobile-business.png"
order: 0
---

Patimania is a multi-sided marketplace for pet-hotel, grooming, and pet-taxi services in Türkiye. Payments sit in escrow via iyzico and are only released once the service is confirmed complete. I built the whole thing solo over three months — data model to devops, backend to mobile app — starting in July 2026. Web is live at patimania.com. Android is in Google Play closed testing; iOS is under App Store review.

Three months of work in numbers: ~1,500 commits, ~145k lines of TypeScript across four codebases, 52 database tables, 84 migrations, 37 end-to-end test suites (~1,090 checks) running against real Postgres + MinIO, and 129 distinct screens across web + iOS + Android.

## Pieces I'm proud of

- **Double-booking is a database-level impossibility.** A PostgreSQL `EXCLUDE` constraint over `(resource_id, tstzrange)` using `btree_gist` rejects overlapping time ranges for the same room or vehicle. If two customers race for the same slot, one write wins at the database — the application can't overbook even if the logic misbehaves. A 5–10 minute soft-hold sits on top for the payment window.
- **Backend-authoritative money + double-entry ledger.** Prices, commissions, and release rules live server-side; the client can only propose. Behind the escrow flow is a double-entry ledger that tracks commission, business receivable, and VAT legs, with debit = credit invariants enforced on every write. Money fields are `numeric`, never `float`.
- **Status-changing writes are conditional.** Approvals, cancellations, and refunds all run as `UPDATE ... WHERE status = 'pending'`. I measured the unconditional version — two concurrent approve calls really did produce two accepted rows both reporting success. Now they can't.
- **RBAC sentinels caught a real vulnerability.** Admin endpoints are wired to per-user permissions, but forgetting a row *opens* access, not closes it. CI now fails the build if a new admin endpoint ships without a permission entry. That sentinel caught a live bug: support staff could resolve their own customer complaints solo.
- **iOS ↔ Android parity harness.** A three-layer setup — a ledger of platform-branches (CI fails if the count moves), a deep-link parity checker across `app.json` / AASA / route table, and an on-device diagnostic that turns visual regressions into numbers. A silent iOS deep-link outage got caught this way; plain smoke tests were both green.

## Constraints on purpose

Hosted end-to-end in Türkiye on a Turkish VDS, no third-party CDN in front of the origin, so KVKK compliance stays boring instead of scary. Modular monolith — one repo, three deployables (api / web / mobile). First-party, cookieless visit logging with daily-rotated hashes and 3-decimal coordinate rounding, so businesses get "how many people viewed me" without a third-party analytics vendor in the path.
