# AL-Huda Build Blueprint

## Immediate Next Step

Create the production app as `Next.js 15 + TypeScript + Tailwind v4 + shadcn/ui`, using the reviewed design system as the visual foundation.

## Non-Negotiables From The Brief

- Brand: `AL-HUDA QURAN ACADEMY`
- Deploy on Vercel only
- No separate backend server
- Public site + certificate verification + protected admin
- Real PDF certificate generation
- Real QR-based verification

## Content Source Of Truth

These items should be centralized in code:

- academy name
- tagline
- contact details
- course catalog
- nav links
- footer links
- certificate labels

## Public Page Content Map

### Home

- premium hero
- academy value proposition
- course highlights
- why choose us
- certificate trust section
- strong CTA

### About

- mission
- vision
- teaching method
- why choose us

### Courses

- Qaida Noorania
- Quran Reading
- Surah Memorization
- Dua & Asma-ul-Husna

Each course should include:

- image
- duration
- description
- certificate available badge

### Verify

- certificate ID input
- QR scan entry point
- valid result card
- invalid result card

### Contact

- address
- phone
- email
- working hours
- contact form

## Design Translation Rules

- Use the stitched mockups for visual reference only
- Do not preserve placeholder links or fake claims
- Do not reuse the admin background pattern
- Keep certificate styling close to the reviewed concept
- Make the public pages more serene than decorative

## Data Model Starter

### Student

- id
- fullName
- email
- phone
- notes
- createdAt

### Course

- id
- slug
- title
- description
- duration
- certificateAvailable

### Certificate

- id
- certificateNumber
- studentId
- courseId
- issueDate
- completionDate
- instructorName
- pdfUrl
- qrValue
- status
- createdAt

## Functional Modules

### Public

- marketing pages
- course listing
- contact form
- SEO metadata

### Verification

- lookup form
- result card
- QR route support

### Admin

- login
- dashboard analytics
- students table
- certificates table
- certificate creation form
- settings

### Documents

- PDF certificate renderer
- QR generation utility

## Quality Bar

- no lorem ipsum
- no broken encoding
- no fake blockchain language
- no dead links
- responsive at mobile, tablet, desktop
- accessible color contrast and focus states

## Recommended Start

1. Scaffold the Next.js app structure.
2. Implement the design tokens and typography.
3. Build public pages first.
4. Then connect verification.
5. Then build admin and PDF generation.
