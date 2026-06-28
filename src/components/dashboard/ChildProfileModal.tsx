'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, User, Heart, School, Phone, ChevronLeft, ChevronRight,
  AlertCircle, Utensils, Moon, Upload, FileText, CheckCircle2, Sparkles } from 'lucide-react';
import { Child, ChildProfileType } from '@/types/api';

/* ── types ───────────────────────────────────────────────────────── */

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (child: Partial<Child>) => void;
  initialData?: Partial<Child>;
}

const STEPS = [
  { id: 1, label: 'Basic Info',   icon: User },
  { id: 2, label: 'Care Profile', icon: Heart },
  { id: 3, label: 'Health',       icon: AlertCircle },
  { id: 4, label: 'Contact',      icon: Phone },
];

const SPECIAL_STEPS = [...STEPS, { id: 5, label: 'Special Care', icon: Sparkles }];

/* ── input components ────────────────────────────────────────────── */

function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-2">
      <label className="block text-sm font-bold text-primary-900">{children}</label>
      {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label hint={hint}>{label}</Label>
      {children}
    </div>
  );
}

const INPUT = "w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none text-sm text-slate-700 placeholder:text-slate-400 transition-all bg-white";
const TEXTAREA = `${INPUT} resize-none`;

function TagInput({
  value, onChange, placeholder,
}: {
  value: string[]; onChange: (v: string[]) => void; placeholder?: string;
}) {
  const [input, setInput] = useState('');

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) onChange([...value, trimmed]);
    setInput('');
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          className={`flex-1 ${INPUT}`}
        />
        <button
          type="button"
          onClick={add}
          className="px-4 py-2 rounded-xl bg-primary-50 text-primary-700 text-sm font-bold hover:bg-primary-100 transition-colors border-2 border-primary-100"
        >
          Add
        </button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
              {tag}
              <button type="button" onClick={() => onChange(value.filter(t => t !== tag))} className="hover:text-red-500 transition-colors">
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── main modal ──────────────────────────────────────────────────── */

