'use client';

import { Input } from '@/components/ui/Input';
import { IndianRupee, Calendar } from 'lucide-react';
import { NannyProfileFormState } from '@/types/nannyProfileForm';

interface Props {
  form: NannyProfileFormState;
  update: (patch: Partial<NannyProfileFormState>) => void;
}

export function CompensationSection({ form, update }: Props) {
  return (
    <div className="space-y-6">
      <Input
        label="Please mention your previous salary"
        type="number"
        min={0}
        value={form.previousSalary}
        onChange={(e) => update({ previousSalary: e.target.value })}
        leftIcon={<IndianRupee size={16} />}
        className="rounded-xl"
      />
      <Input
        label="When can you start working?"
        type="date"
        value={form.availableStartDate}
        onChange={(e) => update({ availableStartDate: e.target.value })}
        leftIcon={<Calendar size={16} />}
        helperText="You are expected to start quickly. Work timings follow school hours; any additional hours requested by the parent are billable."
        className="rounded-xl"
      />
    </div>
  );
}
