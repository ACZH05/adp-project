// Extracting validation logic from WizardPage.tsx to reduce complexity

export const validateWizardStep = (
  stepNum: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  documents: any
): Record<string, string> => {
  const stepErrors: Record<string, string> = {};

  if (stepNum === 1) {
    if (!formData.fullName.trim()) stepErrors.fullName = 'Full Name is required';
    
    const icClean = formData.icPassport.replace(/-/g, '');
    if (!formData.icPassport.trim()) {
      stepErrors.icPassport = 'IC / Passport number is required';
    } else if (icClean.length === 12 && !/^\d+$/.test(icClean)) {
      stepErrors.icPassport = 'IC should contain numbers only';
    } else if (formData.icPassport.trim().length < 6) {
      stepErrors.icPassport = 'Invalid passport format';
    }

    if (!formData.dob) stepErrors.dob = 'Date of birth is required';
    if (!formData.contactNumber.trim()) stepErrors.contactNumber = 'Contact number is required';
    if (!formData.email.trim()) {
      stepErrors.email = 'Email is required';
    } else if (!formData.email.includes('@')) {
      stepErrors.email = 'Please enter a valid email address';
    }
    if (!formData.residentialAddress.trim()) stepErrors.residentialAddress = 'Residential address is required';
  }

  if (stepNum === 2) {
    if (!formData.businessName.trim()) stepErrors.businessName = 'Business Name is required';
    if (!formData.regNumber.trim()) stepErrors.regNumber = 'Registration Number is required';
    if (!formData.position.trim()) stepErrors.position = 'Your Position is required';
    if (!formData.regDate) stepErrors.regDate = 'Registration Date is required';
    if (!formData.expiryDate) stepErrors.expiryDate = 'Expiry Date is required';
    if (!formData.businessPhone.trim()) stepErrors.businessPhone = 'Business Phone is required';
    if (!formData.businessAddress.trim()) stepErrors.businessAddress = 'Business Registered Address is required';
  }

  if (stepNum === 3) {
    if (!formData.premiseAddress.trim()) stepErrors.premiseAddress = 'Premise address is required';
    if (!formData.postcode.trim()) {
      stepErrors.postcode = 'Postcode is required';
    } else if (formData.postcode.trim().length !== 5) {
      stepErrors.postcode = 'Postcode must be exactly 5 digits';
    }
    if (!formData.cityDistrict.trim()) stepErrors.cityDistrict = 'Postcode is invalid or not detected';
    if (!formData.premiseType) stepErrors.premiseType = 'Premise Type is required';
    if (!formData.floorLevel.trim()) stepErrors.floorLevel = 'Floor Level is required';
  }

  if (stepNum === 4) {
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
  }

  if (stepNum === 5) {
    const requiredDocs = ['passportPhoto', 'icCopy', 'businessReg', 'tenancyAgreement'];
    requiredDocs.forEach((docKey) => {
      const file = documents[docKey];
      if (!file) {
        stepErrors[docKey] = 'This document is required';
      } else if (file.status === 'uploading') {
        stepErrors[docKey] = 'Please wait for file scanning to complete';
      }
    });
  }

  if (stepNum === 6) {
    if (!formData.signatoryName.trim()) stepErrors.signatoryName = 'Signatory name is required';
    if (!formData.signatoryIc.trim()) stepErrors.signatoryIc = 'Signatory IC/Passport is required';
    if (!formData.companyName.trim()) stepErrors.companyName = 'Company name is required';
    if (!formData.acceptedDeclaration) stepErrors.acceptedDeclaration = 'You must accept the legal declaration';
  }

  return stepErrors;
};
