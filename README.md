# Jordan — Worldwide Disney Travel Planning

Canonical repository for Jordan's independent Disney-focused travel planning website.

## Current architecture

Zero-build static site:

- `index.html` — semantic page structure and content
- `styles.css` — responsive visual system
- `app.js` — navigation, intake brief builder, and contact configuration

This intentionally has no framework or package dependencies so it can deploy directly on GitHub Pages or any static host.

## Positioning

Jordan is positioned as a worldwide Disney vacation planning specialist with a former flight-attendant perspective on trip flow, comfort, logistics, and international travel.

Primary destination coverage:

- Walt Disney World
- Disneyland Resort
- Disney Cruise Line
- Aulani
- Disneyland Paris
- Tokyo Disney Resort
- Hong Kong Disneyland
- Shanghai Disney Resort
- Adventures by Disney / multi-city Disney travel

## Before public launch

1. Add Jordan's real headshot and replace the founder-image placeholder.
2. Set Jordan's real booking email in `SITE_CONFIG.plannerEmail` inside `app.js`, or replace the email workflow with a booking/CRM endpoint.
3. Add verified testimonials only after Jordan has permission to publish them.
4. Add the final business/agency name if different from Jordan's personal brand.
5. Confirm host/domain and then add canonical URL, Open Graph URL, and social-share image metadata.
6. Add privacy policy / terms appropriate to the booking workflow and any analytics used.
7. If Jordan books travel through a host agency, add any required seller-of-travel, host-agency, or advisor disclosures.

## Trip intake

The current form creates a clean traveler brief in-browser and allows the visitor to copy it. Once `plannerEmail` is configured, the email action can be enabled without introducing a backend.

For production lead capture, a CRM/form endpoint is preferable so inquiries are not lost if the visitor closes the page.

## Future roadmap

Possible next evolution:

- Destination detail pages
- Jordan's travel guides / SEO content
- FAQ/content CMS
- Client testimonials
- Lead CRM integration
- Consultation scheduling
- Email newsletter capture
- Trip request persistence
- Analytics
- Custom domain
- Optional migration to a travel CMS such as the Voyagr architecture reviewed separately

## Independence / trademark note

This is intended as an independent travel-planning website. Disney names and destination names should be used only to accurately describe the services and destinations Jordan helps clients plan. Do not imply official affiliation, sponsorship, or endorsement unless Jordan actually has the corresponding authorized relationship and disclosure language.
