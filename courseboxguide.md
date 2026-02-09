# Coursebox AI Integration Guide

> A comprehensive step-by-step guide for integrating Coursebox AI with the Cytobiz Medical & Innovation Academy LMS platform.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Integration Options](#2-integration-options)
3. [Option A: LTI 1.3 Integration (Recommended)](#3-option-a-lti-13-integration)
4. [Option B: SCORM Export/Import](#4-option-b-scorm-exportimport)
5. [Option C: Zapier Automation](#5-option-c-zapier-automation)
6. [Option D: WordPress Plugin](#6-option-d-wordpress-plugin)
7. [Option E: Open API / REST API](#7-option-e-open-api--rest-api)
8. [Enrollment Sync via Zapier Webhooks](#8-enrollment-sync-via-zapier-webhooks)
9. [AI-Powered Course Creation Workflow](#9-ai-powered-course-creation-workflow)
10. [Architecture Recommendations](#10-architecture-recommendations)
11. [Security Considerations](#11-security-considerations)
12. [References](#12-references)

---

## 1. Overview

**Coursebox AI** is an AI-driven Learning Management System that enables rapid course creation, AI-powered quizzes, automated grading, and AI tutoring. Integrating Coursebox with our platform allows us to:

- **Author courses with AI** — Convert documents, videos, and URLs into structured courses automatically.
- **Export SCORM packages** — Package Coursebox-authored content for import into our custom LMS.
- **Sync enrollments** — Automatically enroll learners in Coursebox when they enroll on our platform (and vice versa).
- **Leverage AI assessments** — Use Coursebox's AI quiz generator and grading for assessments.
- **White-label delivery** — Embed Coursebox content seamlessly via LTI 1.3.

---

## 2. Integration Options

| Method | Best For | Complexity | Real-Time? |
|--------|----------|------------|------------|
| **LTI 1.3** | Embedding Coursebox courses directly in our LMS | Medium | Yes |
| **SCORM** | Exporting packaged courses for offline/standalone use | Low | No |
| **Zapier** | Automating enrollment sync, notifications, data flow | Low | Near real-time |
| **WordPress Plugin** | WooCommerce storefronts selling Coursebox courses | Low | Yes |
| **Open API** | Custom programmatic integration | High | Yes |

---

## 3. Option A: LTI 1.3 Integration (Recommended)

LTI (Learning Tools Interoperability) 1.3 is the industry standard for connecting learning tools with LMS platforms. Coursebox supports LTI 1.3 as both a **Tool Provider** and works with major LMS platforms.

### Step 1: Enable LTI in Coursebox

1. Log in to your **Coursebox Admin Dashboard**.
2. Navigate to **Settings → Integrations → LTI 1.3**.
3. Enable the LTI 1.3 integration.
4. Note the following credentials:
   - **Platform ID / Client ID**
   - **Deployment ID**
   - **JWKS URL** (JSON Web Key Set)
   - **Authorization Endpoint**
   - **Token Endpoint**
   - **OIDC Login URL**

### Step 2: Configure Our Platform as an LTI Consumer

1. Create a Supabase Edge Function `lti-launch` to handle the LTI 1.3 handshake.
2. Store LTI credentials securely as environment variables:
   - `COURSEBOX_LTI_CLIENT_ID`
   - `COURSEBOX_LTI_DEPLOYMENT_ID`
   - `COURSEBOX_LTI_JWKS_URL`
3. Implement the OIDC login flow:
   - Receive the login initiation request from Coursebox.
   - Redirect to Coursebox's authorization endpoint.
   - Validate the ID token using the JWKS.
   - Launch the course content in an iframe.

### Step 3: Embed Coursebox Content

```tsx
// Example: Embedding a Coursebox course via LTI launch URL
<iframe
  src={ltiLaunchUrl}
  width="100%"
  height="800px"
  allow="fullscreen"
  style={{ border: 'none' }}
/>
```

### Step 4: Grade Passback (Optional)

LTI 1.3 supports **Assignment and Grade Services (AGS)**:
- Configure grade passback to sync Coursebox assessment scores back to our platform.
- Map Coursebox grades to our `assessment_attempts` table.

### Supported LMS Platforms for LTI 1.3

Coursebox officially supports LTI 1.3 with:
- **Canvas**
- **Moodle**
- **Blackboard**
- **Schoolbox**
- Custom platforms (like ours) via standard LTI 1.3 implementation.

---

## 4. Option B: SCORM Export/Import

SCORM (Sharable Content Object Reference Model) allows packaging courses as standalone, portable files.

### Step 1: Export from Coursebox

1. Open the course in **Coursebox**.
2. Go to **Course Settings → Export**.
3. Select **SCORM 1.2** or **SCORM 2004** format.
4. Download the `.zip` package.

### Step 2: Host SCORM Content

1. Upload the SCORM package to **Supabase Storage** (bucket: `scorm-packages`).
2. Extract and serve via a dedicated edge function or static hosting.

### Step 3: Embed SCORM Player

Use a SCORM player library (e.g., `scorm-again` or `pipwerks-scorm-api`) to:
- Launch the SCORM content in our Learn page.
- Track completion status via SCORM API calls.
- Map SCORM data (`cmi.core.lesson_status`, `cmi.core.score.raw`) to our `lesson_progress` and `assessment_attempts` tables.

```typescript
// Example SCORM data mapping
const scormToDatabase = {
  'cmi.core.lesson_status': 'lesson_progress.completed',
  'cmi.core.score.raw': 'assessment_attempts.score',
  'cmi.core.total_time': 'lesson_progress.time_spent_seconds',
};
```

### Limitations
- SCORM is a **one-way export** — no real-time sync.
- Content updates require re-export and re-upload.
- Less flexible than LTI 1.3 for interactive features.

---

## 5. Option C: Zapier Automation

Coursebox has a native Zapier integration with triggers and actions for automating workflows.

### Available Triggers (Events from Coursebox)

| Trigger | Description |
|---------|-------------|
| **Channel Enrolled** | Fires when a learner enrolls in a Coursebox channel/course |
| **Course Completed** | Fires when a learner completes a course |
| **Quiz Submitted** | Fires when a learner submits a quiz |

### Available Actions (Send to Coursebox)

| Action | Description |
|--------|-------------|
| **Enroll User** | Enroll a user in a specific Coursebox course |
| **Create User** | Create a new user account in Coursebox |
| **API Request (Beta)** | Make custom API calls to Coursebox |

### Step 1: Set Up Zapier Account

1. Create a [Zapier account](https://zapier.com) (free tier works for basic flows).
2. Search for **"Coursebox LMS"** in the app directory.
3. Connect your Coursebox account by providing your API key.

### Step 2: Create Enrollment Sync Zap

**Scenario**: When a learner enrolls on our platform → auto-enroll them in Coursebox.

1. **Trigger**: Webhooks by Zapier → Catch Hook
   - Set up a webhook URL in Zapier.
   - Configure our Supabase Edge Function to POST to this webhook on enrollment.

2. **Action**: Coursebox LMS → Enroll User
   - Map the learner's email, name, and course ID.
   - Coursebox will create the user (if new) and enroll them.

### Step 3: Create Completion Sync Zap

**Scenario**: When a learner completes a Coursebox course → update our database.

1. **Trigger**: Coursebox LMS → Course Completed
2. **Action**: Webhooks by Zapier → POST to our Supabase Edge Function
   - Update `lesson_progress` or `enrollments.progress_percentage`.

### Step 4: Webhook Edge Function

```typescript
// supabase/functions/coursebox-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const payload = await req.json();
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Handle course completion from Coursebox
  if (payload.event === 'course_completed') {
    await supabase
      .from('enrollments')
      .update({ 
        progress_percentage: 100,
        completed_at: new Date().toISOString()
      })
      .eq('user_id', payload.user_id)
      .eq('course_id', payload.course_id);
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

---

## 6. Option D: WordPress Plugin

If using WordPress/WooCommerce as a sales frontend:

### Step 1: Install the Plugin

1. Download the **Course Box** plugin from WordPress.org.
2. Upload to `/wp-content/plugins/course-box/` or install via WP admin.
3. Activate the plugin.
4. Ensure **WooCommerce** is installed and active.

### Step 2: Configure API Credentials

1. Go to **Course Box → Settings** in WordPress admin.
2. Enter your Coursebox API key and endpoint URL.
3. Test the connection.

### Step 3: Import Courses

1. Go to **Course Box → Import**.
2. Browse available Coursebox courses.
3. Select courses to import as WooCommerce products.
4. Customers purchasing a course are automatically enrolled in Coursebox.

### Requirements
- WordPress 5.0+
- WooCommerce 4.0+
- PHP 7.4+
- Coursebox API key with read/write permissions

---

## 7. Option E: Open API / REST API

Coursebox provides an Open API for programmatic integration. This is the most flexible but highest-complexity option.

### Step 1: Obtain API Credentials

1. Log in to **Coursebox Admin**.
2. Navigate to **Settings → Integrations → Open API**.
3. Generate an **API Key**.
4. Store securely as a Supabase secret: `COURSEBOX_API_KEY`.

### Step 2: API Authentication

```typescript
const headers = {
  'Authorization': `Bearer ${Deno.env.get('COURSEBOX_API_KEY')}`,
  'Content-Type': 'application/json',
};
```

### Step 3: Common API Operations

#### List Courses
```typescript
const response = await fetch('https://api.coursebox.ai/v1/courses', {
  headers,
});
const courses = await response.json();
```

#### Enroll a User
```typescript
const response = await fetch('https://api.coursebox.ai/v1/enrollments', {
  method: 'POST',
  headers,
  body: JSON.stringify({
    email: 'learner@example.com',
    course_id: 'coursebox-course-id',
    first_name: 'John',
    last_name: 'Doe',
  }),
});
```

#### Get Learner Progress
```typescript
const response = await fetch(
  `https://api.coursebox.ai/v1/enrollments/${enrollmentId}/progress`,
  { headers }
);
const progress = await response.json();
```

### Step 4: Edge Function Wrapper

Create a Supabase Edge Function to proxy API calls:

```typescript
// supabase/functions/coursebox-api/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const COURSEBOX_API_URL = 'https://api.coursebox.ai/v1';

serve(async (req) => {
  const COURSEBOX_API_KEY = Deno.env.get('COURSEBOX_API_KEY');
  if (!COURSEBOX_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'COURSEBOX_API_KEY not configured' }),
      { status: 500 }
    );
  }

  const { action, data } = await req.json();

  const endpoints: Record<string, { method: string; path: string }> = {
    list_courses: { method: 'GET', path: '/courses' },
    enroll_user: { method: 'POST', path: '/enrollments' },
    get_progress: { method: 'GET', path: `/enrollments/${data?.enrollment_id}/progress` },
  };

  const endpoint = endpoints[action];
  if (!endpoint) {
    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400 }
    );
  }

  const response = await fetch(`${COURSEBOX_API_URL}${endpoint.path}`, {
    method: endpoint.method,
    headers: {
      'Authorization': `Bearer ${COURSEBOX_API_KEY}`,
      'Content-Type': 'application/json',
    },
    ...(endpoint.method !== 'GET' && { body: JSON.stringify(data) }),
  });

  const result = await response.json();
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

---

## 8. Enrollment Sync via Zapier Webhooks

### Architecture

```
Our Platform (Enroll) 
  → Supabase Edge Function (POST webhook)
    → Zapier Webhook Trigger
      → Coursebox LMS Action (Enroll User)

Coursebox (Course Completed)
  → Zapier Trigger (Course Completed)
    → Webhooks by Zapier Action (POST to our Edge Function)
      → Update enrollments table
```

### Implementation Steps

1. **Create a Zapier Zap** with trigger "Webhooks by Zapier → Catch Hook".
2. **Copy the webhook URL** provided by Zapier.
3. **Store it** as a Supabase secret: `ZAPIER_COURSEBOX_WEBHOOK_URL`.
4. **Fire the webhook** from our enrollment edge function:

```typescript
// In send-enrollment-email/index.ts or a new edge function
const webhookUrl = Deno.env.get('ZAPIER_COURSEBOX_WEBHOOK_URL');
if (webhookUrl) {
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: enrollment.user_email,
      course_name: enrollment.course_title,
      coursebox_course_id: enrollment.coursebox_mapping_id,
    }),
  });
}
```

---

## 9. AI-Powered Course Creation Workflow

### Using Coursebox AI to Author Courses for Our Platform

1. **Upload source material** to Coursebox:
   - PDF documents, slides, videos, or URLs.
   - Coursebox AI auto-generates a structured course with modules and lessons.

2. **Refine with AI tools**:
   - **AI Quiz Generator** — Auto-create assessments from course content.
   - **AI Flashcard Maker** — Generate study aids.
   - **AI Video Generator** — Create training videos from text.
   - **AI Grading** — Automated assessment grading.

3. **Export to our platform**:
   - **Option A**: Export as SCORM and import into our LMS.
   - **Option B**: Use LTI 1.3 to embed directly.
   - **Option C**: Manually recreate the structure in our admin panel using Coursebox as a content authoring tool.

4. **Sync learner data**:
   - Use Zapier or the Open API to keep enrollment and progress data in sync.

---

## 10. Architecture Recommendations

### Recommended Integration Stack

For the Cytobiz platform, we recommend a **hybrid approach**:

| Layer | Tool | Purpose |
|-------|------|---------|
| **Course Authoring** | Coursebox AI | Use AI to rapidly create course content |
| **Content Delivery** | LTI 1.3 | Embed Coursebox courses seamlessly in our Learn page |
| **Enrollment Sync** | Zapier | Auto-enroll learners in Coursebox when they enroll on our platform |
| **Progress Tracking** | Zapier + Webhooks | Sync completion data back to our database |
| **Fallback** | SCORM Export | For offline or standalone content packages |

### Database Mapping

Add a `coursebox_course_id` field to our `courses` table to map between platforms:

```sql
ALTER TABLE courses ADD COLUMN coursebox_course_id TEXT;
```

### Edge Function Architecture

```
┌─────────────────────────────────────┐
│         Our Frontend (React)         │
├──────────────┬──────────────────────┤
│   Learn Page │  Enrollment Page     │
│   (LTI 1.3   │  (Supabase)          │
│    iframe)   │                      │
├──────────────┴──────────────────────┤
│        Supabase Edge Functions       │
│  ┌──────────┐  ┌──────────────────┐ │
│  │ LTI      │  │ Coursebox        │ │
│  │ Launch   │  │ Webhook Handler  │ │
│  └──────────┘  └──────────────────┘ │
├─────────────────────────────────────┤
│     Zapier (Middleware)              │
├─────────────────────────────────────┤
│     Coursebox AI Platform            │
└─────────────────────────────────────┘
```

---

## 11. Security Considerations

- **API Keys**: Store all Coursebox API keys as Supabase secrets, never in frontend code.
- **LTI 1.3 Security**: LTI 1.3 uses OAuth 2.0 and JWT tokens — validate all tokens server-side.
- **Webhook Validation**: Verify webhook signatures to prevent spoofing.
- **CORS**: Configure CORS headers in edge functions to only accept requests from trusted origins.
- **Data Privacy**: Ensure learner PII (name, email) transmitted to Coursebox complies with your privacy policy.
- **Rate Limiting**: Implement rate limiting on webhook endpoints to prevent abuse.

---

## 12. References

- **Coursebox Integrations Page**: https://www.coursebox.ai/integrations
- **Coursebox User Manual**: https://courseboxptyltd.freshdesk.com/support/solutions/51000303986
- **Coursebox on Zapier**: https://zapier.com/apps/coursebox-lms/integrations
- **LTI 1.3 Specification**: https://www.imsglobal.org/spec/lti/v1p3/
- **SCORM Standards**: https://scorm.com/scorm-explained/
- **Coursebox WordPress Plugin**: https://en-gb.wordpress.org/plugins/course-box/
- **Coursebox LTI Blog Post**: https://www.coursebox.ai/blog/lti-in-course-authoring
- **Coursebox Zapier YouTube Tutorial**: https://www.youtube.com/watch?v=RMEymPIp9CY
