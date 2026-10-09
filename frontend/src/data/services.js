export const services = {
    hospitals: {
        icon: 'Hospital',
        label: 'Hospitals',
        description: 'Find top hospitals, clinics & emergency services across Telangana',
        count: 340,
        items: [
            { name: 'NIMS (Nizam\'s Institute of Medical Sciences)', area: 'Punjagutta, Hyderabad', type: 'Government' },
            { name: 'Gandhi Hospital', area: 'Musheerabad, Hyderabad', type: 'Government' },
            { name: 'Osmania General Hospital', area: 'Afzalgunj, Hyderabad', type: 'Government' },
            { name: 'Apollo Hospitals', area: 'Jubilee Hills, Hyderabad', type: 'Private' },
            { name: 'Yashoda Hospitals', area: 'Somajiguda, Hyderabad', type: 'Private' },
            { name: 'KIMS Hospital', area: 'Secunderabad', type: 'Private' },
            { name: 'Continental Hospitals', area: 'Gachibowli, Hyderabad', type: 'Private' },
            { name: 'Care Hospitals', area: 'Banjara Hills, Hyderabad', type: 'Private' },
        ],
    },
    schools: {
        icon: 'School',
        label: 'Schools',
        description: 'Top-rated schools including CBSE, ICSE, SSC & International boards',
        count: 1250,
        items: [
            { name: 'Hyderabad Public School', area: 'Begumpet, Hyderabad', type: 'Private (CBSE)' },
            { name: 'Oakridge International School', area: 'Gachibowli, Hyderabad', type: 'Private (IB)' },
            { name: 'Meridian School', area: 'Madhapur, Hyderabad', type: 'Private (CBSE)' },
            { name: 'Delhi Public School', area: 'Nacharam, Hyderabad', type: 'Private (CBSE)' },
            { name: 'Bharatiya Vidya Bhavan', area: 'Jubilee Hills, Hyderabad', type: 'Private (CBSE)' },
            { name: 'Telangana Social Welfare School', area: 'Multiple locations', type: 'Government (SSC)' },
            { name: 'TSMS (Telangana Model School)', area: 'Multiple locations', type: 'Government (SSC)' },
            { name: 'Chirec International', area: 'Kondapur, Hyderabad', type: 'Private (CBSE/Cambridge)' },
        ],
    },
    meeseva: {
        icon: 'FileText',
        label: 'MeeSeva',
        description: 'Access official Telangana Government electronic services (certificates, land records, bill payments) at nearby MeeSeva centres',
        count: 4500,
        offerings: [
            'Caste & Income Certificates',
            'Residence & Nativity Certificates',
            'Adangal / Pahani Copies (Land Records)',
            'Utility Bill Payments (Electricity, Water)',
            'Ration Card Corrections & Applications',
            'Encumbrance Certificates (Registration)',
            'Aadhaar Enrolment & Updates'
        ],
        items: [
            { name: 'MeeSeva Centre - Khairatabad', area: 'Municipal Office Compound, Khairatabad, Hyderabad Central', type: 'Government Authorised' },
            { name: 'MeeSeva Centre - Madhapur', area: 'Opp. Image Gardens, Madhapur, Cyberabad', type: 'Government Authorised' },
            { name: 'MeeSeva Centre - Hanamkonda', area: 'Collectorate Road, Hanamkonda, Warangal', type: 'Government Authorised' },
            { name: 'MeeSeva Centre - Karimnagar', area: 'Opp. Collectorate Office, Karimnagar', type: 'Government Authorised' },
            { name: 'MeeSeva Centre - Nizamabad', area: 'Pragathi Nagar, Nizamabad', type: 'Government Authorised' },
            { name: 'MeeSeva Centre - Secunderabad', area: 'YMCA Circle, Secunderabad', type: 'Government Authorised' },
            { name: 'MeeSeva Centre - Malkajgiri', area: 'Vidyut Nagar, Malkajgiri', type: 'Government Authorised' },
            { name: 'MeeSeva Centre - Kazipet', area: 'Near Railway Station Road, Kazipet, Warangal', type: 'Government Authorised' }
        ],
    },
};
