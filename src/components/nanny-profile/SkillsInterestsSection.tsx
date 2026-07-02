'use client';

import { Textarea } from '@/components/ui/Textarea';
import { PillMultiSelect } from '@/components/nanny-profile/FormPrimitives';
import { NannyProfileFormState } from '@/types/nannyProfileForm';
import { ACADEMIC_SUBJECTS, CHILD_ACTIVITIES } from '@/constants/nannyOnboarding';

interface Props {
  form: NannyProfileFormState;
  update: (patch: Partial<NannyProfileFormState>) => void;
}

export function SkillsInterestsSection({ form, update }: Props) {
  return (
    <div className="space-y-7">
      <PillMultiSelect
        label="What subjects can you teach academically?"
        hint="Select all that apply"
        options={ACADEMIC_SUBJECTS}
        value={form.academicSubjects}
        onChange={(v) => update({ academicSubjects: v })}
      />

      <div>
        <Textarea
          label="Tell us about yourself"
          required
          value={form.hobbiesInterests}
          onChange={(e) => update({ hobbiesInterests: e.target.value })}
          placeholder="Tell us what you enjoy outside of work — reading, music, sport…"
        />
      </div>

      <PillMultiSelect
        label="Which activities can you do with the child?"
        hint="Select all that apply"
        options={CHILD_ACTIVITIES}
        value={form.hobbiesActivitiesForChild}
        onChange={(v) => update({ hobbiesActivitiesForChild: v })}
      />
    </div>
  );
}
