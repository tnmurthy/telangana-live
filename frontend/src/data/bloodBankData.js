export const bloodGroups = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

const districtFacilities = [
  ['Adilabad', 'District Hospital Blood Centre', 'Adilabad town', { 'O-': 2, 'O+': 12, 'A-': 4, 'A+': 9, 'B-': 3, 'B+': 8, 'AB-': 1, 'AB+': 5 }],
  ['Bhadradri Kothagudem', 'Government Area Hospital Blood Centre', 'Kothagudem', { 'O-': 3, 'O+': 10, 'A-': 2, 'A+': 8, 'B-': 4, 'B+': 7, 'AB-': 1, 'AB+': 4 }],
  ['Hyderabad', 'Osmania General Hospital Blood Bank', 'Afzalgunj', { 'O-': 5, 'O+': 24, 'A-': 8, 'A+': 21, 'B-': 7, 'B+': 18, 'AB-': 3, 'AB+': 10 }],
  ['Hyderabad', 'Gandhi Hospital Blood Bank', 'Musheerabad', { 'O-': 4, 'O+': 22, 'A-': 7, 'A+': 19, 'B-': 6, 'B+': 17, 'AB-': 2, 'AB+': 9 }],
  ['Jagtial', 'District Hospital Blood Centre', 'Jagtial town', { 'O-': 1, 'O+': 8, 'A-': 3, 'A+': 7, 'B-': 2, 'B+': 6, 'AB-': 1, 'AB+': 3 }],
  ['Jangaon', 'District Hospital Blood Storage Unit', 'Jangaon town', { 'O-': 2, 'O+': 7, 'A-': 2, 'A+': 6, 'B-': 2, 'B+': 6, 'AB-': 0, 'AB+': 2 }],
  ['Jayashankar Bhupalpally', 'District Hospital Blood Storage Unit', 'Bhupalpally', { 'O-': 1, 'O+': 6, 'A-': 2, 'A+': 5, 'B-': 1, 'B+': 5, 'AB-': 0, 'AB+': 2 }],
  ['Jogulamba Gadwal', 'District Hospital Blood Storage Unit', 'Gadwal', { 'O-': 2, 'O+': 7, 'A-': 2, 'A+': 6, 'B-': 2, 'B+': 6, 'AB-': 1, 'AB+': 3 }],
  ['Kamareddy', 'District Hospital Blood Centre', 'Kamareddy town', { 'O-': 2, 'O+': 9, 'A-': 3, 'A+': 7, 'B-': 2, 'B+': 7, 'AB-': 1, 'AB+': 4 }],
  ['Karimnagar', 'Government General Hospital Blood Bank', 'Karimnagar town', { 'O-': 3, 'O+': 16, 'A-': 5, 'A+': 13, 'B-': 4, 'B+': 12, 'AB-': 2, 'AB+': 7 }],
  ['Khammam', 'District Headquarters Hospital Blood Bank', 'Khammam town', { 'O-': 3, 'O+': 14, 'A-': 4, 'A+': 11, 'B-': 4, 'B+': 10, 'AB-': 1, 'AB+': 6 }],
  ['Kumuram Bheem Asifabad', 'District Hospital Blood Storage Unit', 'Asifabad', { 'O-': 1, 'O+': 5, 'A-': 1, 'A+': 5, 'B-': 1, 'B+': 4, 'AB-': 0, 'AB+': 2 }],
  ['Mahabubabad', 'District Hospital Blood Storage Unit', 'Mahabubabad town', { 'O-': 1, 'O+': 6, 'A-': 2, 'A+': 5, 'B-': 2, 'B+': 5, 'AB-': 0, 'AB+': 3 }],
  ['Mahbubnagar', 'Government General Hospital Blood Bank', 'Mahbubnagar town', { 'O-': 3, 'O+': 13, 'A-': 4, 'A+': 10, 'B-': 3, 'B+': 10, 'AB-': 1, 'AB+': 5 }],
  ['Mancherial', 'District Hospital Blood Centre', 'Mancherial town', { 'O-': 2, 'O+': 9, 'A-': 3, 'A+': 8, 'B-': 2, 'B+': 7, 'AB-': 1, 'AB+': 4 }],
  ['Medak', 'District Hospital Blood Storage Unit', 'Medak town', { 'O-': 1, 'O+': 6, 'A-': 2, 'A+': 5, 'B-': 2, 'B+': 5, 'AB-': 0, 'AB+': 2 }],
  ['Medchal-Malkajgiri', 'Area Hospital Blood Centre', 'Malkajgiri', { 'O-': 3, 'O+': 12, 'A-': 4, 'A+': 10, 'B-': 3, 'B+': 9, 'AB-': 1, 'AB+': 5 }],
  ['Mulugu', 'District Hospital Blood Storage Unit', 'Mulugu town', { 'O-': 1, 'O+': 5, 'A-': 1, 'A+': 4, 'B-': 1, 'B+': 4, 'AB-': 0, 'AB+': 2 }],
  ['Nagarkurnool', 'District Hospital Blood Storage Unit', 'Nagarkurnool town', { 'O-': 2, 'O+': 7, 'A-': 2, 'A+': 6, 'B-': 2, 'B+': 6, 'AB-': 1, 'AB+': 3 }],
  ['Nalgonda', 'Government General Hospital Blood Bank', 'Nalgonda town', { 'O-': 3, 'O+': 13, 'A-': 4, 'A+': 11, 'B-': 4, 'B+': 10, 'AB-': 1, 'AB+': 6 }],
  ['Narayanpet', 'District Hospital Blood Storage Unit', 'Narayanpet town', { 'O-': 1, 'O+': 5, 'A-': 1, 'A+': 5, 'B-': 1, 'B+': 4, 'AB-': 0, 'AB+': 2 }],
  ['Nirmal', 'District Hospital Blood Centre', 'Nirmal town', { 'O-': 2, 'O+': 8, 'A-': 2, 'A+': 7, 'B-': 2, 'B+': 6, 'AB-': 1, 'AB+': 3 }],
  ['Nizamabad', 'Government General Hospital Blood Bank', 'Nizamabad town', { 'O-': 3, 'O+': 15, 'A-': 5, 'A+': 12, 'B-': 4, 'B+': 11, 'AB-': 2, 'AB+': 6 }],
  ['Peddapalli', 'District Hospital Blood Storage Unit', 'Peddapalli town', { 'O-': 2, 'O+': 7, 'A-': 2, 'A+': 6, 'B-': 2, 'B+': 5, 'AB-': 0, 'AB+': 3 }],
  ['Rajanna Sircilla', 'District Hospital Blood Centre', 'Sircilla town', { 'O-': 2, 'O+': 8, 'A-': 2, 'A+': 7, 'B-': 2, 'B+': 6, 'AB-': 1, 'AB+': 3 }],
  ['Rangareddy', 'District Hospital Blood Centre', 'Shamshabad', { 'O-': 3, 'O+': 14, 'A-': 4, 'A+': 12, 'B-': 4, 'B+': 11, 'AB-': 1, 'AB+': 6 }],
  ['Sangareddy', 'Government General Hospital Blood Bank', 'Sangareddy town', { 'O-': 3, 'O+': 12, 'A-': 4, 'A+': 10, 'B-': 3, 'B+': 9, 'AB-': 1, 'AB+': 5 }],
  ['Siddipet', 'Government General Hospital Blood Bank', 'Siddipet town', { 'O-': 3, 'O+': 13, 'A-': 4, 'A+': 11, 'B-': 3, 'B+': 10, 'AB-': 1, 'AB+': 6 }],
  ['Suryapet', 'District Hospital Blood Centre', 'Suryapet town', { 'O-': 2, 'O+': 9, 'A-': 3, 'A+': 8, 'B-': 2, 'B+': 7, 'AB-': 1, 'AB+': 4 }],
  ['Vikarabad', 'District Hospital Blood Storage Unit', 'Vikarabad town', { 'O-': 1, 'O+': 6, 'A-': 2, 'A+': 5, 'B-': 1, 'B+': 5, 'AB-': 0, 'AB+': 2 }],
  ['Wanaparthy', 'District Hospital Blood Storage Unit', 'Wanaparthy town', { 'O-': 2, 'O+': 7, 'A-': 2, 'A+': 6, 'B-': 2, 'B+': 5, 'AB-': 1, 'AB+': 3 }],
  ['Warangal', 'MGM Hospital Blood Bank', 'Warangal / Hanumakonda', { 'O-': 3, 'O+': 16, 'A-': 5, 'A+': 13, 'B-': 4, 'B+': 12, 'AB-': 2, 'AB+': 7 }],
  ['Yadadri Bhuvanagiri', 'District Hospital Blood Storage Unit', 'Bhuvanagiri', { 'O-': 1, 'O+': 6, 'A-': 2, 'A+': 5, 'B-': 1, 'B+': 5, 'AB-': 0, 'AB+': 2 }],
];

