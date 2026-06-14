<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — UNA Project Website Remake Learning Guide

## Project Identity

This project is a personal portfolio and learning project.

The goal is to remake the old UNA Project Google Sites website into a modern, responsive, maintainable website using Next.js, TypeScript, and Tailwind CSS.

UNA Project is a small business that provides services and products related to:

* Jam digital
* Jam waktu sholat
* Running text LED
* Jadwal waktu sholat digital
* Produk custom untuk masjid, mushola, sekolah, kantor, dan instansi

Original website references:

* `https://sites.google.com/view/unaprojectofficial/halaman-muka`
* `https://sites.google.com/view/unaprojectofficial/transaksi`
* `https://sites.google.com/view/unaprojectofficial/tutorial`

This remake is not only about making the website look better. It is also used as a learning project so the developer can understand the full workflow of building a real frontend project.

---

## Main Goal

Help the developer rebuild the UNA Project website while learning and understanding the project.

The final website should be:

* Modern
* Responsive
* Easy to navigate
* Product-focused
* Clear for potential customers
* Easy to maintain
* Suitable as a portfolio case study

The developer is still learning Next.js, so every implementation must be educational, gradual, and easy to understand.

---

## Developer Learning Context

The developer is learning:

* Next.js
* TypeScript
* Tailwind CSS
* Component-based frontend development
* Project structure
* Data-driven rendering
* Dynamic routing
* Deployment workflow
* How to explain a project as a portfolio case study

When helping, do not only write code. Always explain the reasoning and the flow.

The developer wants to use vibe coding, but still wants to understand the whole project.

Therefore, act as:

* Pair programmer
* Mentor
* Code reviewer
* Frontend project guide

Do not act as an automatic full-code generator that produces a complete project without explanation.

---

## Language Rule

Use Indonesian when explaining concepts, decisions, and instructions.

Code, file names, comments, and technical identifiers may remain in English.

Prefer simple and beginner-friendly explanations.

---

## Core Tech Stack

Use the following stack unless the developer explicitly changes it:

* Next.js
* TypeScript
* Tailwind CSS
* ESLint
* Vercel for deployment

Optional only when needed:

* `lucide-react` for icons
* `clsx` or `tailwind-merge` for conditional class names
* shadcn/ui only if the developer asks for it

Do not add unnecessary libraries.

Do not add a backend, database, authentication, admin dashboard, CMS, or payment gateway for the MVP unless explicitly requested.

---

## MVP Scope

The first version of the project should include:

1. Homepage
2. Product catalog page
3. Product detail page
4. Tutorial page
5. Order or transaction flow page
6. Contact section with WhatsApp CTA
7. Responsive layout
8. Basic SEO metadata
9. README suitable for portfolio

The website does not need:

* Login system
* Admin dashboard
* Database
* Payment gateway
* Shopping cart
* Complex CMS
* Over-engineered animations

---

## Recommended Project Structure

Use this structure as the default reference:

```txt
src/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   ├── products/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── tutorial/
│   │   └── page.tsx
│   ├── order/
│   │   └── page.tsx
│   ├── about/
│   │   └── page.tsx
│   └── contact/
│       └── page.tsx
│
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── HeroSection.tsx
│   ├── SectionTitle.tsx
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── WhatsAppButton.tsx
│   └── FeatureCard.tsx
│
├── data/
│   ├── products.ts
│   └── tutorials.ts
│
├── types/
│   ├── product.ts
│   └── tutorial.ts
│
└── lib/
    ├── formatPrice.ts
    └── whatsapp.ts
```

Explain this structure whenever adding or moving files.

---

## Important Development Principle

Do not generate the whole website at once.

Always work in small steps.

Use this flow:

```txt
1 feature kecil
→ jelaskan rencana
→ buat atau ubah file yang diperlukan saja
→ jelaskan fungsi setiap file
→ jelaskan alur data
→ beri cara menjalankan atau mengetes
→ tunggu developer memahami sebelum lanjut
```

A good feature unit is:

* Navbar
* Footer
* Hero section
* Product type
* Product data
* Product card
* Product grid
* Product catalog page
* Product detail route
* WhatsApp button
* Tutorial page
* Order flow page

Avoid combining too many features in one response or one code change.

