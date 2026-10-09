export const meesevaCategories = [
  {
    id: 'certificates',
    label: 'Revenue & Certificates',
    icon: 'FileText',
    description: 'Official government certificates and domicile proofs.',
    offerings: [
      {
        name: 'Income Certificate',
        fee: '₹45',
        timeline: '7 Days',
        documents: ['Application Form', 'Ration Card / Aadhaar Card', 'Employer Salary Certificate or IT Returns', 'Self-Declaration Form'],
        link: 'https://ts.meeseva.telangana.gov.in/'
      },
      {
        name: 'Integrated Caste Certificate',
        fee: '₹45',
        timeline: '30 Days',
        documents: ['Application Form', 'SSC Memo or School Leaving Certificate', 'Father/Sibling Caste Certificate', 'Land documents/Pahani copy'],
        link: 'https://ts.meeseva.telangana.gov.in/'
      },
      {
        name: 'Residence / Domicile Certificate',
        fee: '₹45',
        timeline: '15 Days',
        documents: ['Application Form', 'Aadhaar Card', 'Ration Card', 'Study Certificates (7 consecutive years) or Land Registry docs'],
        link: 'https://ts.meeseva.telangana.gov.in/'
      },
      {
        name: 'EWS Certificate (Economically Weaker Section)',
        fee: '₹45',
        timeline: '10 Days',
        documents: ['Application Form', 'Aadhaar Card', 'Income Certificate', 'Property/Landholding Documents', 'PAN Card copy'],
        link: 'https://ts.meeseva.telangana.gov.in/'
      },
      {
        name: 'Family Membership Certificate',
        fee: '₹45',
        timeline: '15 Days',
        documents: ['Application Form', 'Death Certificate of the deceased', 'Service Certificate (if employed)', 'Affidavit on ₹20 Stamp Paper', 'Aadhaar Cards of all members'],
        link: 'https://ts.meeseva.telangana.gov.in/'
      }
    ]
  },
  {
    id: 'land',
    label: 'Land & Registration',
    icon: 'Map',
    description: 'Land records, patta copy, and property documents.',
    offerings: [
      {
        name: 'Adangal / Pahani Copy',
        fee: '₹35',
        timeline: 'Instant (or 3 Days for Certified)',
        documents: ['Application Form', 'Survey Number details', 'District, Mandal & Village names', 'Previous Land Document'],
        link: 'https://ts.meeseva.telangana.gov.in/'
      },
      {
        name: 'Encumbrance Certificate (EC)',
        fee: '₹200 + search fee',
        timeline: '1 Day (Online) / 5 Days (Counter)',
        documents: ['Application Form', 'Property Address & Boundary Details', 'Copy of Sale Deed', 'Schedule of Property'],
        link: 'https://ts.meeseva.telangana.gov.in/'
      },
      {
        name: 'Certified Copy of Registered Document',
        fee: '₹200',
        timeline: '3 Days',
        documents: ['Application Form', 'Document Number and Year of Registration', 'Sub-Registrar Office Name', 'Aadhaar Card'],
        link: 'https://ts.meeseva.telangana.gov.in/'
      }
    ]
  },
  {
    id: 'utility',
    label: 'Utility & Bill Payments',
    icon: 'CreditCard',
    description: 'Electricity bills, water tax, and local body payments.',
    offerings: [
      {
        name: 'TSSPDCL / TSNPDCL Electricity Bill',
        fee: 'No Service Fee',
        timeline: 'Instant',
        documents: ['Unique Service Number (USN) / Consumer Number', 'Latest Bill Copy (Optional)'],
        link: 'https://ts.meeseva.telangana.gov.in/'
      },
      {
        name: 'HMWSSB Water Bill Payment',
        fee: 'No Service Fee',
        timeline: 'Instant',
        documents: ['CAN Number (Consumer Account Number)', 'Latest Bill Copy (Optional)'],
        link: 'https://ts.meeseva.telangana.gov.in/'
      },
      {
        name: 'GHMC Property Tax Payment',
        fee: 'No Service Fee',
        timeline: 'Instant',
        documents: ['Property Tax Number (PTIN)', 'Mobile Number registered with GHMC'],
        link: 'https://ts.meeseva.telangana.gov.in/'
      },
      {
        name: 'Traffic Challan Payment',
        fee: '₹5 Transaction Fee',
        timeline: 'Instant',
        documents: ['Vehicle Registration Number (e.g., TS09XX1234)', 'Challan Number (if available)'],
        link: 'https://ts.meeseva.telangana.gov.in/'
      }
    ]
  },
  {
    id: 'welfare',
    label: 'Welfare & Ration',
    icon: 'Heart',
    description: 'PDS ration cards and healthcare welfare cards.',
    offerings: [
      {
        name: 'New Ration Card Application (FSC)',
        fee: '₹45',
        timeline: '30 Days',
        documents: ['Application Form', 'Aadhaar Cards of all family members', 'Income Certificate', 'Gas Connection details', 'Resident Proof'],
        link: 'https://ts.meeseva.telangana.gov.in/'
      },
      {
        name: 'Ration Card Member Addition / Deletion',
        fee: '₹45',
        timeline: '15 Days',
        documents: ['Application Form', 'Original Ration Card', 'Birth Certificate (for addition) / Marriage or Death Certificate (for deletion)', 'Aadhaar Card of the member'],
        link: 'https://ts.meeseva.telangana.gov.in/'
      },
      {
        name: 'Aarogyasri Health Card Issue',
        fee: '₹45',
        timeline: '15 Days',
        documents: ['Application Form', 'Ration Card (FSC)', 'Aadhaar Cards of all members', 'Medical records (if any)'],
        link: 'https://ts.meeseva.telangana.gov.in/'
      }
    ]
  },
  {
    id: 'identity',
    label: 'Aadhaar & Identity',
    icon: 'User',
    description: 'Biometrics registration, demographic updates, and voter registration.',
    offerings: [
      {
        name: 'Aadhaar Mobile Link / Demographic Update',
        fee: '₹50',
        timeline: '3-5 Days',
        documents: ['Aadhaar Number', 'Proof of Identity (POI) / Proof of Address (POA)', 'Biometric verification (at centre)'],
        link: 'https://ts.meeseva.telangana.gov.in/'
      },
      {
        name: 'Aadhaar New Enrolment / Biometric Update',
        fee: 'Free (New) / ₹100 (Biometric)',
        timeline: '15 Days',
        documents: ['Birth Certificate (for new)', 'Proof of Address (POA)', 'Physical presence for fingerprints & iris scan'],
        link: 'https://ts.meeseva.telangana.gov.in/'
      },
      {
        name: 'New Voter Registration (Form 6)',
        fee: 'Free',
        timeline: '30-45 Days',
        documents: ['Application Form 6', 'Passport size photo', 'Age Proof (Birth Certificate / Class 10 Memo)', 'Address Proof (Gas bill / Bank Passbook / Aadhaar)'],
        link: 'https://ts.meeseva.telangana.gov.in/'
      }
    ]
  }
];
