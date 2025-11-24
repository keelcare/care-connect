export type UserRole = 'parent' | 'nanny' | 'admin';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
    profiles?: UserProfile;
    nanny_details?: NannyDetails;
}

export interface UserProfile {
    user_id: string;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    address: string | null;
    lat: string | null; // Decimal stored as string
    lng: string | null; // Decimal stored as string
    profile_image_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface NannyDetails {
    user_id: string;
    skills: string[];
    experience_years: number | null;
    hourly_rate: string | null; // Decimal stored as string
    bio: string | null;
    availability_schedule: Record<string, string[]> | null;
    created_at: string;
    updated_at: string;
}

export type JobStatus = 'open' | 'closed' | 'cancelled';

export interface Job {
    id: string;
    parent_id: string;
    title: string;
    description: string | null;
    date: string; // Date
    time: string; // Time
    location_lat: string | null; // Decimal stored as string
    location_lng: string | null; // Decimal stored as string
    status: JobStatus;
    created_at: string;
    updated_at: string;
}

// Authentication DTOs
export interface SignupDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    user: {
        id: string;
        email: string;
        role: UserRole;
    };
}

export interface GoogleUser {
    email: string;
    oauth_provider_id: string;
    oauth_access_token?: string;
    oauth_refresh_token?: string;
}

export interface Coordinates {
    lat: number;
    lng: number;
}

export interface NearbyNanny {
    id: string;
    email: string;
    role: 'nanny';
    profile: UserProfile | null;
    nanny_details: NannyDetails | null;
    distance: number; // in kilometers
}

export interface NearbyJob {
    id: string;
    title: string;
    description: string | null;
    date: string;
    time: string;
    location_lat: string | null;
    location_lng: string | null;
    status: JobStatus;
    parent: {
        id: string;
        email: string;
        role: 'parent';
        profiles: {
            first_name: string | null;
            last_name: string | null;
        } | null;
    } | null;
    distance: number; // in kilometers
}

export interface UpdateUserDto {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    lat?: number;
    lng?: number;
    profileImageUrl?: string;
    skills?: string[];
    experienceYears?: number;
    hourlyRate?: number;
    bio?: string;
    availabilitySchedule?: Record<string, string[]>;
}

export interface GeocodeAddressDto {
    address: string;
}

export interface NearbySearchDto {
    lat: number;
    lng: number;
    radius?: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    count: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface NearbySearchResponse<T> {
    success: boolean;
    count: number;
    radius: string;
    data: T[];
}

export type RequestStatus = 'PENDING' | 'ASSIGNED' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface ServiceRequest {
    id: string;
    parentId: string;
    nannyId?: string;
    status: RequestStatus;
    date: string;
    startTime: string;
    endTime?: string;
    durationHours: number;
    numChildren: number;
    childrenAges: number[];
    specialRequirements?: string;
    location: {
        address: string;
        lat: number;
        lng: number;
    };
    totalAmount?: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateServiceRequestDto {
    date: string;
    start_time: string;
    duration_hours: number;
    num_children: number;
    children_ages: number[];
    special_requirements?: string;
    address?: string; // Optional if using profile address
}

// Booking Types
export type BookingStatus = 'REQUESTED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Booking {
    id: string;
    job_id: string;
    parent_id: string;
    nanny_id: string;
    status: BookingStatus;
    start_time: string;
    end_time?: string;
    notes?: string;
    cancellation_reason?: string;
    created_at: string;
    updated_at: string;
    job?: Job;
    parent?: User;
    nanny?: User;
}

export interface CreateBookingDto {
    nannyId: string;
    date: string; // YYYY-MM-DD
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    notes?: string;
    jobId?: string; // Optional for backwards compatibility if needed
}

export interface CancelBookingDto {
    reason: string;
}

// Chat/Message Types
export interface Chat {
    id: string;
    booking_id?: string;
    participant_ids?: string[];
    created_at: string;
    updated_at: string;
    booking?: Booking;
}

export interface Message {
    id: string;
    chat_id: string;
    sender_id: string;
    content: string;
    attachment_url?: string;
    is_read: boolean;
    created_at: string;
    sender?: User;
}

export interface SendMessageDto {
    content: string;
    attachmentUrl?: string;
}

export interface CreateChatDto {
    participantId?: string;
    bookingId?: string;
}

// Review Types
export interface Review {
    id: string;
    booking_id: string;
    reviewer_id: string;
    reviewee_id: string;
    rating: number;
    comment?: string;
    created_at: string;
    updated_at: string;
    reviewer?: User;
    reviewee?: User;
    booking?: Booking;
}

export interface CreateReviewDto {
    bookingId: string;
    rating: number;
    comment?: string;
}

// Notification Types
export type NotificationType = 'email' | 'push' | 'sms';

export interface SendNotificationDto {
    type: NotificationType;
    to: string;
    subject?: string;
    content: string;
}

// Admin Types
export interface AdminStats {
    totalUsers: number;
    totalBookings: number;
    activeBookings: number;
}