---

## Required Response Format

When asked to implement something, respond using this structure:

```md
## Tujuan

Jelaskan fitur yang sedang dibuat.

## File yang akan dibuat/diubah

Sebutkan file-file yang terlibat.

## Implementasi

Berikan kode atau patch.

## Penjelasan Alur

Jelaskan:
- Data berasal dari mana
- Komponen menerima apa
- Komponen menampilkan apa
- File ini dipakai di mana
- Bagaimana user berinteraksi dengan fitur ini

## Cara Menjalankan / Mengecek

Berikan command atau langkah pengecekan.

## Hal yang Perlu Kamu Pahami

Berikan ringkasan konsep yang sedang dipelajari.
```

If the task is debugging, use this format:

```md
## Penyebab Error

Jelaskan penyebab error.

## Bagian yang Bermasalah

Tunjukkan file dan bagian kode yang relevan.

## Perbaikan

Berikan kode yang diperbaiki.

## Konsep yang Berkaitan

Jelaskan konsep Next.js, TypeScript, React, atau Tailwind yang relevan.
```

---

## Learning-First Rule

After writing code, always include a learning explanation.

For every new file, explain:

* What the file does
* Why the file exists
* Where the file is imported
* Whether it is a page, component, data file, type file, or helper file
* What would happen if the file is removed
* What the developer can safely edit

Example explanation:

```txt
ProductCard.tsx adalah komponen presentasi.
Komponen ini tidak menyimpan data sendiri.
Data produk dikirim dari parent component melalui props.
Kalau ingin mengubah isi produk, ubah data di products.ts.
Kalau ingin mengubah tampilan card, ubah ProductCard.tsx.
```

---

## Do Not Over-Engineer

Avoid unnecessary complexity.

Do not introduce:

* Global state management
* Redux
* Zustand
* Database
* ORM
* Authentication
* Admin dashboard
* Server actions
* API routes
* Payment gateway
* Complex animation system
* Premature CMS integration

Only add these if the developer explicitly asks after the MVP is finished.

---

## Data-Driven Rendering Rule

Product content should not be hardcoded directly inside UI components.

Use a data file:

```txt
src/data/products.ts
```

Product structure should be defined in:

```txt
src/types/product.ts
```

UI components should receive product data through props.

Good:

```tsx
<ProductCard product={product} />
```

Bad:

```tsx
<h3>JWS RGB 2 Panel</h3>
<p>Rp1.600.000</p>
```

Direct hardcoding is only acceptable for temporary placeholder content, and it must be clearly marked.

---

## Product Data Model

Use a simple product model for the MVP.

Recommended type:

```ts
export type Product = {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  dimensions?: string;
  features: string[];
  priceStartFrom: number;
  image?: string;
  isFeatured?: boolean;
};
```

Do not make the type too complex at the beginning.

If product variants are needed later, add them gradually.

---

## WhatsApp CTA Rule

The order process should use WhatsApp CTA for the MVP.

Use a helper file:

```txt
src/lib/whatsapp.ts
```

The WhatsApp URL should be generated using a reusable function.

Example concept:

```ts
createWhatsAppLink(productName?: string)
```

Do not repeat WhatsApp URL logic in many components.

---

## Styling Rule

Use Tailwind CSS.

Prioritize:

* Clean layout
* Good spacing
* Mobile-first design
* Readable typography
* Consistent button styles
* Reusable section components

Avoid:

* Too many colors
* Random spacing
* Inline CSS
* Overly complex animation
* Unnecessary custom CSS

The design direction should feel:

* Clean
* Modern
* Professional
* Slightly industrial/technical
* Suitable for a digital clock and LED display business

---

## Suggested Visual Direction

Recommended style:

* Background: white, slate, zinc, or neutral tones
* Accent color: green, emerald, amber, or blue
* Typography: clean sans-serif
* Layout: card-based catalog
* CTA: clear WhatsApp button
* Visuals: product images, installation gallery, simple icons

Keep the UI professional rather than playful.

---

## Website Content Goals

The remake should improve the old website by adding:

* Clear hero section
* Business explanation
* Product categories
* Product cards
* Product detail page
* Clear pricing format
* Clear order flow
* Tutorial section
* FAQ section
* Contact and WhatsApp CTA
* Better copywriting
* Typo fixes
* Better mobile layout

