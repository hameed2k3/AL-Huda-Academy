# MongoDB + Vercel Plan

## Cluster Check

On July 18, 2026, I tested the provided MongoDB Atlas URI from the app runtime.

Result:

- Cluster ping: successful
- Visible databases: `sample_mflix`, `test`, `admin`, `local`

This confirms the cluster is reachable and can be used from a Next.js app.

## Current Reality

The app is not using MongoDB yet.

The current admin storage method is:

- browser `localStorage`

That is why the app has behaved like a client-only demo rather than a true shared database-backed admin system.

## Recommended Production Architecture

Use:

- Next.js frontend
- Next.js Route Handlers in `app/api/`
- MongoDB Atlas
- Vercel hosting

Do not use:

- a separate Express server
- a separate backend deployment

This keeps the architecture simple and Vercel-friendly.

## Why This Fits Your Requirement

You asked for:

- simple frontend
- API included in the app
- no complex backend
- hosting on Vercel

This stack gives exactly that:

- frontend pages in `app/`
- API routes in `app/api/`
- DB logic in `lib/`
- one deployment on Vercel

## Security Note

The MongoDB credentials were shared in chat.

Before production:

1. Rotate the password in Atlas.
2. Create a dedicated app user with only the permissions your app needs.
3. Save the new values only in Vercel environment variables and `.env.local`.

## Recommended Environment Variables

- `MONGODB_URI`
- `MONGODB_DB_NAME`

Suggested database name:

- `al_huda_quran_academy`

## Recommended Collections

### `students`

- `_id`
- `fullName`
- `guardianName`
- `email`
- `phone`
- `courseId`
- `status`
- `instructorName`
- `createdAt`
- `completedAt`
- `certificateId`

### `courses`

- `_id`
- `title`
- `duration`
- `description`
- `certificateAvailable`
- `createdAt`

### `certificates`

- `_id`
- `certificateNumber`
- `studentId`
- `studentName`
- `courseId`
- `courseTitle`
- `issueDate`
- `completionDate`
- `instructorName`
- `grade`
- `generatedAt`

## Simple API Plan

### Courses

- `GET /api/admin/courses`
- `POST /api/admin/courses`
- `PATCH /api/admin/courses/[id]`
- `DELETE /api/admin/courses/[id]`

### Students

- `GET /api/admin/students`
- `POST /api/admin/students`
- `PATCH /api/admin/students/[id]`
- `DELETE /api/admin/students/[id]`

### Completion Flow

- `POST /api/admin/students/[id]/complete`

This route should:

- mark the student as completed
- generate a certificate record
- return the certificate payload

### Verification

- `GET /api/verify?certificate=AHQA-2026-0001`

### Certificate Download

- `GET /api/certificates/[certificateNumber]`

## Vercel Hosting Plan

### In Vercel Project Settings

Add:

- `MONGODB_URI`
- `MONGODB_DB_NAME`

### Deployment Model

- pages and UI render from Next.js
- API runs as Vercel serverless functions
- MongoDB Atlas stores the real shared data

No separate backend hosting is needed.

## Recommended Next Step

Replace the current `localStorage` admin store with:

1. Mongo connection helper
2. collection helpers
3. admin CRUD API routes
4. frontend fetch/mutation integration
5. certificate and verification lookup against MongoDB

## Final Recommendation

Yes, this cluster can be used.

The simplest production setup is:

- Next.js on Vercel
- MongoDB Atlas as the database
- built-in Next.js API routes instead of a separate backend server
