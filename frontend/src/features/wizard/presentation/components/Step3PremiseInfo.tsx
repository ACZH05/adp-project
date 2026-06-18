import React, { useEffect } from 'react';
import { TextInput } from '@/src/shared/components/TextInput';

interface Step3Props {
  data: {
    premiseAddress: string;
    postcode: string;
    cityDistrict: string;
    premiseType: string;
    floorLevel: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

// Simple postcode mapping database for auto-detection simulation
const getCityFromPostcode = (pc: string): string => {
  if (pc.startsWith('5') || pc.startsWith('6')) return 'Kuala Lumpur / Putrajaya';
  if (pc.startsWith('1')) return 'George Town, Penang';
  if (pc.startsWith('8')) return 'Johor Bahru, Johor';
  if (pc.startsWith('4')) return 'Shah Alam, Selangor';
  if (pc.startsWith('9')) return 'Kuching, Sarawak';
  if (pc.startsWith('88')) return 'Kota Kinabalu, Sabah';
  if (pc.startsWith('3')) return 'Ipoh, Perak';
  if (pc.startsWith('7')) return 'Seremban, Negeri Sembilan';
  return 'Semenyih, Selangor'; // Fallback
};

export const Step3PremiseInfo: React.FC<Step3Props> = ({
  data,
  errors,
  onChange,
}) => {
  // Auto-detect City/District when a 5-digit postcode is entered
  useEffect(() => {
    if (data.postcode.length === 5 && /^\d+$/.test(data.postcode)) {
      const detectedCity = getCityFromPostcode(data.postcode);
      if (data.cityDistrict !== detectedCity) {
        onChange('cityDistrict', detectedCity);
      }
    } else if (data.postcode.length < 5) {
      // Clear auto-detection if postcode is cleared/shortened
      if (data.cityDistrict !== '') {
        onChange('cityDistrict', '');
      }
    }
  }, [data.postcode, data.cityDistrict, onChange]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-primary">Premise Details</h2>
        <p className="text-sm text-text-muted mt-1">Provide information about the establishment or event location.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2 flex flex-col gap-1.5 w-full">
          <label htmlFor="premiseAddress" className="text-sm font-semibold text-text-main">
            Premise Address <span className="text-error">*</span>
          </label>
          <textarea
            id="premiseAddress"
            placeholder="Enter the full physical address of the premises"
            rows={3}
            value={data.premiseAddress}
            onChange={(e) => onChange('premiseAddress', e.target.value)}
            className={`
              w-full px-3 py-2 bg-white border rounded-default text-sm
              focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary
              transition-all placeholder:text-text-muted min-h-[80px]
              ${errors.premiseAddress ? 'border-error ring-1 ring-error' : 'border-border-muted'}
            `}
          />
          {errors.premiseAddress && (
            <p className="text-xs text-error font-medium">
              {errors.premiseAddress}
            </p>
          )}
        </div>

        <TextInput
          label="Postcode"
          id="postcode"
          placeholder="e.g. 50000"
          maxLength={5}
          value={data.postcode}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, ''); // Numeric only
            onChange('postcode', val);
          }}
          error={errors.postcode}
          required
        />

        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="cityDistrict" className="text-sm font-semibold text-text-main">
            City / District <span className="text-xs font-normal text-text-muted">(Auto-detect)</span>
          </label>
          <div className="relative">
            <input
              id="cityDistrict"
              type="text"
              readOnly
              placeholder="Enter postcode to auto-detect"
              value={data.cityDistrict}
              className={`
                w-full h-11 px-3 py-2 bg-surface-container-low border border-border-muted rounded-default text-sm text-text-main outline-none cursor-not-allowed
                ${data.cityDistrict ? 'border-success ring-1 ring-success/20' : ''}
              `}
            />
            {data.cityDistrict && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider text-success bg-success/10 px-2 py-0.5 rounded">
                Detected
              </span>
            )}
          </div>
          {errors.cityDistrict && (
            <p className="text-xs text-error font-medium">
              {errors.cityDistrict}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="premiseType" className="text-sm font-semibold text-text-main">
            Premise Type <span className="text-error">*</span>
          </label>
          <select
            id="premiseType"
            value={data.premiseType}
            onChange={(e) => onChange('premiseType', e.target.value)}
            className={`
              w-full h-11 px-3 py-2 bg-white border border-border-muted rounded-default text-sm text-text-main
              focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all
              ${errors.premiseType ? 'border-error ring-1 ring-error' : ''}
            `}
          >
            <option value="">Select Premise Type</option>
            <option value="Commercial">Commercial Shop Lot</option>
            <option value="Mall">Shopping Mall Unit</option>
            <option value="Hotel">Hotel / Resort</option>
            <option value="Industrial">Industrial Warehouses</option>
            <option value="Open Space">Open Space / Outdoor</option>
            <option value="Other">Other</option>
          </select>
          {errors.premiseType && (
            <p className="text-xs text-error font-medium">
              {errors.premiseType}
            </p>
          )}
        </div>

        <TextInput
          label="Floor Level"
          id="floorLevel"
          placeholder="e.g. Ground Floor, Level 3"
          value={data.floorLevel}
          onChange={(e) => onChange('floorLevel', e.target.value)}
          error={errors.floorLevel}
          required
        />
      </div>
    </div>
  );
};
