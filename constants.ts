
export const TEMPLE_NAME_EN = "Go-Govinda Kalpavruksha Narasimha Salagrama Temple";
export const TEMPLE_NAME_TE = "గో-గోవింద కల్పవృక్ష నరసింహ సాలగ్రామ క్షేత్రం";
export const TEMPLE_SLOGAN_TE = "ఓం ఉగ్రం వీరం మహావిష్ణుం జ్వలంతం సర్వతోముఖం | నృసింహం భీషణం భద్రం మృత్యుమృత్యుం నమామ్యహం";

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
  "Upamanyu (ఉపమన్యు)",
  "Other / ఇతర"
];

export const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const MONTHS_TE = [
  "జనవరి", "ఫిబ్రవరి", "మార్చి", "ఏప్రిల్", "మే", "జూన్",
  "జూలై", "ఆగస్టు", "సెప్టెంబర్", "అక్టోబర్", "నవంబర్", "డిసెంబర్"
];

export const STORAGE_KEY = 'temple_devotees_data';

/**
 * Helper to get a stable YYYY-MM-DD string in LOCAL time.
 * Avoids the common toISOString() timezone offset bug.
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
    dateOfBirth: getRelativeDate(0, -40), // Birthday Today
    marriageDate: getRelativeDate(-5, -10),
    wifeName: 'Lakshmi / లక్ష్మి',
    wifeDOB: getRelativeDate(15, -38),
    children: [{ name: 'Srinivasa', dob: getRelativeDate(1, -8) }], // Child Birthday Tomorrow
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
    marriageDate: getRelativeDate(0, -20), // Anniversary Today
    wifeName: 'Saraswati / సరస్వతి',
    wifeDOB: getRelativeDate(1, -42), // Spouse Birthday Tomorrow
    children: [{ name: 'Aditya', dob: getRelativeDate(12, -15) }],
    gothram: 'Kasyapa (కాశ్యప)',
    phoneNumber: '9123456789',
    address: 'Miyapur, Hyderabad',
    createdAt: new Date().toISOString(),
    callHistory: []
  },
  {
    id: 'm3',
    fullName: 'Venkat Reddy / వెంకట్ రెడ్డి',
    dateOfBirth: getRelativeDate(1, -35), // Birthday Tomorrow
    marriageDate: getRelativeDate(5, -12), // Anniversary in 5 days
    wifeName: 'Gauri / గౌరీ',
    wifeDOB: getRelativeDate(0, -33), // Spouse Birthday Today
    children: [],
    gothram: 'Athreya (ఆత్రేయ)',
    phoneNumber: '8888899999',
    address: 'Gachibowli, Hyderabad',
    createdAt: new Date().toISOString(),
    callHistory: []
  },
  {
    id: 'm4',
    fullName: 'Satyanarayana / సత్యనారాయణ',
    dateOfBirth: getRelativeDate(-10, -60),
    marriageDate: getRelativeDate(-200, -35),
    wifeName: 'Annapurna / అన్నపూర్ణ',
    wifeDOB: getRelativeDate(-5, -58),
    children: [
      { name: 'Kalyan', dob: getRelativeDate(0, -30) } // Child Birthday Today
    ],
    gothram: 'Vasistha (వసిష్ఠ)',
    phoneNumber: '7777766666',
    address: 'Banjara Hills, Hyderabad',
    createdAt: new Date().toISOString(),
    callHistory: []
  },
  {
    id: 'm5',
    fullName: 'Krishna Murthy / కృష్ణ మూర్తి',
    dateOfBirth: getRelativeDate(25, -50),
    marriageDate: getRelativeDate(0, -25), // Anniversary Today
    wifeName: 'Radha / రాధ',
    wifeDOB: getRelativeDate(4, -48),
    children: [{ name: 'Hari', dob: getRelativeDate(1, -5) }], // Child Birthday Tomorrow
    gothram: 'Srivatsa (శ్రీవత్స)',
    phoneNumber: '9900112233',
    address: 'Secunderabad',
    createdAt: new Date().toISOString(),
    callHistory: []
  },
  {
    id: 'm6',
    fullName: 'Srinivas Rao / శ్రీనివాస్ రావు',
    dateOfBirth: getRelativeDate(0, -42), // Birthday Today
    marriageDate: getRelativeDate(20, -15),
    wifeName: 'Padma / పద్మ',
    wifeDOB: getRelativeDate(-12, -40),
    children: [{ name: 'Deepak', dob: getRelativeDate(10, -10) }],
    gothram: 'Gautama (గౌతమ)',
    phoneNumber: '9885012345',
    address: 'Dilsukhnagar, Hyderabad',
    createdAt: new Date().toISOString(),
    callHistory: []
  },
  {
    id: 'm7',
    fullName: 'Praveen Kumar / ప్రవీణ్ కుమార్',
    dateOfBirth: getRelativeDate(6, -33),
    marriageDate: getRelativeDate(1, -8), // Anniversary Tomorrow
    wifeName: 'Siri / సిరి',
    wifeDOB: getRelativeDate(22, -30),
    children: [],
    gothram: 'Haritasa (హరితస)',
    phoneNumber: '9550011223',
    address: 'Madhapur, Hyderabad',
    createdAt: new Date().toISOString(),
    callHistory: []
  }
];
