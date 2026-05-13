// Farmer information portal data for Telangana
// Includes MSP prices, crop advisories, agri schemes, and market rates

// Minimum Support Prices (MSP) – Government of India, Kharif 2025-26 & Rabi 2025-26
export const mspPrices = {
    season: 'Kharif 2025–26 & Rabi 2025–26',
    announcedOn: '2025-06-12',
    crops: [
        // Kharif
        { name: 'Paddy (Common)', telugu: 'వడ్లు (సాధారణ)', season: 'Kharif', msp: 2183, unit: '₹/quintal', lastYearMsp: 2065, category: 'Cereal' },
        { name: 'Paddy (Grade A)', telugu: 'వడ్లు (Grade A)', season: 'Kharif', msp: 2203, unit: '₹/quintal', lastYearMsp: 2085, category: 'Cereal' },
        { name: 'Cotton (Medium Staple)', telugu: 'పత్తి (మీడియం)', season: 'Kharif', msp: 7121, unit: '₹/quintal', lastYearMsp: 6620, category: 'Cash Crop' },
        { name: 'Cotton (Long Staple)', telugu: 'పత్తి (లాంగ్)', season: 'Kharif', msp: 7521, unit: '₹/quintal', lastYearMsp: 7020, category: 'Cash Crop' },
        { name: 'Maize', telugu: 'మొక్కజొన్న', season: 'Kharif', msp: 2090, unit: '₹/quintal', lastYearMsp: 1962, category: 'Cereal' },
        { name: 'Soybean', telugu: 'సోయాబీన్', season: 'Kharif', msp: 4892, unit: '₹/quintal', lastYearMsp: 4600, category: 'Oilseed' },
        { name: 'Groundnut', telugu: 'వేరుశెనగ', season: 'Kharif', msp: 6783, unit: '₹/quintal', lastYearMsp: 6377, category: 'Oilseed' },
        { name: 'Sunflower', telugu: 'పొద్దుతిరుగుడు', season: 'Kharif', msp: 7280, unit: '₹/quintal', lastYearMsp: 6760, category: 'Oilseed' },
        { name: 'Jowar (Hybrid)', telugu: 'జొన్న', season: 'Kharif', msp: 3180, unit: '₹/quintal', lastYearMsp: 3015, category: 'Cereal' },
        { name: 'Bajra', telugu: 'సజ్జ', season: 'Kharif', msp: 2625, unit: '₹/quintal', lastYearMsp: 2500, category: 'Cereal' },
        { name: 'Red Chilli (Dry)', telugu: 'మిరప కాయలు', season: 'Kharif', msp: 5400, unit: '₹/quintal', lastYearMsp: 4950, category: 'Spice' },
        { name: 'Turmeric', telugu: 'పసుపు', season: 'Kharif', msp: 9500, unit: '₹/quintal', lastYearMsp: 8500, category: 'Spice' },
        // Rabi
        { name: 'Wheat', telugu: 'గోధుమ', season: 'Rabi', msp: 2275, unit: '₹/quintal', lastYearMsp: 2150, category: 'Cereal' },
        { name: 'Gram (Chana)', telugu: 'శనగ', season: 'Rabi', msp: 5440, unit: '₹/quintal', lastYearMsp: 5230, category: 'Pulse' },
        { name: 'Masur (Lentil)', telugu: 'మసూర్', season: 'Rabi', msp: 6425, unit: '₹/quintal', lastYearMsp: 6000, category: 'Pulse' },
        { name: 'Rapeseed / Mustard', telugu: 'ఆవాలు', season: 'Rabi', msp: 5950, unit: '₹/quintal', lastYearMsp: 5650, category: 'Oilseed' },
        { name: 'Sunflower (Rabi)', telugu: 'పొద్దుతిరుగుడు (రబీ)', season: 'Rabi', msp: 7280, unit: '₹/quintal', lastYearMsp: 6760, category: 'Oilseed' },
    ],
};

