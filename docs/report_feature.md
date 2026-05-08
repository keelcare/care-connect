# Post-Booking Child Progress Report — Implementation Plan

A structured report system where nannies/caregivers fill out a child progress report after completing a Shadow Teacher or Special Needs booking. Parents view the completed report. Admins manage the report question template.

---

## Overview

| Aspect | Detail |
|--------|--------|
| **Trigger** | Booking status → `COMPLETED` for `ST` / `SN` service categories |
| **Actor: Nanny** | Fills out dynamic report within 1 hour of booking completion |
| **Actor: Parent** | Views completed report inside Booking Detail page |
| **Actor: Admin** | Manages the question template via UI editor or Excel upload |
| **Escalation** | Auto-escalation cron at 5 min intervals — overdue reports flag the nanny and notify admin |

---

## Scope

Changes span **two repositories**:
- **Frontend**: `/Users/zenith/Keel/care-connect`
- **Backend**: `/Users/zenith/Keel/care-connect-backend`

---

## 1. Database Schema (Prisma)

New models added to `prisma/schema.prisma`. No existing tables are broken — only a new optional relation is added to `bookings`.

### New Enums

```prisma
enum report_input_type {
  TEXT
  RATING
  YES_NO
  MULTI_CHOICE
}

enum report_status {
  PENDING
  SUBMITTED
  OVERDUE
}
```

### New Models

```prisma
/// Admin-managed report question templates. Versioned — each upload/edit creates a new version.
model report_templates {
  id               String                     @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  version          Int                        @default(autoincrement())
  is_active        Boolean                    @default(true)
  created_by       String?                    @db.Uuid
  created_at       DateTime                   @default(now()) @db.Timestamptz(6)
  questions        report_template_questions[]
  progress_reports progress_reports[]

  @@unique([version])
}

/// Individual questions belonging to a template version
model report_template_questions {
  id               String            @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  template_id      String            @db.Uuid
  question_text    String
  input_type       report_input_type
  options          String[]          @default([])  // for MULTI_CHOICE
  is_required      Boolean           @default(true)
  display_order    Int
  report_templates report_templates  @relation(fields: [template_id], references: [id], onDelete: Cascade)

  @@index([template_id])
}

/// A completed (or pending) report linked to a booking
model progress_reports {
  id               String           @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  booking_id       String           @unique @db.Uuid
  nanny_id         String           @db.Uuid
  child_id         String?          @db.Uuid
  template_id      String           @db.Uuid
  status           report_status    @default(PENDING)
  personal_remark  String?
  due_at           DateTime         @db.Timestamptz(6)
  submitted_at     DateTime?        @db.Timestamptz(6)
  escalated        Boolean          @default(false)
  created_at       DateTime         @default(now()) @db.Timestamptz(6)
  updated_at       DateTime         @default(now()) @db.Timestamptz(6)

  answers          report_answers[]
  bookings         bookings         @relation(fields: [booking_id], references: [id], onDelete: Cascade)
  report_templates report_templates @relation(fields: [template_id], references: [id])

  @@index([booking_id])
  @@index([nanny_id])
}

/// Individual answers for each question in a report
model report_answers {
  id               String           @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  report_id        String           @db.Uuid
  question_id      String           @db.Uuid
  answer_text      String?          // for TEXT, YES_NO
  answer_rating    Int?             // for RATING (1–5)
  answer_choices   String[]         @default([])  // for MULTI_CHOICE
  progress_reports progress_reports @relation(fields: [report_id], references: [id], onDelete: Cascade)

  @@index([report_id])
}
```

Add to the existing `bookings` model:
```prisma
progress_reports  progress_reports?
```

---

## 2. Backend — New `ProgressReportsModule`

All new files in `src/progress-reports/`.

### Module File: `progress-reports.module.ts`
- Imports `PrismaModule`, `NotificationsModule`, `ScheduleModule`
- Exports `ProgressReportsService`

### Service: `progress-reports.service.ts`

| Method | Description |
|--------|-------------|
| `createPendingReport(bookingId)` | Called on booking completion. Finds the active template, creates a `progress_reports` record with `status=PENDING`, `due_at = now + 1 hour`. Only runs for `ST`/`SN` categories. Sends in-app + FCM notification to nanny. |
| `submitReport(reportId, nannyId, answers, personalRemark)` | Validates ownership, checks `PENDING` status, validates required fields, saves answers, sets `status=SUBMITTED`, notifies parent. Locks report after submission. |
| `getReportByBooking(bookingId)` | Returns full report with template questions + answers. Used by both nanny (fill) and parent (read). |
| `getReportForNanny(nannyId)` | Returns all PENDING/OVERDUE reports for a nanny. |
| `checkOverdueReports()` | Cron target. Finds reports where `status=PENDING AND due_at < now AND escalated=false`. Sets `escalated=true`, `status=OVERDUE`, adds a soft flag to `nanny_details`, notifies admin and parent. |

