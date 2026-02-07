# Environment Switching Configuration Guide

This guide explains how to configure Google OAuth and environment variables to support multiple environments (Local, DEV, and Production) seamlessly.

## 1. Google Cloud Console Setup

To support multiple backends and frontends, you must configure your **OAuth 2.0 Client IDs** in the [Google Cloud Console](https://console.cloud.google.com/).

### Authorized JavaScript Origins
Add all frontend URLs that will initiate the login:
- `http://localhost:3000`
- `https://keelcare.netlify.app`
- `https://your-production-frontend.com`

### Authorized Redirect URIs
Add the callback URLs for **each backend environment**:
- `http://localhost:4000/auth/google/callback` (Local Backend)
- `https://care-connect-backend-production.up.railway.app/auth/google/callback` (DEV Backend)
- `https://your-production-backend.com/auth/google/callback` (Production Backend)

## 2. Environment Variables (.env)

### Frontend (`CareConnect/.env.local`)
To switch backends, simply change `NEXT_PUBLIC_API_URL`.

```bash
# To use Local Backend
NEXT_PUBLIC_API_URL=http://localhost:4000

# To use DEV Backend (Hosted)
NEXT_PUBLIC_API_URL=https://care-connect-backend-production.up.railway.app
```

### Backend (`care-connect-backend/.env`)
The backend now supports dynamic redirection, but `FRONTEND_URL` is still the default fallback.

```bash
# Local Backend
FRONTEND_URL=http://localhost:3000
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback

# DEV Backend (Hosted)
FRONTEND_URL=https://keelcare.netlify.app
GOOGLE_CALLBACK_URL=https://care-connect-backend-production.up.railway.app/auth/google/callback
```

## 3. How it Works
1. **Initiation**: The Frontend sends its current `origin` (e.g., `localhost:3000`) to the Backend's `/auth/google` endpoint or as a header in AJAX requests.
2. **State/Context Capturing**: The Backend captures this `origin`. For Google, it's stored in `state`. For standard flows (forgot password, signup), it's captured from the `Origin` or `Referer` headers.
3. **Execution**:
   - **Google**: Google redirects back to the *Backend*, which then uses the stored `origin` to redirect back to the correct *Frontend*.
   - **Emails**: Links for Password Reset and Email Verification use the captured `origin` as the base URL.
4. **Session Security**: The Backend dynamically sets cookie security options:
   - If the origin is `HTTPS`, cookies are set with `SameSite=None; Secure; Partitioned`.
   - This allows a local backend (`HTTP`) to work with a hosted frontend (`HTTPS`) seamlessly.
5. **CORS**: The Backend's `main.ts` and Socket.io gateways allow requests from any of the registered frontend origins.

