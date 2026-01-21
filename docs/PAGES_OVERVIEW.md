# CareConnect - Pages Overview

This document provides a comprehensive list of all pages in the CareConnect application, organized by section, with brief descriptions of their purpose and functionality.

---

## Public Pages

### 1. **Home Page** (`/`)

**Route:** `/`  
**Purpose:** Landing page for the application  
**Features:**

- Hero section introducing the platform
- "Trusted By" section showcasing credibility
- Featured services overview
- Call-to-action to sign up or browse caregivers

---

## Authentication Pages

### 2. **Login Page** (`/auth/login`)

**Route:** `/auth/login`  
**Purpose:** User authentication  
**Features:**

- Email and password login form
- Google OAuth integration
- "Forgot password" link
- Redirect to signup page for new users
- Role-based redirection after login (parents → browse, nannies → dashboard)

### 3. **Signup Page** (`/auth/signup`)

**Route:** `/auth/signup`  
**Purpose:** New user registration  
**Features:**

- Role selection (Family/Parent or Caregiver/Nanny)
- User information form (first name, last name, email, password)
- Terms of service agreement checkbox
- Google OAuth signup option
- Redirect to login after successful registration

### 4. **Auth Callback Page** (`/auth/callback`)

**Route:** `/auth/callback`  
**Purpose:** OAuth callback handler  
**Features:**

- Processes OAuth tokens from Google authentication
- Handles authentication errors
- Redirects to appropriate page based on user role
- Loading state during authentication

---

## Parent/Family Pages

### 5. **Browse Page** (`/browse`)

**Route:** `/browse`  
**Purpose:** Main landing page for parents after login  
**Features:**

- Personalized welcome message
- Featured caregivers section
- Nearby caregivers based on location
- Quick access to search functionality
- Profile cards with caregiver details

### 6. **Search Page** (`/search`)

**Route:** `/search`  
**Purpose:** Advanced caregiver search and filtering  
**Features:**

- Search bar for name, location, or skills
- Filter sidebar (desktop) and modal (mobile)
- Grid view of caregiver profiles
- Real-time search results
- Pagination
- Option to load demo data if no results found

### 7. **Caregiver Profile Page** (`/caregiver/[id]`)

**Route:** `/caregiver/[id]` (dynamic)  
**Purpose:** Detailed view of individual caregiver  
**Features:**

- Profile header with photo and basic info
- Hourly rate display
- Stats: rating, experience, certifications
- About me section
- Skills and certifications list
- Availability calendar
- "Request Booking" and "Message" buttons
- Verification badge display

---

## Dashboard Pages (Shared)

### 8. **Dashboard Overview** (`/dashboard`)

**Route:** `/dashboard`  
**Purpose:** Main dashboard for logged-in users  
**Features:**

- Personalized welcome message
- Statistics cards (bookings, messages, hours, ratings)
- Upcoming bookings list
- Quick action buttons
- Role-specific content

### 9. **Profile Page** (`/dashboard/profile`)

**Route:** `/dashboard/profile`  
**Purpose:** View own profile  
**Features:**

- Profile image display
- Personal information
- Role badge
- Location and verification status
- For nannies: hourly rate, experience, bio, skills
- Link to public profile view (for nannies)
- Edit profile button

### 10. **Settings Page** (`/dashboard/settings`)

**Route:** `/dashboard/settings`  
**Purpose:** Edit user profile and account settings  
**Features:**

- Personal information form (name, phone, address, profile image)
- For nannies: additional fields (hourly rate, experience, skills, bio)
- Save/cancel actions
- Success/error message display
- Form validation

### 11. **Messages Page** (`/dashboard/messages`)

**Route:** `/dashboard/messages`  
**Purpose:** Real-time chat with other users  
**Features:**

- Conversation list sidebar
- Active chat window
- Real-time messaging via WebSocket
- Typing indicators
- Message history
- Connection status indicator
- Booking context for each conversation
- Auto-scroll to latest message

---

## Booking Management Pages

### 12. **Bookings List** (`/dashboard/bookings`)

**Route:** `/dashboard/bookings`  
**Purpose:** View all bookings  
**Features:**

- List of all bookings (upcoming and past)
- Booking cards with date, time, and status
- Status badges (confirmed, in progress, completed, cancelled)
- Action buttons based on status and role
- For nannies: "Start" and "Complete" buttons
- Cancel booking option
- Empty state with call-to-action

### 13. **Booking Details** (`/dashboard/bookings/[id]`)

**Route:** `/dashboard/bookings/[id]` (dynamic)  
**Purpose:** Detailed view of a single booking  
**Features:**

- Booking information (date, time, location, description)
- Status badge
- Other party information (parent or nanny)
- For parents: nanny details (experience, rate, skills)
- Action buttons (start, complete, cancel, open chat)
- Cancellation reason display (if cancelled)
- Back navigation

