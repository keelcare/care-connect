# Browse Page & Role-Based Redirects

## Summary
Implemented a new "Browse" page for general users (parents) and updated the authentication flow to redirect users based on their role upon login.

## Changes

### 1. **Browse Page** (`src/app/browse/page.tsx`)
- **New Page**: Created a dedicated landing page for authenticated parents.
- **Features**:
  - Welcome header with user's name.
  - "Featured Caregivers" section (reusing existing component).
  - "Nearby Caregivers" section (currently fetching a subset of all nannies).
  - Links to the full search page.

### 2. **Auth Context** (`src/context/AuthContext.tsx`)
- **Role-Based Redirect**: Updated the `login` function to check the user's role after authentication.
  - **Parents** -> Redirect to `/browse`
  - **Nannies/Others** -> Redirect to `/dashboard`

## Testing Checklist

- [ ] **Parent Login**:
  - Log in as a user with role `parent`.
  - Verify redirect to `/browse`.
  - Verify "Featured" and "Nearby" sections are visible.
- [ ] **Nanny Login**:
  - Log in as a user with role `nanny`.
  - Verify redirect to `/dashboard`.
