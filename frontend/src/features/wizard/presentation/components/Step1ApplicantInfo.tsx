import React from 'react';
import { TextInput } from '@/src/shared/components/TextInput';

import { StepContainer } from './StepContainer';

interface Step1Props {
  data: {
    fullName: string;
    icPassport: string;
    dob: string;
    email: string;
    contactNumber: string;
    residentialAddress: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

export const Step1ApplicantInfo: React.FC<Step1Props> = ({
  data,
  errors,
  onChange,
}) => {
  return (
    <StepContainer 
      title="Applicant Information" 
      description="Please enter the personal details of the applicant."
    >
        <TextInput
          label="Full Name"
          id="fullName"
          placeholder="e.g. John Doe"
          value={data.fullName}
          onChange={(e) => onChange('fullName', e.target.value)}
          error={errors.fullName}
          required
        />

        <TextInput
          label="IC / Passport Number"
          id="icPassport"
          placeholder="e.g. 950101-14-5567 or A12345678"
          value={data.icPassport}
          onChange={(e) => onChange('icPassport', e.target.value)}
          error={errors.icPassport}
          required
        />

        <TextInput
          label="Date of Birth"
          id="dob"
          type="date"
          value={data.dob}
          onChange={(e) => onChange('dob', e.target.value)}
          error={errors.dob}
          required
        />

        <TextInput
          label="Contact Number"
          id="contactNumber"
          placeholder="e.g. +60123456789"
          value={data.contactNumber}
          onChange={(e) => onChange('contactNumber', e.target.value)}
          error={errors.contactNumber}
          required
        />

        <div className="md:col-span-2">
          <TextInput
            label="Email Address"
            id="email"
            type="email"
            placeholder="e.g. john.doe@example.com"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            error={errors.email}
            required
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-1.5 w-full">
          <label htmlFor="residentialAddress" className="text-sm font-semibold text-text-main">
            Full Residential Address <span className="text-error">*</span>
          </label>
          <textarea
            id="residentialAddress"
            placeholder="Enter your full home address"
            rows={3}
            value={data.residentialAddress}
            onChange={(e) => onChange('residentialAddress', e.target.value)}
            className={`
              w-full px-3 py-2 bg-white border rounded-default text-sm
              focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary
              transition-all placeholder:text-text-muted min-h-[80px]
              ${errors.residentialAddress ? 'border-error ring-1 ring-error' : 'border-border-muted'}
            `}
          />
          {errors.residentialAddress && (
            <p className="text-xs text-error font-medium">
              {errors.residentialAddress}
            </p>
          )}
        </div>
    </StepContainer>
  );
};
