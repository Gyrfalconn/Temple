
export const TEMPLE_NAME_TE = "శ్రీ నృసింహ సేవా వాహిని";
export const TEMPLE_SUB_NAME_TE = "గో - గోవిందా కల్పవృక్ష నారసింహ సాలగ్రామ ఆశ్రమం";
export const TEMPLE_ADDRESS_TE = "శ్రీ అహోబిల మఠం పక్కన , రామాలయం దగ్గర భద్రాచలం";
export const TEMPLE_TAGLINE_TE = "సఖలాభీష్ఠసిద్ధిరస్తు";

// Compatibility exports
export const TEMPLE_NAME_EN = TEMPLE_NAME_TE;
export const TEMPLE_SLOGAN_TE = TEMPLE_TAGLINE_TE;

export const GOTHRAMS = [
  "Select Gothram / గోత్రమును ఎంచుకోండి",
  "Bharadwaja (భరద్వాజ)",
  "Kasyapa (కాశ్యప)",
  "Athreya (ఆత్రేయ)",
  "Gautama (గౌతమ)",
  "Vasistha (వసిష్ఠ)",
  "Kausika (కౌశిక)",
  "Sandilya (శాండిల్య)",
  "Agastya (అగస్త్య)",
  "Haritasa (హరితస)",
  "Gargeya (గార్గేయ)",
  "Srivatsa (శ్రీవత్స)",
  "Moudgalya (ముద్గల)",
  "Vishnu (విష్ణు)",
  "Sounaka (శౌనక)",
  "Angirasa (అంగిరస)",
  "Vatsa (వత్స)",
  "Jamadagni (జమదగ్ని)",
  "Kanva (కణ్వ)",
  "Mudgala (ముద్గల)",
  "Upamanyu (ఉపమంయు)",
  "Other / ఇతర"
];

export const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const MONTHS_TE = [
  "జనవరి", "ఫిబ్రవరి", "మార్చి", "ఏప్ర్రిల్", "మే", "జూన్",
  "జూలై", "ఆగస్టు", "సెప్టెంబర్", "అక్టోబర్", "నవంబర్", "డిసెంబర్"
];

export const STORAGE_KEY = 'temple_devotees_data';

/**
 * Helper to get a stable YYYY-MM-DD string in LOCAL time.
 */
export const getLocalISOString = (date: Date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Helper to get relative date strings for mock data
const getRelativeDate = (days: number, yearOffset: number = -30) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear() + yearOffset;
  return `${year}-${month}-${day}`;
};

export const MOCK_DEVOTEES = [
  {
    id: 'm1',
    fullName: 'Ananthacharya / అనంతాచార్య',
    dateOfBirth: getRelativeDate(0, -40),
    marriageDate: getRelativeDate(-5, -10),
    wifeName: 'Lakshmi / లక్ష్మి',
    wifeDOB: getRelativeDate(15, -38),
    children: [{ name: 'Srinivasa', dob: getRelativeDate(1, -8) }],
    gothram: 'Bharadwaja (భరద్వాజ)',
    phoneNumber: '9848012345',
    address: 'Kukatpally, Hyderabad',
    createdAt: new Date().toISOString(),
    callHistory: []
  },
  {
    id: 'm2',
    fullName: 'Ramesh Sharma / రమేష్ శర్మ',
    dateOfBirth: getRelativeDate(-50, -45),
    marriageDate: getRelativeDate(0, -20),
    wifeName: 'Saraswati / సరస్వతి',
    wifeDOB: getRelativeDate(1, -42),
    children: [{ name: 'Aditya', dob: getRelativeDate(12, -15) }],
    gothram: 'Kasyapa (కాశ్యప)',
    phoneNumber: '9123456789',
    address: 'Miyapur, Hyderabad',
    createdAt: new Date().toISOString(),
    callHistory: []
  }
];