// Crop advisory for current season (April - pre-Kharif sowing preparation)
export const cropAdvisories = [
    {
        id: 'advisory-1',
        crop: 'Cotton',
        telugu: 'పత్తి',
        icon: '🌿',
        month: 'April',
        title: 'Pre-Sowing Land Preparation',
        advisory: 'Begin deep ploughing and add FYM @ 5 tonnes/acre. Select BT cotton varieties suited for your district. Ensure soil testing is done to check pH (ideal: 6.5–8.0). Contact nearest Krishi Vigyan Kendra for certified seeds.',
        urgency: 'high',
        tags: ['Sowing Prep', 'Soil Health'],
    },
    {
        id: 'advisory-2',
        crop: 'Paddy',
        telugu: 'వడ్లు',
        icon: '🌾',
        month: 'April',
        title: 'Nursery Bed Preparation for Kharif',
        advisory: 'Prepare nursery beds (wet/dry) from mid-April. Use MTU-1010, JGL-1798, or Telangana Sona varieties. Seed rate: 25 kg/acre. Treat seeds with Carbendazim 2g/kg before sowing to prevent seed-borne diseases.',
        urgency: 'medium',
        tags: ['Nursery', 'Seed Treatment'],
    },
    {
        id: 'advisory-3',
        crop: 'Groundnut',
        telugu: 'వేరుశెనగ',
        icon: '🥜',
        month: 'April',
        title: 'Water Management Advisory',
        advisory: 'Irrigate groundnut fields once in 10–12 days. Critical stages: pegging and pod development. Avoid waterlogging; ensure proper drainage channels. Apply gypsum @ 200 kg/acre at pegging stage for better pod filling.',
        urgency: 'medium',
        tags: ['Irrigation', 'Crop Management'],
    },
    {
        id: 'advisory-4',
        crop: 'Red Chilli',
        telugu: 'మిరప',
        icon: '🌶️',
        month: 'April',
        title: 'Pest & Disease Surveillance',
        advisory: 'Watch for thrips, mites, and viral diseases (Leaf curl, Mosaic). Spray imidacloprid 0.3 ml/L for thrips. Remove and destroy virus-infected plants immediately. Use yellow sticky traps @ 10/acre for monitoring.',
        urgency: 'high',
        tags: ['Pest Control', 'Disease'],
    },
    {
        id: 'advisory-5',
        crop: 'Maize',
        telugu: 'మొక్కజొన్న',
        icon: '🌽',
        month: 'April',
        title: 'Fall Armyworm Alert',
        advisory: 'Fall Armyworm (FAW) activity is expected with rising temperatures. Scout fields twice weekly. Apply Chlorantraniliprole 0.4 ml/L or Spinetoram 0.5 ml/L at early infestation. ICAR helpline: 1800-425-1122.',
        urgency: 'critical',
        tags: ['Pest Alert', 'FAW'],
    },
    {
        id: 'advisory-6',
        crop: 'Turmeric',
        telugu: 'పసుపు',
        icon: '💛',
        month: 'April',
        title: 'Post-Harvest Storage Tips',
        advisory: 'Cure freshly harvested turmeric by boiling in water for 45–60 minutes. Dry on raised platforms for 10–15 days. Store in dry, well-ventilated gunny bags. Hyderabad market prices currently at ₹9,200–₹9,800/quintal.',
        urgency: 'low',
        tags: ['Post-Harvest', 'Storage'],
    },
];

