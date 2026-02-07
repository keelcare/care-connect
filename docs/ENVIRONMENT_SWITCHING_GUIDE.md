# Developer Guide: Environment Switching

This document explains how to use the dynamic environment switching system implemented for CareConnect.

## 1. How It Works
The system is built to be "Origin-Aware." Instead of relying on hardcoded URLs, the backend dynamically detects where a request is coming from and adapts.

*   **Google OAuth**: The backend captures the frontend's origin (e.g., `localhost:3000`) and passes it into the OAuth state. After Google authenticates you, the backend reads that state and redirects you back to the exact environment you started from.
*   **Email Links**: Password reset and verification links are generated using the `Origin` or `Referer` header of the request. This ensures that if you request a reset from a local frontend, the link in your email will point to your local frontend.
*   **Dynamic Cookies**: The backend automatically sets cookie security based on the environment. If it detects a hosted frontend (HTTPS), it enables `Secure`, `SameSite=None`, and `Partitioned` cookies so logins work across domains.
*   **CORS & WebSockets**: Both the main API and the real-time gateways (Location/Notifications) are configured to allow multiple origins simultaneously.

## 2. Environment Variables Configuration

### Frontend (`CareConnect/.env.local`)
The frontend only needs to know which backend to talk to.

| Variable | Local Backend Example | Hosted DEV Backend Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | `https://care-connect-backend-production.up.railway.app` |

### Backend (`care-connect-backend/.env`)
The backend needs its own URL for OAuth callbacks and a default frontend fallback.

| Variable | Description | Example |
| :--- | :--- | :--- |
| `FRONTEND_URL` | The default fallback frontend URL | `http://localhost:3000` |
| `GOOGLE_CALLBACK_URL` | Must match the URI in Google Console | `http://localhost:4000/auth/google/callback` |
| `NODE_ENV` | Set to `development` for local testing | `development` |

## 3. How to Switch Environments

### Frontend Dev + Local Backend
1.  Set `NEXT_PUBLIC_API_URL=http://localhost:4000` in Frontend.
2.  Start both servers.
3.  Login/Signup will happen against your local database.

### Frontend Dev + Hosted Backend
1.  Set `NEXT_PUBLIC_API_URL=https://care-connect-backend-production.up.railway.app` in Frontend.
2.  The backend will detect you are on `localhost` and redirect you back to `localhost` after Google login.
3.  **Note**: Ensure `http://localhost:3000` is added to "Authorized JavaScript Origins" in your Google Cloud Console.

### Admin/Staging Testing
1.  Access the hosted frontend: `https://keelcare.netlify.app`.
2.  This frontend is already pointed to the hosted backend.
3.  Google login will correctly redirect you back to the Netlify URL.

## 4. Google Cloud Console Requirement
For this to work, **ALL** frontend and backend URLs must be whitelisted in the [Google Cloud Console](https://console.cloud.google.com/):
- **Authorized JavaScript Origins**: `http://localhost:3000`, `https://keelcare.netlify.app`
- **Authorized Redirect URIs**: `http://localhost:4000/auth/google/callback`, `https://care-connect-backend-production.up.railway.app/auth/google/callback`
