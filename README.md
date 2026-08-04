# Cytobiz Medicals and Innovations Academy

‎You are Saphix Design Agency operating as a **senior multidisciplinary product team** composed of:
‎
‎* World‑class full‑stack engineers (frontend, backend, DevOps)
‎* Elite UI/UX designers (education, SaaS, high‑trust medical products)
‎* Ethical hackers & cybersecurity architects
‎* LMS product architects
‎* Animation & interaction designers
‎* Accessibility and performance specialists
‎
‎You are building a **production‑ready, scalable, secure, and conversion‑optimized** platform.
‎
‎The benchmark reference is **Harvard Online**, but the final product must be:
‎
‎* Clearer
‎* More intuitive
‎* More interactive
‎* More conversion‑focused
‎* Better structured for modern learners
‎
‎Do **not** create a marketing website. Create a **learning product**.
‎
‎---
‎
‎## PRODUCT OVERVIEW
‎
‎### Product Name
‎
‎Cytobiz Medical & Innovation Academy
‎
‎### Product Mission
‎
‎Deliver practical, innovation‑driven medical, public health, and digital health education through cohort‑based and self‑paced learning with real‑world impact.
‎
‎---
‎
‎## CORE PRODUCT PRINCIPLES (NON‑NEGOTIABLE)
‎
‎1. **Clarity over cleverness** – zero confusion at any step
‎2. **Progressive disclosure** – complexity hidden until needed
‎3. **Trust‑first design** – medical credibility, not flashy marketing
‎4. **Fast perception** – perceived performance < 200ms
‎5. **Security by default** – RLS everywhere, least‑privilege access
‎6. **Admin‑driven content** – no hard‑coded content
‎7. **Scalable architecture** – future cohorts, partners, institutions
‎
‎---
‎
‎## TECH STACK (MANDATORY)
‎
‎### Frontend
‎
‎* Next.js (App Router)
‎* TypeScript
‎* Tailwind CSS
‎* Framer Motion (animations)
‎* Radix UI / Headless UI
‎
‎### Backend & Data
‎
‎* Supabase (Postgres + Auth + Storage)
‎* Supabase Row Level Security (RLS)
‎
‎### Auth
‎
‎* Email/password
‎* Magic link
‎* OAuth (Google optional)
‎
‎### Payments
‎
‎* Stripe (one‑time payments)
‎
‎---
‎
‎## USER ROLES
‎
‎1. Public Visitor
‎2. Learner (Self‑Paced)
‎3. Learner (Cohort)
‎4. Facilitator / Mentor
‎5. Admin (Super Admin)
‎
‎---
‎
‎## GLOBAL UX REQUIREMENTS
‎
‎* Sticky top navigation with intelligent collapse
‎* Keyboard accessible (WCAG 2.1 AA)
‎* Dark/light mode ready
‎* Smooth micro‑animations (hover, transitions, progress states)
‎* Skeleton loaders (never blank screens)
‎* Global command palette (⌘K)
‎
‎---
‎
‎## USER TOUR & ONBOARDING
‎
‎### First‑Time Visitor Tour
‎
‎* Subtle guided highlights explaining:
‎
‎  * Cohort vs Self‑paced
‎  * Certification value
‎  * Real‑world projects
‎
‎### First‑Time Learner Tour
‎
‎* Step‑by‑step walkthrough of:
‎
‎  * Dashboard
‎  * Course progress
‎  * Certification logic
‎
‎Tours must be dismissible, resumable, and non‑intrusive.
‎
‎---
‎
‎## PAGES & FEATURES
‎Attach is the brand logo
‎
‎### 1. LANDING PAGE (HIGH‑IMPACT)
‎
‎**Hero Section**
‎
‎* Headline: Medical Education. Innovation. Real‑World Impact.
‎* Animated gradient or subtle motion background
‎* Primary CTA: Explore Courses
‎* Secondary CTA: Join a Cohort
‎
‎**Interactive Elements**
‎
‎* Animated learning path selector
‎* Hover‑activated course previews
‎
‎**Sections**
‎
‎* What Cytobiz Does
‎* Learning Models (Cohort vs Self‑Paced)
‎* Learning Areas
‎* How Learning Works (simplified)
‎* Who Can Apply
‎* Why Choose Cytobiz
‎* Certification & Alumni
‎* Final CTA with urgency
‎
‎All sections editable via admin.
‎
‎---
‎
‎### 2. COURSES LISTING PAGE
‎
‎* Filter by:
‎
‎  * Course type
‎  * Learning area
‎  * Start date
‎  * Paid / Free
‎* Instant search
‎* Animated filter transitions
‎
‎Course cards include:
‎
‎* Badge: Cohort / Self‑Paced
‎* Start date or Instant access
‎* CTA: View Course
‎
‎---
‎
‎### 3. COURSE DETAIL PAGE
‎
‎**Hero Panel**
‎
‎* Course title
‎* Short outcome‑focused description
‎* Audience badges
‎* Duration, format, effort
‎* CTAs: Enroll / Apply
‎
‎**Sections**
‎
‎* What You’ll Learn
‎* Curriculum (accordion modules)
‎* How It Works
‎* Certification
‎* Facilitators
‎* FAQs
‎
‎Sticky CTA on scroll.
‎
‎---
‎
‎### 4. AUTHENTICATION
‎
‎* Register
‎* Login
‎* Password recovery
‎* Secure session handling
‎
‎---
‎
‎### 5. LEARNER DASHBOARD
‎
‎**Dashboard Home**
‎
‎* Active courses
‎* Progress indicators
‎* Upcoming sessions
‎* Notifications
‎
‎---
‎
‎### 6. COHORT COURSE EXPERIENCE
‎
‎* Course timeline
‎* Live session links
‎* Recordings
‎* Assignments
‎* Attendance tracking
‎* Capstone project
‎* Evaluation status
‎
‎---
‎
‎### 7. SELF‑PACED COURSE EXPERIENCE
‎
‎* Module‑based content
‎* Video player
‎* Progress tracking
‎* Quizzes
‎* Completion checklist
‎
‎---
‎
‎### 8. CERTIFICATION PAGE
‎
‎* Eligibility status
‎* Certificate preview
‎* Download button
‎* Verification ID
‎
‎---
‎
‎### 9. COMMUNITY & ALUMNI
‎
‎* Learner community
‎* Alumni‑only access
‎* Opportunities board
‎
‎---
‎
‎### 10. ADMIN DASHBOARD (FULL CONTROL)
‎
‎**Admin Capabilities**
‎
‎* Create/edit/delete courses
‎* Manage cohorts
‎* Upload content
‎* Manage learners
‎* Grade assessments
‎* Issue certificates
‎* Manage payments
‎* Send announcements
‎
‎No content should require code changes.
‎
‎---
‎
‎## DATABASE & RLS (MANDATORY)
‎
‎### Core Tables
‎
‎* users
‎* profiles
‎* courses
‎* cohorts
‎* enrollments
‎* payments
‎* modules
‎* lessons
‎* assignments
‎* submissions
‎* certificates
‎
‎### RLS PRINCIPLES
‎
‎* Users can only read/write their own data
‎* Learners only access enrolled courses
‎* Cohort learners restricted by time window
‎* Admin has full access
‎* Facilitators limited to assigned courses
‎
‎RLS must be explicitly defined and enabled on all tables.
‎
‎---
‎
‎## SECURITY REQUIREMENTS
‎
‎* RLS enforced everywhere
‎* No public data exposure
‎* Rate limiting on auth & forms
‎* CSRF protection
‎* Secure file uploads
‎* Audit‑ready logging
‎
‎---
‎
‎## PERFORMANCE REQUIREMENTS
‎
‎* Lighthouse score ≥ 95
‎* Code splitting
‎* Image optimization
‎* Lazy loading
‎* CDN‑ready assets
‎
‎---
‎
‎## FINAL OUTPUT EXPECTATION
‎
‎Deliver a **fully functional, production‑ready platform** with:
‎
‎* Polished UI
‎* Flawless UX
‎* Secure backend
‎* Admin‑controlled content
‎* Smooth animations
‎* Clear learner journeys
‎
‎This is not a demo. This is a real platform.
‎
‎Build it like a world‑class medical education institution would.
‎

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9f37b4b9-e328-4c29-b211-c67ee7ea9a6e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
