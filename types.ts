
export interface CallRecord {
  date: string; // YYYY-MM-DD of the occasion
  type: 'Birthday' | 'Anniversary';
  timestamp: string; // Actual time the call was made
}

export interface Devotee {
  id: string;
  fullName: string;
  phoneNumber: string;
  gothram: string;
  address: string;
  dateOfBirth: string; // ISO string YYYY-MM-DD
  marriageDate?: string; // ISO string YYYY-MM-DD
  notes?: string; 
  createdAt: string;
  callHistory: CallRecord[]; // Log of completed blessing calls
}

export type ViewState = 'reminders' | 'upcoming' | 'directory' | 'add' | 'details';

export type Language = 'en' | 'te' | 'both';