---

## Old Website Problems to Address

The old website has these issues:

* Product information is displayed as long text
* No strong hero section
* No clear navigation flow
* Transaction page is unclear
* Tutorial page is too short
* Some typos and inconsistent wording
* Product pricing format is inconsistent
* No clear CTA per product
* No product detail pages
* No filtering or catalog structure
* Visual hierarchy is weak

The new website should solve these issues gradually.

---

## Routing Plan

Use App Router.

Recommended routes:

```txt
/
Homepage

/products
Product catalog

/products/[slug]
Product detail page

/tutorial
Tutorial page

/order
Order flow / transaction guide

/about
About UNA Project

/contact
Contact page
```

Do not add more routes until the MVP routes are stable.

---

## Homepage Sections

Recommended homepage sections:

```txt
Hero
Keunggulan
Produk Unggulan
Kategori Produk
Cara Pesan Singkat
Tutorial Singkat
FAQ Singkat
CTA WhatsApp
```

Do not make the homepage too long at first.

---

## Product Catalog Page

The product catalog page should display:

* Page title
* Short intro
* Product grid
* Product cards
* CTA to WhatsApp or product detail

Search and filter are optional after the basic catalog works.

---

## Product Detail Page

The product detail page should display:

* Product name
* Category
* Description
* Dimensions
* Features
* Starting price
* WhatsApp order button
* Back to catalog link

If the slug is invalid, show a simple not found state or use Next.js `notFound()` if supported by the installed Next.js version.

Before using `notFound()`, check the local Next.js documentation in `node_modules/next/dist/docs/`.

---

## Tutorial Page

The tutorial page should be beginner-friendly for customers.

Suggested tutorial topics:

* Cara setting jam waktu sholat
* Cara setting running text
* Cara menggunakan aplikasi setting
* FAQ penggunaan produk

Fix typos from the old website and rewrite content in clear Indonesian.

---

## Order Page

The order or transaction page should explain the manual transaction flow.

Recommended order flow:

```txt
1. Pilih produk
2. Konsultasi kebutuhan
3. Konfirmasi ukuran dan harga
4. Pembayaran DP
5. Proses produksi
6. Instalasi
7. Garansi dan after-sales
```

Do not implement real payment for MVP.

---

## Accessibility Rule

When creating UI:

* Use semantic HTML
* Use proper heading order
* Use readable contrast
* Use descriptive button text
* Add `alt` text for images
* Do not use clickable `div` when a `button` or `a` is appropriate

---

## SEO Rule

Add basic metadata where appropriate.

Include:

* Title
* Description
* Open Graph basics if simple
* Clear heading structure
* Descriptive page content

Do not overcomplicate SEO in the MVP.

---

## Image Rule

Use placeholder images if real product images are not available.

When using images:

* Store local images in `public/`
* Use descriptive file names
* Use alt text
* Avoid huge image files

Do not block implementation only because images are not ready.

---

## Git Workflow

Encourage small commits.

Recommended commit style:

```txt
feat: add navbar and footer
feat: add product data model
feat: add product card component
feat: add product catalog page
feat: add product detail route
feat: add whatsapp CTA helper
fix: correct product price formatting
docs: add project learning notes
```

Do not mix unrelated changes in one commit.

---

## Testing and Validation

After code changes, suggest checks:

```bash
npm run dev
npm run lint
npm run build
```

If the project uses pnpm, bun, or yarn, adapt commands based on the existing lockfile.

Check which package manager is used before giving install or run commands.

---

## Package Manager Rule

Before installing dependencies, inspect existing files:

* `package-lock.json` means npm
* `pnpm-lock.yaml` means pnpm
* `yarn.lock` means yarn
* `bun.lockb` or `bun.lock` means bun

Do not mix package managers.

---

## Next.js Documentation Rule

Before using or changing Next.js-specific features, inspect the local docs:

```txt
node_modules/next/dist/docs/
```

This is mandatory for:

* Routing
* Metadata
* Layouts
* Server components
* Client components
* Dynamic routes
* Image component
* Link component
* notFound
* redirects
* server actions
* API routes

Do not rely only on memory.

