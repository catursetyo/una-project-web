# UNA Project Visual Design System

## Design Direction

UNA Project should look like a premium landing page for a digital Islamic hardware/service business.

The visual identity should communicate:

```txt
Presisi
Amanah
Modern
Teknis
Profesional
Cocok untuk masjid & mushola
Tetap ramah untuk UMKM
```

The design must be inspired by the provided reference:

* Dark green premium hero
* Gold CTA buttons
* LED digital clock visuals
* Cream/off-white content sections
* Product catalog with LED preview cards
* Auto-murotal feature section
* Clean order steps
* Testimonials
* Strong footer and floating WhatsApp button

Do not make the website look too playful, generic, or like a normal e-commerce template.

---

## Core Visual Keywords

Use these keywords as the visual guide:

```txt
dark emerald
gold accent
LED glow
digital display
mosque-friendly
premium UMKM
clean industrial
semi-islamic
modern catalog
```

---

## Color Palette

### Primary Colors

```txt
Deep Green        #0A211D
Dark Emerald      #0F3A32
Muted Emerald     #0D2E26
Brand Green       #155A4C
Accent Teal       #1C6F5C
Soft Teal         #2C8C72
```

Usage:

* Hero background
* Header
* Footer
* Dark buttons
* Icon backgrounds
* Product LED panel backgrounds

---

### Gold Accent

```txt
Gold Light        #F0C875
Gold Main         #D6A437
Gold Text Dark    #221500
```

Usage:

* Primary CTA buttons
* Brand subtitle
* Section labels on dark background
* Product tags
* Icon strokes
* Highlight marks

CTA gradient:

```css
linear-gradient(180deg, #F0C875 0%, #D6A437 100%)
```

---

### Background Colors

```txt
Cream Background  #FAFAF5
Soft Section       #F5F6F0
White              #FFFFFF
Footer Dark        #060F0D
```

Usage:

* Main page background
* Product sections
* Testimonial section
* Footer

---

### Text Colors

```txt
Main Text          #111A10
Muted Text         #6B7568
Soft Text          #3A4438
White Text         #FFFFFF
White Muted        rgba(255,255,255,0.72)
White Subtle       rgba(255,255,255,0.45)
```

Usage:

* Main headings
* Paragraphs
* Footer text
* Hero description

---

### LED Colors

```txt
LED Orange         #FF5C33
LED Pink           #FF5C8A
LED Blue           #5CB0FF
LED Green          #5CFFB0
LED Warm           #F0C875
WhatsApp Green     #1FAE5C
```

Usage:

* Digital clock text
* Product preview mockups
* Running text
* RGB product simulation
* WhatsApp floating button

---

## Typography

### Font Roles

Use three font families:

```txt
Heading / Brand    Outfit
Body / UI          Plus Jakarta Sans
Digital LED        VT323
```

### Heading Style

Headings should feel bold, rounded, modern, and confident.

Suggested classes:

```txt
font-heading font-extrabold tracking-tight
```

Hero heading:

```txt
text-4xl md:text-5xl lg:text-6xl
leading-[0.95] md:leading-[1.02]
```

Section heading:

```txt
text-3xl md:text-4xl
leading-tight
```

Card heading:

```txt
text-base md:text-lg
font-bold
```

---

### Body Style

Body text should be clean and readable.

Suggested classes:

```txt
font-body text-base leading-7 text-muted
```

Hero description:

```txt
text-white/70 text-base md:text-lg leading-8
```

---

### LED Text Style

Use VT323 for simulated LED text.

Suggested classes:

```txt
font-led tracking-wider
```

Large clock:

```txt
text-5xl md:text-7xl lg:text-8xl
text-[#FF5C33]
drop-shadow or text-shadow glow
```

Small product preview:

```txt
text-4xl md:text-5xl
```

---

## Layout System

### Container

Use a consistent max-width container.

Recommended:

```txt
max-w-6xl mx-auto px-4 sm:px-6 lg:px-8
```

Reference desktop content width is around 1096–1160px.

Do not use fixed `1920px` or `absolute` page layout.

