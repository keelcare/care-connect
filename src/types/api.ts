export type UserRole = 'parent' | 'nanny' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  is_verified: boolean;
  is_active: boolean;
  ban_reason?: string | null;
  identity_verification_status?: 'pending' | 'verified' | 'rejected' | null;
  verification_rejection_reason?: string | null;
  identity_documents?: IdentityDocument[];
  created_at: string;
  updated_at: string;
  profiles?: UserProfile;
  nanny_details?: NannyDetails;
  averageRating?: number;
  totalReviews?: number;
  children?: Child[];
}

export interface IdentityDocument {
  id: string;
  type: 'AADHAR' | 'PAN' | 'VOTER_ID';
  id_number: string;
  file_path: string;
  original_name?: string;
  uploaded_at: string;
}

export type ChildProfileType = 'STANDARD' | 'SPECIAL_NEEDS';

export interface Child {
  id: string;
  parent_id: string;
  first_name: string;
  last_name: string;
  dob: string; // ISO Date
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  profile_type: ChildProfileType;

  // Standard Fields
  allergies?: string[];
  dietary_restrictions?: string[];

  // Special Needs / Shadow Teacher Fields
  diagnosis?: string; // Optional
  care_instructions?: string;
  emergency_contact_override?: {
    name: string;
    phone: string;
    relation: string;
  };

  // Shadow Teacher Specifics
  school_details?: {
    name: string;
    grade: string;
    teacher_contact?: string;
  };
  learning_goals?: string[];

  created_at: string;
  updated_at: string;
}

export interface VerificationUploadResponse {
  id: string;
  identity_verification_status: string;
  identity_documents: IdentityDocument[];
}

export interface AdminVerificationRejectDto {
  reason: string;
}

export interface UserProfile {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  full_name?: string | null; // Backend may return this
  phone: string | null;
  bio?: string | null; // Backend may include bio here
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

// Service Types
export interface Service {
  id: string;
  name: string;
  hourly_rate: string;
  created_at: string;
  updated_at: string;
}

export type ServiceType = 'CHILD_CARE' | 'SHADOW_TEACHER' | 'SPECIAL_NEEDS' | 'PET_CARE' | 'HOUSEKEEPING';

export type SubscriptionPlanType = 'ONE_TIME' | 'MONTHLY' | 'SIX_MONTH' | 'YEARLY';

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
  refresh_token?: string;
  user: User;
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

export type RequestStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'pending'
  | 'assigned'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface ServiceRequest {
  id: string;
  parent_id: string;
  nanny_id?: string;
  status: RequestStatus;
  service_type?: ServiceType;
  date: string;
  start_time: string;
  end_time?: string;
  duration_hours: number;
  num_children: number;
  children_ages: number[];
  special_requirements?: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  // Shadow Teacher subscription fields
  plan_type?: SubscriptionPlanType;
  plan_duration_months?: number;
  monthly_rate?: number;
  discount_percentage?: number;
  total_plan_amount?: number;
  total_amount?: number;
  cancellation_reason?: string;
  category: string;
  created_at: string;
  updated_at: string;
  parent?: User;
  nanny?: User;
}

export interface CreateServiceRequestDto {
  date: string;
  start_time: string;
  duration_hours: number;
  num_children: number;
  child_ids?: string[];
  children_ages: number[];
  category: string;
  special_requirements?: string;
  max_hourly_rate?: number;
  required_skills?: string[];
  // Shadow Teacher subscription fields
  plan_type?: SubscriptionPlanType;
  plan_duration_months?: number;
  monthly_rate?: number;
  discount_percentage?: number;
  location?: {
    address: string;
    lat: number;
    lng: number;
  };
}

// Booking Types
export type BookingStatus =
  | 'REQUESTED'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'requested';

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
  cancellation_fee?: number;
  cancellation_fee_status?: 'pending' | 'paid' | 'waived';
  tags?: string[];
  created_at: string;
  updated_at: string;
  job?: Job;
  parent?: User;
  nanny?: User;
  users_bookings_nanny_idTousers?: User;
}

