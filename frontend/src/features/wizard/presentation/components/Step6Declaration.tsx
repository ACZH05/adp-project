import React, { useState } from 'react';
import { TextInput } from '@/src/shared/components/TextInput';

interface Step6Props {
  data: {
    signatoryName: string;
    signatoryIc: string;
    companyName: string;
    acceptedDeclaration: boolean;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string | boolean) => void;
}

export const Step6Declaration: React.FC<Step6Props> = ({
  data,
  errors,
  onChange,
}) => {
  const [declaredTime, setDeclaredTime] = useState<string>('');

  const handleCheckboxChange = (checked: boolean) => {
    onChange('acceptedDeclaration', checked);
    if (checked) {
      setDeclaredTime(new Date().toLocaleString());
    } else {
      setDeclaredTime('');
    }
  };

  const declarationText = `
LEGAL DECLARATION & AGENT AUTHORIZATION UNDERTAKING

1. I, the undersigned applicant/authorized signatory, hereby declare that all information, declarations, and documents submitted in this entertainment license application are complete, true, and accurate to the best of my knowledge.
2. I acknowledge that any false statement, misrepresentation, or omission of material facts in this application constitutes a serious offense under local municipal laws and regulatory codes, which may lead to immediate rejection, suspension of the license, forfeiture of fees, and potential prosecution.
3. I authorize the Licensing Authority and its designated officers or automated systems (including artificial intelligence verification components) to verify any information provided herein, perform background regulatory scans, inspect premised locations, and share relevant application metadata with key governmental partner bodies.
4. I agree to abide by all standard regulatory requirements, operating guidelines, zoning ordinances, and specific license conditions that may be imposed upon approval.
5. I understand that the decision to approve or reject this license is at the sole discretion of the Licensing Authority and is subject to the audit logs, on-site safety assessments, and statutory compliance checks.
  `.trim();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-primary">Declaration & Submission</h2>
        <p className="text-sm text-text-muted mt-1">Review the legal undertaking and sign to finalize your application.</p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Read-only legal terms scroll box */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-semibold text-text-main">Legal Declaration Text</label>
          <div className="w-full h-48 p-4 bg-surface-container-low border border-border-muted rounded-md text-xs text-text-muted font-normal leading-relaxed overflow-y-scroll whitespace-pre-wrap">
            {declarationText}
          </div>
        </div>

        {/* Input Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Signatory Full Name"
            id="signatoryName"
            placeholder="e.g. John Doe"
            value={data.signatoryName}
            onChange={(e) => onChange('signatoryName', e.target.value)}
            error={errors.signatoryName}
            required
          />

          <TextInput
            label="Signatory IC / Passport"
            id="signatoryIc"
            placeholder="e.g. 950101-14-5567"
            value={data.signatoryIc}
            onChange={(e) => onChange('signatoryIc', e.target.value)}
            error={errors.signatoryIc}
            required
          />

          <div className="md:col-span-2">
            <TextInput
              label="Company Name"
              id="companyName"
              placeholder="e.g. Acme Corporation Sdn Bhd"
              value={data.companyName}
              onChange={(e) => onChange('companyName', e.target.value)}
              error={errors.companyName}
              required
            />
          </div>
        </div>

        {/* Checkbox with Declared At Badge */}
        <div className="flex flex-col gap-3 mt-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              id="acceptedDeclaration"
              checked={data.acceptedDeclaration}
              onChange={(e) => handleCheckboxChange(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border-muted text-primary focus:ring-primary accent-primary"
            />
            <span className="text-sm text-text-main font-semibold select-none leading-tight">
              I hereby certify that the information provided is correct and complete, and I accept the terms of the legal declaration above. <span className="text-error">*</span>
            </span>
          </label>
          {errors.acceptedDeclaration && (
            <p className="text-xs text-error font-medium pl-7">
              {errors.acceptedDeclaration}
            </p>
          )}

          {/* Declared At badge */}
          {data.acceptedDeclaration && declaredTime && (
            <div className="flex items-center gap-2 mt-1 self-start pl-7">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Declared At: {declaredTime}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
