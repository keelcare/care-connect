# Quick Reference: Using Updated API Endpoints

## Fetching All Nannies

Instead of relying only on nearby search, you can now fetch all nannies:

```typescript
// In your Search page or component
import { api } from '@/lib/api';

// Fetch all nannies (returns User[] with role='nanny')
const allNannies = await api.users.nannies();

// Each nanny has this structure:
{
  id: string;
  email: string;
  role: 'nanny';
  is_verified: boolean;
  profiles: {
    first_name: string;
    last_name: string;
    address: string;
    profile_image_url: string;
    // ... other profile fields
  };
  nanny_details: {
    skills: string[];
    experience_years: number;
    hourly_rate: string;  // e.g., "25.00"
    bio: string;
    availability_schedule: { ... };
  };
}
```

## Important Type Differences

### Full User Object (from `/users/me`, `/users/:id`, `/users/nannies`)
```typescript
{
  profiles: UserProfile;  // ✅ plural
  is_verified: boolean;   // ✅ included
}
```

### NearbyNanny Object (from `/location/nannies/nearby`)
```typescript
{
  profile: UserProfile;   // ✅ singular
  // is_verified not included
  distance: number;       // ✅ extra field
}
```

## Example: Enhanced Search Page

```typescript
"use client";

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { User, NearbyNanny } from '@/types/api';

export default function SearchPage() {
    const [nannies, setNannies] = useState<User[]>([]);
    const [nearbyNannies, setNearbyNannies] = useState<NearbyNanny[]>([]);
    
    // Option 1: Fetch all nannies (no location required)
    useEffect(() => {
        const fetchAll = async () => {
            const data = await api.users.nannies();
            setNannies(data);
        };
        fetchAll();
    }, []);
    
    // Option 2: Fetch nearby nannies (requires coordinates)
    const searchNearby = async (lat: number, lng: number) => {
        const response = await api.location.nearbyNannies(lat, lng, 10);
        if (response.success) {
            setNearbyNannies(response.data);
        }
    };
    
    // Render full User objects
    return (
        <div>
            {nannies.map(nanny => (
                <div key={nanny.id}>
                    <h3>{nanny.profiles?.first_name} {nanny.profiles?.last_name}</h3>
                    <p>${nanny.nanny_details?.hourly_rate}/hr</p>
                    {nanny.is_verified && <span>✓ Verified</span>}
                </div>
            ))}
            
            {/* OR render nearby results */}
            {nearbyNannies.map(nanny => (
                <div key={nanny.id}>
                    <h3>{nanny.profile?.first_name} {nanny.profile?.last_name}</h3>
                    <p>${nanny.nanny_details?.hourly_rate}/hr</p>
                    <p>{nanny.distance.toFixed(1)} km away</p>
                </div>
            ))}
        </div>
    );
}
```

## Uploading Profile Images

```typescript
// Update user's profile image
const updateProfileImage = async (userId: string, imageUrl: string) => {
    const updatedUser = await api.users.uploadImage(userId, imageUrl);
    console.log('Image updated:', updatedUser.profiles?.profile_image_url);
};

// Example usage
await updateProfileImage(
    currentUser.id, 
    'https://example.com/profile-pic.jpg'
);
```

## Best Practices

1. **Use `/users/nannies` for browse/list views** - No coordinates needed
2. **Use `/location/nannies/nearby` for location-based search** - Shows distance
3. **Check field names** - `profiles` vs `profile` depending on endpoint
4. **Handle null values** - Use optional chaining (`?.`) for nested fields
5. **Type your responses** - Use `User[]` or `NearbyNanny[]` appropriately

## Common Pitfalls

❌ **Wrong:**
```typescript
const nannies = await api.location.nearbyNannies(lat, lng);
console.log(nannies.data[0].profiles.first_name); // profiles is undefined!
```

✅ **Correct:**
```typescript
const response = await api.location.nearbyNannies(lat, lng);
console.log(response.data[0].profile?.first_name); // profile (singular)
```

❌ **Wrong:**
```typescript
const nannies = await api.users.nannies();
console.log(nannies[0].profile.first_name); // profile is undefined!
```

✅ **Correct:**
```typescript
const nannies = await api.users.nannies();
console.log(nannies[0].profiles?.first_name); // profiles (plural)
```
