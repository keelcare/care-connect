'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Edit2, Trash2, User, Heart, AlertCircle,
  Utensils, Moon, Phone, FileText, Sparkles, Users,
} from 'lucide-react';
import ParentLayout from '@/components/layout/ParentLayout';
import { Button } from '@/components/ui/button';
import { ChildProfileModal } from '@/components/dashboard/ChildProfileModal';
import { api } from '@/lib/api';
import { Child } from '@/types/api';
import { useAuth } from '@/context/AuthContext';

/* ── helpers ─────────────────────────────────────────────────────── */

function calcAge(dob: string) {
  return Math.floor((Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
}

function formatDob(dob: string) {
  try { return new Date(dob).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); }
  catch { return dob; }
}

/* ── child card ──────────────────────────────────────────────────── */

function ChildCard({
  child, onEdit, onDelete, deleting,
}: {
  child: Child;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  const isSpecial = child.profile_type === 'SPECIAL_NEEDS';
  const age = calcAge(child.dob);

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md group ${
      isSpecial ? 'border-rose-100 hover:border-rose-200' : 'border-slate-100 hover:border-primary-100'
    }`}>
      {/* Colour header */}
      <div className={`h-1.5 ${isSpecial ? 'bg-rose-400' : 'bg-primary-600'}`} />

      <div className="p-5">
        {/* Avatar + name + actions */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-black flex-shrink-0 ${
              isSpecial ? 'bg-rose-500' : 'bg-primary-800'
            }`}>
              {child.first_name[0].toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-primary-900 text-base">{child.first_name} {child.last_name}</p>
              <p className="text-xs text-slate-500">{age} years old · {formatDob(child.dob)}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={onEdit}
              className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-primary-700 transition-colors"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={onDelete}
              disabled={deleting}
              className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors"
            >
              {deleting
                ? <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                : <Trash2 size={14} />}
            </button>
          </div>
        </div>

        {/* Profile type badge */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
            isSpecial ? 'bg-rose-50 text-rose-600' : 'bg-primary-50 text-primary-700'
          }`}>
            {isSpecial ? <Heart size={10} className="fill-current" /> : <User size={10} />}
            {isSpecial ? 'Special Care' : 'Standard Care'}
          </span>

          {child.gender && (
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
              {child.gender === 'MALE' ? 'Boy' : child.gender === 'FEMALE' ? 'Girl' : 'Other'}
            </span>
          )}
        </div>

        {/* Info pills */}
        <div className="space-y-2">
          {(child.allergies?.length ?? 0) > 0 && (
            <div className="flex items-start gap-2 text-xs">
              <AlertCircle size={12} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-red-600">Allergies: </span>
                <span className="text-slate-600">{child.allergies!.join(', ')}</span>
                {child.allergy_severity && (
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${
                    child.allergy_severity === 'severe' ? 'bg-red-100 text-red-600' :
                    child.allergy_severity === 'moderate' ? 'bg-amber-100 text-amber-600' :
                    'bg-emerald-100 text-emerald-600'
                  }`}>{child.allergy_severity}</span>
                )}
              </div>
            </div>
          )}

          {(child.dietary_restrictions?.length ?? 0) > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <Utensils size={12} className="text-slate-400 flex-shrink-0" />
              <span className="text-slate-600">{child.dietary_restrictions!.join(', ')}</span>
            </div>
          )}

          {child.bedtime && (
            <div className="flex items-center gap-2 text-xs">
              <Moon size={12} className="text-indigo-400 flex-shrink-0" />
              <span className="text-slate-600">Bedtime: {child.bedtime}</span>
            </div>
          )}

          {isSpecial && child.diagnosis && (
            <div className="flex items-start gap-2 text-xs">
              <Sparkles size={12} className="text-rose-400 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600 truncate">{child.diagnosis}</span>
            </div>
          )}

          {isSpecial && child.school_details?.name && (
            <div className="flex items-center gap-2 text-xs">
              <FileText size={12} className="text-slate-400 flex-shrink-0" />
              <span className="text-slate-600">{child.school_details.name}{child.school_details.grade ? `, ${child.school_details.grade}` : ''}</span>
            </div>
          )}

          {(child.emergency_contact ?? child.emergency_contact_override) && (
            <div className="flex items-center gap-2 text-xs">
              <Phone size={12} className="text-emerald-500 flex-shrink-0" />
              <span className="text-slate-600">
                {(child.emergency_contact ?? child.emergency_contact_override)!.name}
                {' · '}
                {(child.emergency_contact ?? child.emergency_contact_override)!.phone}
              </span>
            </div>
          )}

          {child.personality_notes && (
            <p className="text-xs text-slate-400 italic line-clamp-2 pt-1">
              "{child.personality_notes}"
            </p>
          )}
        </div>
      </div>

      {/* Edit footer */}
      <div className="border-t border-slate-50 px-5 py-3 bg-slate-50/50">
        <button
          onClick={onEdit}
          className="text-xs font-semibold text-primary-600 hover:text-primary-800 transition-colors"
        >
          Edit profile →
        </button>
      </div>
    </div>
  );
}

