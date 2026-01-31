'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/ToastProvider';
import ParentLayout from '@/components/layout/ParentLayout';
import { Button } from '@/components/ui/button';
import { User } from '@/types/api';
import {
  DaySelector,
  generateRecurrencePattern,
  formatRecurrencePattern,
} from '@/components/scheduling/DaySelector';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Users,
  FileText,
  Sparkles,
  CheckCircle2,
  Repeat,
  User as UserIcon,
  Star,
  MapPin,
} from 'lucide-react';
import Image from 'next/image';

const DURATION_OPTIONS = [
  { value: '1', label: '1 hour' },
  { value: '2', label: '2 hours' },
  { value: '3', label: '3 hours' },
  { value: '4', label: '4 hours' },
  { value: '5', label: '5 hours' },
  { value: '6', label: '6 hours' },
  { value: '7', label: '7 hours' },
  { value: '8', label: '8 hours' },
];

const TIME_SLOTS = [
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
];

export default function BookRecurringPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [nanny, setNanny] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    frequency: 'weekly',
    selectedDays: [] as string[],
    startDate: '',
    endDate: '',
    startTime: '',
    duration: '',
    numChildren: '1',
    childrenAges: '',
    specialRequirements: '',
  });

  useEffect(() => {
    const fetchNanny = async () => {
      if (!params.nannyId) return;
      try {
        const id = Array.isArray(params.nannyId)
          ? params.nannyId[0]
          : params.nannyId;
        const data = await api.users.get(id);
        setNanny(data);
      } catch (error) {
        console.error('Failed to fetch nanny:', error);
        addToast({
          message: 'Failed to load caregiver details',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNanny();
  }, [params.nannyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push(
        '/auth/login?redirect=' + encodeURIComponent(window.location.pathname)
      );
      return;
    }

    if (!nanny) return;

    if (formData.frequency !== 'daily' && formData.selectedDays.length === 0) {
      addToast({ message: 'Please select at least one day', type: 'error' });
      return;
    }

    setSubmitting(true);

    try {
      const recurrencePattern = generateRecurrencePattern(
        formData.frequency,
        formData.selectedDays
      );

      const childrenAges = formData.childrenAges
        .split(',')
        .map((age) => parseInt(age.trim()))
        .filter((age) => !isNaN(age));

      const payload = {
        nannyId: nanny.id,
        recurrencePattern,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        startTime: formData.startTime,
        durationHours: parseInt(formData.duration),
        numChildren: parseInt(formData.numChildren),
        childrenAges: childrenAges.length > 0 ? childrenAges : undefined,
        specialRequirements: formData.specialRequirements || undefined,
      };

      await api.recurringBookings.create(payload);
      addToast({
        message: `Recurring booking created with ${nanny.profiles?.first_name}!`,
        type: 'success',
      });
      router.push('/recurring-bookings');
    } catch (error: any) {
      console.error('Failed to create recurring booking:', error);
      addToast({
        message: error.message || 'Failed to create recurring booking',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const canProceedToStep2 =
    formData.frequency === 'daily' || formData.selectedDays.length > 0;
  const canProceedToStep3 =
    formData.startDate !== '' &&
    formData.startTime !== '' &&
    formData.duration !== '';

  const getNannyName = () => {
    if (nanny?.profiles?.first_name && nanny?.profiles?.last_name) {
      return `${nanny.profiles.first_name} ${nanny.profiles.last_name}`;
    }
    return nanny?.email || 'Caregiver';
  };

  if (loading) {
    return (
      <ParentLayout>
        <div className="flex items-center justify-center min-h-screen bg-stone-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </ParentLayout>
    );
  }

  if (!nanny) {
    return (
      <ParentLayout>
        <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50">
          <h2 className="text-xl font-bold text-stone-900">
            Caregiver not found
          </h2>
          <Button
            onClick={() => router.push('/browse')}
            className="mt-4 bg-primary-900 hover:bg-primary-800 rounded-xl"
          >
            Browse Caregivers
          </Button>
        </div>
      </ParentLayout>
    );
  }

  return (
    <ParentLayout>
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-50 pb-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              className="mb-4 -ml-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100"
              onClick={() => router.back()}
            >
              <ChevronLeft size={20} className="mr-1" />
              Back
            </Button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Repeat className="w-5 h-5 text-purple-600" />
              </div>
              <h1 className="text-3xl font-bold text-stone-900">
                Create Recurring Booking
              </h1>
            </div>
            <p className="text-stone-500 mt-1">
              Schedule regular care sessions with your caregiver
            </p>
          </div>

          {/* Nanny Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-8 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
              {nanny.profiles?.profile_image_url ? (
                <Image
                  src={nanny.profiles.profile_image_url}
                  alt={getNannyName()}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-stone-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-stone-900">{getNannyName()}</h3>
              <div className="flex items-center gap-3 mt-1 text-sm text-stone-500">
                {nanny.nanny_details?.hourly_rate && (
                  <span>₹{nanny.nanny_details.hourly_rate}/hr</span>
                )}
                {nanny.nanny_details?.experience_years && (
                  <span>{nanny.nanny_details.experience_years} yrs exp</span>
                )}
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${currentStep >= step
                          ? 'bg-purple-600 text-white'
                          : 'bg-stone-100 text-stone-400'
                        }`}
                    >
                      {currentStep > step ? <CheckCircle2 size={20} /> : step}
                    </div>
                    <span
                      className={`hidden sm:block text-sm font-medium ${currentStep >= step
                          ? 'text-stone-900'
                          : 'text-stone-400'
                        }`}
                    >
                      {step === 1 && 'Schedule'}
                      {step === 2 && 'Date & Time'}
                      {step === 3 && 'Details'}
                    </span>
                  </div>
                  {step < 3 && (
                    <div
                      className={`flex-1 h-1 mx-4 rounded-full transition-all ${currentStep > step ? 'bg-purple-600' : 'bg-stone-200'
                        }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Recurrence Pattern */}
              {currentStep === 1 && (
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Repeat size={16} className="text-purple-600" />
                    </div>
                    <h2 className="text-xl font-bold text-stone-900">
                      How often do you need care?
                    </h2>
                  </div>

                  {/* Frequency Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-stone-700 mb-3">
                      Frequency
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['daily', 'weekly', 'monthly'].map((freq) => {
                        const isSelected = formData.frequency === freq;
                        return (
                          <button
                            key={freq}
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                frequency: freq,
                                selectedDays: [],
                              })
                            }
                            className={`py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all capitalize ${isSelected
                                ? 'bg-purple-600 text-white border-purple-600'
                                : 'bg-white border-stone-200 text-stone-700 hover:border-purple-300 hover:bg-purple-50'
                              }`}
                          >
                            {freq}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Day Selection for Weekly */}
                  {formData.frequency === 'weekly' && (
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-3">
                        Select Days
                      </label>
                      <DaySelector
                        selectedDays={formData.selectedDays}
                        onChange={(days) =>
                          setFormData({ ...formData, selectedDays: days })
                        }
                      />
                    </div>
                  )}

                  {/* Date Selection for Monthly */}
                  {formData.frequency === 'monthly' && (
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-3">
                        Select Dates of Month
                      </label>
                      <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: 28 }, (_, i) => i + 1).map(
                          (date) => {
                            const dateStr = date.toString();
                            const isSelected =
                              formData.selectedDays.includes(dateStr);
                            return (
                              <button
                                key={date}
                                type="button"
                                onClick={() => {
                                  const newDays = isSelected
                                    ? formData.selectedDays.filter(
                                      (d) => d !== dateStr
                                    )
                                    : [...formData.selectedDays, dateStr].sort(
                                      (a, b) => parseInt(a) - parseInt(b)
                                    );
                                  setFormData({
                                    ...formData,
                                    selectedDays: newDays,
                                  });
                                }}
                                className={`w-10 h-10 rounded-lg font-medium text-sm border transition-all ${isSelected
                                    ? 'bg-purple-600 text-white border-purple-600'
                                    : 'bg-white border-stone-200 text-stone-700 hover:border-purple-300'
                                  }`}
                              >
                                {date}
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}

                  {formData.frequency === 'daily' && (
                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                      <p className="text-sm text-purple-700">
                        <strong>Daily:</strong> Bookings will be created for
                        every day between your start and end dates.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Date & Time */}
              {currentStep === 2 && (
                <div className="p-6 md:p-8">
                  {/* Date Range */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Calendar size={16} className="text-purple-600" />
                      </div>
                      <h2 className="text-xl font-bold text-stone-900">
                        Date Range
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Start Date *
                        </label>
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              startDate: e.target.value,
                            })
                          }
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          End Date (Optional)
                        </label>
                        <input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              endDate: e.target.value,
                            })
                          }
                          min={
                            formData.startDate ||
                            new Date().toISOString().split('T')[0]
                          }
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 focus:outline-none"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-stone-500 mt-2">
                      Leave end date empty for ongoing recurring bookings
                    </p>
                  </div>

                  {/* Time Selection */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Clock size={16} className="text-purple-600" />
                      </div>
                      <h2 className="text-xl font-bold text-stone-900">
                        Start Time
                      </h2>
                    </div>

                    <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                      {TIME_SLOTS.map((time) => {
                        const isSelected = formData.startTime === time;
                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, startTime: time })
                            }
                            className={`py-3 px-2 rounded-xl text-sm font-medium border-2 transition-all ${isSelected
                                ? 'bg-purple-600 text-white border-purple-600'
                                : 'bg-white border-stone-200 text-stone-700 hover:border-purple-300 hover:bg-purple-50'
                              }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Clock size={16} className="text-purple-600" />
                      </div>
                      <h2 className="text-xl font-bold text-stone-900">
                        Duration
                      </h2>
                    </div>

                    <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                      {DURATION_OPTIONS.map((option) => {
                        const isSelected = formData.duration === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                duration: option.value,
                              })
                            }
                            className={`py-3 px-2 rounded-xl text-sm font-medium border-2 transition-all ${isSelected
                                ? 'bg-purple-600 text-white border-purple-600'
                                : 'bg-white border-stone-200 text-stone-700 hover:border-purple-300 hover:bg-purple-50'
                              }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Additional Details */}
              {currentStep === 3 && (
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <FileText size={16} className="text-purple-600" />
                    </div>
                    <h2 className="text-xl font-bold text-stone-900">
                      Additional Details
                    </h2>
                  </div>

                  {/* Number of Children */}
                  <div className="mb-6">
                    <label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-3">
                      <Users size={16} />
                      Number of Children
                    </label>
                    <div className="flex gap-3">
                      {['1', '2', '3', '4', '5+'].map((num) => {
                        const isSelected = formData.numChildren === num;
                        return (
                          <button
                            key={num}
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, numChildren: num })
                            }
                            className={`w-14 h-14 rounded-xl font-semibold border-2 transition-all ${isSelected
                                ? 'bg-purple-600 text-white border-purple-600'
                                : 'bg-white border-stone-200 text-stone-700 hover:border-purple-300'
                              }`}
                          >
                            {num}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Children Ages */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Children Ages (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.childrenAges}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          childrenAges: e.target.value,
                        })
                      }
                      placeholder="e.g., 3, 5, 7"
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 focus:outline-none"
                    />
                  </div>

                  {/* Special Requirements */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-3">
                      <FileText size={16} />
                      Special Requirements (Optional)
                    </label>
                    <textarea
                      value={formData.specialRequirements}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specialRequirements: e.target.value,
                        })
                      }
                      placeholder="Any specific needs, allergies, preferences, or instructions..."
                      className="w-full h-32 px-4 py-3 rounded-xl border border-stone-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 focus:outline-none resize-none text-stone-900 placeholder:text-stone-400"
                    />
                  </div>

                  {/* Summary Card */}
                  <div className="mt-8 p-5 bg-purple-50 rounded-2xl border border-purple-200">
                    <h3 className="font-semibold text-stone-900 mb-4">
                      Booking Summary
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Caregiver</span>
                        <span className="font-medium text-stone-900">
                          {getNannyName()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Schedule</span>
                        <span className="font-medium text-stone-900">
                          {formData.frequency === 'daily'
                            ? 'Daily'
                            : formatRecurrencePattern(
                              generateRecurrencePattern(
                                formData.frequency,
                                formData.selectedDays
                              )
                            )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Start Date</span>
                        <span className="font-medium text-stone-900">
                          {formData.startDate
                            ? new Date(formData.startDate).toLocaleDateString(
                              'en-US',
                              {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )
                            : '-'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Time</span>
                        <span className="font-medium text-stone-900">
                          {formData.startTime || '-'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Duration</span>
                        <span className="font-medium text-stone-900">
                          {formData.duration
                            ? `${formData.duration} hour${parseInt(formData.duration) > 1 ? 's' : ''}`
                            : '-'}
                        </span>
                      </div>
                      {nanny.nanny_details?.hourly_rate &&
                        formData.duration && (
                          <div className="flex justify-between pt-3 border-t border-purple-200">
                            <span className="text-stone-500">
                              Est. per session
                            </span>
                            <span className="font-bold text-purple-700">
                              ₹
                              {(
                                parseFloat(nanny.nanny_details.hourly_rate) *
                                parseInt(formData.duration)
                              ).toFixed(0)}
                            </span>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="px-6 md:px-8 py-5 bg-stone-50 border-t border-stone-100 flex justify-between">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentStep(currentStep - 1);
                    }}
                    className="rounded-xl px-6"
                  >
                    <ChevronLeft size={18} className="mr-1" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentStep(currentStep + 1);
                    }}
                    disabled={
                      currentStep === 1
                        ? !canProceedToStep2
                        : !canProceedToStep3
                    }
                    className="rounded-xl px-6 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                  >
                    Continue
                    <ChevronRight size={18} className="ml-1" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl px-8 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} className="mr-2" />
                        Create Recurring Booking
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </ParentLayout>
  );
}
