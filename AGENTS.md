<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — UNA Project Web Remake Agent Guide

## Project Context

This project is `una-project-web`, a personal portfolio and learning project by the developer.

The project remakes the old UNA Project Google Sites website into a modern website for a small business that provides:

* Jam waktu sholat digital
* Running text LED
* JWS RGB panel
* JWS Android TV
* Seven segment digital clock
* Auto-murotal features
* Product installation and setup service

The current goal is to maintain the premium dark green and gold website, complete the Admin Dashboard, and connect it to the documented backend contract.

This is not just a website completion task. This is also a learning project. Every change must help the developer understand the project structure, component flow, and design implementation.

---

## Current Project Assumptions

Before coding, inspect the real repository files.

Expected stack:

* Next.js
* React
* TypeScript
* Tailwind CSS
* ESLint
* npm

Use npm because this repository uses `package-lock.json`.

Use these commands unless the repo shows otherwise:

```bash
npm install
npm run dev
npm run lint
npm run build
```

Do not switch package managers.

Do not introduce pnpm, yarn, or bun unless the developer explicitly asks.

---

## Mandatory Reading Before Coding

Before writing or editing code, read these files if they exist:

```txt
AGENTS.md
docs/README.md
docs/WEB_SECURITY.md
docs/DESIGN.md
docs/PRODUCT.md
README.md
package.json
src/app/page.tsx
src/app/layout.tsx
src/app/globals.css
src/components/
src/data/
src/lib/
src/types/
```

Also inspect the installed Next.js local documentation before changing Next.js-specific APIs:

```txt
node_modules/next/dist/docs/
```

This is mandatory before using or changing:

* App Router
* Layouts
* Metadata
* Dynamic routes
* Link
* Image
* Server Components
* Client Components
* notFound
* redirects
* Server Actions
* API routes

Do not rely only on memory because this project uses a newer Next.js version.

---

## Primary Design Source

Use `docs/DESIGN.md` as the design contract.

The new style must follow the provided reference design:

* Dark emerald/navy-green hero
* Gold/yellow CTA buttons
* Clean cream/off-white sections
* Strong typography
* JWS digital display simulation
* LED dot matrix visual language
* Product catalog cards with artificial LED preview
* Floating WhatsApp button
* Premium UMKM product landing page feel

Do not create a random new design direction.

Do not make the website look like a generic SaaS landing page.

The identity should feel like:

```txt
Islamic digital product
LED display business
JWS/running text specialist
modern UMKM
professional but still approachable
```

---

## Very Important Design Rule

Do not copy the Figma/React reference as one huge inline-style component.

The reference design may contain absolute positions and inline styles. Convert it into clean, responsive, maintainable code using:

* React components
* TypeScript types
* Tailwind utility classes
* Reusable data arrays
* CSS variables or Tailwind-compatible design tokens
* Mobile-first responsive layout

Bad approach:

```tsx
<div style={{ width: 1920, height: 6146, position: "relative" }}>
  ...
</div>
```

Good approach:

```tsx
<section className="bg-una-deep text-white">
  <Container>
    <HeroContent />
    <JwsDisplayMockup />
  </Container>
</section>
```

---

## Learning-First Rule

The developer is using vibe coding to learn.

Therefore, do not silently generate large code changes.

For every task:

1. Explain the goal.
2. Explain which files will be touched.
3. Implement the smallest useful change.
4. Explain the data/component flow.
5. Explain what the developer should understand.
6. Tell how to run and verify the result.
7. Suggest a small manual edit the developer can try.

The developer must be able to explain the code later as a portfolio project.

---

## Response Format for Implementation Tasks

When asked to implement a feature, respond using this format:

