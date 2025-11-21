import {
    LoginDto,
    SignupDto,
    AuthResponse,
    User,
    UpdateUserDto,
    Coordinates,
    NearbyNanny,
    NearbyJob,
    NearbySearchResponse,
    ApiResponse
} from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
    }

    return data;
}

export const api = {
    auth: {
        login: (body: LoginDto) => fetchApi<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
        signup: (body: SignupDto & { role: string }) => fetchApi<User>('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
    },
    users: {
        me: () => fetchApi<User>('/users/me'),
        get: (id: string) => fetchApi<User>(`/users/${id}`),
        nannies: () => fetchApi<User[]>('/users/nannies'),
        update: (id: string, body: UpdateUserDto) => fetchApi<User>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
        uploadImage: (userId: string, imageUrl: string) =>
            fetchApi<User>('/users/upload-image', {
                method: 'POST',
                body: JSON.stringify({ userId, imageUrl })
            }),
    },
    location: {
        geocode: (address: string) => fetchApi<ApiResponse<Coordinates>>('/location/geocode', { method: 'POST', body: JSON.stringify({ address }) }),
        nearbyNannies: (lat: number, lng: number, radius: number = 10) =>
            fetchApi<NearbySearchResponse<NearbyNanny>>(`/location/nannies/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
        nearbyJobs: (lat: number, lng: number, radius: number = 10) =>
            fetchApi<NearbySearchResponse<NearbyJob>>(`/location/jobs/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
    },
};
