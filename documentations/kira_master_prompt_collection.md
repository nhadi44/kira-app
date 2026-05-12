# KIRA — MASTER PROMPT COLLECTION

## PRODUCT OVERVIEW

KIRA adalah AI-powered Security Copilot untuk membantu developer dan perusahaan melakukan audit keamanan awal secara cepat, explainable, dan lebih terjangkau.

KIRA bukan pengganti penetration testing profesional.
KIRA membantu:
- meningkatkan awareness cybersecurity
- mengurangi barrier audit keamanan
- membantu tim kecil melakukan security review awal
- menyediakan baseline sebelum pentest profesional dilakukan

Core principles:
- enterprise-grade UX
- explainable AI
- privacy-first architecture
- security-by-design
- premium SaaS aesthetic

---

# 01_SYSTEM_ARCHITECTURE_PROMPT.md

# SYSTEM ROLE: PRINCIPAL SECURITY ARCHITECT

You are a Principal Full-Stack Engineer, Security Consultant, and SaaS Architect tasked with building "KIRA", an enterprise-grade AI-powered security auditing platform.

The application MUST feel like premium internal enterprise software:
- clean
- minimal
- functional
- serious
- production-ready

Avoid generic AI-template aesthetics.

You are expected to generate:
- maintainable architecture
- secure backend logic
- strict typing
- production-ready code
- scalable folder structures
- deterministic AI integrations

Never generate placeholder code unless explicitly marked TODO.

---

# DESIGN SYSTEM — OBSIDIAN SLATE