// Government schemes for farmers
export const farmerSchemes = [
    {
        id: 'rythu-bandhu',
        name: 'Rythu Bandhu',
        telugu: 'రైతు బంధు',
        description: 'Investment support of ₹10,000 per acre per year (₹5,000 per season) for all land-owning farmers in Telangana for purchasing seeds, fertilisers, and other agricultural inputs.',
        benefit: '₹5,000/acre per season',
        eligibility: 'Land-owning farmers with pattadar passbook',
        howToApply: 'Auto-credited to registered bank account linked to pattadar passbook. No separate application needed.',
        contact: '040-23450004',
        website: 'https://rythubandhu.telangana.gov.in',
        icon: '💰',
        status: 'active',
    },
    {
        id: 'rythu-bima',
        name: 'Rythu Bima',
        telugu: 'రైతు బీమా',
        description: 'Free life insurance of ₹5 lakh for farmers aged 18–59 years. In case of death, the nominee receives the insurance amount without any premium from the farmer.',
        benefit: '₹5 lakh life insurance (free)',
        eligibility: 'Farmers aged 18–59 with pattadar passbook',
        howToApply: 'Registration through Village Revenue Officer or Mee Seva centres.',
        contact: '1800-425-0066',
        website: 'https://rythubima.telangana.gov.in',
        icon: '🛡️',
        status: 'active',
    },
    {
        id: 'pm-kisan',
        name: 'PM-KISAN',
        telugu: 'పీఎం-కిసాన్',
        description: 'Central government scheme providing ₹6,000 per year in 3 equal instalments of ₹2,000 to all eligible farmer families across India.',
        benefit: '₹6,000/year (3 instalments)',
        eligibility: 'Small and marginal farmers with less than 2 hectares of cultivable land',
        howToApply: 'Apply at Mee Seva / CSC centres or online at pmkisan.gov.in with Aadhaar and bank details.',
        contact: '011-24300606',
        website: 'https://pmkisan.gov.in',
        icon: '🇮🇳',
        status: 'active',
    },
    {
        id: 'pmfby',
        name: 'Pradhan Mantri Fasal Bima Yojana',
        telugu: 'ఫసల్ బీమా యోజన',
        description: 'Crop insurance scheme covering losses from natural calamities, pests, and diseases. Farmers pay only 2% (Kharif) or 1.5% (Rabi) of the sum insured as premium.',
        benefit: 'Crop loss compensation up to insured sum',
        eligibility: 'All farmers including sharecroppers and tenant farmers',
        howToApply: 'Apply through banks, Common Service Centres, or insurance company agents before the cut-off date.',
        contact: '1800-180-1551',
        website: 'https://pmfby.gov.in',
        icon: '☔',
        status: 'active',
    },
    {
        id: 'kcc',
        name: 'Kisan Credit Card (KCC)',
        telugu: 'కిసాన్ క్రెడిట్ కార్డ్',
        description: 'Provides adequate and timely credit for agricultural needs. Farmers can borrow up to ₹3 lakh at 4% interest per year (after interest subvention of 3% + 2% for prompt repayment).',
        benefit: 'Up to ₹3 lakh credit at 4% p.a.',
        eligibility: 'All farmers, tenant farmers, sharecroppers, SHG members',
        howToApply: 'Apply at nearest bank branch with land records, Aadhaar, and passport photo.',
        contact: '1800-110-001',
        website: 'https://www.nabard.org',
        icon: '💳',
        status: 'active',
    },
    {
        id: 'soil-health',
        name: 'Soil Health Card Scheme',
        telugu: 'మట్టి ఆరోగ్య కార్డు',
        description: 'Free soil testing and Soil Health Card issued every 2 years showing 12 soil parameters including macro and micro nutrients, with crop-wise fertiliser recommendations.',
        benefit: 'Free soil testing + fertiliser advisory',
        eligibility: 'All farmers',
        howToApply: 'Contact nearest Agriculture Extension Officer or Rythu Seva Kendra for soil sample collection.',
        contact: '1800-180-1551',
        website: 'https://soilhealth.dac.gov.in',
        icon: '🌱',
        status: 'active',
    },
];