---

### Section Spacing

Use compact, consistent spacing so sections remain connected.

Recommended:

```txt
py-12 sm:py-14 lg:py-16
```

Hero content:

```txt
py-12 sm:py-14 lg:py-16
```

Compact strips:

```txt
py-6 sm:py-7
```

---

### Grid Rules

Product catalog:

```txt
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

Feature cards:

```txt
grid grid-cols-1 md:grid-cols-2
```

Testimonials:

```txt
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

Stats:

```txt
grid grid-cols-2 md:grid-cols-4
```

---

## Buttons

### Primary Button

Use for WhatsApp and main CTA.

Visual:

```txt
Gold gradient
Rounded full
Dark text
Medium shadow
Icon optional
```

Suggested Tailwind:

```txt
inline-flex items-center justify-center gap-2 rounded-full
bg-gradient-to-b from-[#F0C875] to-[#D6A437]
px-7 py-3.5
font-bold text-[#221500]
shadow-[0_10px_28px_-10px_rgba(214,164,55,0.6)]
transition hover:-translate-y-0.5 hover:shadow-lg
```

Text examples:

```txt
Pesan via WhatsApp
Hubungi Kami
Mulai Konsultasi
Tanya Soal Murotal
```

---

### Dark Button

Use on cream/white backgrounds.

```txt
rounded-full
bg-[#0A211D]
text-[#FAFAF5]
px-7 py-3.5
font-bold
```

Text examples:

```txt
Konsultasi Gratis
Minta Katalog Lengkap
```

---

### Outline Light Button

Use on dark background.

```txt
rounded-full
border border-white/30
text-white
px-7 py-3.5
font-bold
hover:bg-white/10
```

Text examples:

```txt
Lihat Katalog
```

---

### Outline Dark Button

Use on light background.

```txt
rounded-full
border border-[#111A10]/10
text-[#111A10]
px-7 py-3.5
font-bold
hover:bg-[#111A10]/5
```

---

## Header / Navbar

### Visual

The header should be dark green with slight transparency.

```txt
background: rgba(10, 33, 29, 0.95)
border-bottom: 1px solid rgba(255,255,255,0.12)
backdrop-filter: blur(6px)
```

Use:

```txt
sticky top-0 z-50
```

or fixed only if spacing is handled correctly.

### Content

Header contains:

```txt
Logo mark
UNA Project
Jam Waktu Sholat Digital
Navigation links
Gold WhatsApp CTA
```

Navigation:

```txt
Beranda
Produk
Keunggulan
Murotal
Testimoni
```

CTA:

```txt
Hubungi Kami
```

---

## Logo Direction

The logo mark can be a simple mosque/dome/drop shape with dots, inspired by the reference.

Visual:

```txt
Dark green fill
Gold stroke
Gold dot grid
Rounded vertical form
```

If no image logo exists, create a simple SVG component named:

```txt
LogoMark.tsx
```

Do not use an unrelated logo.

---

## Hero Section

### Background

Use a deep emerald background with a restrained radial teal glow and subtle
LED dot-matrix texture. The product display should feel illuminated inside a
dark showroom, while gold remains the only bright accent.

### Structure

Hero should contain:

```txt
Title
Subtitle
Live digital clock with running text
Down-arrow navigation to the stats strip
```

Keep the composition centered with compact vertical spacing. Do not add CTA,
trust badges, product specs, or prayer-time details inside the hero.

### Hero Title

Text:

```txt
UNA Project
```

Style:

```txt
Large Outfit heading
White `UNA` with solid gold `Project`
Compact line height
Centered alignment
```

---

### Hero Subtitle

Text:

```txt
Menyediakan running text dan jam waktu sholat sesuai kebutuhan Anda.
```

Keep it short, readable, and no wider than about 65 characters per line.

---

## JWS Display Mockup

The JWS display is the visual centerpiece.

### Outer Frame

Use a metallic frame effect:

```txt
rounded-2xl
p-3
bg-gradient-to-br from-slate-200 via-slate-400 to-slate-600
shadow-xl
```

