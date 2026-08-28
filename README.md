# Jordan — Worldwide Disney Vacation Planning

Static GitHub Pages site for Jordan's independent Disney-focused travel planning brand.

## Current architecture

- `index.html` — public experience and trip designer
- `styles.css` — responsive visual system and interaction styling
- `app.js` — trip budgeting, date logic, offer matching, sparkles/fireworks, copyable brief
- `data/pricing.json` — current public price intelligence and source links

No framework, build step, package manager or server is required.

## Pricing model

The planner deliberately separates:

1. **Published** — rates copied from official public Disney destination pages.
2. **Date exact** — published date-calendar pricing (currently strongest for Tokyo Disney Resort).
3. **Estimate** — user-editable lodging, airfare, dining and transport planning values.
4. **Live check** — products where static data would be misleading, such as Disney Cruise Line or dynamic Disneyland Paris pricing.

Pricing snapshot updated: **2026-08-28**.

### Primary sources used in the current snapshot

- Walt Disney World tickets and 4-Park Magic Ticket offer
- Disneyland Resort ticket pricing FAQ and current offers
- Tokyo Disney Resort official dated ticket calendar
- Hong Kong Disneyland official 2026 offer terms / published tier values
- Shanghai Disney Resort official pricing policy and current offers
- Disneyland Paris official ticket shop
- Disney Cruise Line official cruise search and special-rate page
- Aulani / Disney offer pages

Do not present a snapshot as a guaranteed bookable price. Recheck source links before purchase.

## Magic interaction layer

- Sparkles on interactive clicks
- Firework burst on trip calculation
- Animated orbit hero
- Ambient stars and twinkles
- Reduced-motion support for accessibility

## Next production upgrades

1. Add Jordan's real photo and brand mark.
2. Configure real consultation/contact destination.
3. Add a licensed live hotel/airfare API or serverless pricing service if desired.
4. Add analytics and conversion tracking.
5. Add destination guide pages / SEO content.
6. Add CRM or lead form backend.
7. Automate `data/pricing.json` refresh via scheduled workflow only where source terms permit automated access.

## Legal / brand note

This project is an independent travel-planning website and must not imply that it is an official Disney property or that Jordan holds credentials/authorization that have not been verified.
