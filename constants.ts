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
