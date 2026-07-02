'use client';

import { useState } from 'react';
import { CheckCircle2, UploadCloud, Loader2, FileText, CreditCard, IdCard } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { IdentityDocument } from '@/types/api';

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
  onUploaded: () => void | Promise<void>;
}

function DocumentUploadRow({
  type,
  existing,
  onUploaded,
}: {
  type: DocType;
  existing?: IdentityDocument;
  onUploaded: () => void | Promise<void>;
}) {
  const config = DOC_CONFIG[type];
  const [idNumber, setIdNumber] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justUploaded, setJustUploaded] = useState(false);

  const handleFileChange = (f: File | null) => {
    setFile(f);
    setJustUploaded(false);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please choose a file');
      return;
    }
    if (config.requiresIdNumber && !idNumber.trim()) {
      setError(`Please enter your ${config.idLabel}`);
      return;
    }
    setLoading(true);
    setError(null);
    setJustUploaded(false);
    try {
      const formData = new FormData();
      formData.append('idType', type);
      if (config.requiresIdNumber) formData.append('idNumber', idNumber);
      formData.append('file', file);
      await api.verification.upload(formData);
      setUploadedFileName(file.name);
      setJustUploaded(true);
      setFile(null);
      setIdNumber('');
      await onUploaded();
    } catch (err: any) {
      setJustUploaded(false);
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const isUploaded = justUploaded || !!existing;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'rounded-2xl border p-5 transition-colors',
        isUploaded ? 'border-[#6AAE8A]/40 bg-[#6AAE8A]/5' : 'border-neutral-200 bg-white'
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'shrink-0 w-10 h-10 rounded-xl flex items-center justify-center',
            isUploaded ? 'bg-[#6AAE8A]/15 text-[#4a8568]' : 'bg-primary-50 text-primary-700'
          )}
        >
          {isUploaded ? <CheckCircle2 size={18} /> : <Icon size={18} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-primary-900">
              {config.title} <span className="text-error-500">*</span>
            </p>
            {isUploaded && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#4a8568] shrink-0">
                <CheckCircle2 size={12} /> Uploaded
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">{config.description}</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {config.requiresIdNumber && (
          <Input
            placeholder={config.idLabel}
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            className="rounded-xl"
          />
        )}

        <div className="flex items-center gap-3">
          <label className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-neutral-300 bg-neutral-50/60 cursor-pointer hover:bg-neutral-100 hover:border-neutral-400 text-sm text-neutral-600 transition-colors min-w-0">
            <UploadCloud size={16} className="shrink-0" />
            <span className="truncate">
              {file
                ? file.name
                : justUploaded && uploadedFileName
                ? uploadedFileName
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
          <button
            type="button"
            onClick={handleUpload}
            disabled={loading || !file}
            className="px-5 py-2.5 rounded-xl bg-primary-900 text-white text-sm font-semibold disabled:opacity-40 flex items-center gap-2 shrink-0 transition-all hover:bg-primary-800"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : justUploaded ? (
              <CheckCircle2 size={14} className="text-[#6AAE8A]" />
            ) : null}
            {loading ? 'Uploading' : justUploaded ? 'Done' : 'Upload'}
          </button>
        </div>
        {error && <p className="text-xs text-error-600">{error}</p>}
      </div>
    </div>
  );
}

export function DocumentsSection({ documents, onUploaded }: Props) {
  const byType = (type: DocType) => documents.find((d) => d.type === type);

  return (
    <div className="space-y-4">
      <DocumentUploadRow type="RESUME" existing={byType('RESUME')} onUploaded={onUploaded} />
      <DocumentUploadRow type="PAN" existing={byType('PAN')} onUploaded={onUploaded} />
      <DocumentUploadRow type="AADHAR" existing={byType('AADHAR')} onUploaded={onUploaded} />
    </div>
  );
}
