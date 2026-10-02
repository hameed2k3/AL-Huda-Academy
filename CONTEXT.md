# Workspace Context: AL-HUDA QURAN ACADEMY

## Core Brand & Information
- **Product Name**: `AL-HUDA QURAN ACADEMY`
- **Tagline**: Authentic Quranic & Islamic Studies Online
- **Design Language**: Serene Islamic Aesthetic (Warm Ivory `#FFFBF4`, Emerald Green `#0f5132` / `#103D33`, Soft Gold `#c9a227`).

## Tech Stack
- **Framework**: Next.js 15 (App Router, TypeScript, Server Actions / Route Handlers)
- **Styling**: Tailwind CSS v4, Lucide Icons, Framer Motion
- **Database**: MongoDB Atlas (`al_huda_quran_academy`) via native `mongodb` driver
- **Authentication**: HTTP-Only Cookie Sessions (Admin & Student roles)
- **Document Generation**: `pdf-lib` and `qrcode` for PDF Certificates

## Architecture Overview
- `app/(public)`: Public marketing site (`/`, `/about`, `/courses`, `/contact`, `/privacy`, `/terms`, `/verify`)
- `app/admin`: Protected Admin Portal (`/admin/dashboard`, `/admin/students`, `/admin/courses`, `/admin/certificates`, `/admin/duas`, `/admin/dhikrs`)
- `app/student`: Protected Student Portal (`/student/dashboard`, `/student/history`, `/student/courses`, `/student/certificates`)
- `lib/`: Repository layer (`admin-repository.ts`, `ibadah-repository.ts`, `mongodb.ts`)
- `tasks/`: Task breakdown files for each implementation phase

## Phase Roadmap
- **Phase 1**: Mobile Application Experience & Responsiveness Overhaul (Drawer Navigation, Touch Targets, Bottom App Bar)
- **Phase 2**: Production Hardening & Database Security (Indexes, Rate Limiting, Cookie Expiry)
- **Phase 3**: Student Ibadah Analytics & Streak Tracking (Visual Charts, Streak Badges)
- **Phase 4**: Automated Notifications & Batch Operations (Email/WhatsApp Alerts, CSV Import)
- **Phase 5**: SEO, Performance & Production Vercel Deployment