## Core Palette
- Background: Zinc-950 (#09090b)
- Surface: Zinc-900 (#18181b)
- Border: Zinc-800 (#27272a)

## Semantic Colors
- Safe: Emerald-500 (#10b981)
- Warning: Amber-500 (#f59e0b)
- Vulnerable: Rose-500 (#e11d48)

## Typography
- UI: Inter
- Code: JetBrains Mono

## UI PRINCIPLES
- Large whitespace
- Soft borders
- Minimal shadows
- No neon
- No glowing gradients
- No glassmorphism abuse
- Dense information hierarchy
- Enterprise dashboard aesthetic

Animations must be subtle and purposeful.

---

# TECH STACK

## Framework
- Next.js 15 App Router
- TypeScript strict mode

## Authentication
- Clerk

## Database
- PostgreSQL
- Prisma ORM

## Validation
- Zod

## AI
- Gemini 1.5 Pro

## Styling
- Tailwind CSS
- Shadcn UI

## Animation
- Framer Motion

## PDF
- react-pdf

---

# ARCHITECTURE RULES

Use production-grade folder structure:

/app
  /(marketing)
  /dashboard
  /api

/actions
/components
/lib
/hooks
/types
/prisma

Rules:
- Server Actions only inside `/actions`
- Prisma singleton inside `/lib/prisma.ts`
- Gemini client inside `/lib/gemini.ts`
- Validation schemas inside `/lib/validations`
- Shared types inside `/types`
- Never mix server/client responsibilities
- Prefer Server Components by default
- Use Client Components only when interactivity is required

---

# SECURITY REQUIREMENTS

This is a security platform.
Code quality and security are mandatory.

You MUST:
- Validate all input with Zod
- Sanitize code snippets before persistence
- Prevent prompt injection attempts
- Limit code input size to 50KB
- Validate Gemini responses with schema parsing
- Never trust AI responses directly
- Prevent users from accessing reports belonging to others
- Implement rate limiting for audit requests
- Escape dangerous markdown content
- Prevent XSS from rendered findings
- Validate remediation snippets before rendering

Block dangerous remediation suggestions:
- eval()
- exec()
- child_process
- shell execution
- disabling authentication
- insecure bypasses

---

# PERFORMANCE RULES

- Prefer React Server Components
- Minimize client-side state
- Use Suspense where appropriate
- Avoid unnecessary re-renders
- Paginate history tables
- Lazy-load heavy UI
- Optimize Prisma queries
- Prevent overfetching

---

# OBSERVABILITY

Implement structured logging for:
- Audit creation
- Gemini failures
- Unauthorized access
- PDF export failures

Include:
- request IDs
- timestamps
- user IDs

Prepare architecture for Sentry-compatible monitoring.

---

# PROBLEM BACKGROUND

Many small and medium-sized companies struggle to perform regular security audits due to:
- expensive penetration testing costs
- lack of internal security expertise
- low cybersecurity awareness
- delayed security reviews until incidents occur

KIRA is designed as an AI-powered first-line security auditing platform that helps developers and organizations perform early-stage security analysis before engaging professional penetration testing services.

The goal is not to replace security professionals, but to:
- improve security awareness
- reduce initial audit barriers
- provide actionable vulnerability insights
- help teams identify potential risks earlier

---

# 02_LANDING_PAGE_AND_UPLOAD_SCAN.md

# PHASE 6 — LANDING PAGE, AUTH EXPERIENCE & PROJECT SCANNING

Expand KIRA into a complete AI-powered security auditing platform with onboarding, authentication flows, and full project scanning capabilities.

The experience MUST feel like:
- premium enterprise SaaS
- security-focused
- minimal
- serious
- trustworthy
- not AI-template generated

Maintain the established Obsidian Slate design system.

---

# PRODUCT POSITIONING

KIRA is NOT a penetration testing replacement.

KIRA is:
- an AI Security Copilot
- an early-stage security awareness platform
- a developer-first auditing assistant
- accessible cybersecurity tooling for modern teams

Core mission:
Help developers and organizations identify security risks earlier before engaging professional security audits.

---

# LANDING PAGE EXPERIENCE

Create a premium marketing landing page under:

`/`

The landing page MUST feel polished, modern, and enterprise-grade.

Avoid:
- excessive gradients
- generic AI hero sections
- glowing effects
- stock AI aesthetics

Use:
- large whitespace
- subtle motion
- zinc surfaces
- professional typography
- clean hierarchy

---

# LANDING PAGE STRUCTURE

## HERO SECTION

Requirements:
- strong product headline
- concise value proposition
- enterprise security aesthetic
- subtle animated background grid
- code/security inspired visual

Headline example tone:
"AI Security Intelligence for Modern Development Teams"

Subheadline:
"KIRA helps teams perform early-stage security audits faster, more affordably, and with explainable AI insights."

Primary CTA:
- Start Audit

Secondary CTA:
- View Demo Report

Hero visuals:
- security findings panel
- integrity score
- remediation preview
- code audit visualization

Use subtle Framer Motion animations only.

---

# FULL PROJECT DEEP SCAN

Upgrade KIRA from code snippet scanning into project-level auditing.

## PROJECT UPLOAD WORKSPACE

Route:
`/dashboard/new-scan`

Requirements:
- drag-and-drop upload
- upload progress indicator
- support:
  - .zip
  - .rar
  - .tar.gz

UI should resemble:
- secure upload portal
- enterprise document intake system

Display:
- project size
- file count
- scan readiness status

---

# FILE PROCESSING PIPELINE

Requirements:
- securely extract uploaded archive
- reject dangerous files
- limit upload size
- sanitize filenames
- prevent path traversal attacks
- ignore binary/non-source files
- scan recursively

Supported scan targets:
- JavaScript
- TypeScript
- PHP
- Java
- Python
- Go
- configuration files
- .env exposure
- package manifests

---

# DEEP SCAN ENGINE

KIRA must:
- analyze project structure
- inspect dependencies
- detect insecure configs
- identify hardcoded secrets
- detect risky patterns
- inspect auth flows
- identify exposed tokens
- analyze environment configs

AI scan should aggregate findings across multiple files.

---

# SCAN MODES

Implement:

## Quick Scan
- lightweight analysis
- faster result

## Deep Scan
- recursive project analysis
- dependency inspection
- multi-file context analysis

---

# REPORT EXPERIENCE UPGRADE

Each report should include:

## Project Metadata
- project name
- total files scanned
- scan duration
- scan mode
- generated timestamp

## Integrity Score
Weighted based on:
- severity
- exposure risk
- vulnerability count

## Vulnerability Timeline
Show categorized findings:
- Critical
- High
- Medium
- Low

## File References
Each finding must include:
- filename
- approximate line number
- affected module

---

# AI Explainability Layer

Provide:
- technical explanation
- beginner explanation
- business impact explanation

Toggleable tabs:
- Developer
- Beginner
- Business

---

# 03_PRIVACY_AND_TERMS.md

# PRIVACY, DATA HANDLING & TERMS COMPLIANCE

KIRA is a security-focused platform.
User trust and data privacy are critical product principles.

Implement a transparent privacy and data handling policy across the application.

---

# CORE PRIVACY PRINCIPLE

KIRA MUST NEVER permanently store uploaded source code, extracted project files, or proprietary application contents.

KIRA ONLY stores:
- user authentication data
- audit metadata
- vulnerability findings
- integrity scores
- report summaries
- timestamps

Raw source code must remain ephemeral.

---

# REQUIRED DATA POLICY

## SOURCE CODE HANDLING

Uploaded files and extracted project contents:
- must only exist temporarily during scan processing
- must never be persisted permanently in the database
- must never be publicly accessible
- must never be reused for AI training
- must never be shared with third parties

After scan completion:
- automatically delete uploaded archives
- automatically delete extracted temporary files
- clear temporary scan workspace securely

Retention window:
- immediate deletion after processing completion
- optional short-lived temporary retention ONLY during active scan session

---

# DATABASE RESTRICTIONS

The database MUST NOT store:
- raw uploaded source code
- extracted project files
- secrets/API keys
- proprietary business logic
- uploaded archives

The database MAY store:
- audit summary
- sanitized findings
- integrity score
- scan metadata
- report references
- timestamps
- user account references

---

# PRIVACY NOTICE

Create dedicated pages:

- /privacy
- /terms

Both pages must match KIRA's enterprise design system.

---

# TERMS & CONDITIONS PAGE

Create enterprise-style Terms & Conditions.

Clearly state:

## KIRA Limitations
- KIRA is an AI-assisted auditing platform
- KIRA does not guarantee complete vulnerability detection
- KIRA is not a replacement for professional penetration testing
- users remain responsible for production security validation

## Liability Disclaimer
- findings are advisory
- users should validate remediation independently
- professional security review is recommended for critical systems

## Data Handling
- uploaded code is processed temporarily
- source code is automatically deleted after scan completion
- KIRA does not claim ownership of uploaded code

---

# TRUST & TRANSPARENCY UX

Add privacy assurance messaging throughout upload workflows.

Examples:
- "Your source code is never permanently stored."
- "Uploaded files are automatically deleted after processing."
- "KIRA only stores audit summaries and findings metadata."

Display these notices:
- upload page
- onboarding flow
- scan confirmation modal

---

# 04_PRODUCT_POSITIONING.md

# PRODUCT NARRATIVE

KIRA adalah AI Security Copilot yang membantu developer dan perusahaan melakukan audit keamanan awal secara cepat, mudah dipahami, dan lebih terjangkau menggunakan AI.

KIRA tidak menggantikan pentester profesional.
KIRA membantu organisasi membangun security awareness lebih awal sebelum proses penetration testing lanjutan dilakukan.

---

# TARGET AUDIENCE

Primary audience:
- startup teams
- UMKM digital
- small-medium companies
- freelance developers
- companies without dedicated security engineers
- engineering teams with limited security budget

---

# CORE VALUE PROPOSITION

KIRA membantu:
- mengurangi barrier audit keamanan
- mempercepat awareness security
- memberikan explainable vulnerability insights
- membantu audit awal sebelum professional pentest
- mempercepat remediation workflow

---

# DIFFERENTIATION

Unlike traditional security tools, KIRA focuses on:
- accessibility-first security
- explainable AI findings
- beginner-friendly explanations
- business impact awareness
- remediation preview diffs
- enterprise-grade UX simplicity

---

# DEMO FLOW

1. User uploads vulnerable project
2. KIRA performs AI deep scan
3. Integrity score generated
4. Vulnerabilities categorized
5. Remediation previews displayed
6. Business impact explained
7. Exportable professional report generated

---

# UX KEYWORDS

The platform must feel:
- premium
- intentional
- trustworthy
- clean
- serious
- security-focused
- enterprise-grade
- human-designed

Avoid:
- AI gimmicks
- glowing neon visuals
- generic dashboards
- template aesthetics
- cluttered interfaces

---

# TAGLINES

Suggested branding:

- KIRA — AI Security Intelligence for Modern Teams
- Ship Faster. Audit Smarter.
- Early Security Awareness Powered by AI
- Understand Risk Before It Becomes a Breach

---

# FINAL IMPLEMENTATION RULES

For every implementation:
1. Show folder/file structure first
2. Explain architecture decisions briefly
3. Generate complete production-ready code
4. Include strict typing
5. Include validation schemas
6. Include loading and error states
7. Include security protections
8. Never generate pseudo-code

All code must:
- build successfully
- follow TypeScript strict mode
- avoid any type
- avoid placeholder logic
- follow enterprise SaaS standards
- follow security-by-design principles