// Current Regulated Market (APMC) commodity prices in Telangana
export const marketPrices = {
    lastUpdated: '2026-04-04',
    source: 'Telangana State Agricultural Marketing Department',
    markets: [
        {
            market: 'APMC Hyderabad (Bowenpally)',
            commodities: [
                { name: 'Onion', price: 1800, unit: '₹/quintal', change: -200 },
                { name: 'Tomato', price: 2400, unit: '₹/quintal', change: 300 },
                { name: 'Potato', price: 1600, unit: '₹/quintal', change: 0 },
            ],
        },
        {
            market: 'APMC Karimnagar',
            commodities: [
                { name: 'Paddy (Common)', price: 2200, unit: '₹/quintal', change: 0 },
                { name: 'Cotton', price: 7350, unit: '₹/quintal', change: 150 },
                { name: 'Maize', price: 2050, unit: '₹/quintal', change: -30 },
            ],
        },
        {
            market: 'APMC Nizamabad',
            commodities: [
                { name: 'Turmeric', price: 9500, unit: '₹/quintal', change: 200 },
                { name: 'Red Chilli', price: 14500, unit: '₹/quintal', change: -300 },
                { name: 'Soybean', price: 4850, unit: '₹/quintal', change: 50 },
            ],
        },
    ],
};

// Helpline numbers for farmers
export const farmerHelplines = [
    { name: 'Kisan Call Centre', number: '1800-180-1551', description: '24×7 free agri advisory', icon: '📞' },
    { name: 'Rythu Seva Kendra', number: '1800-425-0066', description: 'TS Agriculture Dept', icon: '🌾' },
    { name: 'ICAR Helpline', number: '1800-425-1122', description: 'Pest & disease advisory', icon: '🔬' },
    { name: 'Soil Testing', number: '040-24651039', description: 'PJTSAU Soil Testing Lab', icon: '🌱' },
    { name: 'PM-KISAN Helpline', number: '155261', description: 'Central scheme queries', icon: '🇮🇳' },
];

// Weather-based crop calendar
export const cropCalendar = [
    { month: 'January', activities: ['Rabi harvesting begins (wheat, pulses)', 'Sugarcane plant crop harvesting', 'Summer paddy nursery preparation'] },
    { month: 'February', activities: ['Wheat harvest in Nizamabad, Karimnagar', 'Summer groundnut sowing', 'Mango flowering – spray for fruit set'] },
    { month: 'March', activities: ['Rabi crop harvesting', 'Summer paddy transplanting', 'Inter-cropping season for vegetables'] },
    { month: 'April', activities: ['Kharif land preparation (cotton, maize, paddy)', 'Nursery bed preparation for paddy', 'Pre-monsoon soil health check recommended'] },
    { month: 'May', activities: ['Early Kharif sowing (maize, jowar) in drylands', 'Cotton sowing begins after first rains', 'Summer crops need extra irrigation'] },
    { month: 'June', activities: ['SW Monsoon arrival – Kharif sowing peak', 'Paddy transplanting (wetlands)', 'Cotton sowing – main season starts'] },
    { month: 'July', activities: ['Kharif crops establishment', 'Weeding operations in paddy, cotton', 'Watch for pest outbreaks (FAW in maize)'] },
    { month: 'August', activities: ['Paddy active tillering stage', 'Cotton boll formation', 'Apply top-dressing fertilisers'] },
    { month: 'September', activities: ['Paddy flowering & grain filling', 'Red chilli transplanting', 'Rabi land preparation begins'] },
    { month: 'October', activities: ['Kharif harvest begins (early paddy, maize)', 'Rabi sowing starts (wheat, gram)', 'Cotton picking season'] },
    { month: 'November', activities: ['Main Kharif harvest (paddy, cotton)', 'Rabi crop sowing in full swing', 'Turmeric harvest begins'] },
    { month: 'December', activities: ['Cotton last picking', 'Rabi crops in vegetative growth', 'Turmeric and chilli harvest in progress'] },
];
