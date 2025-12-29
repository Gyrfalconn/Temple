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
    fullName: 'Anantha Rama Rao / అనంత రామారావు',
    dateOfBirth: getRelativeDate(0, -45), // Birthday TODAY
    marriageDate: getRelativeDate(-10, -20),
    wifeName: 'Lakshmi Devi / లక్ష్మి దేవి',
    wifeDOB: getRelativeDate(15, -42),
    children: [
      { name: 'Srinivasa / శ్రీనివాస', dob: getRelativeDate(5, -12) },
      { name: 'Padmavathi / పద్మావతి', dob: getRelativeDate(-20, -8) }
    ],
    gothram: 'Bharadwaja (భరద్వాజ)',
    phoneNumber: '9848012345',
    address: 'Sannidhi Street, Bhadrachalam',
    createdAt: new Date().toISOString(),
    callHistory: []
  },
  {
    id: 'm2',
    fullName: 'Venkatasubba Rao / వెంకటసుబ్బా రావు',
    dateOfBirth: getRelativeDate(-50, -55),
    marriageDate: getRelativeDate(0, -25), // Anniversary TODAY
    wifeName: 'Saraswathi / సరస్వతి',
    wifeDOB: getRelativeDate(2, -50),
    children: [{ name: 'Kalyan / కళ్యాణ్', dob: getRelativeDate(12, -22) }],
    gothram: 'Kasyapa (కాశ్యప)',
    phoneNumber: '9123456789',
    address: 'Miyapur, Hyderabad',
    createdAt: new Date().toISOString(),
    callHistory: []
  },
  {
    id: 'm3',
    fullName: 'Narayana Murthy / నారాయణ మూర్తి',
    dateOfBirth: getRelativeDate(1, -40), // Birthday TOMORROW
    marriageDate: getRelativeDate(15, -15),
    wifeName: 'Sita / సీత',
    wifeDOB: getRelativeDate(-10, -38),
    children: [],
    gothram: 'Athreya (ఆత్రేయ)',
    phoneNumber: '9988776655',
    address: 'Temple View Colony, Bhadrachalam',
    createdAt: new Date().toISOString(),
    callHistory: []
  },
  {
    id: 'm4',
    fullName: 'Gopal Krishna / గోపాల్ కృష్ణ',
    dateOfBirth: getRelativeDate(5, -35), // Birthday in 5 days
    marriageDate: getRelativeDate(1, -10), // Anniversary TOMORROW
    wifeName: 'Radha / రాధ',
    wifeDOB: getRelativeDate(-5, -32),
    children: [{ name: 'Krishna / కృష్ణ', dob: getRelativeDate(0, -5) }],
    gothram: 'Srivatsa (శ్రీవత్స)',
    phoneNumber: '9000123456',
    address: 'Kukatpally, Hyderabad',
    createdAt: new Date().toISOString(),
    callHistory: []
  },
  {
    id: 'm5',
    fullName: 'Subrahmanya Sharma / సుబ్రహ్మణ్య శర్మ',
    dateOfBirth: getRelativeDate(-15, -60),
    marriageDate: getRelativeDate(4, -30), // Anniversary in 4 days
    wifeName: 'Annapurna / అన్నపూర్ణ',
    wifeDOB: getRelativeDate(20, -58),
    children: [
      { name: 'Kartikeya / కార్తికేయ', dob: getRelativeDate(2, -25) },
      { name: 'Ganesha / గణేశ', dob: getRelativeDate(10, -20) }
    ],
    gothram: 'Gautama (గౌతమ)',
    phoneNumber: '8888777766',
    address: 'Brahmana Veedhi, Bhadrachalam',
    createdAt: new Date().toISOString(),
    callHistory: []
  },
  {
    id: 'm6',
    fullName: 'Arjuna Rao / అర్జున రావు',
    dateOfBirth: getRelativeDate(10, -38), // Birthday in 10 days
    marriageDate: getRelativeDate(-100, -12),
    wifeName: 'Draupadi / ద్రౌపది',
    wifeDOB: getRelativeDate(50, -35),
    children: [{ name: 'Abhimanyu / అభిమన్యు', dob: getRelativeDate(25, -10) }],
    gothram: 'Vasistha (వసిష్ఠ)',
    phoneNumber: '7776665554',
    address: 'Gachibowli, Hyderabad',
    createdAt: new Date().toISOString(),
    callHistory: []
  },
  {
    id: 'm7',
    fullName: 'Srinivasulu / శ్రీనివాసులు',
    dateOfBirth: getRelativeDate(20, -32), // Birthday in 20 days
    marriageDate: '', // Single Devotee
    wifeName: '',
    wifeDOB: '',
    children: [],
    gothram: 'Sandilya (శాండిల్య)',
    phoneNumber: '9555444333',
    address: 'Ramalayam Area, Bhadrachalam',
    createdAt: new Date().toISOString(),
    callHistory: []
  },
  {
    id: 'm8',
    fullName: 'Govinda Rajulu / గోవింద రాజులు',
    dateOfBirth: getRelativeDate(-200, -48),
    marriageDate: getRelativeDate(12, -20), // Anniversary in 12 days
    wifeName: 'Andal / ఆండాళ్',
    wifeDOB: getRelativeDate(-10, -45),
    children: [
      { name: 'Ranganath / రంగనాథ్', dob: getRelativeDate(1, -15) },
      { name: 'Varada / వరద', dob: getRelativeDate(15, -12) },
      { name: 'Yadagiri / యాదగిరి', dob: getRelativeDate(8, -8) }
    ],
    gothram: 'Vishnu (విష్ణు)',
    phoneNumber: '9444333222',
    address: 'Ashram Road, Bhadrachalam',
    createdAt: new Date().toISOString(),
    callHistory: []
  },
  {
    id: 'm9',
    fullName: 'Hanumantha Rao / హనుమంత రావు',
    dateOfBirth: getRelativeDate(25, -50), // Birthday in 25 days
    marriageDate: getRelativeDate(2, -28), // Anniversary in 2 days
    wifeName: 'Anjana / అంజన',
    wifeDOB: getRelativeDate(0, -48),
    children: [],
    gothram: 'Angirasa (అంగిరస)',
    phoneNumber: '9333222111',
    address: 'Old Town, Bhadrachalam',
    createdAt: new Date().toISOString(),
    callHistory: []
  },
  {
    id: 'm10',
    fullName: 'Parvathi Devi / పార్వతి దేవి',
    dateOfBirth: getRelativeDate(3, -38), // Birthday in 3 days
    marriageDate: getRelativeDate(-5, -15),
    wifeName: 'Shiva / శివ',
    wifeDOB: getRelativeDate(3, -40),
    children: [
      { name: 'Shanmukha / షణ్ముఖ', dob: getRelativeDate(10, -10) }
    ],
    gothram: 'Agastya (అగస్త్య)',
    phoneNumber: '9222111000',
    address: 'Hill View, Bhadrachalam',
    createdAt: new Date().toISOString(),
    callHistory: []
  }
];
