# Task Breakdown: Phase 2 - Production Hardening & Database Security

## Overview
Harden MongoDB schemas, indexes, session security, and environment configuration for production readiness on Vercel.

## Sub-Tasks

- [ ] **2.1 MongoDB Indexing Scripts (`lib/mongodb-indexes.ts`)**
  - Create index helper to enforce unique indexes on `certificateNumber` in `certificates` collection.
  - Create unique index on `email` and `phone` in `students` collection.
  - Create compound index on `studentId + date` in `daily_logs` collection.

- [ ] **2.2 Auth Session Hardening & Rate Limiting**
  - Implement rate limiting (e.g. 5 failed attempts per minute) on `/api/admin/auth/login` and `/api/student/auth/login`.
  - Set strict cookie expiration (`SameSite=Lax`, `Secure` in production).

- [ ] **2.3 Production Environment Config Verification**
  - Verify `.env.example` vs `.env.local` schema.
  - Configure fallback error handlers for database connection drops.

## Status
- **State**: Pending (Queued after Phase 1)
