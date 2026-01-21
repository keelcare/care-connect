# API Integration Update Summary

## Date: 2025-11-20

### Overview

Updated the frontend codebase to align with the latest backend API documentation, specifically the FRONTEND_INTEGRATION.md and API.md files.

### Key Changes

#### 1. API Client Updates (`src/lib/api.ts`)

- **Added** `GET /users/nannies` endpoint to fetch all caregivers
  - Returns: `User[]` with nanny role
  - Public endpoint, no authentication required
- **Added** `POST /users/upload-image` endpoint
  - Accepts: `{ userId: string, imageUrl: string }`
  - Returns: Updated `User` object
  - Currently accepts URL strings (file upload to be added later)

```typescript
users: {
    me: () => fetchApi<User>('/users/me'),
    get: (id: string) => fetchApi<User>(`/users/${id}`),
    nannies: () => fetchApi<User[]>('/users/nannies'),  // NEW
    update: (id: string, body: UpdateUserDto) => fetchApi<User>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    uploadImage: (userId: string, imageUrl: string) =>  // NEW
        fetchApi<User>('/users/upload-image', {
            method: 'POST',
            body: JSON.stringify({ userId, imageUrl })
        }),
}
```

#### 2. Type Definition Fixes (`src/types/api.ts`)

- **Fixed** `NearbyNanny` interface to match API response structure:
  - Changed `profiles` → `profile` (singular)
  - Removed `is_verified` field (not included in nearby search responses)

```typescript
// BEFORE
export interface NearbyNanny {
  id: string;
  email: string;
  role: 'nanny';
  is_verified: boolean; // ❌ Not in API response
  profiles: UserProfile | null; // ❌ Wrong field name
  nanny_details: NannyDetails | null;
  distance: number;
}

// AFTER
export interface NearbyNanny {
  id: string;
  email: string;
  role: 'nanny';
  profile: UserProfile | null; // ✅ Correct field name
  nanny_details: NannyDetails | null;
  distance: number;
}
```

#### 3. Search Page Updates (`src/app/search/page.tsx`)

- Updated all references from `nanny.profiles` → `nanny.profile`
- Updated mock data to match new type structure
- Removed `is_verified` from mock `NearbyNanny` objects
- Set `isVerified={false}` in ProfileCard (field not available in nearby search)

```typescript
// Updated ProfileCard props
<ProfileCard
    name={`${nanny.profile?.first_name || 'Caregiver'} ${nanny.profile?.last_name || ''}`}
    image={nanny.profile?.profile_image_url || '...'}
    location={nanny.profile?.address || `${nanny.distance.toFixed(1)} km away`}
    isVerified={false}  // Not available in NearbyNanny response
    // ... other props
/>
```

### API Endpoints Reference

#### Available Endpoints

1. **Authentication**
   - `POST /auth/signup` - Register new user
   - `POST /auth/login` - Login with email/password
   - `GET /auth/google` - Initiate Google OAuth
   - `GET /auth/google/callback` - OAuth callback

2. **Users**
   - `GET /users/me` - Get current user (requires auth)
   - `GET /users/:id` - Get user by ID (public)
   - `GET /users/nannies` - Get all nannies (public) ✨ NEW
   - `PUT /users/:id` - Update user profile
   - `POST /users/upload-image` - Upload profile image URL ✨ NEW

3. **Location**
   - `POST /location/geocode` - Convert address to coordinates
   - `GET /location/nannies/nearby` - Find nearby nannies
   - `GET /location/jobs/nearby` - Find nearby jobs

### Important Notes

1. **Backend Port**: Backend runs on `http://localhost:4000` (not 3000)
2. **Frontend Port**: Frontend should run on `http://localhost:3000` for CORS to work
3. **CORS**: Backend is configured for `http://localhost:3000` by default
4. **Authentication**: JWT tokens stored in `localStorage` with key `'token'`
5. **Profile Images**: Currently accepts URL strings, file upload to be added later
6. **Sensitive Fields**: Password hashes and OAuth tokens are automatically excluded from API responses

### Testing

All changes have been tested:

- ✅ Build successful (`npm run build`)
- ✅ Linting passed (`npm run lint`)
- ✅ Type checking passed
- ✅ All pages render without errors

### Next Steps

1. **Use `/users/nannies` endpoint** in Search page for initial load
2. **Implement profile image upload** when backend adds file upload support
3. **Add error boundaries** for better error handling
4. **Consider pagination** for large result sets

### Files Modified

- `src/lib/api.ts` - Added new endpoints
- `src/types/api.ts` - Fixed NearbyNanny interface
- `src/app/search/page.tsx` - Updated to use correct field names