export interface CreateBookingDto {
  nannyId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  numChildren: number;
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

// Recurring Booking Types
export type RecurrencePattern =
  | 'DAILY'
  | 'WEEKLY_MON'
  | 'WEEKLY_TUE'
  | 'WEEKLY_WED'
  | 'WEEKLY_THU'
  | 'WEEKLY_FRI'
  | 'WEEKLY_SAT'
  | 'WEEKLY_SUN'
  | 'WEEKLY_MON_WED_FRI'
  | 'WEEKLY_TUE_THU'
  | 'MONTHLY_1'
  | 'MONTHLY_15'
  | 'MONTHLY_1_15'
  | string; // Allow custom patterns like WEEKLY_MON_TUE_WED

export interface RecurringBooking {
  id: string;
  parent_id: string;
  nanny_id: string;
  recurrence_pattern: RecurrencePattern;
  start_date: string;
  end_date?: string;
  start_time: string;
  duration_hours: number;
  num_children: number;
  children_ages: number[];
  special_requirements?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  parent?: User;
  nanny?: User;
  bookings?: Booking[];
}

export interface CreateRecurringBookingDto {
  nannyId: string;
  recurrencePattern: RecurrencePattern;
  startDate: string;
  endDate?: string;
  startTime: string;
  durationHours: number;
  numChildren: number;
  childrenAges?: number[];
  specialRequirements?: string;
}

export interface UpdateRecurringBookingDto {
  recurrencePattern?: RecurrencePattern;
  endDate?: string;
  isActive?: boolean;
}

// Availability Block Types
export interface AvailabilityBlock {
  id: string;
  nanny_id: string;
  start_time: string;
  end_time: string;
  is_recurring: boolean;
  recurrence_pattern?: RecurrencePattern;
  reason?: string;
  created_at: string;
}

export interface CreateAvailabilityBlockDto {
  startTime: string;
  endTime: string;
  isRecurring?: boolean;
  recurrencePattern?: RecurrencePattern;
  reason?: string;
}

// Favorites Types
export interface Favorite {
  id: string;
  parent_id: string;
  nanny_id: string;
  created_at: string;
  nanny?: User;
  // Backend returns nanny data under this key
  users_favorite_nannies_nanny_idTousers?: User;
}

// Enhanced Review Types (with 5 rating categories)
export interface EnhancedReview {
  id: string;
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  rating_punctuality?: number;
  rating_professionalism?: number;
  rating_care_quality?: number;
  rating_communication?: number;
  comment?: string;
  response?: string;
  created_at: string;
  updated_at: string;
  reviewer?: User;
  reviewee?: User;
  booking?: Booking;
}

export interface CreateEnhancedReviewDto {
  bookingId: string;
  revieweeId: string;
  rating: number;
  rating_punctuality?: number;
  rating_professionalism?: number;
  rating_care_quality?: number;
  rating_communication?: number;
  comment?: string;
}

export interface UpdateReviewDto {
  rating?: number;
  rating_punctuality?: number;
  rating_professionalism?: number;
  rating_care_quality?: number;
  rating_communication?: number;
  comment?: string;
}

export interface ReviewResponseDto {
  response: string;
}

// Admin Enhanced Types
export interface AdminDispute {
  id: string;
  booking_id: string;
  reported_by: string;
  reason: string;
  status: 'open' | 'investigating' | 'resolved';
  resolution?: string;
  resolved_by?: string;
  created_at: string;
  updated_at: string;
  booking?: Booking;
  reporter?: User;
}

export interface AdminPaymentStats {
  totalPayments: number;
  pendingPayments: number;
  totalRevenue: number;
}

export interface AdminAdvancedStats {
  completionRate: number;
  acceptanceRate: number;
  totalRevenue: number;
  popularBookingTimes: { hour: number; count: number }[];
}

export interface SystemSetting {
  key: string;
  value: string | number | boolean;
  description?: string;
}

// Notification Types (enhanced)
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
  related_id?: string;
  category?: string;
}
