---
title: "Building a Pet Marketplace Platform"
description: "Four months of building a pet-services marketplace: the design decisions, the bugs the database now refuses, working with Claude Code, and what isn't done yet."
pubDate: 2026-10-29
tags: ["patimania", "engineering", "ai"]
heroImage: ../../assets/blog/building-patimania.jpg
---

I'm building **Patimania**, a marketplace that connects pet owners with pet hotels, groomers and pet taxis in Türkiye. It runs on the web, on iOS and Android, and behind it there's a business panel and an admin panel. The customer pays up front, and the money waits in escrow until the service is done; then the commission is taken and the rest goes to the business.

The first commit went in on 2 July 2026. This post is about how it's built: the decisions that shaped it, a few problems I had to solve properly, and what I learned from writing the code with an AI agent.

Where it stands first, because I don't want to oversell it. Patimania is in soft launch at [patimania.com](https://patimania.com). Search, business pages and business sign-up are open, but every business listed so far is a demo record, and real payments are off until the payment provider is connected. The whole payment flow is built and tested against a fake provider. The app is in Google Play closed testing and TestFlight external testing.

## Three services, three different clocks

The decision that shaped everything else was *not* forcing the three services into one "appointment" model. They really are different:

- **Pet hotel** works in nights, and each named room is its own resource.
- **Grooming** works in time slots, and each named groomer is a resource.
- **Pet taxi** has no fixed price at all. The customer opens a request, drivers send offers, the customer picks one. An offer is valid for 12 hours and can't outlive its request.

Each one kept its own time and capacity model, and the business panel changes with it: a room calendar for hotels, an appointment book for groomers, a trip list for drivers.

![The hotel's room calendar in the business panel (demo data)](../../assets/projects/patimania/gallery/05-room-calendar.png)

## Double bookings the database refuses

Two customers must never get the same room for the same night. "Check first, then write" in application code doesn't hold up under a race: two requests can pass the check at the same moment and both write.

So I moved the rule into PostgreSQL. An exclusion constraint makes overlapping time ranges for the same resource impossible:

```sql
EXCLUDE USING gist (
  resource_id WITH =,
  tstzrange(start_at, end_at, '[)') WITH &&
) WHERE (
  exclusive
  AND status IN ('pending_payment','paid','confirmed','in_progress','completed')
);
```

Even if the code has a bug, or two requests arrive in the same microsecond, the database rejects the second one. The `WHERE` clause limits it to bookings that actually hold the slot: a cancelled booking frees it, and taxi offers never hold one.

## Money that never moves twice

Payment webhooks can arrive twice, a user can tap "approve" twice, and a scheduled job can run in the same second as a user action. Every write that changes a status is conditional (`UPDATE … WHERE status = 'pending'`), so the second attempt updates zero rows and stops quietly.

Around that:

- Prices, commission and availability are always calculated on the server. A price coming from the client is never accepted.
- Locks are always taken in the same order, payments first and then reservations. A CI check warns if a new code path takes them the other way round.
- Every money transition is written to a ledger that can only be appended to. Even the cleanup scripts skip it.

## Rules frozen onto the booking

The cancellation window and the commission rate can be changed from the admin panel. If changing them also changed the rules of bookings made last week, a promise to a customer would be broken. So when a booking is made, it takes its own copy of the policy, and every later decision uses that copy.

This turned into a habit across the project: business rules live in a policy table instead of the code, and counters are computed from one ledger instead of being kept separately.

## An address is more than a pin

"Kadıköy" is enough to search, but a pet taxi has to reach the door. Asking for the full address up front made people give up before searching. So the address comes in two steps: a point on the map first, then the door details (building, number, floor, flat) in separate fields, only when a booking needs them.

There was one trap specific to Turkish. In address matching the possessive suffix matters: "Tan Sokak" and "Tan Sokağı" can be different streets. A simple "contains" match gets that wrong, so the matching handles Turkish suffix rules on its own.

## Permissions you can't forget

The admin panel has 30 screens, and each staff member gets their own set of permissions. Forgetting the permission check on a new admin endpoint opens it to every staff member, and tests won't notice, because tests usually run as an admin.

So a script in CI scans every admin endpoint and fails the build if one has no permission entry. The same idea now covers other silent bug classes: lock order, iOS/Android drift, deep-link parity and a few more. Seven of these checks run on every build. If a kind of bug has hurt once, I'd rather a machine watch for it than trust that I'll remember.

## Writing the code with Claude Code

I wrote Patimania with Claude Code from the first commit. It's the reason four surfaces (API, web, mobile app and admin panel) got built in four months. It's also not the interesting part.

The interesting part is checking the work. An agent writes fast, and when it's wrong it's wrong just as fast and just as confidently. What kept the project standing was the set of rules I put around that speed:

1. **Decisions stay with me.** Scope, data model, architecture and saying "we're not doing this" are mine, and each is written down with its reasoning: 102 decision records so far. The agent implements; it doesn't decide.
2. **No claim without proof.** "It works" isn't accepted until it has been shown to work.
3. **Silent bugs go to machines.** The seven CI checks above catch what both people and agents miss.
4. **A separate review.** At the end of each stage, a review runs in a context that didn't write the code, because whoever wrote it carries its blind spots.

That's where the 76 end-to-end test suites and 3,900 assertions come from. Each suite starts a real API server, sends real HTTP requests against an isolated database and checks the result in the database.

## What the mobile app taught me

- **A network error isn't an empty list.** In the first version a failed request looked like "no results". Now every list has three distinct states: results, no results, no connection.
- **Visual bugs don't show up in tests.** The app has a diagnostics screen that turns iOS/Android layout differences into numbers, so they can be compared instead of eyeballed.
- **Native changes don't ship over the air.** Small fixes go out as OTA updates without a store review, but changing the launch animation needed a new store build.

## Boring choices on purpose

It's a modular monolith: one repository, with the API, web and mobile app sharing one package of business logic. Microservices would have cost far more than they'd have given at this size. PostgreSQL does four jobs (the exclusion constraint, time ranges, geographic search with PostGIS and the job queue), so there's no separate Redis or search server to run. It's hosted on a server in Türkiye, because personal data has to stay in the country under KVKK, the Turkish data-protection law.

## What isn't done

- **Real payments.** The flow is ready and tested; the provider adapter isn't connected yet, because choosing between iyzico and PayTR depends on setting up the company.
- **Real businesses.** Every business on the site is a demo record. The real challenge of a marketplace isn't technical: it needs enough real businesses first.
- **File storage restore drill.** The database restore was rehearsed on 23 October; restoring the file storage hasn't been tried yet.
- **Push notifications on a real phone.** They work on the emulator but haven't been seen on a physical device.

## In numbers

Measured on 24 October 2026: 2,441 commits in 115 days, 315,165 lines of TypeScript, 32 backend modules, 68 tables with 106 foreign keys, 124 migrations live, 128 web routes, 45 app screens, 76 end-to-end test suites with 3,900 assertions, 7 CI checks and 102 decision records.

Next up is the real payment adapter, invoicing, and bringing in the first real businesses. You can see more screenshots on the [project page](/projects/patimania).
