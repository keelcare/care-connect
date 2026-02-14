'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Baby,
  Heart,
  Briefcase,
  Home,
  GraduationCap,
  HandHeart,
  MapPin,
  Check,
  AlertCircle,
  IndianRupee,
  Navigation,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/ToastProvider';

export default function NannyOnboardingPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [updatingLocation, setUpdatingLocation] = useState(false);
  
  // Initialize with "Child Care" by default since this is a nanny app
  const [categories, setCategories] = useState<{ [key: string]: boolean }>({
    childCare: true,

    specialNeeds: false,
    tutoring: false,
    petCare: false,
    housekeeping: false,
  });

  const [formData, setFormData] = useState({
    hourlyRate: '',
    experienceYears: '',
    bio: '',
    skills: '', // Comma separated string
    address: '',
    lat: null as number | null,
    lng: null as number | null,
  });

  // Pre-fill data if user already has some (e.g. if they came back to edit)
  useEffect(() => {
    if (user) {
      // Map existing skills to categories if present
      const userSkills = (user.nanny_details?.skills || []).map(s => s.toLowerCase());
      
      const newCategories = { ...categories };

      if (userSkills.some(s => s.includes('special') || s.includes('disability'))) newCategories.specialNeeds = true;
      if (userSkills.some(s => s.includes('tutor') || s.includes('math') || s.includes('homework'))) newCategories.tutoring = true;
      if (userSkills.some(s => s.includes('pet') || s.includes('dog'))) newCategories.petCare = true;
      if (userSkills.some(s => s.includes('house') || s.includes('clean'))) newCategories.housekeeping = true;
      
      setCategories(newCategories);

      // Filter out category keywords from the manual skills list for cleaner display
      const categoryKeywords = ['child', 'baby', 'senior', 'elderly', 'special', 'disability', 'tutor', 'pet', 'house', 'clean'];
      const manualSkills = (user.nanny_details?.skills || [])
        .filter(s => !categoryKeywords.some(k => s.toLowerCase().includes(k)))
        .join(', ');

      setFormData({
        hourlyRate: user.nanny_details?.hourly_rate?.toString() || '',
        experienceYears: user.nanny_details?.experience_years?.toString() || '',
        bio: user.nanny_details?.bio || '',
        skills: manualSkills,
        address: user.profiles?.address || '',
        lat: user.profiles?.lat ? parseFloat(user.profiles.lat) : null,
        lng: user.profiles?.lng ? parseFloat(user.profiles.lng) : null,
      });
    }
  }, [user]);

  const serviceOptions = [
    { id: 'childCare', label: 'Child Care', icon: Baby, color: 'text-amber-500 bg-amber-50 border-amber-200' },
    { id: 'specialNeeds', label: 'Special Needs', icon: HandHeart, color: 'text-teal-500 bg-teal-50 border-teal-200' },

    { id: 'tutoring', label: 'Tutoring', icon: GraduationCap, color: 'text-indigo-500 bg-indigo-50 border-indigo-200' },
    { id: 'petCare', label: 'Pet Care', icon: Briefcase, color: 'text-orange-500 bg-orange-50 border-orange-200' },
    { id: 'housekeeping', label: 'Housekeeping', icon: Home, color: 'text-blue-500 bg-blue-50 border-blue-200' },
  ];

  const toggleCategory = (id: string) => {
    setCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUpdateLocation = () => {
    if (!navigator.geolocation) {
      addToast({ message: 'Geolocation is not supported by your browser', type: 'error' });
      return;
    }

    setUpdatingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          let addressName = 'Current Location';
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            if (data.display_name) {
              addressName = data.display_name;
            }
          } catch (e) {
            console.warn('Reverse geocoding failed', e);
          }

          setFormData(prev => ({
            ...prev,
            lat: latitude,
            lng: longitude,
            address: addressName
          }));

          addToast({ message: 'Location detected!', type: 'success' });
        } catch (error) {
          console.error('Error updating location:', error);
          addToast({ message: 'Failed to detect location.', type: 'error' });
        } finally {
          setUpdatingLocation(false);
        }
      },
      (error) => {
        let errorMessage = 'Unable to retrieve location';
        
        if (error.code === 1) {
          errorMessage = 'Please allow location access in your browser settings';
        } else if (error.code === 2) {
          errorMessage = 'Unable to determine your location. Please check your Wi-Fi and Location Services';
        } else if (error.code === 3) {
          errorMessage = 'Location request timed out. Please try again';
        }
        
        addToast({ message: errorMessage, type: 'error' });
        setUpdatingLocation(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      // 1. Construct Skills Array
      const skillsList: string[] = [];
      
      // Add category keywords
      if (categories.childCare) skillsList.push('Child Care', 'Babysitting');

      if (categories.specialNeeds) skillsList.push('Special Needs', 'Disability Care');
      if (categories.tutoring) skillsList.push('Tutoring', 'Homework Help');
      if (categories.petCare) skillsList.push('Pet Care');
      if (categories.housekeeping) skillsList.push('Housekeeping', 'Cleaning');

      // Add manual skills
      if (formData.skills) {
        const manual = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
        skillsList.push(...manual);
      }
      
      // Remove duplicates
      const uniqueSkills = Array.from(new Set(skillsList));

      await api.users.update(user.id, {
        hourlyRate: parseFloat(formData.hourlyRate),
        experienceYears: parseInt(formData.experienceYears),
        bio: formData.bio,
        skills: uniqueSkills,
        address: formData.address,
        lat: formData.lat || undefined,
        lng: formData.lng || undefined,
      });

      await refreshUser();
      addToast({ message: 'Profile completed successfully!', type: 'success' });
      router.push('/dashboard/profile');
      
    } catch (error) {
      console.error('Profile update failed:', error);
      addToast({ message: 'Failed to save profile. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-emerald-600 px-8 py-10 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Build Your Care Profile</h1>
            <p className="text-emerald-100 text-lg">Help families find the perfect match by sharing your details.</p>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500 opacity-20 rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
          
          {/* Section 1: Services */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-stone-900 border-b border-gray-100 pb-2">
              1. What services do you provide?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {serviceOptions.map((service) => (
                <div
                  key={service.id}
                  onClick={() => toggleCategory(service.id)}
                  className={`
                    cursor-pointer relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center text-center gap-3
                    ${categories[service.id] 
                      ? `${service.color} bg-opacity-100 shadow-sm transform scale-[1.02]` 
                      : 'border-stone-100 bg-stone-50 text-stone-500 hover:bg-stone-100'
                    }
                  `}
                >
                  {categories[service.id] && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-current rounded-full flex items-center justify-center">
                      <Check size={12} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                  <service.icon size={28} />
                  <span className="font-semibold text-sm">{service.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Details */}
          <div className="space-y-4">
             <h2 className="text-xl font-bold text-stone-900 border-b border-gray-100 pb-2">
              2. Your Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Hourly Rate (₹)"
                type="number"
                placeholder="e.g. 500"
                min={0}
                value={formData.hourlyRate}
                onChange={e => {
                  const val = parseFloat(e.target.value);
                  if (val < 0) return;
                  setFormData({...formData, hourlyRate: e.target.value})
                }}
                required
                className="rounded-xl"
                leftIcon={<IndianRupee size={16} />}
              />
              <Input
                label="Years of Experience"
                type="number"
                placeholder="e.g. 3"
                min={0}
                value={formData.experienceYears}
                onChange={e => {
                  const val = parseFloat(e.target.value);
                  if (val < 0) return;
                  setFormData({...formData, experienceYears: e.target.value})
                }}
                required
                className="rounded-xl"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Additional Skills
              </label>
              <Input
                placeholder="CPR Certified, First Aid, Driving License, Cooking..."
                value={formData.skills}
                onChange={e => setFormData({...formData, skills: e.target.value})}
                className="rounded-xl"
                helperText="Separate multiple skills with commas"
              />
            </div>

             <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Your Bio
              </label>
              <textarea
                className="w-full p-4 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-stone-400 min-h-[120px]"
                placeholder="Tell parents about your experience, your style of care, and why you love what you do..."
                value={formData.bio}
                onChange={e => setFormData({...formData, bio: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Section 3: Location */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-stone-900 border-b border-gray-100 pb-2">
              3. Service Location
            </h2>
            <div className="flex gap-3">
               <div className="flex-1">
                 <Input
                  placeholder="Your Base City/Area"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  required
                  className="rounded-xl"
                  leftIcon={<MapPin size={18} />}
                />
               </div>
               <Button 
                type="button"
                variant="outline"
                className="rounded-xl h-12 px-6"
                onClick={handleUpdateLocation}
                disabled={updatingLocation}
               >
                 {updatingLocation ? (
                   <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                 ) : (
                    <Navigation size={18} />
                 )}
               </Button>
            </div>
            <p className="text-xs text-stone-500 flex items-center gap-1">
              <AlertCircle size={12} />
              We use your location to show you nearby jobs and show your profile to nearby parents.
            </p>
          </div>

          <div className="pt-6 border-t border-stone-100 flex justify-end gap-4">
             <Button
                type="button"
                variant="ghost"
                onClick={() => router.push('/dashboard')}
                className="rounded-xl"
              >
                Skip for now
              </Button>
             <Button
                type="submit"
                size="lg"
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-emerald-200 px-8"
                isLoading={loading}
              >
                Complete Profile
              </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