### Controller: `progress-reports.controller.ts`

| Endpoint | Method | Guard | Description |
|----------|--------|-------|-------------|
| `GET /progress-reports/booking/:bookingId` | GET | JWT (Parent/Nanny) | Get report by booking ID |
| `GET /progress-reports/nanny/pending` | GET | JWT (Nanny) | Get pending reports for current nanny |
| `POST /progress-reports/:id/submit` | POST | JWT (Nanny) | Submit a completed report |

### DTO: `dto/submit-report.dto.ts`
```typescript
class AnswerDto {
  questionId: string;
  answerText?: string;
  answerRating?: number;      // 1–5, for RATING type
  answerChoices?: string[];   // for MULTI_CHOICE type
}

class SubmitReportDto {
  answers: AnswerDto[];
  personalRemark?: string;
}
```

---

## 3. Backend — Admin Template Endpoints

Added to existing `AdminController` / `AdminService`.

### New Endpoints in `admin.controller.ts`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `GET /admin/report-template` | GET | Get current active template with questions |
| `PUT /admin/report-template` | PUT | Update template via JSON body (creates new version, deactivates old) |
| `POST /admin/report-template/upload` | POST | Upload `.xlsx` file to set template (creates new version) |
| `GET /admin/report-template/history` | GET | List all template versions (read-only) |

### New Methods in `admin.service.ts`

- `getActiveTemplate()` — returns current `is_active=true` template with `questions` included, ordered by `display_order`
- `updateTemplate(questions[])` — transaction: deactivate current → create new version → insert questions
- `uploadTemplateFromExcel(fileBuffer)` — parses XLSX using `exceljs`, maps columns to `SubmitQuestionDto[]`, calls `updateTemplate`
- `getTemplateHistory()` — returns all template versions newest-first (questions not included for brevity)

### XLSX Schema Reference

The expected Excel file format for template uploads:

| Column | Field | Notes |
|--------|-------|-------|
| A | `question_id` | Optional, ignored during upload |
| B | `question_text` | Required |
| C | `input_type` | `TEXT` / `RATING` / `YES_NO` / `MULTI_CHOICE` |
| D | `options` | Comma-separated, only used for `MULTI_CHOICE` |
| E | `is_required` | `TRUE` / `FALSE` |
| F | `order` | Integer display order |

---

## 4. Backend — Integration Points

### `bookings.service.ts` → `completeBooking()`

After existing completion + payment logic (~line 533), inject:

```typescript
// Trigger progress report for Shadow Teacher / Special Needs bookings
if (['ST', 'SN'].includes(booking.service_requests?.category || '')) {
  this.progressReportsService.createPendingReport(id).catch(err =>
    this.logger.error('Failed to create progress report:', err)
  );
}
```

Requires injecting `ProgressReportsService` via constructor (with `forwardRef` to avoid circular dependency).

### `tasks.service.ts`

Add alongside the existing `handleExpiredBookings` cron:

```typescript
@Cron('*/5 * * * *')
async handleOverdueReports() {
  this.logger.debug('Checking for overdue progress reports...');
  try {
    await this.progressReportsService.checkOverdueReports();
  } catch (error) {
    this.logger.error('Error in handleOverdueReports cron job', error);
  }
}
```

### `app.module.ts`

Register `ProgressReportsModule` in the `imports` array.

---

## 5. Frontend — TypeScript Types

Add to `src/types/api.ts`:

```typescript
// Progress Report Types
export type ReportInputType = 'TEXT' | 'RATING' | 'YES_NO' | 'MULTI_CHOICE';
export type ReportStatus = 'PENDING' | 'SUBMITTED' | 'OVERDUE';

export interface ReportTemplateQuestion {
  id: string;
  question_text: string;
  input_type: ReportInputType;
  options: string[];
  is_required: boolean;
  display_order: number;
}

export interface ReportTemplate {
  id: string;
  version: number;
  is_active: boolean;
  created_at: string;
  questions: ReportTemplateQuestion[];
}

export interface ReportAnswer {
  id: string;
  question_id: string;
  answer_text?: string;
  answer_rating?: number;
  answer_choices?: string[];
}

export interface ProgressReport {
  id: string;
  booking_id: string;
  nanny_id: string;
  child_id?: string;
  template_id: string;
  status: ReportStatus;
  personal_remark?: string;
  due_at: string;
  submitted_at?: string;
  escalated: boolean;
  answers: ReportAnswer[];
  report_templates?: ReportTemplate;
}

export interface SubmitReportAnswerDto {
  questionId: string;
  answerText?: string;
  answerRating?: number;
  answerChoices?: string[];
}

export interface SubmitReportDto {
  answers: SubmitReportAnswerDto[];
  personalRemark?: string;
}
```