```md
## Tujuan

Jelaskan fitur atau perubahan yang akan dibuat.

## File yang Akan Diubah

Sebutkan file yang akan dibuat/diubah.

## Rencana Singkat

Jelaskan langkah implementasi.

## Implementasi

Berikan patch/kode yang diperlukan.

## Penjelasan Alur

Jelaskan:
- Data berasal dari mana
- Komponen menerima props apa
- Komponen menampilkan apa
- File ini dipakai di mana
- Bagaimana user berinteraksi dengan bagian ini

## Cara Mengecek

Berikan command dan hal yang harus dilihat di browser.

## Yang Perlu Kamu Pahami

Jelaskan konsep React/Next/Tailwind yang sedang dipelajari.
```

For debugging, use:

```md
## Penyebab Error

Jelaskan akar masalahnya.

## File yang Bermasalah

Sebutkan file dan bagian yang relevan.

## Perbaikan Minimal

Berikan fix terkecil terlebih dahulu.

## Konsep yang Berkaitan

Jelaskan konsep yang perlu dipahami.

## Cara Mengecek

Berikan langkah validasi.
```

---

## Current Refactor Goal

The current goal is to implement Phase 6: **Decoupled Backend & Admin Dashboard**.

We have completed the frontend restyling and are building a pragmatic monorepo using:
* **Frontend UI**: Next.js App Router (deployed on Vercel)
* **Backend API**: Golang REST API (Echo / Fiber / net/http, deployed on Google Cloud Run)
* **Database**: PostgreSQL (hosted on Supabase Free Tier)

The Next.js frontend stays at the repository root. The Golang API lives in `backend/`; auth is implemented while content CRUD is still pending. Production hosts are `unaproject.my.id` for public pages and `admin.unaproject.my.id` for the admin dashboard on the same Vercel project.

Features to implement on the Admin Dashboard (`/admin/*`):
1. **Product Management**: CRUD for products, prices, variants, images, specs, and features.
2. **Testimonials Management**: CRUD for installation documentation and customer reviews.
3. **Tutorial Management**: CRUD for user guides and step-by-step instructions.
4. **Order Steps Management**: Customize the transaction workflow steps shown on the landing page.
5. **WhatsApp Chat Templates Management**: Customize dynamic message patterns (e.g. `{product_name}`) for WhatsApp CTAs.

Do not add unnecessary microservices or complex CMS tools. Keep the architecture clean, type-safe, and educational.
Read `docs/WEB_SECURITY.md` before changing auth, admin access, API boundaries, uploads, secrets, or deployment.

---

## Target Page Structure

The homepage should be structured like this:

```txt
Header / Navbar
Hero Section
Stats Strip
Why / Keunggulan Section
Product Catalog Preview
Order Steps Section
Testimonials Section
Final CTA Section
Footer
Floating WhatsApp Button
```

Use section IDs for navigation:

```txt
#home
#produk
#keunggulan
#testimoni
#kontak
```

Navbar should link to those sections.

---

## Suggested Component Structure

Keep components small and readable.

Recommended structure:

```txt
src/components/
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Container.tsx
│
├── sections/
│   ├── HeroSection.tsx
│   ├── StatsStrip.tsx
│   ├── WhySection.tsx
│   ├── ProductCatalogSection.tsx
│   ├── OrderStepsSection.tsx
│   ├── TestimonialsSection.tsx
│   └── FinalCtaSection.tsx
│
├── ui/
│   ├── Button.tsx
│   ├── SectionLabel.tsx
│   ├── SectionHeading.tsx
│   ├── ProductCard.tsx
│   ├── FeatureCard.tsx
│   ├── LogoMark.tsx
│   ├── JwsDisplayMockup.tsx
│   ├── MiniLedPreview.tsx
│   └── FloatingWhatsApp.tsx
```

Only create or move files gradually.

If the current repo already has a different structure, adapt carefully instead of doing a massive rewrite.

---

## Data Structure Rule

Content should be data-driven where useful.

Use data files for:

```txt
src/data/products.ts
src/data/features.ts
src/data/testimonials.ts
src/data/navigation.ts
```

Do not hardcode repeated product cards directly in JSX.

A product object should support the new design.

Recommended product type:

