export interface OfficerAppointment {
  id: string;
  applicantName: string;
  applicationId: string;
  date: string;
  time: string;
  type: 'Inspection' | 'Interview' | 'Consultation';
  status: 'Pending' | 'Approved' | 'Conflicted' | 'Completed';
}

export const mockOfficerAppointments: OfficerAppointment[] = [
  {
    id: 'APT-1001',
    applicantName: 'Sarah Jenkins',
    applicationId: 'APP-2026-042',
    date: '2026-06-25',
    time: '10:00 AM',
    type: 'Inspection',
    status: 'Pending',
  },
  {
    id: 'APT-1002',
    applicantName: 'Michael Chang',
    applicationId: 'APP-2026-043',
    date: '2026-06-25',
    time: '11:00 AM',
    type: 'Interview',
    status: 'Conflicted', 
  },
  {
    id: 'APT-1003',
    applicantName: 'Ahmad bin Khalid',
    applicationId: 'APP-2026-045',
    date: '2026-06-26',
    time: '02:00 PM',
    type: 'Inspection',
    status: 'Approved',
  },
  {
    id: 'APT-1004',
    applicantName: 'Rachel Lim',
    applicationId: 'APP-2026-048',
    date: '2026-06-27',
    time: '09:00 AM',
    type: 'Inspection',
    status: 'Pending',
  }
];