/* ── empty state ─────────────────────────────────────────────────── */

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
      <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Users size={24} className="text-primary-400" />
      </div>
      <p className="font-bold text-primary-900 text-base mb-2">No child profiles yet</p>
      <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
        Add profiles for your children so we can match you with the most suitable caregivers and personalise each session.
      </p>
      <Button
        onClick={onAdd}
        className="h-10 px-6 rounded-xl bg-primary-900 text-white text-sm font-bold gap-2 mx-auto"
      >
        <Plus size={15} /> Add First Profile
      </Button>
    </div>
  );
}

/* ── main page ───────────────────────────────────────────────────── */

export default function FamilyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Partial<Child> | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      setChildren(await api.family.list());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchChildren();
    else if (user === null) router.push('/auth/login');
  }, [user, router]);

  const handleSave = async (childData: Partial<Child>) => {
    try {
      if (selectedChild?.id) {
        const updated = await api.family.update(selectedChild.id, childData);
        setChildren(prev => prev.map(c => c.id === selectedChild.id ? updated : c));
      } else {
        const created = await api.family.create(childData);
        setChildren(prev => [...prev, created]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Failed to save profile. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this child profile?')) return;
    setDeletingId(id);
    try {
      await api.family.delete(id);
      setChildren(prev => prev.filter(c => c.id !== id));
    } catch { alert('Failed to remove profile.'); }
    finally { setDeletingId(null); }
  };

  const openAdd = () => { setSelectedChild(undefined); setIsModalOpen(true); };
  const openEdit = (child: Child) => { setSelectedChild(child); setIsModalOpen(true); };

  return (
    <ParentLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-primary-900 tracking-tight">My Family</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Child profiles help us find caregivers who are the perfect match.
            </p>
          </div>
          {children.length > 0 && (
            <Button
              onClick={openAdd}
              className="h-10 px-4 rounded-xl bg-primary-900 text-white text-sm font-bold gap-2 flex-shrink-0 shadow-md shadow-primary-900/20"
            >
              <Plus size={15} /> Add Child
            </Button>
          )}
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-white rounded-2xl border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : children.length === 0 ? (
          <EmptyState onAdd={openAdd} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {children.map(child => (
              <ChildCard
                key={child.id}
                child={child}
                onEdit={() => openEdit(child)}
                onDelete={() => handleDelete(child.id)}
                deleting={deletingId === child.id}
              />
            ))}

            {/* Add new card */}
            <button
              onClick={openAdd}
              className="bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary-300 hover:bg-primary-50/30 transition-all flex flex-col items-center justify-center gap-3 p-8 min-h-[200px] text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
                <Plus size={22} className="text-slate-400 group-hover:text-primary-600 transition-colors" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-600 group-hover:text-primary-900 transition-colors">Add Another Child</p>
                <p className="text-xs text-slate-400 mt-0.5">Standard or special needs profile</p>
              </div>
            </button>
          </div>
        )}
      </div>

      <ChildProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={selectedChild}
      />
    </ParentLayout>
  );
}
