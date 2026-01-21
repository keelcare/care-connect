'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/ToastProvider';
import ParentLayout from '@/components/layout/ParentLayout';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  Baby,
  Heart,
  PawPrint,
  Home,
  BookOpen,
  Accessibility,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Users,
  FileText,
  Sparkles,
  CheckCircle2,
  MapPin,
  GraduationCap,
  HandHelping,
  HandHeart,
} from 'lucide-react';
import Link from 'next/link';

const SERVICE_TYPES = [
  {
    id: 'shadowTeacher',
    label: 'Shadow Teacher',
    icon: GraduationCap,
    color: 'bg-amber-50 text-amber-600 border-amber-200',
    activeColor: 'bg-amber-500 text-white border-amber-500',
  },
  {
    id: 'specialNeeds',
    label: 'Special Needs',
    icon: HandHeart,
    color: 'bg-teal-50 text-teal-600 border-teal-200',
    activeColor: 'bg-teal-500 text-white border-teal-500',
  },
];

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

export default function BookServicePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [missingLocation, setMissingLocation] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    duration: '',
    numChildren: '1',
    specialRequirements: '',
    serviceType: '',
  });

  // Generate next 14 days for date selection
  const getNextDays = () => {
    const days = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const availableDates = getNextDays();

  useEffect(() => {
    if (user?.profiles) {
      if (!user.profiles.lat || !user.profiles.lng) {
        setMissingLocation(true);
      } else {
        setMissingLocation(false);
      }
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (missingLocation) {
      addToast({
        message: 'Please set your location in your profile first',
        type: 'error',
      });
      return;
    }

    if (!formData.serviceType) {
      addToast({ message: 'Please select a service type', type: 'error' });
      return;
    }

    if (!formData.date || !formData.startTime || !formData.duration) {
      addToast({
        message: 'Please fill in all required fields',
        type: 'error',
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        date: formData.date,
        start_time: formData.startTime,
        duration_hours: Number(formData.duration),
        num_children: Number(formData.numChildren),
        children_ages: [],
        max_hourly_rate: undefined,
        required_skills: [],
        special_requirements: formData.specialRequirements,
      };

      await api.requests.create(payload);

      addToast({
        message:
          'Service request submitted! We are finding the best match for you...',
        type: 'success',
      });
      router.push('/bookings');
    } catch (error) {
      console.error('Service request failed:', error);
      addToast({
        message: 'Failed to create service request. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const canProceedToStep2 = formData.serviceType !== '';
  const canProceedToStep3 =
    formData.date !== '' &&
    formData.startTime !== '' &&
    formData.duration !== '';

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <ParentLayout>
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-50 pb-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              className="mb-4 -ml-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100"
              onClick={() => {
                if (currentStep > 1) {
                  setCurrentStep(currentStep - 1);
                } else {
                  router.back();
                }
              }}
            >
              <ChevronLeft size={20} className="mr-1" />
              Back
            </Button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </div>
              <h1 className="text-3xl font-bold text-stone-900">
                Book a Service
              </h1>
            </div>
            <p className="text-stone-500 mt-1">
              Tell us what you need and we'll find the perfect caregiver for you
            </p>
          </div>

          {/* Location Warning */}
          {missingLocation && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
              <AlertCircle
                size={20}
                className="text-amber-600 mt-0.5 flex-shrink-0"
              />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Location Required
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Please set your location in your{' '}
                  <Link
                    href="/dashboard/profile"
                    className="underline font-medium text-amber-900"
                  >
                    profile settings
                  </Link>{' '}
                  to use auto-matching.
                </p>
              </div>
            </div>
          )}

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        currentStep >= step
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-100 text-stone-400'
                      }`}
                    >
                      {currentStep > step ? <CheckCircle2 size={20} /> : step}
                    </div>
                    <span
                      className={`hidden sm:block text-sm font-medium ${
                        currentStep >= step
                          ? 'text-stone-900'
                          : 'text-stone-400'
                      }`}
                    >
                      {step === 1 && 'Service Type'}
                      {step === 2 && 'Date & Time'}
                      {step === 3 && 'Details'}
                    </span>
                  </div>
                  {step < 3 && (
                    <div
                      className={`flex-1 h-1 mx-4 rounded-full transition-all ${
                        currentStep > step ? 'bg-emerald-600' : 'bg-stone-200'
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
              {/* Step 1: Service Type */}
              {currentStep === 1 && (
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Sparkles size={16} className="text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-stone-900">
                      What service do you need?
                    </h2>
                  </div>

                  <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                    {SERVICE_TYPES.map((service) => {
                      const Icon = service.icon;
                      const isSelected = formData.serviceType === service.id;
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              serviceType: service.id,
                            })
                          }
                          className={`p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-4 hover:scale-[1.02] min-w-[160px] md:min-w-[180px] ${
                            isSelected
                              ? service.activeColor
                              : `${service.color} hover:shadow-md`
                          }`}
                        >
                          <Icon size={32} />
                          <span className="font-bold text-base">
                            {service.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Date & Time */}
              {currentStep === 2 && (
                <div className="p-6 md:p-8">
                  {/* Date Selection */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Calendar size={16} className="text-emerald-600" />
                      </div>
                      <h2 className="text-xl font-bold text-stone-900">
                        Select a Date
                      </h2>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
                      {availableDates.map((date) => {
                        const dateStr = formatDate(date);
                        const isSelected = formData.date === dateStr;
                        return (
                          <button
                            key={dateStr}
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, date: dateStr })
                            }
                            className={`flex-shrink-0 flex flex-col items-center p-4 rounded-2xl border-2 transition-all min-w-[80px] ${
                              isSelected
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-white border-stone-200 hover:border-emerald-300 hover:bg-emerald-50'
                            }`}
                          >
                            <span
                              className={`text-xs font-medium mb-1 ${isSelected ? 'text-emerald-100' : 'text-stone-500'}`}
                            >
                              {date.toLocaleDateString('en-US', {
                                weekday: 'short',
                              })}
                            </span>
                            <span
                              className={`text-2xl font-bold ${isToday(date) && !isSelected ? 'text-emerald-600' : ''}`}
                            >
                              {date.getDate()}
                            </span>
                            <span
                              className={`text-xs ${isSelected ? 'text-emerald-100' : 'text-stone-400'}`}
                            >
                              {date.toLocaleDateString('en-US', {
                                month: 'short',
                              })}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Clock size={16} className="text-emerald-600" />
                      </div>
                      <h2 className="text-xl font-bold text-stone-900">
                        Select Start Time
                      </h2>
                    </div>

                    <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                      {TIME_SLOTS.map((time) => {
                        const isSelected = formData.startTime === time;

                        // Check if slot is in the past or within 15 mins
                        const selectedDateObj = availableDates.find(
                          (d) => formatDate(d) === formData.date
                        );
                        if (selectedDateObj && isToday(selectedDateObj)) {
                          const [slotHours, slotMinutes] = time
                            .split(':')
                            .map(Number);
                          const now = new Date();
                          const slotTime = new Date();
                          slotTime.setHours(slotHours, slotMinutes || 0, 0, 0);

                          // Add 15 minutes buffer to current time
                          const bufferTime = new Date(
                            now.getTime() + 15 * 60000
                          );

                          if (slotTime <= bufferTime) return null;
                        }

                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, startTime: time })
                            }
                            className={`py-3 px-2 rounded-xl text-sm font-medium border-2 transition-all ${
                              isSelected
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-white border-stone-200 text-stone-700 hover:border-emerald-300 hover:bg-emerald-50'
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Duration Selection */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Clock size={16} className="text-emerald-600" />
                      </div>
                      <h2 className="text-xl font-bold text-stone-900">
                        Duration
                      </h2>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
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
                            className={`py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all ${
                              isSelected
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-white border-stone-200 text-stone-700 hover:border-emerald-300 hover:bg-emerald-50'
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
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <FileText size={16} className="text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-stone-900">
                      Additional Details
                    </h2>
                  </div>

                  {/* Number of People */}
                  <div className="mb-6">
                    <label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-3">
                      <Users size={16} />
                      Number of People
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
                            className={`w-14 h-14 rounded-xl font-semibold border-2 transition-all ${
                              isSelected
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-white border-stone-200 text-stone-700 hover:border-emerald-300'
                            }`}
                          >
                            {num}
                          </button>
                        );
                      })}
                    </div>
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
                      className="w-full h-32 px-4 py-3 rounded-xl border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none resize-none text-stone-900 placeholder:text-stone-400"
                    />
                  </div>

                  {/* Summary Card */}
                  <div className="mt-8 p-5 bg-stone-50 rounded-2xl border border-stone-200">
                    <h3 className="font-semibold text-stone-900 mb-4">
                      Booking Summary
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Service</span>
                        <span className="font-medium text-stone-900">
                          {
                            SERVICE_TYPES.find(
                              (s) => s.id === formData.serviceType
                            )?.label
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Date</span>
                        <span className="font-medium text-stone-900">
                          {formData.date
                            ? new Date(formData.date).toLocaleDateString(
                                'en-US',
                                {
                                  weekday: 'long',
                                  month: 'long',
                                  day: 'numeric',
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
                            ? `${formData.duration} hours`
                            : '-'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">People</span>
                        <span className="font-medium text-stone-900">
                          {formData.numChildren}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-stone-200 flex items-center gap-2 text-sm text-emerald-600">
                      <MapPin size={16} />
                      <span>We'll match you with nearby caregivers</span>
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
                    className="rounded-xl px-6 bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
                  >
                    Continue
                    <ChevronRight size={18} className="ml-1" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={loading || missingLocation}
                    className="rounded-xl px-8 bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
                  >
                    {loading ? (
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
                        Finding Caregivers...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} className="mr-2" />
                        Find My Caregiver
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
