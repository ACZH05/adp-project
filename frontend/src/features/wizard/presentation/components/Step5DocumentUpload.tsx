import React, { useRef } from 'react';

export interface UploadedFile {
  name: string;
  size: string;
  status: 'uploading' | 'verified' | 'flagged';
  progress: number;
}

interface Step5Props {
  documents: Record<string, UploadedFile | undefined>;
  errors: Record<string, string>;
  onUploadFile: (key: string, name: string, size: string) => void;
  onDeleteFile: (key: string) => void;
}

interface DocumentTypeConfig {
  key: string;
  label: string;
  description: string;
  accept: string;
}

const DOCUMENT_TYPES: DocumentTypeConfig[] = [
  {
    key: 'passportPhoto',
    label: 'Passport-Sized Photo',
    description: 'Recent photograph with a white background (JPEG/PNG, max 2MB).',
    accept: 'image/jpeg,image/png',
  },
  {
    key: 'icCopy',
    label: 'Identity Card / Passport Copy',
    description: 'Clear copy of front & back of IC or biodata page of Passport (PDF/JPEG/PNG, max 5MB).',
    accept: 'application/pdf,image/jpeg,image/png',
  },
  {
    key: 'businessReg',
    label: 'Business Registration Certificate (SSM)',
    description: 'Full corporate registration document profile (PDF format, max 10MB).',
    accept: 'application/pdf',
  },
  {
    key: 'tenancyAgreement',
    label: 'Tenancy Agreement / Premise Usage Proof',
    description: 'Signed agreement showing permission to use the establishment (PDF, max 10MB).',
    accept: 'application/pdf',
  },
];

export const Step5DocumentUpload: React.FC<Step5Props> = ({
  documents,
  errors,
  onUploadFile,
  onDeleteFile,
}) => {
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, key: string) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      onUploadFile(key, file.name, sizeStr);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      onUploadFile(key, file.name, sizeStr);
    }
  };

  const triggerFileSelect = (key: string) => {
    fileInputRefs.current[key]?.click();
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-primary">Document Upload</h2>
        <p className="text-sm text-text-muted mt-1">
          Upload required supporting documents. AI pre-validation will automatically scan files upon upload.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {DOCUMENT_TYPES.map((docType) => {
          const file = documents[docType.key];
          const hasError = errors[docType.key];

          return (
            <div key={docType.key} className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-text-main">
                  {docType.label} <span className="text-error">*</span>
                </label>
                {hasError && (
                  <span className="text-xs text-error font-medium">{hasError}</span>
                )}
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={(el) => {
                  fileInputRefs.current[docType.key] = el;
                }}
                className="hidden"
                accept={docType.accept}
                onChange={(e) => handleFileChange(e, docType.key)}
              />

              {!file ? (
                /* Empty / Upload Dropzone State */
                <div
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, docType.key)}
                  onClick={() => triggerFileSelect(docType.key)}
                  className={`
                    border border-dashed rounded-lg p-6 bg-white flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-200
                    hover:border-primary hover:bg-surface-container-low
                    ${hasError ? 'border-error bg-error/5' : 'border-border-muted'}
                  `}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted mb-2 group-hover:text-primary">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <p className="text-sm font-semibold text-text-main">
                    Drag & Drop file or <span className="text-primary hover:underline">browse</span>
                  </p>
                  <p className="text-xs text-text-muted mt-1">{docType.description}</p>
                </div>
              ) : (
                /* Uploaded File Details / Status View */
                <div className="border border-border-muted rounded-lg p-4 bg-white flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* File type icon */}
                      <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center text-primary-container shrink-0">
                        {file.name.endsWith('.pdf') ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        )}
                      </div>

                      {/* File Meta */}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text-main truncate">{file.name}</p>
                        <p className="text-xs text-text-muted">{file.size}</p>
                      </div>
                    </div>

                    {/* Action & Status */}
                    <div className="flex items-center gap-3 shrink-0">
                      {file.status === 'verified' && (
                        <div className="flex items-center gap-1.5 bg-success/10 text-success text-xs font-bold px-2.5 py-1 rounded-full">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Verified
                        </div>
                      )}
                      {file.status === 'flagged' && (
                        <div className="flex items-center gap-1.5 bg-warning/10 text-warning text-xs font-bold px-2.5 py-1 rounded-full">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                          </svg>
                          Low Confidence / Flagged
                        </div>
                      )}
                      {file.status === 'uploading' && (
                        <div className="text-xs text-text-muted flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          AI Scanning...
                        </div>
                      )}

                      {/* Delete Action (only if not currently uploading) */}
                      {file.status !== 'uploading' && (
                        <button
                          type="button"
                          onClick={() => onDeleteFile(docType.key)}
                          className="p-1 rounded hover:bg-surface-container-high text-text-muted hover:text-error transition-colors"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress bar for uploading */}
                  {file.status === 'uploading' && (
                    <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-200"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}

                  {/* Prompt for Low Confidence */}
                  {file.status === 'flagged' && (
                    <p className="text-xs text-warning bg-warning/5 border border-warning/10 p-2.5 rounded-md leading-relaxed">
                      <strong>AI Flagged:</strong> Hand-written sections or low image resolution detected. Please ensure all details are legible to prevent officer rejection.
                    </p>
                  )}
                  {file.status === 'verified' && (
                    <p className="text-xs text-success bg-success/5 border border-success/10 p-2.5 rounded-md leading-relaxed">
                      <strong>AI Verified:</strong> Successfully parsed metadata. The document is clearly legible and complete.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
