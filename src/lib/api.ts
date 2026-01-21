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
  AdminStats,
  RecurringBooking,
  CreateRecurringBookingDto,
  UpdateRecurringBookingDto,
  AvailabilityBlock,
  CreateAvailabilityBlockDto,
  Favorite,
  EnhancedReview,
  CreateEnhancedReviewDto,
  UpdateReviewDto,
  ReviewResponseDto,
  AdminDispute,
  AdminPaymentStats,
  AdminAdvancedStats,
  SystemSetting,
  Notification,
  IdentityDocument,
  VerificationUploadResponse,
  AdminVerificationRejectDto,
} from '@/types/api';

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Token refresh callback - will be set by AuthContext
// NOTE: With cookie-based auth, refresh is simpler but we still need to handle 401s
let tokenRefresher: (() => Promise<boolean>) | null = null;
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

export function setTokenRefresher(refresher: () => Promise<boolean>) {
  tokenRefresher = refresher;
}

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  skipRefresh = false
): Promise<T> {
  // With Cookie-based auth, we MUST send credentials
  const fetchOptions: RequestInit = {
    ...options,
    credentials: 'include', // This sends cookies with the request
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, fetchOptions);

  // Try to parse JSON, handle non-JSON responses
  let data;
  try {
    data = await response.json();
  } catch {
    data = { message: 'Invalid response from server' };
  }

  if (!response.ok) {
    // Handle 429 Too Many Requests - Exponential Backoff
    if (response.status === 429) {
      const retryCount = (options as any)._retryCount || 0;
      const MAX_RETRIES = 3;

      if (retryCount < MAX_RETRIES) {
        // Default to 1s, 2s, 4s... or use Retry-After header if available
        const retryAfterHeader = response.headers.get('Retry-After');
        let waitTime = 1000 * Math.pow(2, retryCount);

        if (retryAfterHeader) {
          const seconds = parseInt(retryAfterHeader, 10);
          if (!isNaN(seconds)) {
            waitTime = seconds * 1000;
          }
        }

        console.warn(
          `Rate limited (429). Retrying in ${waitTime}ms... (Attempt ${retryCount + 1}/${MAX_RETRIES})`
        );
        await new Promise((resolve) => setTimeout(resolve, waitTime));

        return fetchApi<T>(
          endpoint,
          {
            ...options,
            _retryCount: retryCount + 1,
          } as any,
          skipRefresh
        );
      }
    }

    // Handle 401 Unauthorized - try to refresh token first
    if (
      response.status === 401 &&
      typeof window !== 'undefined' &&
      !skipRefresh
    ) {
      // Try to refresh the token
      if (tokenRefresher) {
        // Prevent multiple simultaneous refresh attempts
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = tokenRefresher();
        }

        const refreshSuccess = await refreshPromise;
        isRefreshing = false;
        refreshPromise = null;

        if (refreshSuccess) {
          // Retry the original request (cookies will be upgraded automatically)
          const retryResponse = await fetch(
            `${API_URL}${endpoint}`,
            fetchOptions
          );

          // Also handle 429 on retry
          if (retryResponse.status === 429) {
            // As simple heuristic, if we get 429 immediately after refresh, just fail or let user retry.
            // Or implement loop. For now return what we got.
          }

          const retryData = await retryResponse.json();

          if (!retryResponse.ok) {
            throw new Error(retryData.message || 'An error occurred');
          }

          return retryData;
        }
      }

      // If refresh failed or no refresher, logout is handled by the consumer (AuthContext) redirects
      // or we can redirect here
      if (window.location.pathname !== '/auth/login') {
        window.location.href = '/auth/login';
      }
      throw new Error('Session expired');
    }
    throw new Error(data.message || 'An error occurred');
  }

  return data;
}

