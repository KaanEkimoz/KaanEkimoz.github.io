---
title: "Patimania"
platform: Web
genres: ["Marketplace", "SaaS", "Pet-tech"]
year: 2026
duration: "3 months (in progress)"
role: "Solo founder + engineer"
description: "A pet-services marketplace for Türkiye — book grooming, pet-taxi, and pet-hotel from vetted local businesses in one place, with money held in escrow until the service is confirmed complete."
techStack: ["Next.js 15", "React 19", "NestJS", "TypeScript", "PostgreSQL + PostGIS", "Prisma", "React Native / Expo", "iyzico Escrow", "Docker", "MinIO S3", "Nginx + ModSecurity"]
links:
  website: "https://patimania.com"
featured: true
published: false
coverImage: "../../assets/projects/patimania/cover.jpg"
gallery:
  - "../../assets/projects/patimania/cover.jpg"
  - "../../assets/projects/patimania/gallery/01.png"
  - "../../assets/projects/patimania/gallery/02.png"
  - "../../assets/projects/patimania/gallery/03.png"
order: 0
---

Patimania is a multi-sided pet-services marketplace for Türkiye — kuaför, pet-taxi, and pet-hotel bookings in one app, with money held in escrow via iyzico until the service is confirmed complete. Solo founder, solo engineer. Kicked off at the end of June, phase 1 (web) targeted for end of September, companion mobile app already in Play Store closed testing.

## Pieces I'm proud of

- **Double-booking is a physical impossibility.** Postgres `EXCLUDE` constraint over `(resource_id, time_range)` using `btree_gist + tstzrange`. If two people race to book the same slot, one write wins at the database — you can't overbook even if the app logic misbehaves. Proven by 276+ end-to-end tests hammering concurrent writes.
- **Backend-authoritative escrow.** Prices, commissions, and release rules live server-side; the client can only propose. iyzico sub-merchant flow with idempotent webhooks and an auto-release fallback if the customer forgets to confirm the service.
- **iOS ↔ Android parity harness.** On-device numeric divergence detector (a font-loss bug on iOS was caught via a text-width delta) and a deep-link three-way validator that reconciles `app.json` / AASA / route table — caught a shipped iOS deep-link outage the unit tests couldn't.
- **Race-condition-hardened admin queues.** Conditional `updateMany where status = pending`, DMMF-driven payload validation, decision-time snapshot reads. One post-incident audit produced nine fixes across four write paths.

## Constraints on purpose

Hosted end-to-end in Türkiye on a Turkish VDS, no third-party CDN in front of the origin, so KVKK compliance is boring instead of scary. Modular monolith on Turborepo + pnpm — one repo, three deployables (web / api / mobile). Design tokens live in one file; the whole product speaks one language visually.
