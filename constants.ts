
export const TEMPLE_NAME_EN = "Go-Govinda Kalpavruksha Narasimha Salagrama Temple";
export const TEMPLE_NAME_TE = "గో-గోవింద కల్పవృక్ష నరసింహ సాలగ్రామ క్షేత్రం";

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
  "Moudgalya (మౌద్గల్య)",
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

export const STORAGE_KEY = 'temple_devotees_data';

const getRelativeDateString = (year: number, monthOffset = 0, dayOffset = 0) => {
  const d = new Date();
  d.setFullYear(year);
  d.setMonth(d.getMonth() + monthOffset);
  d.setDate(d.getDate() + dayOffset);
  return d.toISOString().split('T')[0];
};

export const MOCK_DEVOTEES = [
  { id: "1", fullName: "P. Rama Krishna / పి. రామకృష్ణ", phoneNumber: "9848022338", gothram: "Bharadwaja (భరద్వాజ)", address: "Ameerpet", dateOfBirth: getRelativeDateString(1985, 0, 0), marriageDate: getRelativeDateString(2010, 0, -5), notes: "", createdAt: new Date().toISOString() },
  { id: "2", fullName: "S. Lakshmi Devi / ఎస్. లక్ష్మీ దేవి", phoneNumber: "9988776655", gothram: "Kasyapa (కాశ్యప)", address: "Jubilee Hills", dateOfBirth: getRelativeDateString(1990, 0, -1), marriageDate: getRelativeDateString(2015, 0, 0), notes: "", createdAt: new Date().toISOString() },
  { id: "3", fullName: "V. Srinivasa Rao / వి. శ్రీనివాస రావు", phoneNumber: "9440123456", gothram: "Athreya (ఆత్రేయ)", address: "Kukatpally", dateOfBirth: getRelativeDateString(1978, 0, 2), marriageDate: getRelativeDateString(2005, 0, 10), notes: "", createdAt: new Date().toISOString() },
  { id: "4", fullName: "K. Parvati / కె. పార్వతి", phoneNumber: "9123456789", gothram: "Vasistha (వసిష్ఠ)", address: "Secunderabad", dateOfBirth: getRelativeDateString(1992, 0, 5), notes: "", createdAt: new Date().toISOString() },
  { id: "5", fullName: "M. Venkatesh / ఎం. వెంకటేష్", phoneNumber: "9866554433", gothram: "Sandilya (శాండిల్య)", address: "Hitech City", dateOfBirth: getRelativeDateString(1988, 0, 0), marriageDate: getRelativeDateString(2012, 0, 0), notes: "", createdAt: new Date().toISOString() },
  { id: "6", fullName: "B. Satyanarayana / బి. సత్యనారాయణ", phoneNumber: "9900112233", gothram: "Vishnu (విష్ణు)", address: "Warangal", dateOfBirth: getRelativeDateString(1965, 1, 0), marriageDate: getRelativeDateString(1990, 1, 0), notes: "", createdAt: new Date().toISOString() },
  { id: "7", fullName: "T. Anusuya / టి. అనసూయ", phoneNumber: "9701231234", gothram: "Kausika (కౌశిక)", address: "Vijayawada", dateOfBirth: getRelativeDateString(1970, 0, -5), marriageDate: getRelativeDateString(1995, 0, 5), notes: "", createdAt: new Date().toISOString() },
  { id: "8", fullName: "G. Mahesh Babu / జి. మహేష్ బాబు", phoneNumber: "9000012345", gothram: "Bharadwaja (భరద్వాజ)", address: "Guntur", dateOfBirth: getRelativeDateString(1982, 0, 10), notes: "", createdAt: new Date().toISOString() },
  { id: "9", fullName: "D. Saroja / డి. సరోజ", phoneNumber: "9849098490", gothram: "Gautama (గౌతమ)", address: "Tirupati", dateOfBirth: getRelativeDateString(1975, 0, 0), marriageDate: getRelativeDateString(2000, 0, 0), notes: "", createdAt: new Date().toISOString() },
  { id: "10", fullName: "R. Narayana Murthy / ఆర్. నారాయణ మూర్తి", phoneNumber: "9550123456", gothram: "Agastya (అగస్త్య)", address: "Vizag", dateOfBirth: getRelativeDateString(1950, -1, 0), marriageDate: getRelativeDateString(1975, -1, 0), notes: "", createdAt: new Date().toISOString() },
  { id: "11", fullName: "N. Chandra Babu / ఎన్. చంద్ర బాబు", phoneNumber: "9100100100", gothram: "Srivatsa (శ్రీవత్స)", address: "Nellore", dateOfBirth: getRelativeDateString(1980, 0, 15), marriageDate: getRelativeDateString(2008, 0, 15), notes: "", createdAt: new Date().toISOString() },
  { id: "12", fullName: "L. Sita / ఎల్. సీత", phoneNumber: "9220022002", gothram: "Bharadwaja (భరద్వాజ)", address: "Kurnool", dateOfBirth: getRelativeDateString(1995, 0, -15), notes: "", createdAt: new Date().toISOString() },
  { id: "13", fullName: "A. Arjun Rao / ఎ. అర్జున్ రావు", phoneNumber: "9330033003", gothram: "Sandilya (శాండిల్య)", address: "Kadapa", dateOfBirth: getRelativeDateString(1988, 0, 20), marriageDate: getRelativeDateString(2014, 0, 20), notes: "", createdAt: new Date().toISOString() },
  { id: "14", fullName: "Y. Rajasekhar / వై. రాజశేఖర్", phoneNumber: "9440044004", gothram: "Kasyapa (కాశ్యప)", address: "Anantapur", dateOfBirth: getRelativeDateString(1972, 2, 0), marriageDate: getRelativeDateString(1998, 2, 0), notes: "", createdAt: new Date().toISOString() },
  { id: "15", fullName: "J. Jagan Mohan / జె. జగన్ మోహన్", phoneNumber: "9550055005", gothram: "Athreya (ఆత్రేయ)", address: "Chittoor", dateOfBirth: getRelativeDateString(1983, 0, -20), marriageDate: getRelativeDateString(2011, 0, -20), notes: "", createdAt: new Date().toISOString() },
  { id: "16", fullName: "K. Pawan Kalyan / కె. పవన్ కళ్యాణ్", phoneNumber: "9660066006", gothram: "Vasistha (వసిష్ఠ)", address: "Eluru", dateOfBirth: getRelativeDateString(1989, 0, 25), notes: "", createdAt: new Date().toISOString() },
  { id: "17", fullName: "S. Balakrishna / ఎస్. బాలకృష్ణ", phoneNumber: "9770077007", gothram: "Gautama (గౌతమ)", address: "Kakinada", dateOfBirth: getRelativeDateString(1968, 0, 30), marriageDate: getRelativeDateString(1994, 0, 30), notes: "", createdAt: new Date().toISOString() },
  { id: "18", fullName: "C. Chiranjeevi / సి. చిరంజీవి", phoneNumber: "9880088008", gothram: "Bharadwaja (భరద్వాజ)", address: "Rajahmundry", dateOfBirth: getRelativeDateString(1974, -2, 0), marriageDate: getRelativeDateString(1980, -2, 0), notes: "", createdAt: new Date().toISOString() },
  { id: "19", fullName: "N. NTR Rao / ఎన్. ఎన్టీఆర్ రావు", phoneNumber: "9990099009", gothram: "Srivatsa (శ్రీవత్స)", address: "Nizamabad", dateOfBirth: getRelativeDateString(1991, 0, -30), marriageDate: getRelativeDateString(2016, 0, -30), notes: "", createdAt: new Date().toISOString() },
  { id: "20", fullName: "M. Mohan Babu / ఎం. మోహన్ బాబు", phoneNumber: "9000000001", gothram: "Agastya (అగస్త్య)", address: "Ongole", dateOfBirth: getRelativeDateString(1976, 0, 1), marriageDate: getRelativeDateString(2002, 0, 1), notes: "", createdAt: new Date().toISOString() }
];