### Screen

Use dark reddish/black LED screen:

```txt
bg-[#181210]
rounded-xl
overflow-hidden
relative
```

### Dot Matrix Pattern

Use CSS background pattern:

```css
background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px);
background-size: 8px 8px;
```

### Display Elements

Include:

```txt
Large time
Running text
```

### Running Text

Use VT323 font.

Example:

```txt
UNA PROJECT • RUNNING TEXT • JAM WAKTU SHOLAT DIGITAL • CUSTOM SESUAI KEBUTUHAN •
```

Use a seamless CSS animation and disable it when the visitor prefers reduced
motion.

---

## Stats Strip

Background:

```txt
white
```

Stats:

```txt
15+     Tipe produk tersedia
100+    Masjid & mushola terlayani
GPS     Akurasi otomatis lokasi
Rp. 0   Biaya setting tambahan
```

Use:

```txt
Brand green for numbers
Gold for plus/significant accent
Muted text for label
Subtle vertical dividers on desktop
```

Mobile:

```txt
2 columns
```

Desktop:

```txt
4 columns
```

---

## Why / Keunggulan Section

### Layout

Desktop:

```txt
Left: copy and CTA
Right: 2x2 feature cards
```

Mobile:

```txt
Stacked
```

### Copy

Label:

```txt
KENAPA UNA PROJECT
```

Heading:

```txt
Dibuat khusus untuk masjid & mushola
```

Description:

```txt
Setiap produk JWS Digital dirancang agar mudah dipasang, mudah dirawat, dan tetap akurat tanpa perlu kalibrasi ulang setiap tahun.
```

Buttons:

```txt
Konsultasi Gratis
Lihat Katalog
```

### Feature Cards

Cards:

```txt
Akurasi GPS Otomatis
Setting dari Smartphone
Pilihan Auto-Murotal
Garansi & Instalasi
```

Card visual:

```txt
White background
Subtle border
Large dark-green icon box
Gold icon
Generous padding
```

---

## Product Catalog Section

### Background

```txt
#F5F6F0
```

### Header

Label:

```txt
KATALOG PRODUK
```

Heading:

```txt
Pilih tipe JWS Digital sesuai kebutuhan
```

Description:

```txt
Running text RGB hingga Android TV — berbagai ukuran dan anggaran, semua termasuk instalasi.
```

CTA:

```txt
Katalog Lengkap →
```

### Catalog Grid

Use rounded container with subtle border.

```txt
rounded-[28px]
overflow-hidden
border border-[#111A10]/10
```

Inside, use product cards.

---

## Product Card

### Structure

```txt
Thumbnail / LED preview
Body
Title
Specs
Footer
Price
Secondary price label
Circular CTA arrow
```

### Thumbnail

Background:

```txt
#0A211D
```

Add dot matrix pattern.

Top-left tag:

```txt
RGB FULL COLOR
ANDROID TV
RGB FIGURA
RGB ALUMUNIUM
SEVEN SEGMENT
LISENSI
```

Tag style:

```txt
rounded-full
border border-[#F0C875]/30
bg-white/10
text-[#F0C875]
uppercase
tracking-wider
text-[10px]
```

### LED Preview Types

#### RGB Time

Use multiple colored spans:

```txt
12 : 45
09 : 30
17 : 58
```

Colors:

```txt
Pink, Gold, Green, Blue
```

#### Single Time

Use one LED orange text:

```txt
04:15
```

#### TV

Show a mini TV outline with a clock icon.

#### Key

Show text:

```txt
KEY
```

### Card Body

Use white background.

Title:

```txt
font-heading font-bold text-[#111A10]
```

Specs:

```txt
text-sm text-[#6B7568] leading-relaxed
```

Price:

```txt
text-[#155A4C] font-heading font-extrabold text-lg
```

CTA circle:

```txt
bg-[#0A211D]
text-white
rounded-full
```

---

## Featured Product Data

Use these 6 products as catalog preview if the current product data is not ready:

