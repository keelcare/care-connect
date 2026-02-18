'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Activity, AlertCircle, School, Phone, Heart } from 'lucide-react';
import { Child, ChildProfileType } from '@/types/api';

interface ChildProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (child: Partial<Child>) => void;
  initialData?: Partial<Child>;
}

export const ChildProfileModal: React.FC<ChildProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Child>>(initialData || {
    profile_type: 'STANDARD',
    gender: 'MALE',
    allergies: [],
    dietary_restrictions: [],
    learning_goals: []
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const updateField = (field: keyof Child, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold text-primary">
              {initialData ? 'Edit Child Profile' : 'Add Child Profile'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Step 1: Basic Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#E5F1EC] flex items-center justify-center text-[#1F6F5B] text-sm">1</span>
                Basic Information
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.first_name || ''}
                    onChange={e => updateField('first_name', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1F6F5B] focus:ring-4 focus:ring-[#1F6F5B]/10 outline-none transition-all"
                    placeholder="e.g. Oliver"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.last_name || ''}
                    onChange={e => updateField('last_name', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1F6F5B] focus:ring-4 focus:ring-[#1F6F5B]/10 outline-none transition-all"
                    placeholder="e.g. Smith"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={formData.dob || ''}
                    onChange={e => updateField('dob', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1F6F5B] focus:ring-4 focus:ring-[#1F6F5B]/10 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={e => updateField('gender', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1F6F5B] focus:ring-4 focus:ring-[#1F6F5B]/10 outline-none transition-all bg-white"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Profile Type */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#E5F1EC] flex items-center justify-center text-[#1F6F5B] text-sm">2</span>
                Care Profile Type
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => updateField('profile_type', 'STANDARD')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${formData.profile_type === 'STANDARD'
                      ? 'border-[#1F6F5B] bg-background'
                      : 'border-gray-100 hover:border-gray-200'
                    }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <User className={`w-5 h-5 ${formData.profile_type === 'STANDARD' ? 'text-[#1F6F5B]' : 'text-gray-400'}`} />
                    <span className={`font-bold ${formData.profile_type === 'STANDARD' ? 'text-primary' : 'text-gray-900'}`}>Standard Care</span>
                  </div>
                  <p className="text-sm text-gray-500">For standard babysitting and nanny services.</p>
                </button>

                <button
                  type="button"
                  onClick={() => updateField('profile_type', 'SPECIAL_NEEDS')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${formData.profile_type === 'SPECIAL_NEEDS'
                      ? 'border-[#CC7A68] bg-[#FDF3F1]'
                      : 'border-gray-100 hover:border-gray-200'
                    }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Heart className={`w-5 h-5 ${formData.profile_type === 'SPECIAL_NEEDS' ? 'text-[#CC7A68]' : 'text-gray-400'}`} />
                    <span className={`font-bold ${formData.profile_type === 'SPECIAL_NEEDS' ? 'text-[#CC7A68]' : 'text-gray-900'}`}>Special Needs / Shadow Teacher</span>
                  </div>
                  <p className="text-sm text-gray-500">For specialized care protocols and educational support.</p>
                </button>
              </div>
            </div>

            {/* Step 3: Specifics */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#E5F1EC] flex items-center justify-center text-[#1F6F5B] text-sm">3</span>
                Specific Details
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Allergies (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Peanuts, Dairy"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1F6F5B] outline-none"
                    onChange={e => updateField('allergies', e.target.value.split(',').map(s => s.trim()))}
                    value={formData.allergies?.join(', ') || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Restrictions (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Vegetarian, Halal"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1F6F5B] outline-none"
                    onChange={e => updateField('dietary_restrictions', e.target.value.split(',').map(s => s.trim()))}
                    value={formData.dietary_restrictions?.join(', ') || ''}
                  />
                </div>
              </div>

              {formData.profile_type === 'SPECIAL_NEEDS' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-6 pt-6 border-t border-gray-100"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis / Conditions</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#CC7A68] focus:ring-4 focus:ring-[#CC7A68]/10 outline-none transition-all"
                      placeholder="e.g. Autism Spectrum Disorder, ADHD"
                      value={formData.diagnosis || ''}
                      onChange={e => updateField('diagnosis', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Care Instructions / Protocols</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#CC7A68] focus:ring-4 focus:ring-[#CC7A68]/10 outline-none transition-all resize-none"
                      placeholder="Detailed instructions for the caregiver..."
                      value={formData.care_instructions || ''}
                      onChange={e => updateField('care_instructions', e.target.value)}
                    />
                  </div>

                  <div className="bg-[#FDF3F1] p-6 rounded-2xl space-y-4">
                    <h4 className="font-semibold text-[#CC7A68] flex items-center gap-2">
                      <School className="w-5 h-5" />
                      School Details (For Shadow Teacher)
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="School Name"
                        className="w-full px-4 py-2 rounded-lg border-transparent focus:border-[#CC7A68] focus:ring-2 focus:ring-[#CC7A68]/20 outline-none"
                        value={formData.school_details?.name || ''}
                        onChange={e => updateField('school_details', { ...formData.school_details, name: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Class / Grade"
                        className="w-full px-4 py-2 rounded-lg border-transparent focus:border-[#CC7A68] focus:ring-2 focus:ring-[#CC7A68]/20 outline-none"
                        value={formData.school_details?.grade || ''}
                        onChange={e => updateField('school_details', { ...formData.school_details, grade: e.target.value })}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-primary hover:bg-primary-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Save Profile
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