export const api = {
  auth: {
    // Login now returns just the user, tokens are in cookies
    login: (body: LoginDto) =>
      fetchApi<{ user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    signup: (body: SignupDto & { role: string }) =>
      fetchApi<User>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    // Refresh now expects empty body, tokens in cookies
    refresh: () =>
      fetchApi<void>(
        '/auth/refresh',
        {
          method: 'POST',
          body: JSON.stringify({}),
        },
        true
      ), // skipRefresh = true to prevent infinite loop
    logout: () => fetchApi<void>('/auth/logout', { method: 'POST' }),
    forgotPassword: (email: string) =>
      fetchApi<{ message: string }>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
    resetPassword: (token: string, newPassword: string) =>
      fetchApi<{ message: string }>('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
      }),
  },
  users: {
    me: () => fetchApi<User>('/users/me'),
    get: (id: string) => fetchApi<User>(`/users/${id}`),
    nannies: () => fetchApi<User[]>('/users/nannies'),
    update: (id: string, body: UpdateUserDto) =>
      fetchApi<User>(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    uploadImage: (userId: string, imageUrl: string) =>
      fetchApi<User>('/users/upload-image', {
        method: 'POST',
        body: JSON.stringify({ userId, imageUrl }),
      }),
  },
  location: {
    geocode: (address: string) =>
      fetchApi<ApiResponse<Coordinates>>('/location/geocode', {
        method: 'POST',
        body: JSON.stringify({ address }),
      }),
    nearbyNannies: (lat: number, lng: number, radius: number = 10) =>
      fetchApi<NearbySearchResponse<NearbyNanny>>(
        `/location/nannies/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
      ),
    nearbyJobs: (lat: number, lng: number, radius: number = 10) =>
      fetchApi<NearbySearchResponse<NearbyJob>>(
        `/location/jobs/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
      ),
  },
  requests: {
    create: (body: CreateServiceRequestDto) =>
      fetchApi<ServiceRequest>('/requests', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    get: (id: string) => fetchApi<ServiceRequest>(`/requests/${id}`),
    getParentRequests: () => fetchApi<ServiceRequest[]>('/requests/parent/me'),
    cancel: (id: string, reason?: string) =>
      fetchApi<ServiceRequest>(`/requests/${id}/cancel`, {
        method: 'PUT',
        body: reason ? JSON.stringify({ reason }) : undefined,
      }),
    getMatches: (id: string) => fetchApi<User[]>(`/requests/${id}/matches`),
  },
  bookings: {
    create: (body: CreateBookingDto) =>
      fetchApi<Booking>('/bookings', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    getActive: () => fetchApi<Booking[]>('/bookings/active'),
    getParentBookings: () => fetchApi<Booking[]>('/bookings/parent/me'),
    getNannyBookings: () => fetchApi<Booking[]>('/bookings/nanny/me'),
    get: (id: string) => fetchApi<Booking>(`/bookings/${id}`),
    start: (id: string) =>
      fetchApi<Booking>(`/bookings/${id}/start`, { method: 'PUT' }),
    complete: (id: string) =>
      fetchApi<Booking>(`/bookings/${id}/complete`, { method: 'PUT' }),
    cancel: (id: string, body: CancelBookingDto) =>
      fetchApi<Booking>(`/bookings/${id}/cancel`, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
  },
  chat: {
    create: (body: CreateChatDto) =>
      fetchApi<Chat>('/chat', { method: 'POST', body: JSON.stringify(body) }),
    getByBooking: (bookingId: string) =>
      fetchApi<Chat>(`/chat/booking/${bookingId}`),
    getMessages: (chatId: string, page: number = 1, limit: number = 50) =>
      fetchApi<Message[]>(
        `/chat/${chatId}/messages?page=${page}&limit=${limit}`
      ),
    sendMessage: (chatId: string, body: SendMessageDto) =>
      fetchApi<Message>(`/chat/${chatId}/message`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },
  reviews: {
    create: (body: CreateReviewDto) =>
      fetchApi<Review>('/reviews', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    getByUser: (userId: string) =>
      fetchApi<Review[]>(`/reviews/user/${userId}`),
    getByBooking: (bookingId: string) =>
      fetchApi<Review[]>(`/reviews/booking/${bookingId}`),
    checkEligibility: (bookingId: string) =>
      fetchApi<{
        canReview: boolean;
        reason: string | null;
        existingReview?: Review;
      }>(`/reviews/booking/${bookingId}/can-review`),
    getWrittenBy: (userId: string) =>
      fetchApi<Review[]>(`/reviews/written-by/${userId}`), // New endpoint for reviews written by user
  },
  notifications: {
    send: (body: SendNotificationDto) =>
      fetchApi<{ success: boolean }>('/notifications/send', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },
  admin: {
    getUsers: () => fetchApi<User[]>('/admin/users'),
    getBookings: () => fetchApi<Booking[]>('/admin/bookings'),
    getStats: () => fetchApi<AdminStats>('/admin/stats'),
    verifyUser: (id: string) =>
      fetchApi<User>(`/admin/users/${id}/verify`, { method: 'PUT' }),
    banUser: (id: string, reason?: string) =>
      fetchApi<User>(`/admin/users/${id}/ban`, {
        method: 'PUT',
        body: JSON.stringify({ reason }),
      }),
    unbanUser: (id: string) =>
      fetchApi<User>(`/admin/users/${id}/unban`, { method: 'PUT' }),
  },
  assignments: {
    getNannyAssignments: () => fetchApi<any[]>('/assignments/nanny/me'),
    accept: (id: string) =>
      fetchApi<any>(`/assignments/${id}/accept`, { method: 'PUT' }),
    reject: (id: string, reason?: string) =>
      fetchApi<any>(`/assignments/${id}/reject`, {
        method: 'PUT',
        body: JSON.stringify({ reason }),
      }),
  },
  recurringBookings: {
    create: (body: CreateRecurringBookingDto) =>
      fetchApi<RecurringBooking>('/recurring-bookings', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    list: () => fetchApi<RecurringBooking[]>('/recurring-bookings'),
    get: (id: string) =>
      fetchApi<RecurringBooking>(`/recurring-bookings/${id}`),
    update: (id: string, body: UpdateRecurringBookingDto) =>
      fetchApi<RecurringBooking>(`/recurring-bookings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    delete: (id: string) =>
      fetchApi<void>(`/recurring-bookings/${id}`, { method: 'DELETE' }),
  },
  availability: {
    list: () => fetchApi<AvailabilityBlock[]>('/availability'),
    create: (body: CreateAvailabilityBlockDto) =>
      fetchApi<AvailabilityBlock>('/availability/block', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    delete: (id: string) =>
      fetchApi<void>(`/availability/${id}`, { method: 'DELETE' }),
  },
  favorites: {
    list: () => fetchApi<Favorite[]>('/favorites'),
    add: (nannyId: string) =>
      fetchApi<Favorite>(`/favorites/${nannyId}`, { method: 'POST' }),
    remove: (nannyId: string) =>
      fetchApi<void>(`/favorites/${nannyId}`, { method: 'DELETE' }),
    check: (nannyId: string) =>
      fetchApi<{ isFavorite: boolean }>(`/favorites/${nannyId}/check`),
  },
  enhancedReviews: {
    create: (body: CreateEnhancedReviewDto) =>
      fetchApi<EnhancedReview>('/reviews', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    update: (id: string, body: UpdateReviewDto) =>
      fetchApi<EnhancedReview>(`/reviews/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    delete: (id: string) =>
      fetchApi<void>(`/reviews/${id}`, { method: 'DELETE' }),
    addResponse: (id: string, body: ReviewResponseDto) =>
      fetchApi<EnhancedReview>(`/reviews/${id}/response`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },
  enhancedNotifications: {
    list: () => fetchApi<Notification[]>('/notifications'),
    markAsRead: (id: string) =>
      fetchApi<Notification>(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllAsRead: () =>
      fetchApi<void>('/notifications/read-all', { method: 'PUT' }),
  },
  enhancedAdmin: {
    // Disputes
    getDisputes: () => fetchApi<AdminDispute[]>('/admin/disputes'),
    getDispute: (id: string) => fetchApi<AdminDispute>(`/admin/disputes/${id}`),
    resolveDispute: (id: string, resolution: string) =>
      fetchApi<AdminDispute>(`/admin/disputes/${id}/resolve`, {
        method: 'PUT',
        body: JSON.stringify({ resolution }),
      }),
    // Payments
    getPayments: () => fetchApi<any[]>('/admin/payments'),
    getPaymentStats: () => fetchApi<AdminPaymentStats>('/admin/payments/stats'),
    // Review Moderation
    getReviews: () => fetchApi<EnhancedReview[]>('/admin/reviews'),
    approveReview: (id: string) =>
      fetchApi<EnhancedReview>(`/admin/reviews/${id}/approve`, {
        method: 'PUT',
      }),
    rejectReview: (id: string) =>
      fetchApi<EnhancedReview>(`/admin/reviews/${id}/reject`, {
        method: 'PUT',
      }),
    // System Settings
    getSettings: () => fetchApi<SystemSetting[]>('/admin/settings'),
    getSetting: (key: string) =>
      fetchApi<SystemSetting>(`/admin/settings/${key}`),
    updateSetting: (key: string, value: any) =>
      fetchApi<SystemSetting>(`/admin/settings/${key}`, {
        method: 'POST',
        body: JSON.stringify({ value }),
      }),
    // Advanced Analytics
    getAdvancedStats: () =>
      fetchApi<AdminAdvancedStats>('/admin/stats/advanced'),
  },
  ai: {
    chat: async (message: string) => {
      const response = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(typeof window !== 'undefined' && localStorage.getItem('token')
            ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
            : {}),
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        // Even if not OK, try to get text if possible, or throw
        throw new Error('Failed to send message');
      }

      const text = await response.text();
      return { response: text };
    },
  },
  verification: {
    upload: (formData: FormData) => {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      return fetch(`${API_URL}/verification/upload`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          // Content-Type is intentionally omitted to let the browser set it with boundary
        },
        body: formData,
      }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res
            .json()
            .catch(() => ({ message: 'Upload failed' }));
          throw new Error(errorData.message || 'Upload failed');
        }
        return res.json();
      });
    },
    reset: () => fetchApi<void>('/verification/reset', { method: 'DELETE' }),
    getPending: () => fetchApi<User[]>('/verification/pending'),
    approve: (id: string) =>
      fetchApi<{
        identity_verification_status: string;
        verification_rejection_reason: null;
      }>(`/verification/${id}/approve`, { method: 'POST' }),
    reject: (id: string, body: AdminVerificationRejectDto) =>
      fetchApi<{
        identity_verification_status: string;
        verification_rejection_reason: string;
      }>(`/verification/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },
};
