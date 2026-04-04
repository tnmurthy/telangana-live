export const taxZones = [
  { zone: 'A', label: 'Prime Zone', areas: 'Banjara Hills, Jubilee Hills, Madhapur, Hitech City', ratePerSqFt: 4.50 },
  { zone: 'B', label: 'Premium Zone', areas: 'Gachibowli, Kondapur, Begumpet, Somajiguda', ratePerSqFt: 3.50 },
  { zone: 'C', label: 'Urban Core', areas: 'Ameerpet, Himayatnagar, Secunderabad, Abids', ratePerSqFt: 2.80 },
  { zone: 'D', label: 'Sub-Urban', areas: 'Kukatpally, Dilsukhnagar, Uppal, Malkajgiri', ratePerSqFt: 2.20 },
  { zone: 'E', label: 'Peripheral', areas: 'Miyapur, Alwal, Bowenpally, Tarnaka, LB Nagar', ratePerSqFt: 1.80 },
  { zone: 'F', label: 'Outskirts', areas: 'Patancheru, Shamshabad, Ghatkesar, Medchal', ratePerSqFt: 1.40 },
];

export const usageTypes = [
  { id: 'residential', label: 'Residential', factor: 1.0, emoji: '🏠' },
  { id: 'commercial', label: 'Commercial', factor: 2.0, emoji: '🏪' },
  { id: 'industrial', label: 'Industrial', factor: 1.5, emoji: '🏭' },
  { id: 'mixed', label: 'Mixed Use', factor: 1.25, emoji: '🏢' },
];

export const exampleProperties = [
  { description: 'Apartment – Banjara Hills', area: 1200, zone: 'A', usage: 'residential', floors: 1, annualTax: 6480 },
  { description: 'Commercial Shop – Ameerpet', area: 400, zone: 'C', usage: 'commercial', floors: 1, annualTax: 2240 },
  { description: 'Villa – Kondapur', area: 3500, zone: 'B', usage: 'residential', floors: 2, annualTax: 24500 },
  { description: 'Office Space – Hitech City', area: 2000, zone: 'A', usage: 'commercial', floors: 1, annualTax: 18000 },
  { description: 'Row House – Miyapur', area: 900, zone: 'E', usage: 'residential', floors: 1, annualTax: 1620 },
];
