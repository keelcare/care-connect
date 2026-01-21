'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/ToastProvider';
import { Button } from '@/components/ui/button';
import { AvailabilityBlock } from '@/types/api';
import {
  DaySelector,
  generateRecurrencePattern,
  formatRecurrencePattern,
} from '@/components/scheduling/DaySelector';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  X,
  CalendarOff,
  Repeat,
  CheckCircle2,
  ChevronLeft,
  Sparkles,
  FileText,
  CalendarDays,
} from 'lucide-react';

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
  '22:00',
  '23:00',
];

const BLOCK_TYPES = [
  {
    id: 'oneTime',
    label: 'One-Time Block',
    description: 'Block a specific date or date range',
    icon: CalendarOff,
    color: 'bg-orange-50 text-orange-600 border-orange-200',
    activeColor: 'bg-orange-500 text-white border-orange-500',
  },
  {
    id: 'recurring',
    label: 'Recurring Block',
    description: 'Block same time every week',
    icon: Repeat,
    color: 'bg-purple-50 text-purple-600 border-purple-200',
    activeColor: 'bg-purple-500 text-white border-purple-500',
  },
];

export default function AvailabilityPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    blockType: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    selectedDays: [] as string[],
    reason: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Generate next 30 days for date selection
  const getNextDays = () => {
    const days = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const availableDates = getNextDays();

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
      setLoading(true);
      const data = await api.availability.list();
      setBlocks(data);
    } catch (error) {
      console.error('Failed to fetch availability blocks:', error);
      addToast({ message: 'Failed to load availability', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!formData.startDate) {
      addToast({ message: 'Please select a start date', type: 'error' });
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      addToast({ message: 'Please select start and end times', type: 'error' });
      return;
    }

    if (
      formData.blockType === 'recurring' &&
      formData.selectedDays.length === 0
    ) {
      addToast({
        message: 'Please select at least one day for recurring block',
        type: 'error',
      });
      return;
    }

    setSubmitting(true);

    try {
      const startDateTime = `${formData.startDate}T${formData.startTime}:00Z`;
      const endDateTime = formData.endDate
        ? `${formData.endDate}T${formData.endTime}:00Z`
        : `${formData.startDate}T${formData.endTime}:00Z`;

      const isRecurring = formData.blockType === 'recurring';

      const payload = {
        startTime: startDateTime,
        endTime: endDateTime,
        isRecurring,
        recurrencePattern: isRecurring
          ? generateRecurrencePattern('weekly', formData.selectedDays)
          : undefined,
        reason: formData.reason || undefined,
      };

      await api.availability.create(payload);
      addToast({
        message: 'Availability block created successfully',
        type: 'success',
      });
      closeModal();
      fetchBlocks();
    } catch (error) {
      console.error('Failed to create availability block:', error);
      addToast({
        message: 'Failed to create availability block',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await api.availability.delete(id);
      addToast({ message: 'Availability block removed', type: 'success' });
      setBlocks(blocks.filter((b) => b.id !== id));
    } catch (error) {
      console.error('Failed to delete availability block:', error);
      addToast({
        message: 'Failed to remove availability block',
        type: 'error',
      });
    } finally {
      setDeleting(null);
    }
  };

  const resetForm = () => {
    setFormData({
      blockType: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      selectedDays: [],
      reason: '',
    });
    setCurrentStep(1);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const openModal = () => {
    resetForm();
    setShowModal(true);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const canProceedToStep2 = formData.blockType !== '';
  const canProceedToStep3 =
    formData.blockType === 'recurring'
      ? formData.selectedDays.length > 0 && formData.startDate !== ''
      : formData.startDate !== '';
  const canSubmit = formData.startTime !== '' && formData.endTime !== '';

  const getStepLabels = () => {
    if (formData.blockType === 'recurring') {
      return ['Block Type', 'Days & Start', 'Time & Details'];
    }
    return ['Block Type', 'Select Date', 'Time & Details'];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Availability</h1>
          <p className="text-stone-500 mt-1">
            Manage your blocked times and recurring unavailability
          </p>
        </div>
        <Button
          onClick={openModal}
          className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Plus size={18} className="mr-2" />
          Block Time
        </Button>
      </div>

      {/* Info Card */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-emerald-800">How it works</p>
          <p className="text-sm text-emerald-700 mt-1">
            Blocked times will automatically prevent parents from booking you
            during those periods. Use recurring blocks for regular
            unavailability like weekends.
          </p>
        </div>
      </div>

      {/* Availability Blocks List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : blocks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
          <CalendarOff className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-stone-900 mb-2">
            No blocked times
          </h3>
          <p className="text-stone-500 mb-6">
            You haven't blocked any times yet. Block times when you're
            unavailable.
          </p>
          <Button
            onClick={() => setShowModal(true)}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus size={18} className="mr-2" />
            Block Time
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {blocks.map((block) => {
            const start = formatDateTime(block.start_time);
            const end = formatDateTime(block.end_time);

            return (
              <div
                key={block.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      block.is_recurring
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-orange-100 text-orange-600'
                    }`}
                  >
                    {block.is_recurring ? (
                      <Repeat size={24} />
                    ) : (
                      <CalendarOff size={24} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-stone-900">
                        {block.is_recurring
                          ? formatRecurrencePattern(
                              block.recurrence_pattern || ''
                            )
                          : start.date}
                      </h3>
                      {block.is_recurring && (
                        <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                          Recurring
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-stone-500">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {start.time} - {end.time}
                      </span>
                      {!block.is_recurring && (
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {start.date}{' '}
                          {start.date !== end.date && `- ${end.date}`}
                        </span>
                      )}
                    </div>
                    {block.reason && (
                      <p className="text-sm text-stone-400 mt-1">
                        {block.reason}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(block.id)}
                  disabled={deleting === block.id}
                  className="text-stone-400 hover:text-red-600 hover:bg-red-50"
                >
                  {deleting === block.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                  ) : (
                    <Trash2 size={18} />
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Block Modal - Enhanced UI */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-stone-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {currentStep > 1 && (
                    <button
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="p-2 hover:bg-stone-100 rounded-xl transition-colors"
                    >
                      <ChevronLeft size={20} className="text-stone-500" />
                    </button>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <CalendarOff className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-stone-900">
                        Block Time
                      </h2>
                      <p className="text-sm text-stone-500">
                        Set when you're unavailable
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-stone-100 rounded-xl transition-colors"
                >
                  <X size={20} className="text-stone-500" />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-between mt-4">
                {[1, 2, 3].map((step) => {
                  const stepLabels = getStepLabels();
                  return (
                    <React.Fragment key={step}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                            currentStep >= step
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-100 text-stone-400'
                          }`}
                        >
                          {currentStep > step ? (
                            <CheckCircle2 size={16} />
                          ) : (
                            step
                          )}
                        </div>
                        <span
                          className={`hidden sm:block text-xs font-medium ${
                            currentStep >= step
                              ? 'text-stone-900'
                              : 'text-stone-400'
                          }`}
                        >
                          {stepLabels[step - 1]}
                        </span>
                      </div>
                      {step < 3 && (
                        <div
                          className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                            currentStep > step
                              ? 'bg-emerald-600'
                              : 'bg-stone-200'
                          }`}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Block Type Selection */}
              {currentStep === 1 && (
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Sparkles size={16} className="text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-bold text-stone-900">
                      What type of block?
                    </h3>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
                    {BLOCK_TYPES.map((type) => {
                      const Icon = type.icon;
                      const isSelected = formData.blockType === type.id;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, blockType: type.id })
                          }
                          className={`p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-3 hover:scale-[1.02] flex-1 max-w-[220px] ${
                            isSelected
                              ? type.activeColor
                              : `${type.color} hover:shadow-md`
                          }`}
                        >
                          <Icon size={32} />
                          <div className="text-center">
                            <span className="font-bold text-base block">
                              {type.label}
                            </span>
                            <span
                              className={`text-xs mt-1 block ${isSelected ? 'opacity-80' : 'text-stone-500'}`}
                            >
                              {type.description}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Date/Days Selection */}
              {currentStep === 2 && (
                <div className="p-6 md:p-8">
                  {formData.blockType === 'recurring' ? (
                    <>
                      {/* Day Selection for Recurring */}
                      <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Repeat size={16} className="text-purple-600" />
                          </div>
                          <h3 className="text-lg font-bold text-stone-900">
                            Select Days to Block
                          </h3>
                        </div>
                        <p className="text-sm text-stone-500 mb-4">
                          These days will be blocked every week
                        </p>
                        <DaySelector
                          selectedDays={formData.selectedDays}
                          onChange={(days) =>
                            setFormData({ ...formData, selectedDays: days })
                          }
                        />
                      </div>

                      {/* Starting From Date */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <CalendarDays
                              size={16}
                              className="text-emerald-600"
                            />
                          </div>
                          <h3 className="text-lg font-bold text-stone-900">
                            Starting From
                          </h3>
                        </div>

                        <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
                          {availableDates.slice(0, 14).map((date) => {
                            const dateStr = formatDate(date);
                            const isSelected = formData.startDate === dateStr;
                            return (
                              <button
                                key={dateStr}
                                type="button"
                                onClick={() =>
                                  setFormData({
                                    ...formData,
                                    startDate: dateStr,
                                  })
                                }
                                className={`flex-shrink-0 flex flex-col items-center p-3 rounded-xl border-2 transition-all min-w-[70px] ${
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
                                  className={`text-xl font-bold ${isToday(date) && !isSelected ? 'text-emerald-600' : ''}`}
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
                    </>
                  ) : (
                    <>
                      {/* Date Selection for One-Time Block */}
                      <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                            <Calendar size={16} className="text-orange-600" />
                          </div>
                          <h3 className="text-lg font-bold text-stone-900">
                            Select Start Date
                          </h3>
                        </div>

                        <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
                          {availableDates.map((date) => {
                            const dateStr = formatDate(date);
                            const isSelected = formData.startDate === dateStr;
                            return (
                              <button
                                key={dateStr}
                                type="button"
                                onClick={() =>
                                  setFormData({
                                    ...formData,
                                    startDate: dateStr,
                                  })
                                }
                                className={`flex-shrink-0 flex flex-col items-center p-3 rounded-xl border-2 transition-all min-w-[70px] ${
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
                                  className={`text-xl font-bold ${isToday(date) && !isSelected ? 'text-emerald-600' : ''}`}
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

                      {/* End Date Selection (Optional) */}
                      {formData.startDate && (
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center">
                              <Calendar size={16} className="text-stone-600" />
                            </div>
                            <h3 className="text-lg font-bold text-stone-900">
                              End Date (Optional)
                            </h3>
                          </div>
                          <p className="text-sm text-stone-500 mb-4">
                            Leave empty for a single day block
                          </p>

                          <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
                            {availableDates
                              .filter(
                                (date) => formatDate(date) >= formData.startDate
                              )
                              .map((date) => {
                                const dateStr = formatDate(date);
                                const isSelected = formData.endDate === dateStr;
                                const isStartDate =
                                  formData.startDate === dateStr;
                                return (
                                  <button
                                    key={dateStr}
                                    type="button"
                                    onClick={() =>
                                      setFormData({
                                        ...formData,
                                        endDate: isSelected ? '' : dateStr,
                                      })
                                    }
                                    className={`flex-shrink-0 flex flex-col items-center p-3 rounded-xl border-2 transition-all min-w-[70px] ${
                                      isSelected
                                        ? 'bg-stone-700 text-white border-stone-700'
                                        : isStartDate
                                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                          : 'bg-white border-stone-200 hover:border-stone-400 hover:bg-stone-50'
                                    }`}
                                  >
                                    <span
                                      className={`text-xs font-medium mb-1 ${
                                        isSelected
                                          ? 'text-stone-300'
                                          : isStartDate
                                            ? 'text-emerald-500'
                                            : 'text-stone-500'
                                      }`}
                                    >
                                      {date.toLocaleDateString('en-US', {
                                        weekday: 'short',
                                      })}
                                    </span>
                                    <span className={`text-xl font-bold`}>
                                      {date.getDate()}
                                    </span>
                                    <span
                                      className={`text-xs ${
                                        isSelected
                                          ? 'text-stone-300'
                                          : isStartDate
                                            ? 'text-emerald-500'
                                            : 'text-stone-400'
                                      }`}
                                    >
                                      {date.toLocaleDateString('en-US', {
                                        month: 'short',
                                      })}
                                    </span>
                                    {isStartDate && !isSelected && (
                                      <span className="text-[10px] font-medium mt-1">
                                        Start
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Step 3: Time Selection & Details */}
              {currentStep === 3 && (
                <div className="p-6 md:p-8">
                  {/* Start Time Selection */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Clock size={16} className="text-emerald-600" />
                      </div>
                      <h3 className="text-lg font-bold text-stone-900">
                        Start Time
                      </h3>
                    </div>

                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                      {TIME_SLOTS.map((time) => {
                        const isSelected = formData.startTime === time;
                        return (
                          <button
                            key={`start-${time}`}
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

                  {/* End Time Selection */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center">
                        <Clock size={16} className="text-stone-600" />
                      </div>
                      <h3 className="text-lg font-bold text-stone-900">
                        End Time
                      </h3>
                    </div>

                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                      {TIME_SLOTS.map((time) => {
                        const isSelected = formData.endTime === time;
                        const isDisabled = !!(
                          formData.startTime && time <= formData.startTime
                        );
                        return (
                          <button
                            key={`end-${time}`}
                            type="button"
                            onClick={() =>
                              !isDisabled &&
                              setFormData({ ...formData, endTime: time })
                            }
                            disabled={isDisabled}
                            className={`py-3 px-2 rounded-xl text-sm font-medium border-2 transition-all ${
                              isDisabled
                                ? 'bg-stone-50 border-stone-100 text-stone-300 cursor-not-allowed'
                                : isSelected
                                  ? 'bg-stone-700 text-white border-stone-700'
                                  : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400 hover:bg-stone-50'
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reason (Optional) */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center">
                        <FileText size={16} className="text-stone-600" />
                      </div>
                      <h3 className="text-lg font-bold text-stone-900">
                        Reason (Optional)
                      </h3>
                    </div>

                    <input
                      type="text"
                      value={formData.reason}
                      onChange={(e) =>
                        setFormData({ ...formData, reason: e.target.value })
                      }
                      placeholder="e.g., Personal appointment, Weekend off, Vacation"
                      className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none text-stone-700 placeholder:text-stone-400"
                    />
                  </div>

                  {/* Summary Card */}
                  {formData.startTime && formData.endTime && (
                    <div className="mt-6 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                      <p className="text-sm font-medium text-stone-700 mb-2">
                        Summary
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            formData.blockType === 'recurring'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {formData.blockType === 'recurring'
                            ? 'Recurring'
                            : 'One-Time'}
                        </span>
                        {formData.blockType === 'recurring' ? (
                          <span className="px-3 py-1 rounded-full bg-stone-200 text-stone-700 text-xs font-medium">
                            {formData.selectedDays
                              .map((d) => d.slice(0, 3))
                              .join(', ')}
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-stone-200 text-stone-700 text-xs font-medium">
                            {new Date(formData.startDate).toLocaleDateString(
                              'en-US',
                              { month: 'short', day: 'numeric' }
                            )}
                            {formData.endDate &&
                              formData.endDate !== formData.startDate &&
                              ` - ${new Date(formData.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                          </span>
                        )}
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                          {formData.startTime} - {formData.endTime}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="p-6 border-t border-stone-100 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  className="flex-1 rounded-xl"
                >
                  Cancel
                </Button>

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={
                      currentStep === 1
                        ? !canProceedToStep2
                        : !canProceedToStep3
                    }
                    className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={submitting || !canSubmit}
                    className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creating...
                      </span>
                    ) : (
                      'Block Time'
                    )}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