export const ChildProfileModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
  const [step, setStep] = useState(1);
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emptyForm: Partial<Child> = {
    profile_type: 'STANDARD',
    gender: 'MALE',
    allergies: [],
    dietary_restrictions: [],
    hobbies: [],
    learning_goals: [],
  };

  const [form, setForm] = useState<Partial<Child>>(initialData ?? emptyForm);

  useEffect(() => {
    if (isOpen) {
      setForm(initialData ?? emptyForm);
      setStep(1);
      setReportFile(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const isSpecial = form.profile_type === 'SPECIAL_NEEDS';
  const steps = isSpecial ? SPECIAL_STEPS : STEPS;
  const totalSteps = steps.length;

  const set = <K extends keyof Child>(field: K, value: Child[K]) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const setNested = <K extends keyof Child>(field: K, patch: Partial<Child[K] & object>) =>
    setForm(prev => ({ ...prev, [field]: { ...(prev[field] as any ?? {}), ...patch } }));

  const ageCalculated = form.dob
    ? Math.floor((Date.now() - new Date(form.dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    : null;

  const canProceed = (): boolean => {
    if (step === 1) return !!(form.first_name?.trim() && form.last_name?.trim() && form.dob);
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // In a real implementation, report file would be uploaded first to get a URL
      // and form.report_url would be set to that URL before calling onSave.
      onSave(form);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Step content ─────────────────────────────────────────────── */

  const renderStep = () => {
    switch (step) {
      /* Step 1: Basic Info */
      case 1:
        return (
          <div className="space-y-5">
            <p className="text-sm text-slate-500 leading-relaxed">
              This information helps caregivers personalise sessions and address your child appropriately.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name">
                <input required type="text" value={form.first_name ?? ''} onChange={e => set('first_name', e.target.value)} className={INPUT} placeholder="e.g. Aanya" />
              </Field>
              <Field label="Last Name">
                <input required type="text" value={form.last_name ?? ''} onChange={e => set('last_name', e.target.value)} className={INPUT} placeholder="e.g. Sharma" />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Date of Birth">
                <input
                  required type="date"
                  max={(() => { const d = new Date(); d.setFullYear(d.getFullYear() - 1); return d.toISOString().split('T')[0]; })()}
                  value={form.dob ?? ''}
                  onChange={e => set('dob', e.target.value)}
                  className={INPUT}
                />
                {ageCalculated !== null && ageCalculated >= 0 && (
                  <p className="text-xs text-primary-600 font-semibold mt-1.5">{ageCalculated} years old</p>
                )}
              </Field>
              <Field label="Gender">
                <select value={form.gender} onChange={e => set('gender', e.target.value as any)} className={INPUT}>
                  <option value="MALE">Boy</option>
                  <option value="FEMALE">Girl</option>
                  <option value="OTHER">Other / Prefer not to say</option>
                </select>
              </Field>
            </div>

            <Field label="Personality & Temperament" hint="Help caregivers understand your child's character.">
              <textarea
                rows={3} value={form.personality_notes ?? ''}
                onChange={e => set('personality_notes', e.target.value)}
                className={TEXTAREA}
                placeholder='e.g. "She is shy at first but warms up quickly. Loves animals and imaginative play."'
              />
            </Field>

            <Field label="Hobbies & Interests" hint="Press Enter or click Add after each one.">
              <TagInput value={form.hobbies ?? []} onChange={v => set('hobbies', v)} placeholder="e.g. Drawing, Football…" />
            </Field>
          </div>
        );

      /* Step 2: Care Profile */
      case 2:
        return (
          <div className="space-y-5">
            <p className="text-sm text-slate-500 leading-relaxed">
              Select the type of care your child needs. This determines which caregivers can be matched and what specialised fields to fill out.
            </p>

            {/* Profile type selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  type: 'STANDARD' as ChildProfileType,
                  icon: User,
                  title: 'Standard Care',
                  desc: 'Regular child care and babysitting sessions.',
                  active: 'border-primary-600 bg-primary-50',
                  iconColor: 'text-primary-600',
                },
                {
                  type: 'SPECIAL_NEEDS' as ChildProfileType,
                  icon: Heart,
                  title: 'Special Needs / Shadow Teacher',
                  desc: 'Specialised support, IEP-aligned care, and educational assistance.',
                  active: 'border-rose-400 bg-rose-50',
                  iconColor: 'text-rose-500',
                },
              ].map(opt => {
                const Icon = opt.icon;
                const selected = form.profile_type === opt.type;
                return (
                  <button
                    key={opt.type} type="button"
                    onClick={() => set('profile_type', opt.type)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${selected ? opt.active : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                  >
                    <Icon size={20} className={`mb-2 ${selected ? opt.iconColor : 'text-slate-400'}`} />
                    <p className={`font-bold text-sm ${selected ? 'text-primary-900' : 'text-slate-700'}`}>{opt.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{opt.desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Daily routine */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <Field label="Bedtime" hint="Typical sleep time at night.">
                <input type="time" value={form.bedtime ?? ''} onChange={e => set('bedtime', e.target.value)} className={INPUT} />
              </Field>
              <Field label="Nap Schedule" hint="e.g. 2 PM – 3:30 PM">
                <input type="text" value={form.nap_schedule ?? ''} onChange={e => set('nap_schedule', e.target.value)} className={INPUT} placeholder="e.g. 2:00 PM – 3:30 PM" />
              </Field>
            </div>
          </div>
        );

      /* Step 3: Health & Dietary */
      case 3:
        return (
          <div className="space-y-5">
            <p className="text-sm text-slate-500 leading-relaxed">
              Accurate health information ensures caregivers can respond appropriately in any situation.
            </p>

            <Field label="Allergies" hint="List each allergy and press Enter / Add.">
              <TagInput value={form.allergies ?? []} onChange={v => set('allergies', v)} placeholder="e.g. Peanuts, Shellfish…" />
            </Field>

            {(form.allergies?.length ?? 0) > 0 && (
              <Field label="Allergy Severity">
                <div className="grid grid-cols-3 gap-2">
                  {(['mild', 'moderate', 'severe'] as const).map(sev => (
                    <button
                      key={sev} type="button"
                      onClick={() => set('allergy_severity', sev)}
                      className={`py-2.5 rounded-xl border-2 text-sm font-semibold capitalize transition-all ${
                        form.allergy_severity === sev
                          ? sev === 'severe' ? 'bg-red-600 border-red-600 text-white'
                            : sev === 'moderate' ? 'bg-amber-500 border-amber-500 text-white'
                            : 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </Field>
            )}

            <Field label="Dietary Restrictions" hint="Vegetarian, Halal, Kosher, no sugar, etc.">
              <TagInput value={form.dietary_restrictions ?? []} onChange={v => set('dietary_restrictions', v)} placeholder="e.g. Vegetarian, No pork…" />
            </Field>

            <Field label="Medical Notes" hint="Regular medications, conditions, GP name, or other health info caregivers should know.">
              <textarea
                rows={3} value={form.medical_notes ?? ''}
                onChange={e => set('medical_notes', e.target.value)}
                className={TEXTAREA}
                placeholder='e.g. "Uses inhaler (salbutamol) before exercise. GP: Dr Priya Nair, +91 98765 43210."'
              />
            </Field>

            {/* Report upload */}
            <Field label="Upload Report" hint="Medical report, vaccination record, or school assessment (PDF or image, max 10 MB).">
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                  reportFile ? 'border-primary-400 bg-primary-50' : 'border-slate-200 hover:border-primary-300 hover:bg-primary-50/40'
                }`}
              >
                {reportFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText size={20} className="text-primary-600 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-sm font-bold text-primary-900 truncate max-w-[200px]">{reportFile.name}</p>
                      <p className="text-xs text-slate-400">{(reportFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); setReportFile(null); }}
                      className="ml-2 text-slate-400 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload size={20} className="text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-600">Click to upload</p>
                    <p className="text-xs text-slate-400 mt-0.5">PDF, JPG, PNG up to 10 MB</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (f && f.size <= 10 * 1024 * 1024) setReportFile(f);
                }}
              />
            </Field>
          </div>
        );

      /* Step 4: Emergency Contact */
      case 4:
        return (
          <div className="space-y-5">
            <p className="text-sm text-slate-500 leading-relaxed">
              This overrides your default profile contact for this child. Leave blank to use your account's default emergency contact.
            </p>

            <Field label="Contact Name">
              <input
                type="text"
                value={form.emergency_contact_override?.name ?? ''}
                onChange={e => setNested('emergency_contact_override', { name: e.target.value })}
                className={INPUT}
                placeholder="e.g. Grandmother Meena"
              />
            </Field>

            <Field label="Relationship to Child">
              <select
                value={form.emergency_contact_override?.relation ?? ''}
                onChange={e => setNested('emergency_contact_override', { relation: e.target.value })}
                className={INPUT}
              >
                <option value="">Select relationship…</option>
                {['Grandparent', 'Aunt / Uncle', 'Family friend', 'Sibling (18+)', 'Neighbour', 'Other'].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </Field>

            <Field label="Phone Number">
              <input
                type="tel"
                value={form.emergency_contact_override?.phone ?? ''}
                onChange={e => setNested('emergency_contact_override', { phone: e.target.value })}
                className={INPUT}
                placeholder="+91 98765 43210"
              />
            </Field>

            {/* Summary preview if filled */}
            {form.emergency_contact_override?.name && form.emergency_contact_override?.phone && (
              <div className="flex items-start gap-3 bg-primary-50 border border-primary-100 rounded-xl p-4">
                <CheckCircle2 size={16} className="text-primary-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-primary-800">
                  <strong>{form.emergency_contact_override.name}</strong>
                  {form.emergency_contact_override.relation ? ` (${form.emergency_contact_override.relation})` : ''}
                  {' — '}
                  {form.emergency_contact_override.phone}
                </p>
              </div>
            )}

            {!form.emergency_contact_override?.name && (
              <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
                <AlertCircle size={15} className="text-slate-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500">No override set — your account's default emergency contact will be used.</p>
              </div>
            )}
          </div>
        );

      /* Step 5: Special Care (only for SPECIAL_NEEDS) */
      case 5:
        return (
          <div className="space-y-5">
            <p className="text-sm text-slate-500 leading-relaxed">
              These details help us match a caregiver with the right specialisation and prepare them for your child's unique needs.
            </p>

            <Field label="Diagnosis / Conditions" hint="e.g. Autism Spectrum Disorder, ADHD, Down Syndrome, Cerebral Palsy">
              <input
                type="text"
                value={form.diagnosis ?? ''}
                onChange={e => set('diagnosis', e.target.value)}
                className={INPUT}
                placeholder="e.g. Autism Spectrum Disorder (Level 2)"
              />
            </Field>

            <Field label="Care Instructions / Protocols" hint="Detailed guidance for the caregiver — routines, triggers, de-escalation strategies, medications.">
              <textarea
                rows={4} value={form.care_instructions ?? ''}
                onChange={e => set('care_instructions', e.target.value)}
                className={TEXTAREA}
                placeholder='e.g. "Avoid loud sudden noises. Uses picture schedule. Calming toy in blue bag. Give 10-minute transition warning."'
              />
            </Field>

            {/* School details */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-4">
              <div className="flex items-center gap-2">
                <School size={16} className="text-primary-600" />
                <p className="font-bold text-sm text-primary-900">School Details <span className="text-slate-400 font-normal">(for Shadow Teacher)</span></p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="School Name">
                  <input
                    type="text"
                    value={form.school_details?.name ?? ''}
                    onChange={e => setNested('school_details', { name: e.target.value })}
                    className={INPUT}
                    placeholder="e.g. Greenwood Academy"
                  />
                </Field>
                <Field label="Class / Grade">
                  <input
                    type="text"
                    value={form.school_details?.grade ?? ''}
                    onChange={e => setNested('school_details', { grade: e.target.value })}
                    className={INPUT}
                    placeholder="e.g. Grade 3 / Class 3B"
                  />
                </Field>
              </div>
              <Field label="Class Teacher Contact">
                <input
                  type="text"
                  value={form.school_details?.teacher_contact ?? ''}
                  onChange={e => setNested('school_details', { teacher_contact: e.target.value })}
                  className={INPUT}
                  placeholder="e.g. +91 98765 43210 or teacher@school.edu"
                />
              </Field>
            </div>

            <Field label="Learning Goals" hint="IEP objectives or specific skills the shadow teacher should work on.">
              <TagInput value={form.learning_goals ?? []} onChange={v => set('learning_goals', v)} placeholder="e.g. Following 2-step instructions…" />
            </Field>
          </div>
        );

      default:
        return null;
    }
  };

  const currentStep = steps[step - 1];
  const StepIcon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">

        {/* Drag pill (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-slate-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 sm:px-6 pt-4 pb-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
                <StepIcon size={16} className="text-primary-700" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Step {step} of {totalSteps}
                </p>
                <h2 className="font-bold text-primary-900 text-base leading-tight">{currentStep.label}</h2>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors">
              <X size={16} className="text-slate-400" />
            </button>
          </div>

          {/* Step progress dots */}
          <div className="flex items-center gap-1.5">
            {steps.map(s => (
              <div
                key={s.id}
                className={`h-1 rounded-full transition-all ${s.id <= step ? 'bg-primary-900' : 'bg-slate-200'} ${s.id === step ? 'flex-[2]' : 'flex-1'}`}
              />
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-4 border-t border-slate-100 flex items-center gap-3 flex-shrink-0 bg-white">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              className="h-11 px-4 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm flex items-center gap-1.5 hover:border-slate-300 transition-all"
            >
              <ChevronLeft size={15} /> Back
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-4 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:border-slate-300 transition-all"
            >
              Cancel
            </button>
          )}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={() => { if (canProceed()) setStep(s => s + 1); }}
              disabled={!canProceed()}
              className="flex-1 h-11 rounded-xl bg-primary-900 text-white font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-primary-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Continue <ChevronRight size={15} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 h-11 rounded-xl bg-primary-900 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-800 disabled:opacity-40 transition-all"
            >
              {submitting ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
              ) : (
                <><CheckCircle2 size={15} /> Save Profile</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