```txt
1. JWS RGB P5 — 4 Panel Frame Alumunium
   Tag: RGB Full Color
   Specs: 133×20 cm · full color · setting via smartphone · akurasi GPS
   Price: Rp 2.000.000
   Secondary: + Murotal Rp 2.300.000
   Preview: 12:45 RGB

2. JWS LED TV 32" (Android / Google TV)
   Tag: Android TV
   Specs: Jam, kalender, jadwal sholat, poster & video dakwah · cocok untuk mushola kantor
   Price: Rp 3.700.000
   Secondary: Dengan STB Rp 4.100.000
   Preview: mini TV

3. JWS RGB 2 Panel — Frame Figura 100×50
   Tag: RGB Figura
   Specs: Dilengkapi poster masjid · full color · akurasi GPS · setting via smartphone
   Price: Rp 1.800.000
   Secondary: + Murotal Rp 2.100.000
   Preview: 09:30 RGB

4. JWS P5 RGB — 3 Panel Frame Alumunium
   Tag: RGB Alumunium
   Specs: 100×20 cm · jam, kalender, jadwal sholat & teks berjalan · akurasi GPS
   Price: Rp 1.800.000
   Secondary: + Murotal Rp 2.100.000
   Preview: 17:58 RGB

5. JWS Seven Segment Jumbo + Running Text
   Tag: Seven Segment
   Specs: 120×60 cm · kaca akrilik anti pecah · jam besar 2,5" · running text terpisah
   Price: Rp 3.600.000
   Secondary: + Murotal Rp 3.900.000
   Preview: 04:15 single orange

6. Lisensi Aktivasi — Android TV Anda
   Tag: Lisensi
   Specs: Sudah punya Android TV? Cukup aktivasi · berlaku seumur hidup · bonus poster & video dakwah
   Price: Rp 1.300.000
   Secondary: Sekali bayar, seumur hidup
   Preview: KEY
```

---

## Catalog More CTA

Below product cards:

```txt
Masih ada 9+ tipe lain — single color, ukuran mini, hingga frame figura khusus.
```

Button:

```txt
Minta Katalog Lengkap
```

---

## Order Steps Section

### Background

```txt
White
```

Label:

```txt
CARA PESAN
```

Heading:

```txt
Tiga langkah, tanpa ribet
```

Description:

```txt
Dari konsultasi hingga produk terpasang dan aktif di lokasi Anda.
```

Steps:

```txt
01 Konsultasi via WhatsApp
Ceritakan kebutuhan masjid atau mushola Anda — ukuran ruang, anggaran, dan fitur yang diinginkan.

02 Pilih Tipe & Ukuran
Kami bantu rekomendasikan tipe JWS yang paling sesuai, lengkap dengan rincian harga dan estimasi waktu.

03 Instalasi & Aktivasi
Tim kami pasang di lokasi, setting GPS, dan pandu hingga jamaah Anda mahir menggunakannya.
```

CTA:

```txt
Mulai Konsultasi
```

---

## Testimonials Section

### Background

```txt
#F5F6F0
```

Label:

```txt
TESTIMONI
```

Heading:

```txt
Dipercaya pengurus masjid & mushola
```

Use testimonial cards.

Example content:

```txt
Sejak pasang JWS, jadwal sholat selalu pas dan jamaah jadi lebih disiplin datang ke masjid. Settingnya pun gampang banget.

Ust. Hadi
Takmir Masjid Al-Ikhlas, Surabaya
```

```txt
Settingnya gampang banget, tinggal dari HP. Fitur auto-murotal juga bikin suasana lebih syahdu — jamaah jadi lebih tepat waktu.

Pak Joko
Pengurus Mushola Babussalam
```

```txt
Pemasangan cepat dan rapi, harganya pun ramah untuk kas masjid kami yang terbatas. Tim UNA Project sangat responsif dan profesional.

Bu Sari
Bendahara Masjid Nurul Iman
```

If these are placeholders, mark them as placeholder until real testimonials are available.

---

## Final CTA Section

### Background

```txt
#0A211D
```

Label:

```txt
SIAP PASANG SEKARANG?
```

