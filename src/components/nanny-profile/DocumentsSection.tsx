'use client';

import { useState } from 'react';
import { CheckCircle2, UploadCloud, Loader2, FileText, CreditCard, IdCard } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { IdentityDocument } from '@/types/api';
import { NannyProfileFormState } from '@/types/nannyProfileForm';

type DocType = 'RESUME' | 'PAN' | 'AADHAR';

const DOC_CONFIG: Record<
  DocType,
  { title: string; description: string; accept: string; hint: string; requiresIdNumber: boolean; idLabel?: string; icon: React.ElementType }
> = {
  RESUME: {
    title: 'Resume / CV',
    description: 'Your work history and qualifications',
    accept: '.pdf,.doc,.docx',
    hint: 'PDF or Word · up to 5MB',
    requiresIdNumber: false,
    icon: FileText,
  },
  PAN: {
    title: 'PAN Card',
    description: 'For payroll and tax compliance',
    accept: 'image/*,.pdf',
    hint: 'Image or PDF · up to 5MB',
    requiresIdNumber: true,
    idLabel: 'PAN Number',
    icon: CreditCard,
  },
  AADHAR: {
    title: 'Aadhaar Card',
    description: 'For identity verification',
    accept: 'image/*,.pdf',
    hint: 'Image or PDF · up to 5MB',
    requiresIdNumber: true,
    idLabel: 'Aadhaar Number',
    icon: IdCard,
  },
};

interface Props {
  documents: IdentityDocument[];
  form: NannyProfileFormState;
  update: (patch: Partial<NannyProfileFormState>) => void;
}

function DocumentUploadRow({
  type,
  existing,
  form,
  update,
}: {
  type: DocType;
  existing?: IdentityDocument;
  form: NannyProfileFormState;
  update: (patch: Partial<NannyProfileFormState>) => void;
}) {
  const config = DOC_CONFIG[type];
  const pendingDoc = form.pendingDocuments?.[type];
  const [error, setError] = useState<string | null>(null);

  const handleIdChange = (val: string) => {
    update({
      pendingDocuments: {
        ...form.pendingDocuments,
        [type]: { file: pendingDoc?.file as File, idNumber: val },
      },
    });
  };

  const handleFileChange = (f: File | null) => {
    setError(null);
    if (!f) {
      const newPending = { ...form.pendingDocuments };
      delete newPending[type];
      update({ pendingDocuments: newPending });
      return;
    }

    if (f.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    const acceptedTypes = config.accept.split(',').map(t => t.trim());
    const fileExt = '.' + f.name.split('.').pop()?.toLowerCase();
    const isImage = f.type.startsWith('image/');
    
    const isValidType = acceptedTypes.some(t => {
      if (t === 'image/*') return isImage;
      return t === fileExt || t === f.type;
    });

    if (!isValidType) {
      setError(`Invalid file type. Accepted: ${config.accept}`);
      return;
    }

    update({
      pendingDocuments: {
        ...form.pendingDocuments,
        [type]: { file: f, idNumber: pendingDoc?.idNumber || '' },
      },
    });
  };

  const isUploaded = !!existing;
  const isPending = !!pendingDoc?.file;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'rounded-2xl border p-5 transition-colors',
        isUploaded || isPending ? 'border-[#6AAE8A]/40 bg-[#6AAE8A]/5' : 'border-neutral-200 bg-white'
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'shrink-0 w-10 h-10 rounded-xl flex items-center justify-center',
            isUploaded || isPending ? 'bg-[#6AAE8A]/15 text-[#4a8568]' : 'bg-primary-50 text-primary-700'
          )}
        >
          {isUploaded || isPending ? <CheckCircle2 size={18} /> : <Icon size={18} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-primary-900">
              {config.title} <span className="text-error-500">*</span>
            </p>
            {isUploaded ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#4a8568] shrink-0">
                <CheckCircle2 size={12} /> Uploaded
              </span>
            ) : isPending ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 shrink-0">
                <CheckCircle2 size={12} /> Ready to submit
              </span>
            ) : null}
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">{config.description}</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {config.requiresIdNumber && (!isUploaded || isPending) && (
          <Input
            placeholder={config.idLabel}
            value={pendingDoc?.idNumber || ''}
            onChange={(e) => handleIdChange(e.target.value)}
            className="rounded-xl"
          />
        )}

        <div className="flex items-center gap-3">
          <label className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-neutral-300 bg-neutral-50/60 cursor-pointer hover:bg-neutral-100 hover:border-neutral-400 text-sm text-neutral-600 transition-colors min-w-0">
            <UploadCloud size={16} className="shrink-0" />
            <span className="truncate">
              {pendingDoc?.file
                ? pendingDoc.file.name
                : existing
                ? 'Replace file'
                : `Choose file · ${config.hint}`}
            </span>
            <input
              type="file"
              accept={config.accept}
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />
          </label>
        </div>
        {error && <p className="text-xs text-error-600">{error}</p>}
      </div>
    </div>
  );
}

export function DocumentsSection({ documents, form, update }: Props) {
  const byType = (type: DocType) => documents.find((d) => d.type === type);

  return (
    <div className="space-y-4">
      <DocumentUploadRow type="RESUME" existing={byType('RESUME')} form={form} update={update} />
      <DocumentUploadRow type="PAN" existing={byType('PAN')} form={form} update={update} />
      <DocumentUploadRow type="AADHAR" existing={byType('AADHAR')} form={form} update={update} />
    </div>
  );
}
