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
  nanny_onboarding_details?: NannyOnboardingDetails | null;
  averageRating?: number;
  totalReviews?: number;
  children?: Child[];
  bookings?: Record<string, number>;
}

export interface IdentityDocument {
  id: string;
  type: 'AADHAR' | 'PAN' | 'VOTER_ID' | 'RESUME';
  id_number: string;
  file_path: string;
  original_name?: string;
  uploaded_at: string;
}

export interface NannyOnboardingDetails {
  user_id: string;
  age: number | null;
  gender: string | null;
  permanent_address: string | null;
  city: string | null;
  education_qualification: string | null;
  education_qualification_other: string | null;
  stream_subjects: string | null;
  shadow_teacher_experience: string | null;
  age_groups_worked: string[];
  children_types_supported: string[];
  children_types_other: string | null;
  academic_subjects: string[];
  hobbies_interests: string | null;
  hobbies_activities_for_child: string[];
  previous_salary: string | null;
  available_start_date: string | null;
  training_agreement: boolean | null;
  placement_fee_agreement: boolean | null;
  police_verification_consent: boolean | null;
  declaration_confirmed: boolean | null;
  declaration_confirmed_at: string | null;
  onboarding_completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpsertNannyOnboardingDto {
  age?: number;
  gender?: string;
  permanentAddress?: string;
  city?: string;
  educationQualification?: string;
  educationQualificationOther?: string;
  streamSubjects?: string;
  shadowTeacherExperience?: string;
  ageGroupsWorked?: string[];
  childrenTypesSupported?: string[];
  childrenTypesOther?: string;
  academicSubjects?: string[];
  hobbiesInterests?: string;
  hobbiesActivitiesForChild?: string[];
  previousSalary?: string;
  availableStartDate?: string;
  trainingAgreement?: boolean;
  placementFeeAgreement?: boolean;
  policeVerificationConsent?: boolean;
  declarationConfirmed?: boolean;
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

  // Basic care preferences
  personality_notes?: string;     // e.g. "shy at first, loves animals"
  hobbies?: string[];
  bedtime?: string;               // e.g. "8:30 PM"
  nap_schedule?: string;          // e.g. "2 PM – 3:30 PM"

  // Health & safety
  allergies?: string[];
  allergy_severity?: 'mild' | 'moderate' | 'severe'; // severity of worst allergy
  dietary_restrictions?: string[];
  medical_notes?: string;         // GP name, recurring conditions, meds
  report_url?: string;            // URL to uploaded school/medical report

  // Emergency contact (overrides parent's default)
  emergency_contact?: {
    name: string;
    phone: string;
    relation: string;
  };
  // Legacy alias — same field, kept for backwards compatibility
  emergency_contact_override?: {
    name: string;
    phone: string;
    relation: string;
  };

  // Special Needs / Shadow Teacher Fields
  diagnosis?: string;
  care_instructions?: string;

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
  address: string | null; // Typed residential address (onboarding)
  location_address?: string | null; // Label for the matching location (lat/lng)
  lat: string | null; // Decimal stored as string
  lng: string | null; // Decimal stored as string
  profile_image_url: string | null;
  onboarding_completed?: boolean;
  created_at: string;
  updated_at: string;
}

export interface NannyDetails {
  user_id: string;
  skills: string[];
  experience_years: number | null;
  hourly_rate: string | null; // Decimal stored as string
  bio: string | null;
  categories: string[];
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
  categories?: string[];
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
  locationAddress?: string;
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
  hourly_rate?: number;
  parent?: User;
  nanny?: User;
  // Enriched fields returned by findOne
  title?: string;
  booking_id?: string;
  assignments?: Assignment[];
}

export interface Assignment {
  id: string;
  nanny_id: string;
  request_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  request?: ServiceRequest;
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
// max_hourly_rate removed as it is now handled server-side from constants/DB
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
  payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
  start_time: string;
  start_time_formatted?: string;
  end_time?: string;
  notes?: string;
  cancellation_reason?: string;
  cancellation_fee?: number;
  cancellation_fee_status?: 'pending' | 'paid' | 'waived';
  tags?: string[];
  created_at: string;
  updated_at: string;
  total_amount?: number;
  hourly_rate?: number;
  service_request?: ServiceRequest;
  job?: Job;
  parent?: User;
  nanny?: User;
  users_bookings_nanny_idTousers?: User;
  users_bookings_parent_idTousers?: User;
  recurring_request_id?: string | null;
  request_id?: string | null;
  // Enriched fields from backend getBookingById
  nanny_name?: string;
  title?: string;
  hours_per_day?: number;
  service_requests?: ServiceRequest;
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
  target: 'user' | 'parents' | 'nannies';
  userId?: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
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

// Nanny Category Requests
export type CategoryRequestStatus = 'pending' | 'approved' | 'rejected';

export interface CategoryRequest {
  id: string;
  nanny_id: string;
  requested_categories: string[];
  status: CategoryRequestStatus;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminCategoryRequest extends CategoryRequest {
  users: {
    email: string;
    profiles: {
      first_name: string | null;
      last_name: string | null;
    } | null;
  };
}

export interface AdminManualAssignmentDto {
  requestId?: string;
  bookingId?: string;
  nannyId: string;
  force?: boolean;
}

/** Shape of recurrence_pattern for the recurring-request system. */
export interface RecurringRequestPattern {
  days?: string[];   // e.g. ['MON', 'WED'] for weekly recurrence
  dates?: number[];  // e.g. [1, 15] for specific-date recurrence
}

export interface CreateRecurringRequestDto {
  recurrence_type: 'weekly' | 'specific_dates';
  recurrence_pattern: RecurringRequestPattern;
  start_date: string;
  end_date?: string;
  start_time: string;
  duration_hours: number;
  num_children: number;
  children_ages: number[];
  child_ids?: string[];
  category: string;
  plan_type: string;
  plan_duration_months?: number;
  sessions_per_month?: number;
  special_requirements?: string;
  required_skills?: string[];
}

export interface RecurringServiceRequest {
  id: string;
  parent_id: string;
  status: string;
  recurrence_type: 'weekly' | 'specific_dates' | string;
  recurrence_pattern: RecurringRequestPattern;
  start_date: string;
  end_date?: string;
  start_time: string;
  start_time_formatted?: string;
  duration_hours: number;
  num_children: number;
  category: string;
  plan_type: string;
  created_at: string;
  updated_at: string;
  total_bookings?: number;
  next_upcoming_date?: string | null;
  bookings?: Booking[];
  parent?: User;
  _count?: { bookings: number };
  /** Assigned caregiver, enriched from the series' child bookings. */
  nanny?: {
    id: string;
    profiles?: {
      first_name: string | null;
      last_name: string | null;
      profile_image_url: string | null;
    } | null;
  } | null;
  /** Current base hourly rate for the series' category. */
  hourly_rate?: number | null;
  /** hourly_rate × duration_hours × total_bookings. */
  estimated_total?: number | null;
}

export interface AdminManualRequest {
  id: string;
  category: string;
  date: string;
  start_time: string;
  duration_hours: string;
  status: string;
  address: string;
  parent_name: string;
  children_count: number;
  children_names: string;
  special_requirements: string;
  location_lat: number;
  location_lng: number;
  isBookingId?: boolean;
  is_recurring?: boolean;
}

export interface AdminManualNanny {
  id: string;
  first_name: string;
  last_name: string;
  profile_image_url: string;
  distance_km: number;
  experience_years: number;
  match_details: {
    total_score: number;
    matching_skills: string[];
    score_breakdown: {
      skills: number;
      experience: number;
      acceptance_rate: number;
      favorite_bonus: number;
    };
  };
}

// Support Ticket Types
export type SupportCategory = 'payment' | 'booking' | 'technical' | 'grievance' | 'account' | 'other';
export type SupportPriority = 'low' | 'medium' | 'high' | 'critical';
export type SupportStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface SupportTicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string | null;
  is_admin: boolean;
  content: string;
  created_at: string;
  sender?: {
    email?: string;
    profiles?: {
      first_name: string | null;
      last_name: string | null;
      profile_image_url?: string | null;
    } | null;
  } | null;
}

export interface SupportTicket {
  id: string;
  ticket_number: string;
  user_id: string;
  booking_id?: string | null;
  role: 'parent' | 'nanny';
  subject: string;
  description: string;
  category: SupportCategory | string;
  priority: SupportPriority;
  status: SupportStatus;
  admin_notes: string | null;
  resolved_at: string | null; // ISO Date string
  created_at: string;
  updated_at: string;