---

## 6. Frontend — API Client

Add to `src/lib/api.ts`:

```typescript
progressReports: {
  getByBooking: (bookingId: string) =>
    fetchApi<ProgressReport>(`/progress-reports/booking/${bookingId}`),
  getPendingForNanny: () =>
    fetchApi<ProgressReport[]>(`/progress-reports/nanny/pending`),
  submit: (reportId: string, body: SubmitReportDto) =>
    fetchApi<ProgressReport>(`/progress-reports/${reportId}/submit`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
},
```

Add under `api.admin`:

```typescript
reportTemplate: {
  get: () =>
    fetchApi<ReportTemplate>('/admin/report-template'),
  update: (questions: Partial<ReportTemplateQuestion>[]) =>
    fetchApi<ReportTemplate>('/admin/report-template', {
      method: 'PUT',
      body: JSON.stringify({ questions }),
    }),
  uploadExcel: (formData: FormData) =>
    fetch(`${API_URL}/admin/report-template/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    }).then(async res => {
      if (!res.ok) throw new Error((await res.json()).message || 'Upload failed');
      return res.json() as Promise<ReportTemplate>;
    }),
  getHistory: () =>
    fetchApi<ReportTemplate[]>('/admin/report-template/history'),
},
```

---

## 7. Frontend — Report Components

### `src/components/progress-reports/ReportForm.tsx`
Dynamic form rendered from template questions. Handles all 4 input types:
- `TEXT` → `<textarea>` with character counter
- `RATING` → Clickable 5-star row
- `YES_NO` → Toggle pill buttons (Yes / No)
- `MULTI_CHOICE` → Checkbox group from `options[]`

Always includes a "Personal Remark" free-text field at the very bottom (required by spec).
Submit button with loading state. Read-only mode if `status === 'SUBMITTED'`.

### `src/components/progress-reports/ReportView.tsx`
Read-only parent-facing view. Each answer rendered appropriately:
- RATING → filled stars
- YES_NO → green/red pill
- MULTI_CHOICE → tag badges
- TEXT → paragraph

Personal remark displayed in a highlighted blockquote-style card.

### `src/components/progress-reports/ReportStatusBadge.tsx`
Inline status indicator:

| Status | Style | Text |
|--------|-------|------|
| `PENDING` | Amber | "Report being prepared" |
| `OVERDUE` | Red | "Report delayed — we apologise" |
| `SUBMITTED` | Green | "Report ready" |

---

## 8. Frontend — Nanny Pages

### `src/app/nanny/reports/page.tsx`
Lists all pending/overdue reports for the authenticated nanny.  
Each card shows: booking date, service type, child name (if linked), time remaining until due, "Fill Report" CTA.

### `src/app/nanny/reports/[id]/page.tsx`
Full-screen report submission page. Fetches report by ID, renders `<ReportForm />`, handles submit and redirect on success.

Add a quick-action link to the nanny dashboard's `QuickActions` component pointing to `/nanny/reports`.

---

## 9. Frontend — Parent Report View (Booking Detail)

Modify `src/app/bookings/[id]/ClientPage.tsx`:

When `currentStatus === 'COMPLETED'` and the booking category is `ST` or `SN`:
1. Fetch `api.progressReports.getByBooking(bookingId)` on page load
2. If `SUBMITTED` → render `<ReportView />` as a new card below the booking summary
3. If `PENDING` or `OVERDUE` → render `<ReportStatusBadge />` in the same position

---

## 10. Frontend — Admin Template Management

### `src/app/admin/report-template/page.tsx`

Two-panel layout:

**Left: UI Editor**
- Ordered list of current questions (drag handle via `@dnd-kit/core`)
- Inline edit: question text, input type, options (multi-choice only), required toggle
- Add Question button appends a blank row
- Delete button per row (with confirmation)
- Save button creates a new template version atomically

**Right: Excel Upload**
- File dropzone (`.xlsx` only)
- On file selected: parse preview table appears
- Confirm Upload button → calls `api.admin.reportTemplate.uploadExcel()`
- Schema reference table shown permanently below

### Sidebar Update (`AdminSidebar.tsx`)

Add to the `Management` section:
```typescript
{ icon: ClipboardList, label: 'Report Template', href: '/admin/report-template' }
```

---

## 11. Default Seed Data

File: `prisma/seeds/report-template-seed.ts`

| # | Question | Type | Required |
|---|----------|------|----------|
| 1 | How was the child's overall behavior today? | TEXT | Yes |
| 2 | Rate the child's mood throughout the session | RATING | Yes |
| 3 | How engaged was the child during activities? | RATING | Yes |
| 4 | Did the child interact well with others? | YES_NO | Yes |
| 5 | Which activities did the child participate in? | MULTI_CHOICE (Art, Reading, Physical Play, Music, Puzzles, Role Play, Other) | Yes |
| 6 | Were meals/snacks provided and consumed? | YES_NO | No |
| 7 | Were there any incidents or concerns to report? | TEXT | No |

---

## Data Model Diagram

```mermaid
erDiagram
    bookings ||--o| progress_reports : "has"
    progress_reports ||--o{ report_answers : "contains"
    report_templates ||--o{ report_template_questions : "defines"
    report_templates ||--o{ progress_reports : "versioned_by"

    report_templates {
        uuid id PK
        int version UK
        bool is_active
        uuid created_by
        datetime created_at
    }

    report_template_questions {
        uuid id PK
        uuid template_id FK
        string question_text
        enum input_type
        string[] options
        bool is_required
        int display_order
    }

    progress_reports {
        uuid id PK
        uuid booking_id FK_UK
        uuid nanny_id
        uuid child_id
        uuid template_id FK
        enum status
        string personal_remark
        datetime due_at
        datetime submitted_at
        bool escalated
    }

    report_answers {
        uuid id PK
        uuid report_id FK
        uuid question_id
        string answer_text
        int answer_rating
        string[] answer_choices
    }
```

---

## File Change Summary

### Backend (`care-connect-backend`)

| File | Action |
|------|--------|
| `prisma/schema.prisma` | MODIFY — add 4 new models/enums + relation on `bookings` |
| `src/progress-reports/progress-reports.module.ts` | NEW |
| `src/progress-reports/progress-reports.service.ts` | NEW |
| `src/progress-reports/progress-reports.controller.ts` | NEW |
| `src/progress-reports/dto/submit-report.dto.ts` | NEW |
| `src/admin/admin.controller.ts` | MODIFY — add 4 template endpoints |
| `src/admin/admin.service.ts` | MODIFY — add 4 template methods |
| `src/bookings/bookings.service.ts` | MODIFY — call `createPendingReport` on completion |
| `src/tasks/tasks.service.ts` | MODIFY — add overdue cron job |
| `src/app.module.ts` | MODIFY — register `ProgressReportsModule` |
| `prisma/seeds/report-template-seed.ts` | NEW |

### Frontend (`care-connect`)

| File | Action |
|------|--------|
| `src/types/api.ts` | MODIFY — add 6 new types |
| `src/lib/api.ts` | MODIFY — add `api.progressReports` + `api.admin.reportTemplate` |
| `src/components/progress-reports/ReportForm.tsx` | NEW |
| `src/components/progress-reports/ReportView.tsx` | NEW |
| `src/components/progress-reports/ReportStatusBadge.tsx` | NEW |
| `src/app/nanny/reports/page.tsx` | NEW |
| `src/app/nanny/reports/[id]/page.tsx` | NEW |
| `src/app/bookings/[id]/ClientPage.tsx` | MODIFY — parent report view |
| `src/app/admin/report-template/page.tsx` | NEW |
| `src/components/admin/AdminSidebar.tsx` | MODIFY — add nav item |

**Total: 10 backend files + 10 frontend files = 20 file changes**

---

## Open Questions

1. **One report per booking or per child?** If a booking has multiple children (via `booking_children`), should there be one report per booking or one per child? Currently planned as one per booking.

2. **Escalation hardness**: The spec says "flag the nanny account". Planned as a soft flag (admin-visible warning). Should it also block the nanny from accepting new bookings until resolved?

3. **Notification channel**: Push (FCM) or in-app only for report-ready and overdue alerts?

4. **Phased delivery**: Recommend 3 phases:
   - Phase 1: Schema + Backend module + Admin template UI + seed data
   - Phase 2: Nanny report form + submission flow + cron escalation
   - Phase 3: Parent view + notification integration

---

## Verification Plan

### Automated Tests
- Unit tests for `ProgressReportsService` (create, submit, overdue escalation logic)
- Integration test: complete booking → report created → submit → parent can view
- Playwright test for admin template editor CRUD

### Manual Verification
- Nanny report form renders correctly for all 4 input types
- Submitted reports are locked (re-submit returns 400)
- Parent booking detail shows `ReportView` or `ReportStatusBadge` correctly
- Admin template editor creates new versions without affecting completed reports
- 1-hour overdue cron escalation triggers and notifies correctly
