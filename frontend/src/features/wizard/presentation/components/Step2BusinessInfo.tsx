import React from 'react';
import { TextInput } from '@/src/shared/components/TextInput';

import { StepContainer } from './StepContainer';

interface Step2Props {
  data: {
    businessName: string;
    position: string;
    businessPhone: string;
    regDate: string;
    expiryDate: string;
    regNumber: string;
    businessAddress: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

export const Step2BusinessInfo: React.FC<Step2Props> = ({
  data,
  errors,
  onChange,
}) => {
  return (
    <StepContainer 
      title="Business Information" 
      description="Please provide the details of your registered business entity."
    >
        <div className="md:col-span-2">
          <TextInput
            label="Business Legal Name"
            id="businessName"
            placeholder="e.g. Acme Corporation Sdn Bhd"
            value={data.businessName}
            onChange={(e) => onChange('businessName', e.target.value)}
            error={errors.businessName}
            required
          />
        </div>

        <TextInput
          label="Registration Number (SSM / Business Reg)"
          id="regNumber"
          placeholder="e.g. 202401012345 or IP0543211-A"
          value={data.regNumber}
          onChange={(e) => onChange('regNumber', e.target.value)}
          error={errors.regNumber}
          required
        />

        <TextInput
          label="Your Position / Role"
          id="position"
          placeholder="e.g. Director, Manager, Owner"
          value={data.position}
          onChange={(e) => onChange('position', e.target.value)}
          error={errors.position}
          required
        />

        <TextInput
          label="Registration Date"
          id="regDate"
          type="date"
          value={data.regDate}
          onChange={(e) => onChange('regDate', e.target.value)}
          error={errors.regDate}
          required
        />

        {!/sdn\.?\s*bhd\.?/i.test(data.businessName || '') && (
          <TextInput
            label="Expiry Date"
            id="expiryDate"
            type="date"
            value={data.expiryDate}
            onChange={(e) => onChange('expiryDate', e.target.value)}
            error={errors.expiryDate}
            required
          />
        )}

        <div className="md:col-span-2">
          <TextInput
            label="Business Phone Number"
            id="businessPhone"
            placeholder="e.g. +60312345678"
            value={data.businessPhone}
            onChange={(e) => onChange('businessPhone', e.target.value)}
            error={errors.businessPhone}
            required
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-1.5 w-full">
          <label htmlFor="businessAddress" className="text-sm font-semibold text-text-main">
            Full Business Registered Address <span className="text-error">*</span>
          </label>
          <textarea
            id="businessAddress"
            placeholder="Enter the full registered address of your business"
            rows={3}
            value={data.businessAddress}
            onChange={(e) => onChange('businessAddress', e.target.value)}
            className={`
              w-full px-3 py-2 bg-white border rounded-default text-sm
              focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary
              transition-all placeholder:text-text-muted min-h-[80px]
              ${errors.businessAddress ? 'border-error ring-1 ring-error' : 'border-border-muted'}
            `}
          />
          {errors.businessAddress && (
            <p className="text-xs text-error font-medium">
              {errors.businessAddress}
            </p>
          )}
        </div>
    </StepContainer>
  );
};
