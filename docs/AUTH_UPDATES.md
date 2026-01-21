# Authentication Updates

## Summary

Updated the authentication flow to link frontend with backend endpoints, added Google Sign Up, and removed GitHub login.

## Changes

### 1. **Login Page** (`src/app/auth/login/page.tsx`)

- **Linked Auth State**: Now uses `useAuth().login(token)` to update the global authentication state immediately after a successful login API call.
- **Removed GitHub**: Removed the GitHub social login button as requested.
- **Google Login**: Ensured the Google login button redirects to the backend OAuth endpoint (`/auth/google`).

### 2. **Signup Page** (`src/app/auth/signup/page.tsx`)

- **Added Google Sign Up**: Added a "Sign up with Google" button below the registration form.
- **Styling**: Added necessary CSS classes (`divider`, `socialButtons`, `socialBtn`) to `page.module.css` to support the new button.

### 3. **Auth Callback Page** (`src/app/auth/callback/page.tsx`)

- **New Page**: Created to handle the redirect from the backend after Google OAuth.
- **Token Handling**: Extracts the JWT token from URL query parameters (`token` or `access_token`).
- **Auto Login**: Uses `AuthContext` to log the user in and redirect to the dashboard.
- **Error Handling**: Redirects back to login page if authentication fails or no token is found.

### 4. **Auth Context** (`src/context/AuthContext.tsx`)

- Verified `login` function updates localStorage and triggers user fetch via `api.users.me()`.

## Testing Checklist

- [ ] **Login Flow**:
  - Enter valid credentials -> Click Sign In -> Verify redirect to Dashboard and user state update.
  - Click "Continue with Google" -> Verify redirect to backend Google Auth.
- [ ] **Signup Flow**:
- [ ] **Google OAuth Flow**:
  - Click "Continue with Google" or "Sign up with Google".
  - Authenticate with Google.
  - Verify redirect to `/auth/callback`.
  - Verify loading spinner appears briefly.
  - Verify final redirect to `/dashboard` with user logged in.
