'use client';

import { Input } from '@/components/ui/Input';
import { PillSingleSelect, PillMultiSelect } from '@/components/nanny-profile/FormPrimitives';
import { NannyProfileFormState } from '@/types/nannyProfileForm';
import {
  EDUCATION_QUALIFICATIONS,
  SHADOW_TEACHER_EXPERIENCE_RANGES,
  AGE_GROUPS,
  CHILDREN_TYPES_SUPPORTED,
} from '@/constants/nannyOnboarding';

interface Props {
  form: NannyProfileFormState;
  update: (patch: Partial<NannyProfileFormState>) => void;
}

export function EducationExperienceSection({ form, update }: Props) {
  return (
    <div className="space-y-7">
      <PillSingleSelect
        label="Educational qualification"
        required
        options={EDUCATION_QUALIFICATIONS.map((q) => ({ value: q, label: q }))}
        value={form.educationQualification}
        onChange={(v) => update({ educationQualification: v })}
      />
      {form.educationQualification === 'Other' && (
        <Input
          label="Please specify your qualification"
          value={form.educationQualificationOther}
          onChange={(e) => update({ educationQualificationOther: e.target.value })}
          className="rounded-xl"
        />
      )}

      <Input
        label="Stream / subjects studied"
        required
        value={form.streamSubjects}
        onChange={(e) => update({ streamSubjects: e.target.value })}
        placeholder="e.g. Psychology, English Literature"
        className="rounded-xl"
      />

      <PillSingleSelect
        label="How long have you been working as a Shadow Teacher?"
        required
        options={SHADOW_TEACHER_EXPERIENCE_RANGES}
        value={form.shadowTeacherExperience}
        onChange={(v) => update({ shadowTeacherExperience: v })}
      />

      <PillMultiSelect
        label="Which age groups have you worked with?"
        hint="Select all that apply"
        options={AGE_GROUPS}
        value={form.ageGroupsWorked}
        onChange={(v) => update({ ageGroupsWorked: v })}
      />

      <div>
        <PillMultiSelect
          label="Which types of children have you supported?"
          hint="Select all that apply"
          options={CHILDREN_TYPES_SUPPORTED}
          value={form.childrenTypesSupported}
          onChange={(v) => update({ childrenTypesSupported: v })}
        />
        {form.childrenTypesSupported.includes('Other') && (
          <Input
            label="Please specify"
            value={form.childrenTypesOther}
            onChange={(e) => update({ childrenTypesOther: e.target.value })}
            className="rounded-xl mt-4"
          />
        )}
      </div>
    </div>
  );
}
