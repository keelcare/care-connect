'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const WaitlistModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    careType: 'child', 
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

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
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
          careType: formData.careType === 'child' ? 'Child care' : formData.careType === 'shadow' ? 'Shadow teacher' : 'Special needs',
          childDetails: formData.childDetails
        }),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ careType: 'child', name: '', email: '', phone: '', city: '', otherCity: '', childDetails: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
      console.error(error);
    }
  };

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
            className="absolute inset-0 bg-primary-900/40 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
              <div>
                <h2 className="text-2xl font-bold text-primary-900 font-sans tracking-tight">
                  Join the Keel Waitlist
                </h2>
                <p className="text-sm text-gray-500 font-body">Find the perfect care for your family.</p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold mb-3 text-primary-900">You&apos;re on the list!</h3>
                  <p className="text-lg text-gray-600 max-w-md mx-auto">
                    Thank you for your interest. We&apos;re actively training our care professionals and will reach out to you as soon as we&apos;re ready for you.
                  </p>
                  <button
                    onClick={closeModal}
                    className="mt-8 px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-full transition-colors"
                  >
                    Close Window
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {/* Care Type Selection */}
                  <div>
                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">What kind of care do you need?</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, careType: 'shadow' })}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${formData.careType === 'shadow' ? 'border-primary-900 bg-blue-50/30' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                      >
                        <div className={`p-2 rounded-lg ${formData.careType === 'shadow' ? 'text-primary-900' : 'text-gray-400'}`}>
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                          </svg>
                        </div>
                        <div>
                          <span className={`block font-bold ${formData.careType === 'shadow' ? 'text-primary-900' : 'text-gray-700'}`}>Shadow teacher</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, careType: 'child' })}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${formData.careType === 'child' ? 'border-primary-900 bg-blue-50/30' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                      >
                        <div className={`p-2 rounded-lg ${formData.careType === 'child' ? 'text-primary-900' : 'text-gray-400'}`}>
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div>
                          <span className={`block font-bold ${formData.careType === 'child' ? 'text-primary-900' : 'text-gray-700'}`}>Child care</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, careType: 'special' })}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${formData.careType === 'special' ? 'border-primary-900 bg-blue-50/30' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                      >
                        <div className={`p-2 rounded-lg ${formData.careType === 'special' ? 'text-primary-900' : 'text-gray-400'}`}>
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        <div>
                          <span className={`block font-bold ${formData.careType === 'special' ? 'text-primary-900' : 'text-gray-700'}`}>Special needs</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-1.5">Full Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        id="name"
                        maxLength={50}
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
                        }}
                        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all font-body bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400 ${fieldErrors.name ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-primary-900 focus:ring-primary-900/20'}`}
                        placeholder="Your full name"
                      />
                      {fieldErrors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{fieldErrors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-1.5">Phone <span className="text-red-500">*</span></label>
                      <div className={`flex items-center rounded-xl border transition-all bg-gray-50 focus-within:bg-white ${fieldErrors.phone ? 'border-red-400 focus-within:border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 focus-within:border-primary-900 focus-within:ring-2 focus-within:ring-primary-900/20'}`}>
                        <span className="pl-4 pr-2 text-gray-500 font-body font-medium select-none whitespace-nowrap">+91</span>
                        <div className="w-px h-5 bg-gray-200 mr-2" />
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
                          className="flex-1 py-3 pr-4 bg-transparent outline-none font-body text-gray-900 placeholder-gray-400"
                          placeholder="9876543210"
                        />
                      </div>
                      {fieldErrors.phone && <p className="text-red-500 text-xs mt-1.5 font-medium">{fieldErrors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email Address <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                      }}
                      className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all font-body bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400 ${fieldErrors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-primary-900 focus:ring-primary-900/20'}`}
                      placeholder="you@example.com"
                    />
                    {fieldErrors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{fieldErrors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-1.5">Your City <span className="text-red-500">*</span></label>
                    <select
                      id="city"
                      value={formData.city}
                      onChange={(e) => {
                        setFormData({ ...formData, city: e.target.value });
                        if (fieldErrors.city) setFieldErrors({ ...fieldErrors, city: '' });
                      }}
                      className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all font-body bg-gray-50 focus:bg-white text-gray-900 appearance-none h-[50px] mb-3 ${fieldErrors.city ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-primary-900 focus:ring-primary-900/20'}`}
                    >
                      <option value="" disabled hidden>Where are you based?</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Chennai">Chennai</option>
                      <option value="others">Others</option>
                    </select>
                    {fieldErrors.city && <p className="text-red-500 text-xs mb-3 -mt-1 font-medium">{fieldErrors.city}</p>}

                    {formData.city === 'others' && (
                      <div>
                        <input
                          type="text"
                          maxLength={50}
                          value={formData.otherCity}
                          onChange={(e) => {
                            setFormData({ ...formData, otherCity: e.target.value });
                            if (fieldErrors.otherCity) setFieldErrors({ ...fieldErrors, otherCity: '' });
                          }}
                          className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all font-body bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400 ${fieldErrors.otherCity ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-primary-900 focus:ring-primary-900/20'}`}
                          placeholder="Enter your city"
                        />
                        {fieldErrors.otherCity && <p className="text-red-500 text-xs mt-1.5 font-medium">{fieldErrors.otherCity}</p>}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="childDetails" className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-1.5">Anything we should know? <span className="font-normal lowercase">optional</span></label>
                    <textarea
                      id="childDetails"
                      rows={3}
                      maxLength={500}
                      value={formData.childDetails}
                      onChange={(e) => setFormData({ ...formData, childDetails: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-900 focus:ring-2 focus:ring-primary-900/20 outline-none transition-all font-body bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400 resize-none"
                      placeholder="Ages, special needs, or preferred schedule..."
                    />
                  </div>

                  <div className="flex justify-center flex-col items-center">
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-64 bg-white border border-gray-100 text-gray-800 font-bold text-base py-3 rounded-full hover:bg-gray-50 transition-colors disabled:opacity-70 flex justify-center items-center gap-2 shadow-sm"
                    >
                      {status === 'loading' ? (
                        <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      ) : (
                        <>
                          Secure my spot
                          <div className="w-6 h-6 rounded-full bg-[#525252] text-white flex items-center justify-center ml-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          </div>
                        </>
                      )}
                    </button>
                    
                    <div className="flex items-center justify-center text-sm text-gray-400 mt-4 gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Your details are private and never shared.
                    </div>
                  </div>

                  {status === 'error' && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg mt-4">
                      <p className="text-red-600 text-sm font-medium text-center">Something went wrong. Please try again later.</p>
                    </div>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