```ts
export type Product = {
  slug: string;
  name: string;
  tag: string;
  category: string;
  description: string;
  specs: string;
  price: number;
  secondaryPriceLabel?: string;
  ledPreview: {
    kind: "rgb-time" | "single-time" | "tv" | "key";
    value?: string;
    colors?: string[];
  };
  isFeatured?: boolean;
};
```

Keep it simple. Do not over-engineer variants unless needed.

---

## Styling Rule

Use Tailwind CSS as the primary styling method.

Prefer reusable utility patterns.

Avoid:

* Random custom CSS
* Large inline style objects
* Absolute positioning for entire layout
* Fixed 1920px widths
* Pixel-perfect desktop-only layout
* Overuse of animations
* Overuse of client components

Use CSS variables in `globals.css` only when helpful for design tokens.

---

## Font Rule

The reference design uses:

* Outfit for headings and brand
* Plus Jakarta Sans for body
* VT323 for LED/digital display text

If fonts are not installed yet, add them through `next/font/google` if compatible with the installed Next.js version.

Before changing font setup, inspect the local Next.js docs.

Use font variables if possible:

```tsx
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
});
```

Then use classes or CSS variables consistently.

---

## Component Responsibility

### Header

The header should:

* Use dark green translucent background
* Be sticky or fixed only if it does not break layout
* Show UNA Project logo
* Show navigation links
* Show gold WhatsApp CTA button
* Be responsive on mobile

Avoid complicated mobile menu at first. A simple responsive layout is acceptable.

### HeroSection

The hero should include:

* Main heading: `UNA Project`
* Short subtitle
* Large JWS display mockup
* Animated down-arrow navigation at the bottom of the hero viewport

### JwsDisplayMockup

This component simulates the physical product display.

It should include:

* Metallic outer frame
* Dark LED screen
* Dot matrix background
* Large digital time
* Running text/marquee strip

This component may be a client component only if it uses live time or browser timers.

If static, keep it as a server component.

If using `useEffect`, explain why `"use client"` is needed.

### ProductCatalogSection

The catalog section should:

* Use cream/off-white background
* Display section label and heading
* Show 6 featured products in a grid
* Use product cards with dark LED preview top and white content body
* Include price and optional murotal variant label
* Include CTA arrow button
* Include “Lihat Katalog Lengkap” CTA linking to `/product`

### ProductCard

Each card should include:

* LED-style thumbnail
* Tag badge
* Product name
* Specs/short description
* Price
* Secondary price label
* Small circular arrow CTA

Do not put all product content inside ProductCard. Pass product data through props.

### OrderStepsSection

This section should show a simple 3-step process:

```txt
01 Konsultasi via WhatsApp
02 Pilih Tipe & Ukuran
03 Instalasi & Aktivasi
```

Use clean white layout with large spacing and subtle dividers.

### TestimonialsSection

Use cream background.

Show testimonial cards with:

* Star rating
* Testimonial text
* Initial avatar
* Name
* Role/location

If testimonials are placeholders, make them realistic but not excessive.

### FinalCtaSection

Use dark green background.

Include:

* Label
* Strong headline
* Short description
* WhatsApp CTA
* Catalog CTA

### Footer

Use near-black green background.

Include:

* Brand block
* Short business description
* Social icons or placeholders
* Contact info
* Navigation links
* Information links
* Copyright

### FloatingWhatsApp

Add floating WhatsApp button on bottom-right.

It should:

* Use green WhatsApp color
* Have accessible label
* Link to WhatsApp helper
* Not cover important mobile content excessively

---

## WhatsApp Rule

Use a reusable helper for WhatsApp links.

Recommended file:

```txt
src/lib/whatsapp.ts
```

Example responsibility:

```ts
export function createWhatsAppLink(message?: string): string {
  ...
}
```

Do not duplicate WhatsApp URL strings in many components.

Use a placeholder phone number only if the real number is not available. Mark it clearly as TODO.