---

## Service Request Pages (Parents Only)

### 14. **Requests List** (`/dashboard/requests`)

**Route:** `/dashboard/requests`  
**Purpose:** View all service requests  
**Features:**

- Grid of service request cards
- Status badges with color coding
- Request details preview (date, time, location, children)
- "Create New Request" button
- Empty state with call-to-action
- Click to view details

### 15. **Request Details** (`/dashboard/requests/[id]`)

**Route:** `/dashboard/requests/[id]` (dynamic)  
**Purpose:** Detailed view of a service request  
**Features:**

- Request status with icon
- Service information (date, time, duration, children, location)
- Special requirements display
- Assigned caregiver profile (if assigned)
- Action buttons based on status
- Cancel request option (if pending)
- Message nanny option (if accepted/in progress)

### 16. **Create Request** (`/dashboard/requests/create`)

**Route:** `/dashboard/requests/create`  
**Purpose:** Create new service request  
**Features:**

- Multi-section form:
  - Date & Time selection
  - Duration dropdown
  - Number of children and ages
  - Location/address
  - Special requirements textarea
- Form validation
- Pre-filled address from user profile
- Submit and cancel actions
- Error handling

---

## Admin Pages

### 17. **Admin Dashboard** (`/admin`)

**Route:** `/admin`  
**Purpose:** Admin overview and statistics  
**Features:**

- Statistics cards (total users, total bookings, active bookings)
- Quick action buttons
- Access control (admin role only)
- Navigation to user and booking management

### 18. **User Management** (`/admin/users`)

**Route:** `/admin/users`  
**Purpose:** Manage all users  
**Features:**

- User table with columns: name, email, role, verified status, join date
- Role badges
- Verification status icons
- Action buttons: verify user, ban user
- Admin-only access
- Back to dashboard navigation

### 19. **Booking Management** (`/admin/bookings`)

**Route:** `/admin/bookings`  
**Purpose:** Manage all bookings  
**Features:**

- Booking table with columns: job title, parent, nanny, start time, status
- Status badges
- "View Details" button for each booking
- Admin-only access
- Back to dashboard navigation

---

## Page Count Summary

- **Public Pages:** 1
- **Authentication Pages:** 3
- **Parent/Family Pages:** 3
- **Dashboard Pages (Shared):** 4
- **Booking Management Pages:** 2
- **Service Request Pages:** 3
- **Admin Pages:** 3

**Total Pages:** 19

---

## User Flow Summary

### Parent/Family User Flow

1. Home → Signup/Login → Browse
2. Browse → Search → Caregiver Profile → Request Booking
3. Dashboard → Requests → Create Request → Request Details
4. Dashboard → Bookings → Booking Details → Messages
5. Dashboard → Profile/Settings

### Nanny/Caregiver User Flow

1. Home → Signup/Login → Dashboard
2. Dashboard → Bookings → Booking Details → Messages
3. Dashboard → Profile/Settings (including public profile view)

### Admin User Flow

1. Login → Admin Dashboard
2. Admin Dashboard → User Management / Booking Management

---

## Design Considerations

### Common UI Elements Across Pages

- **Navigation:** Header with logo, navigation links, user menu
- **Cards:** Consistent card design for profiles, bookings, requests
- **Buttons:** Primary, secondary, outline, ghost variants
- **Forms:** Input fields, textareas, selects, checkboxes
- **Status Badges:** Color-coded for different states
- **Modals:** For filters, confirmations, and actions
- **Loading States:** Spinners and skeleton screens
- **Empty States:** Helpful messages with call-to-action buttons

### Responsive Design

- Mobile-first approach
- Collapsible sidebars on mobile
- Filter modals instead of sidebars on mobile
- Responsive grids (1 column mobile, 2-3 columns desktop)
- Touch-friendly buttons and interactions

### Color Coding

- **Primary:** Brand color for main actions
- **Success/Green:** Confirmed, completed, verified
- **Warning/Yellow:** Pending states
- **Info/Blue:** In progress, assigned
- **Error/Red:** Cancelled, errors
- **Neutral/Gray:** Inactive, disabled

---

## Notes for Design Team

1. **Authentication flows** include both traditional email/password and Google OAuth
2. **Role-based content** - some pages show different content based on user role (parent vs nanny vs admin)
3. **Real-time features** - Messages page uses WebSocket for live chat
4. **Dynamic routes** - Several pages use dynamic IDs in the URL (e.g., `/caregiver/[id]`)
5. **Protected routes** - Dashboard and admin pages require authentication
6. **Empty states** - All list pages have thoughtful empty states with call-to-action
7. **Loading states** - All pages handle loading and error states gracefully
8. **Accessibility** - Forms include proper labels, semantic HTML, and ARIA attributes

---

_Document generated: 2025-11-22_  
_For: CareConnect Design Team_