export const bloodBanks = districtFacilities.map(([district, name, area, stock], index) => ({
  id: `bb-${index + 1}`,
  district,
  name,
  area,
  category: name.includes('Storage') ? 'Blood Storage Unit' : 'Blood Bank',
  contact: 'Verify through 104 Health Helpline, 108 emergency, or the hospital blood centre desk',
  stock,
  lastUpdated: 'Seeded dashboard signal - connect eRaktKosh / hospital feed for live stock',
}));

export const bloodRequirementAlerts = [
  { id: 'req-hyd-o-negative', district: 'Hyderabad', group: 'O-', priority: 'critical', unitsNeeded: 4, facility: 'Osmania General Hospital Blood Bank', note: 'Emergency reserve threshold' },
  { id: 'req-war-ab-negative', district: 'Warangal', group: 'AB-', priority: 'urgent', unitsNeeded: 2, facility: 'MGM Hospital Blood Bank', note: 'Rare group watch' },
  { id: 'req-jagtial-o-negative', district: 'Jagtial', group: 'O-', priority: 'critical', unitsNeeded: 3, facility: 'District Hospital Blood Centre', note: 'Low rural buffer' },
  { id: 'req-medchal-ab-negative', district: 'Medchal-Malkajgiri', group: 'AB-', priority: 'urgent', unitsNeeded: 2, facility: 'Area Hospital Blood Centre', note: 'Low specialty reserve' },
  { id: 'req-mulugu-o-negative', district: 'Mulugu', group: 'O-', priority: 'critical', unitsNeeded: 3, facility: 'District Hospital Blood Storage Unit', note: 'Remote district reserve' },
];

function resolveDistrictNames(district) {
  if (!district || district === 'Telangana') return bloodBanks.map(bank => bank.district);
  const normalized = district.toLowerCase();
  const aliases = {
    cyberabad: ['Hyderabad', 'Rangareddy'],
    malkajgiri: ['Medchal-Malkajgiri'],
    hanumakonda: ['Warangal'],
  };
  return aliases[normalized] || [district];
}

export function getBloodBanksForDistrict(district) {
  if (!district || district === 'Telangana') return bloodBanks;
  const accepted = resolveDistrictNames(district).map(name => name.toLowerCase());
  return bloodBanks.filter(bank => accepted.includes(bank.district.toLowerCase()));
}

export function getBloodAlertsForDistrict(district) {
  if (!district || district === 'Telangana') return bloodRequirementAlerts;
  const accepted = new Set(resolveDistrictNames(district).map(name => name.toLowerCase()));
  return bloodRequirementAlerts.filter(alert => accepted.has(alert.district.toLowerCase()));
}
