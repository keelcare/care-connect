'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, MapPin, Sparkles, Check, ChevronDown, ArrowRight, Lock } from 'lucide-react';
import { logger } from '@/lib/logger';

export const WaitlistModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    careType: 'shadow',
    name: '',
    email: '',
    phone: '',
    city: '',
    otherCity: '',
    childDetails: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Listen to the URL hash to open/close the modal
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#waitlist') {
        setIsOpen(true);
        // Prevent background scrolling
        document.body.style.overflow = 'hidden';
      } else {
        setIsOpen(false);
        document.body.style.overflow = 'auto';
      }
    };

    // Check on mount
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const closeModal = () => {
    // This will trigger the hashchange listener and close the modal
    window.location.hash = '';
    // Reset form after a tiny delay so it doesn't blink while animating out
    setTimeout(() => {
      setStatus('idle');
      setFieldErrors({});
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Custom inline validation
    const errors: Record<string, string> = {};
    if (!formData.name || !/^[A-Za-z\s.,'-]{2,50}$/.test(formData.name)) {
      errors.name = "Please enter a valid name (letters only).";
    }
    
    // 10-digit Indian mobile number (we prepend +91 on submit)
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || !/^\d{10}$/.test(cleanPhone)) {
      errors.phone = 'Please enter a valid 10-digit mobile number.';
    }

    // Email is optional — only validate the format when something was entered.
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (formData.city === 'others' && (!formData.otherCity || !/^[A-Za-z\s.,'-]{2,50}$/.test(formData.otherCity))) {
      errors.otherCity = "Please enter a valid city name.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    
    setFieldErrors({});
    setStatus('loading');

    const finalCity = formData.city === 'others' ? formData.otherCity : formData.city;
    
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: `+91${formData.phone.replace(/\D/g, '')}`,
          city: finalCity,
          careType: formData.careType === 'shadow' ? 'Shadow teacher' : 'Special needs',
          childDetails: formData.childDetails
        }),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ careType: 'shadow', name: '', email: '', phone: '', city: '', otherCity: '', childDetails: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
      logger.error(error);
    }
  };

  // Shared field styles for a clean, consistent look
  const labelClass = 'mb-2 block text-[13px] font-semibold text-gray-700';
  const optionalClass = 'ml-1.5 font-normal text-gray-400';
  const inputBase =
    'w-full rounded-xl border bg-gray-50/80 px-4 py-3 text-[15px] text-gray-900 placeholder-gray-400 outline-none transition-all focus:bg-white focus:ring-4';
  const inputOk = 'border-gray-200 focus:border-primary-900 focus:ring-primary-900/10';
  const inputErr = 'border-red-300 focus:border-red-400 focus:ring-red-500/10';
  const fieldClass = (err?: string) => `${inputBase} ${err ? inputErr : inputOk}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-primary-900/50 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 24 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.18 }}
            className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_-12px_rgba(15,23,42,0.35)] ring-1 ring-black/5"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-100/80 bg-white/90 px-7 pb-5 pt-7 backdrop-blur-sm">
              <div className="space-y-1">
                <h2 className="text-[22px] font-bold tracking-tight text-primary-900">
                  Join the waitlist
                </h2>
                <p className="text-sm text-gray-500">Be first when Keel opens in your area.</p>
              </div>
              <button
                onClick={closeModal}
                aria-label="Close"
                className="-mr-1.5 -mt-1.5 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto custom-scrollbar px-7 pb-8 pt-6">
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-10 text-center"
                >
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 ring-1 ring-green-100">
                    <Check className="h-8 w-8 text-green-600" strokeWidth={2.5} />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold tracking-tight text-primary-900">You&apos;re on the list! 🎉</h3>
                  <p className="mx-auto max-w-md text-[15px] leading-relaxed text-gray-600">
                    You&apos;re officially in line for early access. We&apos;re vetting and training caregivers city by city, and we&apos;ll reach out by phone the moment we open in your area.
                  </p>
                  <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-500">
                    Want to move up the queue? Share Keel with another family — the more interest in your city, the sooner we launch there.
                  </p>
                  <button
                    onClick={closeModal}
                    className="mt-8 rounded-full bg-gray-100 px-8 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-200"
                  >
                    Close
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {/* Trust chips — reassurance at the point of conversion */}
                  <div className="flex flex-wrap justify-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 text-[11px] font-semibold text-gray-600 ring-1 ring-gray-100">
                      <ShieldCheck size={13} className="text-primary-900/60" />
                      ID &amp; background verified
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 text-[11px] font-semibold text-gray-600 ring-1 ring-gray-100">
                      <MapPin size={13} className="text-primary-900/60" />
                      Now in Delhi
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 text-[11px] font-semibold text-gray-600 ring-1 ring-gray-100">
                      <Sparkles size={13} className="text-primary-900/60" />
                      Launching soon
                    </span>
                  </div>

                  {/* Care Type Selection */}
                  <div>
                    <label className={labelClass}>What kind of care do you need?</label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {([
                        {
                          key: 'shadow',
                          label: 'Shadow teacher',
                          icon: (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            </svg>
                          ),
                        },
                        {
                          key: 'special',
                          label: 'Special needs',
                          icon: (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          ),
                        },
                      ] as const).map((opt) => {
                        const active = formData.careType === opt.key;
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => setFormData({ ...formData, careType: opt.key })}
                            className={`relative flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all ${active ? 'border-primary-900 bg-primary-900/[0.03] ring-1 ring-primary-900' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/60'}`}
                          >
                            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${active ? 'bg-primary-900 text-white' : 'bg-gray-100 text-gray-400'}`}>
                              {opt.icon}
                            </span>
                            <span className={`font-semibold ${active ? 'text-primary-900' : 'text-gray-700'}`}>{opt.label}</span>
                            <span className={`absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full bg-primary-900 transition-all ${active ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                              <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className={labelClass}>Full name</label>
                      <input
                        type="text"
                        id="name"
                        maxLength={50}
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
                        }}
                        className={fieldClass(fieldErrors.name)}
                        placeholder="Your full name"
                      />
                      {fieldErrors.name && <p className="mt-1.5 text-xs font-medium text-red-500">{fieldErrors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="phone" className={labelClass}>Phone</label>
                      <div className={`flex items-center rounded-xl border bg-gray-50/80 transition-all focus-within:bg-white focus-within:ring-4 ${fieldErrors.phone ? 'border-red-300 focus-within:border-red-400 focus-within:ring-red-500/10' : 'border-gray-200 focus-within:border-primary-900 focus-within:ring-primary-900/10'}`}>
                        <span className="select-none whitespace-nowrap pl-4 pr-2 text-[15px] font-medium text-gray-500">+91</span>
                        <div className="mr-2 h-5 w-px bg-gray-200" />
                        <input
                          type="tel"
                          id="phone"
                          maxLength={10}
                          inputMode="numeric"
                          value={formData.phone}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '');
                            setFormData({ ...formData, phone: digits });
                            if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: '' });
                          }}
                          className="flex-1 bg-transparent py-3 pr-4 text-[15px] text-gray-900 placeholder-gray-400 outline-none"
                          placeholder="98765 43210"
                        />
                      </div>
                      {fieldErrors.phone && <p className="mt-1.5 text-xs font-medium text-red-500">{fieldErrors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className={labelClass}>Email address<span className={optionalClass}>optional</span></label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                      }}
                      className={fieldClass(fieldErrors.email)}
                      placeholder="you@example.com"
                    />
                    {fieldErrors.email && <p className="mt-1.5 text-xs font-medium text-red-500">{fieldErrors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="city" className={labelClass}>Your city</label>
                    <div className="relative">
                      <select
                        id="city"
                        value={formData.city}
                        onChange={(e) => {
                          setFormData({ ...formData, city: e.target.value });
                          if (fieldErrors.city) setFieldErrors({ ...fieldErrors, city: '' });
                        }}
                        className={`${fieldClass(fieldErrors.city)} h-[50px] appearance-none pr-11 ${formData.city ? '' : 'text-gray-400'}`}
                      >
                        <option value="" disabled hidden>Where are you based?</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Chennai">Chennai</option>
                        <option value="others">Others</option>
                      </select>
                      <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    {fieldErrors.city && <p className="mt-1.5 text-xs font-medium text-red-500">{fieldErrors.city}</p>}

                    {formData.city === 'others' && (
                      <input
                        type="text"
                        maxLength={50}
                        value={formData.otherCity}
                        onChange={(e) => {
                          setFormData({ ...formData, otherCity: e.target.value });
                          if (fieldErrors.otherCity) setFieldErrors({ ...fieldErrors, otherCity: '' });
                        }}
                        className={`${fieldClass(fieldErrors.otherCity)} mt-3`}
                        placeholder="Enter your city"
                      />
                    )}
                    {fieldErrors.otherCity && <p className="mt-1.5 text-xs font-medium text-red-500">{fieldErrors.otherCity}</p>}
                  </div>

                  <div>
                    <label htmlFor="childDetails" className={labelClass}>Anything we should know?<span className={optionalClass}>optional</span></label>
                    <textarea
                      id="childDetails"
                      rows={3}
                      maxLength={500}
                      value={formData.childDetails}
                      onChange={(e) => setFormData({ ...formData, childDetails: e.target.value })}
                      className={`${fieldClass()} resize-none`}
                      placeholder="Ages, special needs, or preferred schedule..."
                    />
                  </div>

                  {status === 'error' && (
                    <div className="rounded-xl border border-red-100 bg-red-50 p-3">
                      <p className="text-center text-sm font-medium text-red-600">Something went wrong. Please try again later.</p>
                    </div>
                  )}

                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="group flex w-full items-center justify-center gap-2 rounded-full bg-primary-900 py-4 text-[15px] font-semibold text-white shadow-lg shadow-primary-900/20 transition-all hover:bg-primary-800 disabled:opacity-60"
                    >
                      {status === 'loading' ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      ) : (
                        <>
                          Secure my spot
                          <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>

                    <div className="mt-3.5 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                      <Lock size={13} />
                      Your details are private and never shared.
                    </div>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
