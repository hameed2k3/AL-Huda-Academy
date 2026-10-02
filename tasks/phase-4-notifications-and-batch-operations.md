# Task Breakdown: Phase 4 - Automated Notifications & Batch Operations

## Overview
Implement automated student/parent notification workflows upon certificate completion and bulk data management tools for admins.

## Sub-Tasks

- [ ] **4.1 Certificate Issue Email / WhatsApp Dispatcher**
  - Integrate email trigger (e.g. Resend or Nodemailer) when admin generates a certificate.
  - Send direct PDF download & verification link to student/guardian email.

- [ ] **4.2 CSV Bulk Student Registration (`components/admin-bulk-import.tsx`)**
  - Provide CSV upload modal in `/admin/students`.
  - Validate rows (fullName, email, phone, courseId) and bulk upsert to MongoDB.

- [ ] **4.3 Bulk Certificate Issuance**
  - Allow admin to select multiple completed students and trigger batch certificate generation.

## Status
- **State**: Pending