---

## Accessibility Rule

Maintain semantic HTML.

Use:

* `<header>`
* `<nav>`
* `<main>`
* `<section>`
* `<footer>`
* `<a>`
* `<button>` only for real button actions

Do not use clickable `<div>`.

Add:

* `aria-label` for icon-only buttons
* descriptive link text
* useful alt text for images
* readable contrast
* logical heading order

---

## Responsive Rule

The design must be responsive.

Desktop reference can be inspired by the screenshot, but implementation must work on:

* Mobile
* Tablet
* Desktop

Use mobile-first Tailwind classes.

Expected behavior:

* Header navigation may simplify on mobile
* Hero text stacks above display mockup
* Stats become 2-column or 1-column on mobile
* Product cards become 1 column on mobile, 2 on tablet, 3 on desktop
* Feature cards stack on mobile
* Footer columns stack on mobile

Never use fixed widths that break mobile.

---

## Do Not Rewrite Everything at Once

Use this refactor order:

### Phase 1 — Design Foundation

* Add or update `docs/DESIGN.md`
* Update `globals.css` tokens
* Configure fonts
* Create shared `Container`, `Button`, `SectionLabel`, `LogoMark`

### Phase 2 — Layout Foundation

* Update Header
* Update Footer
* Add Floating WhatsApp

### Phase 3 — Hero

* Create new HeroSection
* Create JwsDisplayMockup
* Add title, subtitle, running text, and viewport scroll cue

### Phase 4 — Content Sections

* StatsStrip
* WhySection
* ProductCatalogSection
* OrderStepsSection
* TestimonialsSection
* FinalCtaSection

### Phase 5 — Polish

* Responsive fixes
* Spacing consistency
* Accessibility check
* SEO metadata
* README screenshots/notes

### Phase 6 — Full-Stack Decoupled Backend & Admin Dashboard

* Setup Supabase PostgreSQL database and execute SQL DDL from `docs/DATABASE_SCHEMA.md`
* Build Golang REST API server (Echo/Fiber) with JWT Auth and `sqlc` repository layer
* Create Next.js Admin Dashboard UI (`/admin/*`) with secure cookie session handling
* Implement CRUD for Products, Testimonials, Tutorials, Order Steps, and WhatsApp Templates
* Connect public frontend pages to consume Golang REST API endpoints
* Deploy backend to Google Cloud Run and verify Vercel environment variables

One phase should be implemented and reviewed before moving to the next.

---

## Quality Checklist

A change is done only when:

* `npm run lint` passes
* `npm run build` passes
* The homepage renders without console errors
* Mobile layout is not broken
* The design follows `docs/DESIGN.md`
* Components are readable
* Data is not unnecessarily hardcoded
* The developer can explain what changed

---

## Commit Style

Use conventional commits:

```txt
docs: add design system guide
style: add UNA Project design tokens
feat: add redesigned header
feat: add hero section with JWS display mockup
feat: add product catalog section
feat: add order steps section
feat: add testimonial section
feat: add final CTA and footer
fix: improve mobile spacing
refactor: split homepage into sections
```

Do not mix unrelated changes in one commit.

---

## Documentation Rule

When finishing a major section, update learning documentation if present.

Suggested file:

```txt
LEARNING_NOTES.md
```

Add short notes like:

```md
## Hero Section

Yang dipelajari:
- Cara memecah UI besar menjadi komponen kecil
- Cara membuat mockup visual dengan CSS dan Tailwind
- Cara menggunakan font khusus untuk efek digital
- Cara membuat CTA WhatsApp reusable
```

This project should be explainable in a portfolio.

---

## Final Reminder

The goal is not only to make the website look like the reference.

The goal is to help the developer learn how a real landing page is structured:

* Design tokens
* Components
* Data
* Layout
* Responsive behavior
* Reusable CTA
* Clean refactor
* Portfolio storytelling

Prefer clear, maintainable, educational code over flashy but confusing code.
