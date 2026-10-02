# NovaInvoice Implementation Plan

## Overview
NovaInvoice is a modern, self-hostable invoicing and small-business finance platform designed for freelancers, agencies, and small businesses. It allows users to create invoices, manage customers and products, track payments, generate PDFs, and operate multiple businesses from a single account. 

Based on our Socratic Gate, we will implement forced organization onboarding, cryptographically random tokens for public invoices (with rate limiting), soft deletes for data retention, and synchronous cron endpoints for MVP automations.

## Project Type
WEB

## Success Criteria
- [ ] Users can sign up and create an organization.
- [ ] Users can perform CRUD operations on customers and products.
- [ ] Users can create, send, and manage invoices and estimates.
- [ ] Public invoice links are accessible via secure token.
- [ ] Payments can be recorded and tracked.
- [ ] Invoices can be downloaded as PDFs.
- [ ] Row Level Security (RLS) restricts access exclusively to organization members.

## Tech Stack
- **Frontend Framework**: Next.js (App Router) + React
- **Styling**: Tailwind CSS + shadcn/ui + Framer Motion
- **Database & Auth**: Supabase (PostgreSQL, Auth, RLS)
- **Forms & Validation**: React Hook Form + Zod
- **Storage**: Supabase Storage (for avatars, logos, PDFs, attachments)
- **Deployment**: Vercel
- **Email & PDF**: Resend/Postmark-compatible API + server-side PDF generation

## File Structure
```text
/
├── app/                  # Next.js App Router pages and API routes
│   ├── (auth)/           # Login, signup, onboarding
│   ├── (dashboard)/      # Protected dashboard routes (invoices, customers, etc.)
│   ├── public/           # Public-facing invoice views
│   └── api/              # API routes and webhooks
├── components/           # Reusable React components (shadcn/ui + custom)
├── lib/                  # Utilities, Supabase client, helpers
├── supabase/
│   ├── migrations/       # SQL schema and RLS policies
│   └── seed.sql          # Seed data
├── types/                # TypeScript types/interfaces
└── public/               # Static assets
```

## Task Breakdown

### Task 1: Project Initialization & UI Foundation
- **Agent**: `frontend-specialist`
- **Skills**: `frontend-design`, `clean-code`
- **INPUT**: Empty directory.
- **OUTPUT**: Next.js app scaffolded with Tailwind, shadcn/ui, and standard directory structure.
- **VERIFY**: `npm run dev` starts successfully and displays the default page.

### Task 2: Supabase Schema & RLS Setup
- **Agent**: `database-architect`
- **Skills**: `database-design`, `clean-code`
- **INPUT**: Schema requirements from PRD (profiles, organizations, customers, invoices, etc.).
- **OUTPUT**: Supabase migration files creating the tables, relationships, soft-delete columns, and comprehensive Row Level Security (RLS) policies.
- **VERIFY**: Migrations can be applied locally (`supabase start` or local postgres) and RLS prevents unauthorized access.

### Task 3: Authentication & Onboarding Flow
- **Agent**: `frontend-specialist`
- **Skills**: `clean-code`
- **INPUT**: Next.js app and Supabase Auth.
- **OUTPUT**: Sign up/Login pages, and an onboarding flow that forces new users to create their first Organization before accessing the dashboard.
- **VERIFY**: A new user can register, create an organization, and be redirected to the dashboard.

### Task 4: Core CRUD (Customers & Products)
- **Agent**: `frontend-specialist`
- **Skills**: `clean-code`
- **INPUT**: Authenticated dashboard layout.
- **OUTPUT**: Pages and forms (React Hook Form + Zod) for managing Customers and Products/Services.
- **VERIFY**: Users can create, read, update, and soft-delete customers and products.

### Task 5: Invoice & Estimate Engine
- **Agent**: `frontend-specialist`
- **Skills**: `frontend-design`, `clean-code`
- **INPUT**: Customers and Products features.
- **OUTPUT**: Complex three-column invoice editor, line-item calculations (subtotal, taxes, discounts), and status transitions (Draft → Sent → Paid).
- **VERIFY**: An invoice can be created with multiple line items, saved to the database, and totals calculate correctly.

### Task 6: Public Invoice View & PDF Generation
- **Agent**: `backend-specialist`
- **Skills**: `api-patterns`, `clean-code`
- **INPUT**: Saved invoices.
- **OUTPUT**: `/public/invoice/[token]` route for read-only public access, plus a server-side function/API route to generate a PDF of the invoice.
- **VERIFY**: Navigating to the public link shows the invoice. Clicking "Download PDF" returns a valid PDF file.

### Task 7: Payments & Automations
- **Agent**: `backend-specialist`
- **Skills**: `api-patterns`, `clean-code`
- **INPUT**: Paid invoice capabilities.
- **OUTPUT**: Integration for recording manual payments, a webhook endpoint for Stripe/Razorpay, and Vercel Cron API endpoints for overdue detection.
- **VERIFY**: A mock cron request correctly identifies overdue invoices and updates their status/logs an event.

## Phase X: Verification (Final Checklist)
- [ ] **Lint**: Run `npm run lint` and `npx tsc --noEmit`. Must pass without errors.
- [ ] **Security**: Run `python .agents/skills/vulnerability-scanner/scripts/security_scan.py .`. No critical issues.
- [ ] **Build**: Run `npm run build`. Must compile successfully.
- [ ] **UX & Accessibility**: Run `python .agents/skills/frontend-design/scripts/ux_audit.py .`.
- [ ] **Final Compliance Check**: No prohibited CSS colors (purple/violet), Socratic gate respected, all requirements met.
