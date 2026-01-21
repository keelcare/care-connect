# Feature 4: Service Request & Auto-Matching (Frontend)

## Summary

Implemented the frontend interface for parents to create, view, and manage service requests, enabling the auto-matching system.

## Features Implemented

### 1. **Service Request Management**

- **List View**: `/dashboard/requests`
  - Displays all requests created by the parent
  - Visual status badges (Pending, Assigned, etc.)
  - Key details summary (Date, Time, Location)
- **Create Request**: `/dashboard/requests/create`
  - Comprehensive form for new requests
  - Dynamic child age inputs
  - Validation and error handling
- **Request Details**: `/dashboard/requests/[id]`
  - Full details view
  - Status tracking
  - Assigned nanny profile display
  - Cancellation capability

### 2. **API Integration**

- Updated `src/lib/api.ts` with `requests` endpoints:
  - `create`: Create new request
  - `get`: Fetch single request
  - `getParentRequests`: Fetch all requests for parent
  - `cancel`: Cancel a pending request
  - `getMatches`: Fetch potential matches (prepared for future use)
- Updated `src/types/api.ts` with `ServiceRequest` and `CreateServiceRequestDto` interfaces.

### 3. **UI Components**

- Updated `Button` component with `outline` and `ghost` variants for better UI flexibility.
- Added "Requests" link to the Dashboard Sidebar.

## Files Created/Modified

- `src/app/dashboard/requests/page.tsx` (New)
- `src/app/dashboard/requests/page.module.css` (New)
- `src/app/dashboard/requests/create/page.tsx` (New)
- `src/app/dashboard/requests/create/page.module.css` (New)
- `src/app/dashboard/requests/[id]/page.tsx` (New)
- `src/app/dashboard/requests/[id]/page.module.css` (New)
- `src/lib/api.ts` (Modified)
- `src/types/api.ts` (Modified)
- `src/app/dashboard/layout.tsx` (Modified)
- `src/components/ui/Button.tsx` (Modified)
- `src/components/ui/Button.module.css` (Modified)

## Testing Checklist

- [ ] **Create Request**:
  - Go to `/dashboard/requests/create`
  - Fill out form and submit
  - Verify redirect to list view
- [ ] **View List**:
  - Go to `/dashboard/requests`
  - Verify the newly created request appears
- [ ] **View Details**:
  - Click on a request
  - Verify all details are correct
  - Check status badge color
- [ ] **Cancel Request**:
  - Create a test request
  - Go to details page
  - Click "Cancel Request"
  - Verify status updates to "CANCELLED"
