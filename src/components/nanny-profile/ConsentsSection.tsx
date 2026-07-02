'use client';

import { Check } from 'lucide-react';
import { Checkbox } from '@/components/ui/Checkbox';
import { cn } from '@/lib/utils';
import { NannyProfileFormState } from '@/types/nannyProfileForm';

interface Props {
  form: NannyProfileFormState;
  update: (patch: Partial<NannyProfileFormState>) => void;
}

function YesNoQuestion({
  index,
  question,
  note,
  value,
  onChange,
}: {
  index: number;
  question: string;
  note?: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex gap-4 py-5 border-b border-neutral-100 last:border-0">
      <span className="shrink-0 w-6 h-6 rounded-full bg-primary-50 text-primary-700 text-xs font-bold flex items-center justify-center mt-0.5">
        {index}
      </span>
      <div className="flex-1">
        <p className="text-sm font-medium text-primary-900 leading-relaxed">{question}</p>
        {note && <p className="text-xs text-neutral-400 mt-1">{note}</p>}
        <div className="inline-flex mt-3 p-1 rounded-full bg-neutral-100">
          {(['Yes', 'No'] as const).map((label) => {
            const boolVal = label === 'Yes';
            const selected = value === boolVal;
            return (
              <button
                key={label}
                type="button"
                onClick={() => onChange(boolVal)}
                className={cn(
                  'px-6 py-1.5 rounded-full text-sm font-semibold transition-all',
                  selected
                    ? boolVal
                      ? 'bg-primary-900 text-white shadow-sm'
                      : 'bg-neutral-700 text-white shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700'
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ConsentsSection({ form, update }: Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-neutral-200 bg-white px-5">
        <YesNoQuestion
          index={1}
          question="A mandatory training session must be attended before joining. Do you agree?"
          note="Please note: without this, no placements will be made."
          value={form.trainingAgreement}
          onChange={(v) => update({ trainingAgreement: v })}
        />
        <YesNoQuestion
          index={2}
          question="Keel will deduct a 5% placement / administration fee from your monthly salary. Do you agree?"
          value={form.placementFeeAgreement}
          onChange={(v) => update({ placementFeeAgreement: v })}
        />
        <YesNoQuestion
          index={3}
          question="Do you give your consent for police verification?"
          note="Police verification is mandatory for school placements."
          value={form.policeVerificationConsent}
          onChange={(v) => update({ policeVerificationConsent: v })}
        />
      </div>

      <div className="rounded-2xl border-2 border-primary-100 bg-primary-50/50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Check size={16} className="text-primary-700" />
          <span className="text-xs font-bold uppercase tracking-wide text-primary-700">
            Declaration
          </span>
        </div>
        <Checkbox
          checked={form.declarationConfirmed}
          onChange={(e) => update({ declarationConfirmed: e.target.checked })}
          label={
            <span className="text-sm text-primary-900 leading-relaxed">
              I confirm that all the information provided above is true and correct to
              the best of my knowledge.
            </span>
          }
        />
      </div>
    </div>
  );
}
