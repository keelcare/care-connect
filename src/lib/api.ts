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
    ApiResponse,
    CreateServiceRequestDto,
    ServiceRequest,
    Booking,
    CreateBookingDto,
    CancelBookingDto,
    Chat,
    Message,
    SendMessageDto,
    CreateChatDto,
    Review,
    CreateReviewDto,
    SendNotificationDto,
    AdminStats
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
        credentials: 'include', // Ensure cookies are sent (important for cross-site requests)
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        // Handle 401 Unauthorized - token expired or invalid
        if (response.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user_preferences');
            window.location.href = '/auth/login';
        }
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
    requests: {
        create: (body: CreateServiceRequestDto) => fetchApi<ServiceRequest>('/requests', { method: 'POST', body: JSON.stringify(body) }),
        get: (id: string) => fetchApi<ServiceRequest>(`/requests/${id}`),
        getParentRequests: () => fetchApi<ServiceRequest[]>('/requests/parent/me'),
        cancel: (id: string) => fetchApi<ServiceRequest>(`/requests/${id}/cancel`, { method: 'PUT' }),
        getMatches: (id: string) => fetchApi<User[]>(`/requests/${id}/matches`),
    },
    bookings: {
        create: (body: CreateBookingDto) => fetchApi<Booking>('/bookings', { method: 'POST', body: JSON.stringify(body) }),
        getActive: () => fetchApi<Booking[]>('/bookings/active'),
        getParentBookings: () => fetchApi<Booking[]>('/bookings/parent/me'),
        getNannyBookings: () => fetchApi<Booking[]>('/bookings/nanny/me'),
        get: (id: string) => fetchApi<Booking>(`/bookings/${id}`),
        start: (id: string) => fetchApi<Booking>(`/bookings/${id}/start`, { method: 'PUT' }),
        complete: (id: string) => fetchApi<Booking>(`/bookings/${id}/complete`, { method: 'PUT' }),
        cancel: (id: string, body: CancelBookingDto) => fetchApi<Booking>(`/bookings/${id}/cancel`, { method: 'PUT', body: JSON.stringify(body) }),
    },
    chat: {
        create: (body: CreateChatDto) => fetchApi<Chat>('/chat', { method: 'POST', body: JSON.stringify(body) }),
        getByBooking: (bookingId: string) => fetchApi<Chat>(`/chat/booking/${bookingId}`),
        getMessages: (chatId: string, page: number = 1, limit: number = 50) =>
            fetchApi<Message[]>(`/chat/${chatId}/messages?page=${page}&limit=${limit}`),
        sendMessage: (chatId: string, body: SendMessageDto) =>
            fetchApi<Message>(`/chat/${chatId}/message`, { method: 'POST', body: JSON.stringify(body) }),
    },
    reviews: {
        create: (body: CreateReviewDto) => fetchApi<Review>('/reviews', { method: 'POST', body: JSON.stringify(body) }),
        getByUser: (userId: string) => fetchApi<Review[]>(`/reviews/user/${userId}`),
        getByBooking: (bookingId: string) => fetchApi<Review[]>(`/reviews/booking/${bookingId}`),
    },
    notifications: {
        send: (body: SendNotificationDto) => fetchApi<{ success: boolean }>('/notifications/send', { method: 'POST', body: JSON.stringify(body) }),
    },
    admin: {
        getUsers: () => fetchApi<User[]>('/admin/users'),
        getBookings: () => fetchApi<Booking[]>('/admin/bookings'),
        getStats: () => fetchApi<AdminStats>('/admin/stats'),
        verifyUser: (id: string) => fetchApi<User>(`/admin/users/${id}/verify`, { method: 'PUT' }),
        banUser: (id: string) => fetchApi<User>(`/admin/users/${id}/ban`, { method: 'PUT' }),
    },
    assignments: {
        getNannyAssignments: () => fetchApi<any[]>('/assignments/nanny/me'),
        accept: (id: string) => fetchApi<any>(`/assignments/${id}/accept`, { method: 'PUT' }),
        reject: (id: string, reason?: string) => fetchApi<any>(`/assignments/${id}/reject`, { method: 'PUT', body: JSON.stringify({ reason }) }),
    },
};
