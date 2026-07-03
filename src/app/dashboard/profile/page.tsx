'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin,
  ShieldCheck,
  Edit,
  Star,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { CategoryRequestModal } from '@/components/nanny/CategoryRequestModal';

const CATEGORY_MAP: Record<string, string> = {
  EC: 'Elder Care',
  CC: 'Child Care',
  SN: 'Special Needs',
  ST: 'Shadow Teacher',
};

const reveal = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [isCategoryModalOpen, setIsCategoryModalOpen] = React.useState(false);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <div className="bg-red-50 p-8 rounded-[28px] border border-red-100">
          <p className="text-red-600 mb-4">Please log in to view your profile.</p>
          <Link href="/auth/login">
            <Button>Log In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { profiles, nanny_details, nanny_onboarding_details } = user;
  const fullName =
    `${profiles?.first_name || ''} ${profiles?.last_name || ''}`.trim() || 'Your profile';
  const initial = (profiles?.first_name || user.email || 'U').charAt(0).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Hero banner */}
      <motion.div
        {...reveal}
        className="relative overflow-hidden rounded-[32px] bg-primary-900 px-8 py-10 md:px-12 md:py-12 mt-6"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 right-0 w-72 h-72 rounded-full bg-sky-400/20 blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-56 h-56 rounded-full bg-secondary/20 blur-[100px]" />
        </div>

        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/30 bg-white/10 flex items-center justify-center flex-shrink-0">
            {profiles?.profile_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profiles.profile_image_url}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-white">{initial}</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
              {fullName}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-white/75">
              <span className="flex items-center gap-1.5">
                <MapPin size={15} className="text-white/50" />
                {profiles?.address || 'No address set'}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck
                  size={15}
                  className={user.is_verified ? 'text-emerald-300' : 'text-white/40'}
                />
                {user.is_verified ? 'Verified account' : 'Unverified'}
              </span>
            </div>
            {!!nanny_details?.categories?.length && (
              <div className="flex flex-wrap gap-2 mt-4">
                {nanny_details.categories.map((cat, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white/10 border border-white/15 text-white text-xs font-semibold rounded-full backdrop-blur-sm"
                  >
                    {CATEGORY_MAP[cat] || cat}
                  </span>
                ))}
              </div>
            )}
          </div>

          <Link href="/dashboard/settings" className="sm:self-start">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Edit size={15} className="mr-2" /> Edit
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        {...reveal}
        transition={{ ...reveal.transition, delay: 0.05 }}
        className="grid grid-cols-2 gap-4 mt-6"
      >
        <StatCard
          icon={<Briefcase size={18} />}
          value={nanny_details?.experience_years ?? 0}
          label="Years experience"
        />
        <StatCard
          icon={<Star size={18} />}
          value={user.averageRating ? user.averageRating.toFixed(1) : 'New'}
          label="Average rating"
        />
      </motion.div>

      {/* Extended profile */}
      {nanny_onboarding_details && (
        <Section title="Extended profile" delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5">
            <Fact label="Age" value={nanny_onboarding_details.age} />
            <Fact label="Gender" value={nanny_onboarding_details.gender} />
            <Fact label="City" value={nanny_onboarding_details.city} />
            <Fact
              label="Education"
              value={
                nanny_onboarding_details.education_qualification === 'Other'
                  ? nanny_onboarding_details.education_qualification_other
                  : nanny_onboarding_details.education_qualification
              }
            />
            <Fact
              label="Available from"
              value={nanny_onboarding_details.available_start_date?.slice(0, 10)}
            />
          </div>
          {!!nanny_onboarding_details.academic_subjects?.length && (
            <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-neutral-100">
              {nanny_onboarding_details.academic_subjects.map((s, i) => (
                <Chip key={i}>{s}</Chip>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* About */}
      <Section title="About" delay={0.12}>
        <p className="text-neutral-600 leading-relaxed">
          {nanny_details?.bio || 'No bio provided yet.'}
        </p>
      </Section>

      {/* Skills */}
      <Section title="Skills" delay={0.14}>
        <div className="flex flex-wrap gap-2">
          {nanny_details?.skills?.length ? (
            nanny_details.skills.map((skill, i) => <Chip key={i}>{skill}</Chip>)
          ) : (
            <span className="text-neutral-500 italic">No skills listed</span>
          )}
        </div>
      </Section>

      {/* Categories */}
      <Section
        title="Care categories"
        delay={0.16}
        action={
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-neutral-200"
            onClick={() => setIsCategoryModalOpen(true)}
          >
            Request change
          </Button>
        }
      >
        <div className="flex flex-wrap gap-2">
          {nanny_details?.categories?.length ? (
            nanny_details.categories.map((category, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium"
              >
                {CATEGORY_MAP[category] || category}
              </span>
            ))
          ) : (
            <span className="text-neutral-500 italic">No categories listed</span>
          )}
        </div>
      </Section>

      <motion.div
        {...reveal}
        transition={{ ...reveal.transition, delay: 0.18 }}
        className="mt-6"
      >
        <Link href={`/caregiver/${user.id}`}>
          <Button className="w-full rounded-xl bg-primary-900 hover:bg-primary-800 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
            <Sparkles size={16} />
            View public profile
          </Button>
        </Link>
      </motion.div>

      <CategoryRequestModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        currentCategories={nanny_details?.categories || []}
        onSuccess={() => setIsCategoryModalOpen(false)}
      />
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <div className="bg-white rounded-[24px] border border-neutral-100 shadow-soft p-6 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-primary-900 leading-none font-display">
          {value}
        </div>
        <div className="text-xs font-medium text-neutral-500 uppercase tracking-wide mt-1.5">
          {label}
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  action,
  delay = 0,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      {...reveal}
      transition={{ ...reveal.transition, delay }}
      className="bg-white rounded-[28px] border border-neutral-100 shadow-soft p-7 md:p-9 mt-6"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-xl font-bold text-primary-900">{title}</h3>
        {action}
      </div>
      {children}
    </motion.section>
  );
}

function Fact({ label, value }: { label: string; value?: string | number | null }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-sm font-semibold text-primary-900">{value}</div>
      <div className="text-xs font-medium text-neutral-500 uppercase tracking-wide mt-0.5">
        {label}
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-lg text-sm font-medium">
      {children}
    </span>
  );
}
