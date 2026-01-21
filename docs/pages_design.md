CareConnect: Page-Level Design Specifications

Reference Design: See design.md for global color palette (Teal/Coral/Cream), typography (DM Sans/Inter), and component styling (Rounded-3xl, Glassmorphism).

1. Global Layout Elements

Navigation (Floating):

Sticky top. Transparent on load, backdrop-blur-xl + bg-white/80 on scroll.

Links: text-charcoal hover text-primary.

Mobile: Slide-out drawer with backdrop-blur-lg.

Footer:

bg-charcoal text text-cream. Minimalist columns.

2. Public Pages

1. Home Page (/)

Vibe: Welcoming, Conversational, Motion-heavy.

Key Sections:

Hero: Large blob gradient background. "Conversational Input" component (Pill shape, massive shadow) for searching.

Trust: Infinite Marquee of faces (see design.md).

Services: 3-Col Grid. Cards lift (translate-y) on hover.

CTA: Large "Join Now" banner with bg-secondary (Coral) button.

3. Authentication Pages

Layout Strategy: Full-screen soft gradient background (bg-gradient-to-br from-teal-50 to-pink-50). Center content in a single "Glass Card".

2. Login Page (/auth/login)

Container: White card, shadow-strong, rounded-3xl.

Inputs: bg-gray-50 border-none rounded-xl. Focus ring: ring-primary.

Social: Google Button should be white with shadow-sm and colored G icon.

3. Signup Page (/auth/signup)

Role Selection: Two large cards side-by-side (Parent vs. Caregiver).

Selected: border-2 border-primary bg-teal-50.

Unselected: border border-gray-200.

Form: Staggered animation on load (Input fields slide up one by one).

4. Auth Callback (/auth/callback)

UI: Central Spinner (Teal color) pulsing.

Text: "Verifying your credentials..." in font-display.

4. Parent/Family Pages

5. Browse Page (/browse)

Header: "Welcome back, [Name]" in large font-display.

Featured Carousel: Horizontal scroll snap. Cards have gradient overlays.

Nearby Grid: Standard profile cards (Image left, Info right).

Action: Floating Action Button (FAB) on mobile for "New Search".

6. Search Page (/search)

Layout:

Desktop: Sticky Sidebar (Left) for filters. Main Content (Right) grid.

Mobile: "Filters" Pill button triggers bottom sheet modal.

Filters: Accordions with soft checkboxes (Rounded squares).

Results: Grid of "Profile Cards".

Empty State: Illustration of a sleeping cat/dog with "No matches found".

7. Caregiver Profile Page (/caregiver/[id])

Header: "Cover Photo" style (or distinct pattern). Large Avatar overlaps the border.

Stats Row: 3 Bubbles (Rating, Experience, Verification).

Tabs: "About", "Reviews", "Availability".

Booking Card (Desktop): Sticky right column. White card, shadow-lg. Shows Rate ($20/hr) and large Coral "Request Booking" button.

5. Dashboard Pages (Shared)

Layout: Sidebar Navigation (Desktop) / Bottom Nav (Mobile).

Style: Main content area is bg-cream. Content sits in White Cards.

8. Dashboard Overview (/dashboard)

Stats Cards: 4-Grid. White bg. Icon in a colored circle (Teal for money, Coral for alerts).

Upcoming: "Next Booking" card uses a distinct gradient border to stand out.

9. Profile Page (/dashboard/profile)

View Mode: Clean layout. Data presented in "Read-only" pill containers.

Badges: "Verified" badge is a Teal Checkmark with bg-teal-100 pill.

10. Settings Page (/dashboard/settings)

Form Layout: Single column max-width-2xl.

Inputs: Grouped into "Sections" (Personal, Account, Billing). Each section is a white card.

Save: Sticky bottom bar on mobile.

11. Messages Page (/dashboard/messages)

Layout: Two-pane (List | Chat).

List: Avatars with "Online" dot. Active chat highlighted bg-teal-50.

Chat Window:

Bubbles (Sent): bg-primary text-white rounded-tr-none.

Bubbles (Received): bg-white text-charcoal rounded-tl-none shadow-sm.

Input: Floating pill bar at bottom.

6. Booking Management

7. Bookings List (/dashboard/bookings)

Tabs: "Upcoming" | "Past" | "Cancelled".

Cards: Not a table. Use "Booking Rows".

Layout: Date box (Left) | Info (Middle) | Status Badge (Right).

Status Badges: Pastel Pills.

Confirmed: bg-green-100 text-green-700.

Pending: bg-yellow-100 text-yellow-700.

13. Booking Details (/dashboard/bookings/[id])

Header: Large Status Banner.

Content: Two columns.

Left: Time, Location, Requirements.

Right: Profile Card of the other party.

Actions: "Cancel" is a ghost button (red text). "Start" is a solid Primary button.

7. Service Requests (Parents)

8. Requests List (/dashboard/requests)

Grid: Masonry or uniform grid of request summaries.

Card: Shows "3 Applicants" as a stack of mini-avatars.

15. Request Details (/dashboard/requests/[id])

Applicants Section: List of caregivers who applied. Each row has "Accept" (Primary) and "Decline" (Ghost) buttons.

16. Create Request (/dashboard/requests/create)

Wizard UI: Do not show all fields at once.

Step 1: Who needs care? (Select Icons).

Step 2: When? (Calendar UI).

Step 3: Details.

Progress Bar: Thin teal line at top.

8. Admin Pages

Theme Shift: Slightly denser UI, but keep the rounded corners.

17. Admin Dashboard (/admin)

Charts: Use Chart.js with the Brand Colors (Teal/Coral). Rounded bar charts.

Quick Actions: Grid of icon buttons.

18. User Management (/admin/users)

Table: "Floating Rows" style.

Separate <thead> from <tbody>.

<tr> has bg-white, rounded-lg, and mb-2 (margin bottom) to create gaps between rows. Shadow-sm on rows.

Actions: "Ban" (Red icon), "Verify" (Teal icon).

19. Booking Management (/admin/bookings)

Table: Similar floating row style.

Filters: Top bar with dropdowns for "Status" and "Date Range".

9. Interaction & State Notes

Loading States: Use "Skeleton Screens" (pulsing gray shapes) that match the rounded-3xl aesthetic. Never use a simple browser spinner.

Transitions:

Page transitions: opacity-0 to opacity-100 with translate-y-4 to translate-y-0.

Modals: Slide up from bottom (spring animation).

Empty States: Always include a custom SVG/Illustration (monoline style using Brand Colors) + a specific CTA button.
