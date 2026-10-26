---
title: "Patimania"
platform: Web
genres: ["Marketplace", "SaaS", "Pet-tech"]
year: 2026
duration: "Jun 2026 — ongoing"
role: "Full-stack developer"
description: "A multi-sided marketplace for pet-hotel, grooming, and pet-taxi services in Türkiye. Payments are held in escrow via iyzico until the service is confirmed complete. Web + iOS + Android, in soft launch."
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
category: product
published: false
coverImage: "../../assets/projects/patimania/cover-wide.webp"
coverSquare: "../../assets/projects/patimania/cover-square.webp"
gallery:
  - "../../assets/projects/patimania/gallery/01-home.png"
  - "../../assets/projects/patimania/gallery/02-search.png"
  - "../../assets/projects/patimania/gallery/03-business-profile.png"
  - "../../assets/projects/patimania/app/01-home.jpg"
  - "../../assets/projects/patimania/app/02-hotels.jpg"
  - "../../assets/projects/patimania/app/03-room.jpg"
  - "../../assets/projects/patimania/app/04-groomer.jpg"
  - "../../assets/projects/patimania/app/05-taxi-offers.jpg"
  - "../../assets/projects/patimania/app/06-booking.jpg"
  - "../../assets/projects/patimania/app/07-reviews.jpg"
  - "../../assets/projects/patimania/app/08-driver.jpg"
  - "../../assets/projects/patimania/gallery/04-business-panel.png"
  - "../../assets/projects/patimania/gallery/05-room-calendar.png"
  - "../../assets/projects/patimania/gallery/06-admin-stats.png"
  - "../../assets/projects/patimania/gallery/07-mobile-home.png"
  - "../../assets/projects/patimania/gallery/08-mobile-business.png"
  - "../../assets/projects/patimania/arch/01-system.png"
  - "../../assets/projects/patimania/arch/02-booking-money.png"
  - "../../assets/projects/patimania/arch/03-data-model.png"
order: 0
---

Patimania is a marketplace for pet-hotel, grooming and pet-taxi services in Türkiye. Customers pay up front; iyzico holds the money in escrow and releases it to the business once the service is done. I work on every layer of it: data model, backend, web, mobile app and devops. The first commit was on 2 July 2026.

It's in soft launch at patimania.com. The storefront, search and business sign-up are open, and the businesses listed so far are demo records. Real payments stay off until the payment provider is connected; the flow itself is tested. The app is in Google Play closed testing and TestFlight external testing.

In numbers (24 October 2026): 2,441 commits in 115 days, 315,165 lines of TypeScript, 68 tables, 45 app screens and 76 end-to-end test suites. The code was written with Claude Code; the decisions, the review and the checks around it are mine.

## Pieces I'm proud of

- **No double bookings.** A PostgreSQL `EXCLUDE` constraint rejects overlapping bookings for the same room or vehicle, even if the app logic slips.
- **Money lives on the server.** Prices and commission are computed server-side and recorded in a double-entry ledger.
- **Race-safe status changes.** Approvals, cancellations and refunds are conditional updates, so two concurrent calls can't both succeed.
- **CI guards.** The build fails if a new admin endpoint has no permission entry; this caught a real access bug.
