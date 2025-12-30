
export interface Child {
  name: string;
  dob: string;
}

export interface CallRecord {
  date: string; // YYYY-MM-DD of the occasion
  type: 'Birthday' | 'Anniversary' | 'SpouseBirthday' | 'ChildBirthday';
  timestamp: string; // Actual time the call was made
  relatedPerson?: string; // Name of the child or spouse if applicable
}

export interface Devotee {
  id: string;
  fullName: string;
  dateOfBirth: string;
  profileImage?: string; // Base64 encoded image string
  marriageDate?: string;
  wifeName?: string;
  wifeDOB?: string;
  children: Child[];
  gothram: string;
  phoneNumber: string;
  address: string;
  notes?: string;
  createdAt: string;
  callHistory: CallRecord[];
}

export interface TempleSettings {
  name: string;
  subName: string;
  address: string;
  tagline: string;
  logo1?: string; // Base64 string for left logo
  logo2?: string; // Base64 string for right logo
}

export type ViewState = 'reminders' | 'upcoming' | 'directory' | 'add' | 'details' | 'settings';

export type Language = 'en' | 'te';
