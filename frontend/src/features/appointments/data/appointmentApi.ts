const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082';

const getHeaders = () => {
  const token = localStorage.getItem('adp_jwt_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const appointmentApi = {
  getAvailableSlots: async (date: string) => {
    const response = await fetch(`${API_BASE_URL}/appointments/available-slots?date=${date}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch available slots');
    return response.json();
  },

  getEligibleApplications: async () => {
    const response = await fetch(`${API_BASE_URL}/appointments/eligible-applications`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch eligible applications');
    return response.json();
  },

  getApplicantAppointments: async () => {
    const response = await fetch(`${API_BASE_URL}/appointments/applicant`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch appointments');
    return response.json();
  },

  requestAppointment: async (applicationId: string, startAt: string, endAt: string) => {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ applicationId, startAt, endAt })
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to request appointment');
    }
    return response.json();
  },

  getPendingRequests: async () => {
    const response = await fetch(`${API_BASE_URL}/appointments/officer/pending`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch pending requests');
    return response.json();
  },

  decideAppointment: async (appointmentId: string, decision: 'approve' | 'reject', reason?: string) => {
    const response = await fetch(`${API_BASE_URL}/appointments/officer/${appointmentId}/decision`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ decision, reason })
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to decide appointment');
    }
    return response.json();
  }
};