  // Included in Admin responses
  users?: {
    email: string;
    identity_verification_status?: string;
    profiles: {
      first_name: string | null;
      last_name: string | null;
      phone: string | null;
    } | null;
  };

  // Included on the admin detail endpoint
  bookings?: Booking | null;
  support_ticket_messages?: SupportTicketMessage[];
}

export interface CreateTicketDto {
  subject: string;
  description: string;
  category: SupportCategory | string;
  priority?: SupportPriority;
  bookingId?: string;
}

export interface CreateTicketMessageDto {
  content: string;
}

export interface UpdateTicketDto {
  status?: SupportStatus;
  priority?: SupportPriority;
  admin_notes?: string;
}

export type PaymentAuditStatus = 'created' | 'captured' | 'failed';

export interface PaymentAuditQuery {
  orderId?: string;
  bookingId?: string;
  razorpayPaymentId?: string;
  toStatus?: PaymentAuditStatus;
  triggeredBy?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

export interface PaymentAuditPaymentInfo {
  id?: string;
  orderId?: string;
  bookingId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string | null;
  status?: string;
  amount?: number;
  currency?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentAuditRow {
  id: string;
  paymentId?: string;
  orderId?: string;
  bookingId?: string;
  fromStatus?: string | null;
  toStatus: PaymentAuditStatus | string;
  triggeredBy?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  payment?: PaymentAuditPaymentInfo | null;
}

export interface PaymentAuditPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaymentAuditListResponse {
  items: PaymentAuditRow[];
  pagination: PaymentAuditPagination;
}

export interface PaymentAuditSummaryWindow {
  last7Days?: {
    from?: string;
    to?: string;
  };
  [key: string]: unknown;
}

export interface PaymentAuditSummaryCounts {
  failedLast7Days: number;
  duplicateAttemptsLast7Days: number;
  createdStuckOver24Hours: number;
}

export interface PaymentAuditSummary {
  window: PaymentAuditSummaryWindow;
  counts?: Record<string, number>;
  failedLast7Days: number;
  duplicateAttemptsLast7Days: number;
  createdStuckOver24Hours: number;
  generatedAt: string;
}

export interface PriceSnapshot {
  id: string;
  booking_id: string;
  payment_plan_id: string | null;
  cycle_number: number;
  base_hourly_rate_used: number;
  discount_percent_used: number;
  hours_billed: number;
  custom_price_applied: boolean;
  final_amount: number;              // INR — use this for display
  status: 'pending' | 'charged';
  razorpay_payment_id: string | null;
  payment_id: string | null;
  created_at: string;
  payments?: {
    status: string;
    amount: number;
    currency: string;
    order_id: string;
    created_at: string;
  } | null;
}

export interface PaymentPlan {
  id: string;
  booking_id: string;
  total_cycles: number;             // replaces total_months
  cycles_completed: number;
  start_date: string;
  next_due_date: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;