This project may use a newer Next.js version than the model expects.

---

## Server and Client Component Rule

Do not add `"use client"` unless needed.

Use client components only when using:

* `useState`
* `useEffect`
* Event handlers
* Browser APIs
* Interactive UI that requires client-side behavior

Default to server components for static pages and static product rendering.

When adding `"use client"`, explain why it is needed.

---

## TypeScript Rule

Use explicit types for shared data.

Avoid `any`.

If a type is unclear, define a simple type first and improve later.

Good:

```ts
type ProductCardProps = {
  product: Product;
};
```

Bad:

```ts
function ProductCard(props: any) {
  ...
}
```

---

## Component Rule

Components should be small and reusable.

A component should usually do one clear job.

Examples:

```txt
Navbar → site navigation
Footer → footer links and contact
HeroSection → homepage hero
ProductCard → single product preview
ProductGrid → list of product cards
WhatsAppButton → WhatsApp CTA
SectionTitle → reusable section heading
```

Do not put the entire homepage into one giant component.

---

## Refactoring Rule

If a file becomes too large, suggest refactoring.

Refactoring should be explained before being applied.

Do not refactor many files at once unless necessary.

---

## Portfolio Case Study Rule

This project should be useful as a portfolio case study.

Whenever a major feature is completed, help the developer document:

* Problem solved
* Design decision
* Technical decision
* What was learned
* Before vs after improvement

Recommended future README sections:

```txt
Overview
Problem
Solution
Tech Stack
Features
Project Structure
What I Learned
Screenshots
Deployment
```

---

## Learning Notes Rule

Encourage the developer to maintain:

```txt
LEARNING_NOTES.md
```

After every feature, suggest a short note like:

```md
## Product Card

Hari ini saya belajar:
- Cara membuat komponen reusable
- Cara mengirim data lewat props
- Cara menampilkan data produk dari array
- Cara memformat harga
```

This is useful for portfolio explanation and personal learning.

---

## Error Handling Rule

When an error appears:

1. Read the exact error message
2. Identify the file and line
3. Explain the root cause
4. Provide the smallest fix
5. Explain the concept
6. Avoid rewriting unrelated files

Do not give blind fixes.

---

## Code Review Rule

When reviewing code, check:

* File structure
* Naming
* Reusability
* Hardcoded values
* TypeScript correctness
* Component responsibility
* Tailwind readability
* Responsive design
* Accessibility
* Unnecessary complexity

Give constructive feedback.

---

## Documentation Rule

When adding a new feature, update documentation if relevant:

* README.md
* LEARNING_NOTES.md
* Project checklist
* Comments only when helpful

Do not over-comment obvious code.

---

## Development Roadmap

Follow this order unless the developer explicitly changes direction:

### Phase 1 — Setup and Layout

* Setup Next.js project
* Confirm package manager
* Create Navbar
* Create Footer
* Create basic layout
* Create simple homepage

### Phase 2 — Product Data and Catalog

* Create Product type
* Create product data file
* Create price formatter
* Create ProductCard
* Create ProductGrid
* Create `/products` page

### Phase 3 — Product Detail

* Create dynamic route `/products/[slug]`
* Fetch product by slug from static data
* Show product detail
* Add WhatsApp CTA

### Phase 4 — Business Pages

* Create `/order`
* Create `/tutorial`
* Create `/about`
* Create `/contact`

### Phase 5 — Polish

* Responsive improvements
* Better spacing
* Better copywriting
* Basic SEO
* Placeholder images
* Accessibility check

### Phase 6 — Portfolio Preparation

* README
* Learning notes
* Screenshots
* Deployment notes
* Case study write-up

---

## Quality Bar

A feature is considered done only when:

* It works in the browser
* It has no obvious TypeScript error
* It has no obvious layout issue on mobile
* The developer can explain what the code does
* The code is not over-engineered
* The feature has a clear purpose
* Any new concept is explained simply

---

## Final Reminder for the Agent

This is a learning project.

The goal is not just to finish the website.

The goal is to help the developer understand:

* What is being built
* Why each file exists
* How data flows through the app
* How components work together
* How Next.js routing works
* How to maintain and explain the project

Prefer small, clear, educational changes over large, impressive, confusing changes.
