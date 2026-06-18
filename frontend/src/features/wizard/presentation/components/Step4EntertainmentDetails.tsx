import React from 'react';
import { TextInput } from '@/src/shared/components/TextInput';

interface Step4Props {
  data: {
    primaryType: string;
    quantityCapacity: string;
    quantityUnit: string;
    requestedDuration: string;
    operatingHoursStart: string;
    operatingHoursEnd: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

export const Step4EntertainmentDetails: React.FC<Step4Props> = ({
  data,
  errors,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-primary">Entertainment Details</h2>
        <p className="text-sm text-text-muted mt-1">Provide specific details about the type and operations of the entertainment license.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5 w-full md:col-span-2">
          <label htmlFor="primaryType" className="text-sm font-semibold text-text-main">
            Primary Entertainment Type <span className="text-error">*</span>
          </label>
          <select
            id="primaryType"
            value={data.primaryType}
            onChange={(e) => onChange('primaryType', e.target.value)}
            className={`
              w-full h-11 px-3 py-2 bg-white border border-border-muted rounded-default text-sm text-text-main
              focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all
              ${errors.primaryType ? 'border-error ring-1 ring-error' : ''}
            `}
          >
            <option value="">Select Entertainment Category</option>
            <option value="Live Music">Live Music / Band Performance</option>
            <option value="DJ Performance">DJ Performance / Dance Club</option>
            <option value="Karaoke">Karaoke Lounge</option>
            <option value="Arcade/Gaming">Arcade & Gaming Center</option>
            <option value="Theater">Theater & Cinema</option>
            <option value="Exhibition">Exhibition & Public Show</option>
            <option value="Other">Other</option>
          </select>
          {errors.primaryType && (
            <p className="text-xs text-error font-medium">
              {errors.primaryType}
            </p>
          )}
        </div>

        <TextInput
          label="Quantity / Max Capacity"
          id="quantityCapacity"
          type="number"
          min={1}
          placeholder="e.g. 150"
          value={data.quantityCapacity}
          onChange={(e) => onChange('quantityCapacity', e.target.value)}
          error={errors.quantityCapacity}
          required
        />

        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="quantityUnit" className="text-sm font-semibold text-text-main">
            Capacity Unit <span className="text-error">*</span>
          </label>
          <select
            id="quantityUnit"
            value={data.quantityUnit}
            onChange={(e) => onChange('quantityUnit', e.target.value)}
            className={`
              w-full h-11 px-3 py-2 bg-white border border-border-muted rounded-default text-sm text-text-main
              focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all
              ${errors.quantityUnit ? 'border-error ring-1 ring-error' : ''}
            `}
          >
            <option value="">Select Unit</option>
            <option value="Pax">Pax / Persons</option>
            <option value="Tables">Tables</option>
            <option value="Devices">Devices / Stations</option>
            <option value="Rooms">Rooms / Booths</option>
          </select>
          {errors.quantityUnit && (
            <p className="text-xs text-error font-medium">
              {errors.quantityUnit}
            </p>
          )}
        </div>

        <TextInput
          label="Requested Duration (Months)"
          id="requestedDuration"
          type="number"
          min={1}
          max={12}
          placeholder="e.g. 12"
          value={data.requestedDuration}
          onChange={(e) => onChange('requestedDuration', e.target.value)}
          error={errors.requestedDuration}
          required
        />

        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <TextInput
            label="Operating Hours (Start)"
            id="operatingHoursStart"
            type="time"
            value={data.operatingHoursStart}
            onChange={(e) => onChange('operatingHoursStart', e.target.value)}
            error={errors.operatingHoursStart}
            required
          />

          <TextInput
            label="Operating Hours (End)"
            id="operatingHoursEnd"
            type="time"
            value={data.operatingHoursEnd}
            onChange={(e) => onChange('operatingHoursEnd', e.target.value)}
            error={errors.operatingHoursEnd}
            required
          />
        </div>
      </div>
    </div>
  );
};