  bookings?: {
    id: string;
    nanny_id: string | null;
    service_requests?: { category: string } | null;
    users_bookings_nanny_idTousers?: {
      profiles?: {
        first_name: string | null;
        last_name: string | null;
        profile_image_url: string | null;
      } | null;
    } | null;
  };

  // Legacy admin view fields (still returned by admin endpoint)
  users?: {
    profiles?: {
      first_name: string | null;
      last_name: string | null;
    } | null;
  } | null;
  service_requests?: {
    category: string;
  } | null;

  price_snapshots?: PriceSnapshot[];
}

export interface RateCard {
  id: string;
  service_id: string;
  hourly_rate: number;
  effective_from: string;
  effective_to: string | null;
}

export interface PaymentPlanStats {
  totalRevenue: number;
  totalPlans: number;
  activePlans: number;
  completedPlans: number;
}

// ─── Nanny Dashboard Types ──────────────────────────────────────────

export interface NannyDashboardScheduleItem {
  id: string;
  status: string;
  startTime: string;
  endTime: string | null;
  category: string;
  numChildren: number;
  parentName: string;
  location: string | null;
}

export interface NannyDashboardSummary {
  todayEarnings: number;
  earningsChange: number | null;
  completedToday: number;
  pendingToday: number;
  weeklyTrend: { date: string; amount: number }[];
  todaySchedule: NannyDashboardScheduleItem[];
}

export interface NannyEarningsAnalytics {
  totalAvailable: number;
  pendingProcessing: number;
  jobsCompleted: number;
  jobsThisPeriod: number;
  periodTotal: number;
  periodChange: number | null;
  trend: { date: string; amount: number; projection?: number }[];
}

export interface NannyPerformanceReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewerName: string;
  reviewerInitials: string;
  category: string;
}

export interface NannyPerformance {
  averageRating: number;
  totalReviews: number;
  completionRate: number;
  punctualityScore: number;
  expertiseScore: number;
  professionalismScore: number;
  sentiment: { positive: number; neutral: number; negative: number };
  recentReviews: NannyPerformanceReview[];
}

export interface NannySettings {
  auto_accept_bookings: boolean;
  default_start_time: string | null;
  default_end_time: string | null;
}

export interface DemandForecastSlot {
  label: string;
  count: number;
  pct: number;
}

export interface DemandForecast {
  slots: DemandForecastSlot[];
  sampleSize: number;
  windowDays: number;
}

export interface LiveCoordinate {
  lat: number;
  lng: number;
  timestamp?: string;
}

export interface LiveLocation {
  status: string;
  careLocation: { lat: number; lng: number } | null;
  geofenceRadius: number;
  latest: LiveCoordinate | null;
  distance: number | null; // metres from care location
  inside: boolean | null;
  trail: LiveCoordinate[];
}

/** Payload broadcast on the `/location` socket `location:updated` event. */
export interface LiveLocationUpdate {
  bookingId: string;
  lat: number;
  lng: number;
  distance: number | null;
  radius: number;
  inside: boolean | null;
  timestamp: string;
}
