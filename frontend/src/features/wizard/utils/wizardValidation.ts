import { REQUIRED_DOCUMENT_TYPES } from '../data/wizardConstants';

export interface WizardFormData {
  applicationId?: string;
  applicationVersionId?: string;
  fullName: string;
  icPassport: string;
  dob: string;
  email: string;
  contactNumber: string;
  residentialAddress: string;

  businessName: string;
  position: string;
  businessPhone: string;
  regDate: string;
  expiryDate: string;
  regNumber: string;
  businessAddress: string;

  premiseAddress: string;
  postcode: string;
  cityDistrict: string;
  premiseType: string;
  otherPremiseType: string;
  floorLevel: string;

  primaryType: string;
  quantityCapacity: string;
  quantityUnit: string;
  requestedDuration: string;
  operatingHoursStart: string;
  operatingHoursEnd: string;

  signatoryName: string;
  signatoryIc: string;
  companyName: string;
  acceptedDeclaration: boolean;
}

const validateStep1 = (formData: WizardFormData, stepErrors: Record<string, string>) => {
  if (!formData.fullName.trim()) stepErrors.fullName = 'Full Name is required';
  
  const icClean = formData.icPassport.replace(/-/g, '').trim();
  if (!formData.icPassport.trim()) {
    stepErrors.icPassport = 'IC / Passport number is required';
  } else if (icClean.length < 6) {
    stepErrors.icPassport = 'Invalid IC / Passport format';
  }

  if (!formData.dob) stepErrors.dob = 'Date of birth is required';
  if (!formData.contactNumber.trim()) stepErrors.contactNumber = 'Contact number is required';
  if (!formData.email.trim()) {
    stepErrors.email = 'Email is required';
  } else if (!formData.email.includes('@')) {
    stepErrors.email = 'Please enter a valid email address';
  }
  if (!formData.residentialAddress.trim()) stepErrors.residentialAddress = 'Residential address is required';
};

const validateStep2 = (formData: WizardFormData, stepErrors: Record<string, string>) => {
  if (!formData.businessName.trim()) stepErrors.businessName = 'Business Name is required';
  if (!formData.regNumber.trim()) stepErrors.regNumber = 'Registration Number is required';
  if (!formData.position.trim()) {
    stepErrors.position = 'Your Position is required';
  } else if (!/^[a-zA-Z\s]+$/.test(formData.position.trim())) {
    stepErrors.position = 'Your Position / Role should contain letters only';
  }
  if (!formData.regDate) stepErrors.regDate = 'Registration Date is required';
  const isSdnBhd = /sdn\.?\s*bhd\.?/i.test(formData.businessName || '');
  if (!isSdnBhd && !formData.expiryDate) {
    stepErrors.expiryDate = 'Expiry Date is required';
  } else if (formData.regDate && formData.expiryDate) {
    const reg = new Date(formData.regDate);
    const exp = new Date(formData.expiryDate);
    if (exp < reg) {
      stepErrors.expiryDate = 'Expiry Date cannot be before Registration Date';
    }
  }
  if (!formData.businessPhone.trim()) {
    stepErrors.businessPhone = 'Business Phone is required';
  } else if (/[a-zA-Z]/.test(formData.businessPhone)) {
    stepErrors.businessPhone = 'Business Phone number should contain numbers only';
  }
  if (!formData.businessAddress.trim()) stepErrors.businessAddress = 'Business Registered Address is required';
};

const validateStep3 = (formData: WizardFormData, stepErrors: Record<string, string>) => {
  if (!formData.premiseAddress.trim()) stepErrors.premiseAddress = 'Premise address is required';
  if (!formData.postcode.trim()) {
    stepErrors.postcode = 'Postcode is required';
  } else if (formData.postcode.trim().length !== 5) {
    stepErrors.postcode = 'Postcode must be exactly 5 digits';
  }
  if (!formData.cityDistrict.trim()) stepErrors.cityDistrict = 'Postcode is invalid or not detected';
  if (!formData.premiseType) {
    stepErrors.premiseType = 'Premise Type is required';
  } else if (formData.premiseType === 'Other' && !formData.otherPremiseType.trim()) {
    stepErrors.otherPremiseType = 'Please specify your premise type';
  }
  if (!formData.floorLevel.trim()) stepErrors.floorLevel = 'Floor Level is required';
};

const validateStep4 = (formData: WizardFormData, stepErrors: Record<string, string>) => {
  if (!formData.primaryType) stepErrors.primaryType = 'Primary Category is required';
  if (!formData.quantityCapacity.trim()) stepErrors.quantityCapacity = 'Capacity is required';
  if (!formData.quantityUnit) stepErrors.quantityUnit = 'Capacity Unit is required';
  if (!formData.requestedDuration.trim()) {
    stepErrors.requestedDuration = 'Requested duration is required';
  } else {
    const val = parseInt(formData.requestedDuration);
    if (isNaN(val) || val < 1 || val > 12) {
      stepErrors.requestedDuration = 'Duration must be between 1 and 12 months';
    }
  }
  if (!formData.operatingHoursStart) stepErrors.operatingHoursStart = 'Start time is required';
  if (!formData.operatingHoursEnd) stepErrors.operatingHoursEnd = 'End time is required';
};

const validateStep5 = (documents: Record<string, { status?: string } | undefined>, stepErrors: Record<string, string>) => {
  REQUIRED_DOCUMENT_TYPES.forEach(({ key: docKey }) => {
    const file = documents[docKey];
    if (!file) {
      stepErrors[docKey] = 'This document is required';
    } else if (file.status === 'uploading') {
      stepErrors[docKey] = 'Please wait for file scanning to complete';
    }
  });
};

const validateStep6 = (formData: WizardFormData, stepErrors: Record<string, string>) => {
  if (!formData.signatoryName.trim()) stepErrors.signatoryName = 'Signatory name is required';
  if (!formData.signatoryIc.trim()) stepErrors.signatoryIc = 'Signatory IC/Passport is required';
  if (!formData.companyName.trim()) stepErrors.companyName = 'Company name is required';
  if (!formData.acceptedDeclaration) stepErrors.acceptedDeclaration = 'You must accept the legal declaration';
};

export const validateWizardStep = (
  stepNum: number,
  formData: WizardFormData,
  documents: Record<string, { status?: string } | undefined>,
  setErrors: (errors: Record<string, string>) => void
): boolean => {
  const stepErrors: Record<string, string> = {};

  if (stepNum === 1) validateStep1(formData, stepErrors);
  if (stepNum === 2) validateStep2(formData, stepErrors);
  if (stepNum === 3) validateStep3(formData, stepErrors);
  if (stepNum === 4) validateStep4(formData, stepErrors);
  if (stepNum === 5) validateStep5(documents, stepErrors);
  if (stepNum === 6) validateStep6(formData, stepErrors);

  setErrors(stepErrors);
  return Object.keys(stepErrors).length === 0;
};