Heading:

```txt
Pasang Jam Waktu Sholat Digital di masjid Anda hari ini
```

Description:

```txt
Konsultasi gratis — tim kami bantu pilih tipe yang paling sesuai kebutuhan dan anggaran.
```

Buttons:

```txt
Hubungi via WhatsApp
Lihat Katalog
```

---

## Footer

### Background

```txt
#060F0D
```

Footer columns:

```txt
Brand
Kontak
Navigasi
Informasi
```

Brand description:

```txt
Produsen jam waktu sholat digital untuk masjid, mushola, kantor, dan rumah — akurasi GPS, mudah disetel, garansi resmi.
```

Contact examples:

```txt
Surabaya, Jawa Timur
+62 812-3456-7890
unaprojectofficial@gmail.com
```

Navigation:

```txt
Beranda
Produk
Keunggulan
Testimoni
```

Information:

```txt
Cara Transaksi
Tutorial Penggunaan
Katalog Lengkap
Info Garansi
```

Footer bottom:

```txt
© 2026 UNA Project — Jam Waktu Sholat Digital, Temanggung
Dibuat dengan ❤ untuk UMKM Indonesia
```

Use real contact data if available. If not available, keep TODO comments or placeholders.

---

## Floating WhatsApp Button

Position:

```txt
fixed bottom-6 right-6 z-50
```

Visual:

```txt
56px circle
background #1FAE5C
white WhatsApp icon
strong green shadow
```

Accessibility:

```txt
aria-label="Hubungi UNA Project via WhatsApp"
```

---

## Icon Style

Use simple line icons.

Recommended source:

```txt
lucide-react
```

Only add the dependency if not already installed and if icons are needed.

Icon style:

```txt
stroke width around 1.5–2
gold on dark backgrounds
green on light backgrounds
```

Do not use inconsistent icon sets.

---

## Shadows and Borders

Use subtle premium shadows.

Gold CTA shadow:

```css
0 10px 28px -10px rgba(214, 164, 55, 0.60)
```

WhatsApp shadow:

```css
0 12px 30px -8px rgba(31, 174, 92, 0.65)
```

Card borders:

```css
1px solid rgba(17, 26, 16, 0.10)
```

Dark card border:

```css
1px solid rgba(255, 255, 255, 0.10)
```

---

## Animation Rules

Animations are optional.

Allowed:

* subtle hover lift on buttons/cards
* CSS marquee for running text
* gentle pulse/glow for GPS indicator
* simple LED glow

Avoid:

* heavy animation libraries
* too many scroll animations
* performance-heavy effects
* animation that makes text hard to read

If using animation, prefer CSS.

---

## Copywriting Tone

Use Indonesian.

Tone should be:

```txt
jelas
profesional
meyakinkan
tidak berlebihan
mudah dipahami pengurus masjid/mushola
```

Avoid exaggerated claims.

Good:

```txt
Akurasi GPS otomatis
Mudah diatur dari smartphone
Harga sudah termasuk instalasi
Garansi resmi produk
```

Avoid:

```txt
Nomor 1 paling hebat
Paling murah sedunia
100% pasti sempurna
```

---

## Implementation Notes

When converting the design into code:

1. Build reusable components.
2. Keep content in data files where repeated.
3. Use Tailwind utility classes.
4. Keep layouts responsive.
5. Do not copy the reference code as absolute-positioned inline style.
6. Use CSS variables for repeated colors if helpful.
7. Keep the homepage understandable for a beginner developer.
8. Comment only when it explains non-obvious visual tricks.

---

## Minimum Acceptance Criteria

The redesign is acceptable when:

* Header matches the dark green/gold visual direction.
* Hero has strong headline, CTA, and JWS display mockup.
* Product catalog uses LED-style product cards.
* Murotal section uses dark feature styling.
* Steps and testimonials are clean and readable.
* Footer feels complete.
* WhatsApp CTA is visible and reusable.
* Mobile layout is usable.
* `npm run lint` passes.
* `npm run build` passes.
* Code remains understandable for a learning project.
