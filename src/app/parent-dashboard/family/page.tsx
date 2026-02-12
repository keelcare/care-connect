'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, User, Heart, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import ParentLayout from '@/components/layout/ParentLayout';
import { Button } from '@/components/ui/button';
import { ChildProfileModal } from '@/components/dashboard/ChildProfileModal';
import { api } from '@/lib/api';
import { Child } from '@/types/api';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

export default function FamilyPage() {
  const { user } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Partial<Child> | undefined>(undefined);

  // Mock data for demonstration until backend is ready


  const fetchChildren = async () => {
    try {
      setLoading(true);
      const data = await api.family.list();
      setChildren(data);
    } catch (error) {
      console.error('Failed to fetch children:', error);
      // Optional: Add toast error here if you have useToast hook available in this scope? 
      // The snippet doesn't show useToast imported, let's fix that in a separate edit or assume it's fine for now to just log.
      // But for save/delete we definitely want feedbacks.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  const handleSaveChild = async (childData: Partial<Child>) => {
    try {
      if (selectedChild?.id) {
        // Update existing
        const updated = await api.family.update(selectedChild.id, childData);
        setChildren(prev => prev.map(c => c.id === selectedChild.id ? updated : c));
      } else {
        // Create new
        const created = await api.family.create(childData);
        setChildren(prev => [...prev, created]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save child:', error);
      alert('Failed to save profile. Please try again.'); // Simple alert for now as useToast isn't in imports yet?
    }
  };

  const handleDeleteChild = async (id: string) => {
    if (!confirm('Are you sure you want to delete this profile?')) return;
    try {
      await api.family.delete(id);
      setChildren(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete child:', error);
      alert('Failed to delete profile.');
    }
  };

  const openAddModal = () => {
    setSelectedChild(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (child: Child) => {
    setSelectedChild(child);
    setIsModalOpen(true);
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <ParentLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1B3022] font-display">My Family</h1>
            <p className="text-gray-500 mt-1">Manage profiles for your children to personalize their care.</p>
          </div>
          <Button 
            onClick={openAddModal}
            className="bg-[#1B3022] hover:bg-[#15231b] text-white rounded-xl px-6 py-6 shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Child Profile
          </Button>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="bg-white rounded-[24px] p-6 h-64 animate-pulse bg-gray-100" />
            ))}
          </div>
        ) : children.length === 0 ? (
          <div className="bg-white rounded-[32px] p-12 text-center border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-[#F2F7F4] rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-[#1B3022]" />
            </div>
            <h3 className="text-xl font-bold text-[#1B3022] mb-2">No profiles added yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Add profiles for your children to help us match you with the perfect caregivers and ensure all their needs are met.
            </p>
            <Button onClick={openAddModal} variant="outline" className="border-[#1B3022] text-[#1B3022]">
              Create First Profile
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`group relative bg-white rounded-[24px] border-2 transition-all duration-300 hover:shadow-xl overflow-hidden ${
                  child.profile_type === 'SPECIAL_NEEDS' 
                    ? 'border-[#FDF3F1] hover:border-[#CC7A68]/30' 
                    : 'border-[#F2F7F4] hover:border-[#1B3022]/30'
                }`}
              >
                {/* Header Pattern */}
                <div className={`h-24 ${
                  child.profile_type === 'SPECIAL_NEEDS' 
                    ? 'bg-[#FDF3F1]' 
                    : 'bg-[#F2F7F4]'
                }`} />

                <div className="px-6 pb-6">
                  {/* Avatar & Name */}
                  <div className="relative -mt-12 mb-4 flex justify-between items-end">
                    <div className="relative">
                      <div className={`w-24 h-24 rounded-full border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold ${
                         child.profile_type === 'SPECIAL_NEEDS'
                           ? 'bg-[#CC7A68] text-white'
                           : 'bg-[#1B3022] text-white'
                      }`}>
                        {child.first_name[0]}
                      </div>
                      {child.profile_type === 'SPECIAL_NEEDS' && (
                        <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-sm border border-gray-100" title="Special Needs / Shadow Teacher Profile">
                          <Heart className="w-4 h-4 text-[#CC7A68] fill-current" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openEditModal(child)}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteChild(child.id)}
                        className="p-2 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[#1B3022]">{child.first_name} {child.last_name}</h3>
                    <p className="text-gray-500 text-sm font-medium">
                      {calculateAge(child.dob)} years old • {format(new Date(child.dob), 'MMM d, yyyy')}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {child.allergies && child.allergies.length > 0 && (
                      <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {child.allergies.length} Allergies
                      </span>
                    )}
                    {child.profile_type === 'SPECIAL_NEEDS' && (
                      <span className="px-3 py-1 bg-[#FDF3F1] text-[#CC7A68] text-xs font-semibold rounded-full">
                        Special Care
                      </span>
                    )}
                  </div>

                  {/* Details Preview */}
                  {child.profile_type === 'SPECIAL_NEEDS' && child.diagnosis && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-xl text-sm">
                      <p className="text-gray-500 text-xs uppercase tracking-wide font-semibold mb-1">Diagnosis</p>
                      <p className="text-gray-700 font-medium truncate">{child.diagnosis}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <ChildProfileModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveChild}
          initialData={selectedChild}
        />
      </div>
    </ParentLayout>
  );
}
