const fs = require('fs');
const path = require('path');
const districts = require('../src/data/districts.json');

const BASE_URL = 'https://telangana.live';
const DIST_DIR = path.join(__dirname, '../dist');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');

// Descriptions for main static routes
const staticRouteMeta = {
  '/dashboard': {
    title: 'Civic Intelligence Dashboard & Real-Time Updates - Telangana.live',
    description: 'Get live updates on breaking news, weather, fuel prices, gold rates, and government schemes in Telangana and Hyderabad.',
    h1: 'Telangana Live Civic Intelligence Dashboard',
    h2s: ['Real-Time Regional Feeds', 'Daily Commodities Tracker', 'Welfare & Public Directory'],
    content: `Welcome to the main homepage and dashboard of Telangana Live, the state's leading independent civic intelligence portal. Our platform serves as a unified command center for citizens to access real-time regional feeds, daily updates, and essential public utilities in Hyderabad and all 33 districts of Telangana. 

We gather, consolidate, and verify data across multiple sources to make civic administration transparent and accessible. From monitoring local municipal notifications to tracking daily market rates, fuel prices, transit timelines, and weather forecasts, our dashboard is designed to deliver immediate utility to residents.

### High-Frequency Local News & Public Notifications
Our platform runs an automated curation system that monitors official bulletins, public announcements, and regional press releases. We organize content logically by district and category, ensuring that you can easily track infrastructure works, power cuts, water supply alerts, and administrative changes in your municipality.

### Core Utilities, Welfare Schemes & Public Directory
Access step-by-step guides for applying to government welfare schemes, calculating property tax, checking ration card status, and finding emergency contact directories. We catalog citizen guides for services including MeeSeva, basthi dawakhana clinics, public transit options, and local employment directories, helping you navigate public services without complexity.`
  },
  '/news': {
    title: 'Breaking News & Live Civic Updates - Telangana.live',
    description: 'Get real-time breaking news, local updates, traffic announcements, and civic alerts across all districts of Telangana and Hyderabad.',
    h1: 'Telangana Live News Briefing & Civic Broadcast',
    h2s: ['Breaking Regional News', 'Civic Announcements', 'Transit & Traffic Reports'],
    content: `Welcome to the live news briefing and civic broadcast engine for Telangana state. Our automated data engine aggregates news articles, official announcements, and community updates to keep citizens informed in real-time. We cover everything from local municipal decisions to state-wide policy changes, infrastructure works, and emergency announcements.

Our feed updates continuously throughout the day, filtering content by region and category. We track topics such as municipal governance, local administration, public safety warnings, environmental notices, and cultural events. Our goal is to ensure that residents across Secunderabad, Hyderabad, and all other districts have a central, transparent place to access daily public updates.`
  },
  '/weather': {
    title: 'Telangana Weather Forecast & Rain Reports - Telangana.live',
    description: 'Check today\'s temperature, rain forecast, and 30-day weather outlook for Hyderabad and all Telangana districts.',
    h1: 'Telangana Weather Monitoring & Outlook Dashboard',
    h2s: ['Today\'s Temperature & Rain Outlook', '30-Day Monthly Forecast', 'District Weather Warnings'],
    content: `Stay prepared with the most accurate, real-time weather monitoring and outlook dashboard for the state of Telangana. We provide comprehensive daily forecasts, rain probabilities, humidity ranges, and wind speeds across all 33 districts. Our automated system retrieves updates frequently from meteorological sensors and official agencies, presenting plain, actionable weather guidelines for citizens.

Whether you are planning a trip, managing agricultural schedules, or checking for extreme heatwave or heavy rainfall alerts in your local area, our dashboard makes it simple. We offer a 7-day detailed view and a 30-day monthly outlook, complete with seasonal safety advisories to protect you and your family from extreme weather conditions.`
  },
  '/rates/fuel': {
    title: 'Current Petrol & Diesel Prices in Hyderabad - Telangana.live',
    description: 'Check daily updated petrol and diesel rates in Hyderabad. Live LPG domestic price, CNG vehicle rates, and fuel tax breakdown.',
    h1: 'Hyderabad Fuel Prices & Daily Tariff Tracker',
    h2s: ['Petrol and Diesel Prices Today', 'LPG & CNG Utility Rates', 'Tax Structure & Breakdown'],
    content: `Track daily changes in fuel prices across Hyderabad and major cities in Telangana. Our fuel rate sync engine updates commodity prices every morning, ensuring you get accurate retail prices for petrol, diesel, domestic LPG cylinders, and vehicle CNG. Standardized prices help citizens manage transport expenses and verify retail station tariffs.

We also provide a detailed tax structure breakdown, displaying base prices, excise duties, dealer commissions, and VAT percentages. By keeping these metrics transparent, our portal enables consumers to understand the pricing components of everyday utilities. Read related news alerts regarding oil price fluctuations and local supply logistics.`
  },
  '/rates/gold': {
    title: 'Live Gold Rates in Hyderabad - 22K & 24K Gold Price - Telangana.live',
    description: 'Check current gold rates in Hyderabad today for 22 Karat and 24 Karat gold. Daily silver price history and buyer guides.',
    h1: 'Hyderabad Gold & Silver Price Index',
    h2s: ['Today\'s 22K and 24K Gold Prices', 'Live Silver Rate per Gram', 'Market History & Buyer Guidelines'],
    content: `Access standard, live gold and silver rates in Hyderabad. Our multi-source consensus engine retrieves and validates retail gold prices for 22 Carat and 24 Carat gold (per gram and per 10 grams) along with standard silver prices daily. This guarantees that you are viewing the most reliable market index before making purchases.

In addition to live rates, we maintain a 7-day historical price table to show recent market trends and daily price fluctuations. Our daily buyer's guide details seasonal patterns, GST implications, and retail buying tips, helping you make informed financial decisions when purchasing jewelry or bullion in Telangana.`
  },
  '/reservoirs': {
    title: 'Telangana Reservoir Levels - Live Dam Storage Capacity - Telangana.live',
    description: 'Check live water levels, total capacity (TMC), inflow, and outflow for major dams in Telangana including Nagarjuna Sagar and Srisailam.',
    h1: 'Telangana Water Reservoirs Live Storage Monitor',
    h2s: ['Combined State Water Storage Status', 'Detailed Reservoir Levels (TMC & Feet)', 'Live Inflow and Outflow Reports'],
    content: `Monitor the live capacity and water levels of major reservoirs and dams across Telangana in real-time. Water security is critical for agriculture and municipal drinking supply. Our sync dashboard tracks metrics in TMC (Thousand Million Cubic feet) and height in feet, presenting live inflows and outflows in cusecs (cubic feet per second) for a transparent view of state water resources.

We cover key projects including Nagarjuna Sagar, Srisailam, Sriramsagar (SRSP), Singur, Nizam Sagar, and Himayat Sagar. When water levels fall below critical thresholds, our system automatically generates conservation warnings. During heavy monsoon seasons, check this dashboard for flood alerts and spillway gate operations.`
  },
  '/schemes': {
    title: 'Telangana Welfare Schemes List & Application Guide - Telangana.live',
    description: 'Explore the complete directory of Telangana government welfare schemes. Check eligibility, required documents, and how to apply.',
    h1: 'Telangana State Welfare Schemes Directory',
    h2s: ['Active Welfare Initiatives', 'Eligibility Check & Criteria', 'Application Guide & Documentation'],
    content: `Explore a comprehensive, citizen-friendly directory of active government welfare schemes in Telangana. Navigating public administration can be complex; we simplify the process by organizing welfare programs by citizen intent rather than government department. Get clear guides on eligibility, required documents, and official application channels.

Our directory includes major initiatives such as Rythu Bandhu, Gruha Jyothi, Kalyana Lakshmi, and Aasara Pensions. We outline the step-by-step procedures to apply for certificates, verify pension eligibility, and check scheme application status. Keep track of recent updates regarding government scheme disbursements and policy modifications.`
  },
  '/emergency-contacts': {
    title: 'Emergency Contacts & SOS Helplines in Telangana - Telangana.live',
    description: 'Access the complete list of emergency telephone numbers, disaster management hotlines, and citizen helplines in Telangana.',
    h1: 'Telangana State SOS & Emergency Directory',
    h2s: ['Primary Public Safety Helplines', 'Disaster & Accident Hotlines', 'Local Medical & Administrative Services'],
    content: `Access the essential emergency contacts and SOS helplines directory for Telangana and Hyderabad. During critical events, finding the right contact number quickly is vital. We list public safety hotlines, disaster management forces, fire stations, ambulance services, and local municipal assistance offices in a mobile-optimized layout.

This directory covers police control rooms, women\'s safety lines, child protection services, electricity outage reports, and water board emergency desks. Keep these numbers saved for quick access. You can filter contacts by your specific district or municipal ward for hyper-local emergency support.`
  },
  '/jobs': {
    title: 'Telangana Job Board - Govt & Private Job Openings - Telangana.live',
    description: 'Browse the latest government (TSPSC) and private job vacancies in Hyderabad and Telangana districts. Apply online.',
    h1: 'Telangana Employment & Vacancy Board',
    h2s: ['Latest Public Sector Jobs', 'Private Openings & Subcontracting', 'Eligibility & Application Pathways'],
    content: `Find your next career opportunity on the Telangana Live Job Board. We compile active job openings, recruitment notifications, and employment advertisements across both public and private sectors in Hyderabad and all districts. Job seekers can filter vacancies by category, location, and required qualification.

We track updates from TSPSC (Telangana State Public Service Commission), municipal recruitment drives, and local private employers. Each listing contains a clear summary of required skills, salary ranges, application deadlines, and direct links to apply. Access local employment resources to help build your professional career.`
  },
  '/services': {
    title: 'Telangana Civic Services Directory & MeeSeva Guide - Telangana.live',
    description: 'Complete directory of online government services in Telangana. Guides for certificates, bills, property tax, and MeeSeva.',
    h1: 'Telangana Citizen Services Directory',
    h2s: ['MeeSeva and e-Seva Assistance', 'Utility Bill & Property Tax Payments', 'Land Records & Certificates'],
    content: `Navigate municipal and state administrative workflows easily with our Telangana Civic Services Directory. We act as an independent helper portal, explaining how to request certificates, pay utility bills, check land records, and apply for local licenses on official government portals (GHMC, MeeSeva, TS-bPASS, Dharani).

Our directory bundles services by citizen intent (such as starting a business or moving to a new home) rather than department. Read detailed walkthroughs for obtaining birth certificates, paying power or water bills, calculating property tax, and applying for building approvals. All guides include links to official transaction pages.`
  },
  '/transport/metro': {
    title: 'Hyderabad Metro Timings, Routes & Smart Card Guide - Telangana.live',
    description: 'Get the latest Hyderabad Metro timings, route map, ticket fare calculator, and smart card recharge guidelines.',
    h1: 'Hyderabad Metro Transit Information Hub',
    h2s: ['Metro Route Map & Station List', 'Fare Calculator & Ticket Prices', 'First and Last Train Schedules'],
    content: `Check current schedules, routes, and fare details for the Hyderabad Metro Rail network. Metro rail is the fastest public transport option in the tri-cities. Our portal provides a mobile-friendly directory of the Red, Blue, and Green lines, along with terminal station operating hours and ticket calculators.

Understand how to purchase and recharge smart cards, buy single-journey tokens, and use QR-based tickets to save time. We also compile notifications about transit delays, service expansions, and local feeder bus connections, ensuring your daily commute remains smooth and predictable.`
  },
  '/health/basthi-dawakhana': {
    title: 'Basthi Dawakhana Locator & Public Clinics Directory - Telangana.live',
    description: 'Find neighborhood Basthi Dawakhana clinics in Hyderabad. Doctor availability, diagnostic services, and free medicine schemes.',
    h1: 'Telangana Basthi Dawakhana Directory',
    h2s: ['Clinic Locator by Municipal Ward', 'Available Diagnostic Services & Tests', 'Operating Hours & Doctor Consultations'],
    content: `Find your nearest Basthi Dawakhana clinic and access free primary healthcare services in Hyderabad and suburban Telangana. Basthi Dawakhanas are urban primary health centers established to make quality medical care accessible to local communities. We list clinics, location directions, and operating schedules.

Our directory outlines available services, including free doctor consultations, diagnostic tests, immunizations, and essential medicines. Use this helper guide to find healthcare in your neighborhood, helping you treat basic illnesses and access preventative care easily.`
  },
  '/ai-pulse': {
    title: 'Telangana AI Pulse - Civic Insights & Summaries - Telangana.live',
    description: 'Read automated AI summaries of regional news, public sentiment, civic issues, and local policy changes in Telangana.',
    h1: 'Telangana Live AI-Driven Civic Pulse',
    h2s: ['AI-Summarized Public Reports', 'Community Sentiment Analysis', 'Sector-wise Civic Health Bulletins'],
    content: `Access automated, AI-generated civic summaries and policy impact reports on the Telangana AI Pulse. Our data engine scans regional news feeds, municipal complaints, and press releases to generate concise, readable briefings. This allows citizens to catch up on important local issues quickly.

We evaluate sector-wise progress in public transport, water supply, power grid stability, agriculture, and municipal health. Sentiment tracking highlights critical issues receiving community attention, helping you understand where local developmental efforts are succeeding or require improvement.`
  },
  '/water-supply': {
    title: 'Telangana Water Supply Schedule & Tanker Booking - Telangana.live',
    description: 'Track municipal water supply timings, water board reservoir storage, and book drinking water tankers online.',
    h1: 'Telangana Municipal Water Supply Directory',
    h2s: ['Drinking Water Supply Timings', 'Online Water Tanker Booking Guide', 'HMWS&SB Helpline & Service Desk'],
    content: `Track municipal drinking water supply schedules and manage booking transactions in Hyderabad and major towns in Telangana. Clean water supply is managed at scheduled intervals; our guide helps you stay prepared by outlining distribution timings and pressure updates for your municipal circle.

Learn how to book drinking water tankers online, track tanker delivery status, and resolve billing issues with the water board (HMWS&SB). Access service helplines and read recommendations on water conservation, rainwater harvesting, and municipal pipe connection approvals.`
  },
  '/ration-pds': {
    title: 'Telangana Ration PDS Card FSC Search & Eligibility - Telangana.live',
    description: 'Check eligibility, search FSC database, apply for white ration card, and locate PDS dealer shops in Telangana.',
    h1: 'Telangana Food Security & PDS Ration Directory',
    h2s: ['Food Security Card (FSC) Search', 'Ration Card Application & Eligibility', 'PDS Fair Price Shop Locations'],
    content: `Check your Food Security Card status and learn how to access public distribution services (PDS) in Telangana. The ration card system provides subsidized grains, oil, and fuel to eligible households. Our portal explains how to navigate the official Civil Supplies directory to search your card records.

Read detailed guides on applying for a new white ration card, correcting card details, and adding family members. We also list fair price shops and PDS dealers by mandal and village, ensuring you can locate distribution centers and understand your monthly allocation rights.`
  },
  '/events': {
    title: 'Telangana Events Calendar & Public Holidays - Telangana.live',
    description: 'Check upcoming cultural festivals, state public holidays, municipal meetings, and community events in Telangana.',
    h1: 'Telangana Regional Events & Holiday Calendar',
    h2s: ['State Government Public Holidays', 'Regional Festivals & Cultural Calendars', 'Civic Meetings & Public Forums'],
    content: `Stay updated on regional festivals, public holidays, and civic events in Telangana. Our state calendar keeps track of official government holidays, banking shutdowns, and local municipal forums, helping you plan administrative visits and community engagements.

We cover major regional and national celebrations including Bonalu, Bathukamma, Dasara, and Ramzan, listing local events, public transport schedules, and road closures. Find public forums, townhall meetings, and community gatherings to participate in local civic conversations.`
  },
  '/panchang': {
    title: 'Daily Telangana Panchang & Almanac Timings - Telangana.live',
    description: 'Get daily updated Panchang details, sunrise/sunset, auspicious timings (Shubh Muhurat), and regional calendar data.',
    h1: 'Telangana Daily Panchang & Astro Almanac',
    h2s: ['Daily Tithi, Nakshatra & Yoga', 'Auspicious & Inauspicious Muhurats', 'Sunrise, Sunset & Moonrise Timings'],
    content: `Access daily updated Panchang and regional almanac timings for Hyderabad and Telangana. The Panchang is a traditional calendar that calculates daily astrological attributes based on lunar and solar positions. We present these details clearly to help citizens observe traditional routines.

View current Tithi, Nakshatra, Yoga, and Karana, along with auspicious times (Abhijit Muhurat) and times to avoid (Rahukalam, Yamagandam). We calculate sunrise and sunset times specific to regional latitudes, providing an accurate reference for daily calendars.`
  },
  '/budget': {
    title: 'Telangana State Budget Tracker & Public Finance - Telangana.live',
    description: 'Track state budget allocations, civic development spend, and sector-wise revenue utilization in Telangana.',
    h1: 'Telangana Public Finance & Budget Tracker',
    h2s: ['Annual Budget Allocations', 'Civic Spend & Infrastructure Funding', 'Welfare Program Disbursements'],
    content: `Track annual budget allocations and analyze public finance distributions in the state of Telangana. Transparent public spending is key to development; we summarize the state budget to show where taxpayer money is allocated across infrastructure, education, health, and welfare.

Review charts of department spending (including irrigation, power, municipal administration, and welfare). Compare annual allocations, track public debt records, and read analyses of how these financial plans impact regional civic amenities and local municipal projects.`
  },
  '/politicians': {
    title: 'Telangana MLA / MP Constituency & Profile Tracker - Telangana.live',
    description: 'Explore politician profiles, constituency developmental updates, performance statistics, and disclosures.',
    h1: 'Telangana Constituency & Politician Directory',
    h2s: ['Legislative Assembly (MLA) Directory', 'Member of Parliament (MP) Tracker', 'Constituency Developmental Reports'],
    content: `Explore politician profiles and track developmental projects in your assembly constituency in Telangana. Connecting citizens with elected representatives is vital for local governance. We compile MLA and MP directories, listing names, political parties, contact details, and legislative committee assignments.

Review constituency reports summarizing completed infrastructure works, pending road repairs, water supply expansions, and municipal funding. Access public disclosures and election declarations to ensure transparency and accountability in local administration.`
  },
  '/property-tax': {
    title: 'GHMC Property Tax Calculator & Payment Guide - Telangana.live',
    description: 'Calculate municipal property tax, pay online, search assessments, and check dues on GHMC portal.',
    h1: 'Telangana Municipal Property Tax Guide',
    h2s: ['Online Property Tax Calculator', 'Step-by-step Payment Guide', 'Assessment Status & Receipt Download'],
    content: `Calculate and pay your municipal property tax online in Hyderabad and other municipalities in Telangana. Property tax is a main revenue source for municipal services; our guide simplifies the annual assessment and payment process on official platforms (GHMC, CDMA).

Use our tax calculator helper to estimate dues based on property dimensions, construction type, and usage (residential or commercial). Read guides on self-assessment, updating ownership records, finding tax assessment numbers (PTIN), and downloading payment receipts online.`
  },
  '/report': {
    title: 'Civic Complaint Register & Reporting Desk - Telangana.live',
    description: 'File reports on infrastructure damage, potholes, street lights, water leaks, and track resolution status.',
    h1: 'Telangana Civic Grievances & Reporting Portal',
    h2s: ['Submit a Local Civic Complaint', 'Track Grievance Resolution Status', 'Municipal Ward Performance Metrics'],
    content: `Report civic issues in your neighborhood and track resolution progress with our civic grievance helper. Potholes, broken street lights, garbage heaps, and water pipeline leaks should be addressed quickly; we explain how to file complaints on official municipal portals (GHMC, local corporations).

Follow step-by-step instructions to register complaints, upload photos of the issue, and retrieve tracking IDs. We also display municipal ward performance statistics, showing response times and resolution percentages to help citizens hold municipal administrations accountable.`
  },
  '/search': {
    title: 'Search Civic Directory & News Feed - Telangana.live',
    description: 'Search for local news, government schemes, daily rates, and emergency contacts on Telangana Live.',
    h1: 'Telangana Live Site-wide Civic Search',
    h2s: ['Search News & Civic Bulletins', 'Find Government Welfare Schemes', 'Locate Local Public Helplines'],
    content: `Use our site-wide civic search engine to quickly find relevant information, news articles, daily rates, and emergency contacts. Our database index catalogs pages, guides, and directories, helping you locate resources without navigating multiple menus.

Search for terms like "MeeSeva birth certificate", "Nagarjuna Sagar water level", "Petrol rate Hyderabad", or "Basthi Dawakhana clinic". We display matching results instantly, linking directly to our helper guides and official government portals for quick public utility access.`
  },
  '/parks': {
    title: 'Parks & Green Spaces Directory in Hyderabad - Telangana.live',
    description: 'Explore public parks, lung spaces, entry timings, and urban forestry initiatives in Hyderabad and Telangana.',
    h1: 'Telangana Urban Parks & Forestry Directory',
    h2s: ['Public Parks & Botanical Gardens', 'Entry Fees & Timing Schedules', 'Haritha Haram & Forestry Initiatives'],
    content: `Explore urban parks, gardens, and green spaces across Hyderabad and Telangana. Green spaces are essential for recreation and clean air; we catalog major parks (including NTR Gardens, KBR National Park, Public Gardens, and local HUDA layouts), listing operating hours, entry fees, and available amenities.

Read about urban forestry initiatives like the Telangana Haritha Haram project, which focuses on expanding green cover through community tree plantations. Find neighborhood parks with jogging tracks, kids play areas, and seating spaces to enjoy outdoor activities.`
  },
  '/farmers': {
    title: 'Telangana Farmer Rythu Portal & Agri Rates - Telangana.live',
    description: 'Check Rythu Bandhu status, daily agri commodity prices at market yards, and seed distribution schedules.',
    h1: 'Telangana Agricultural & Farmer Directory',
    h2s: ['Daily Agricultural Commodity Rates', 'Rythu Bandhu welfare Status Guide', 'Seed & Fertilizer Supply Centers'],
    content: `Access daily agricultural commodity rates and find support services for farmers on our Rythu directory. Agriculture is a key sector in Telangana; we catalog market yard prices for crops (including rice, cotton, red gram, and turmeric) across major yards like Warangal and Khammam.

Read guides on verifying Rythu Bandhu scheme status, checking eligibility for Rythu Bima insurance, and finding local seed distribution centers. Access weather forecasts and irrigation advisories from the agriculture department, helping you plan crop cycles and protect harvests.`
  },
  '/meeseva': {
    title: 'MeeSeva Online Citizen Services Guide - Telangana.live',
    description: 'Walkthrough of MeeSeva application forms, online login, status checks, and local center locations.',
    h1: 'MeeSeva Citizen Service Centers Directory',
    h2s: ['Online MeeSeva Login & Services', 'Application Status Check Guide', 'Local Center Locations & Contact Info'],
    content: `Learn how to access MeeSeva services and locate service centers in Telangana. MeeSeva is the official portal for public service delivery, enabling citizens to request certificates, licenses, and pay bills. Our guide outlines registration procedures, forms, and tracking details.

Follow walkthroughs for birth registration, income certificates, land record mutations, and utility billing. Locate physical MeeSeva kiosks in your mandal, verify standard fee structures, and check the status of submitted applications using transaction reference IDs.`
  },
  '/classifieds': {
    title: 'Telangana Local Classifieds & Listings - Telangana.live',
    description: 'Find local housing rentals, second-hand items, service provider listings, and neighborhood directories.',
    h1: 'Telangana Community Classifieds Board',
    h2s: ['Local Housing & Apartment Rentals', 'Second-hand Vehicles & Household Sales', 'Professional Services & Local Trade'],
    content: `Browse local listings, property rentals, and community trade postings on our Telangana Classifieds Board. Local exchanges help build community connections; we provide a free space for residents to share information about housing, items for sale, and professional services.

Find apartment rentals, search for second-hand electronics or vehicles, and locate local service providers (like plumbers, electricians, or tutors) in your neighborhood. All listings are organized by district and mandal, helping you find deals and services close to home.`
  },
  '/hacks': {
    title: 'Telangana Citizen Life Hacks & Survival Guides - Telangana.live',
    description: 'Read tips and life hacks on navigating local bureaucracy, utility savings, and public transit shortcuts.',
    h1: 'Telangana Citizen Bureaucracy Life Hacks',
    h2s: ['Navigating Public Offices & Kiosks', 'Reducing Utility & Power Bills', 'Public Transport Savings & Hacks'],
    content: `Read practical life hacks and tips on navigating daily administrative tasks and public services in Telangana. Dealing with bureaucracy can be time-consuming; our guides offer shortcuts to help you complete registrations and save money on utilities.

Learn how to get certificates faster at MeeSeva kiosks, check for electricity slab rate optimization to reduce power bills, and use transit apps to bypass ticket counters. These user-submitted guides help you save time and money while navigating public infrastructure.`
  },
  '/insights': {
    title: 'Telangana Statnostics & Data Visualizations - Telangana.live',
    description: 'Browse data dashboards on air quality, transit loads, price indices, and public health metrics.',
    h1: 'Telangana Civic Data & Analytics Hub',
    h2s: ['Air Quality Index (AQI) Dashboards', 'Public Transit Passenger Load Metrics', 'Commodity Price Trend Analysis'],
    content: `Explore civic data trends and statistics on our Telangana Statnostics dashboard. Data helps explain public performance; we compile open datasets from government agencies, presenting them in interactive, visual formats to track developmental progress.

Monitor air quality indexes across Hyderabad, track daily transit loads on the metro and local bus networks, and review price indices for essential food items. Access municipal budget analytics to understand where development funds are utilized in your district.`
  },
  '/deep-dives': {
    title: 'Telangana Deep Dives - Long-form Civic Stories - Telangana.live',
    description: 'Read analytical reporting and long-form investigative journalism on regional development projects.',
    h1: 'Telangana Investigative Civic Reporting',
    h2s: ['Infrastructure Project Audits', 'Water Management & Canal Studies', 'Urban Expansion & Civic Challenges'],
    content: `Read long-form investigative articles and deep-dive audits on developmental projects and civic policies in Telangana. Quality reporting helps examine public policy; we provide detailed analyses of infrastructure works, environmental projects, and civic administration.

Our articles cover topics such as the impact of the Kaleshwaram Lift Irrigation project, urban drainage systems in Hyderabad, traffic management strategies, and public health campaigns. We review project timelines, expense records, and community impact to promote constructive civic awareness.`
  },
  '/privacy': {
    title: 'Privacy Policy - Telangana.live',
    description: 'Understand how Telangana.live handles site traffic data, analytics, and user privacy.',
    h1: 'Telangana.live Website Privacy Policy',
    h2s: ['Information Curation & Data Collection', 'Cookies & Traffic Analytics Tracking', 'User Data Protection & Security'],
    content: `Read the Privacy Policy for Telangana Live. We are committed to protecting your privacy while you use our independent civic portal. This policy explains what information we collect, how we use it, and how we protect your personal data when you visit our website.

We collect standard, non-personal traffic logs using analytics services to understand site usage and improve content. We do not sell or share user data with third parties. All personal details provided during feedback or notifications are stored securely and used only for communication purposes.`
  },
  '/terms': {
    title: 'Terms of Service - Telangana.live',
    description: 'Review terms and usage guidelines for using the Telangana Live civic intelligence portal.',
    h1: 'Telangana.live Website Terms of Service',
    h2s: ['Acceptable Use & User Guidelines', 'Disclaimer of Official Affiliation', 'Intellectual Property & Content Use'],
    content: `Review the Terms of Service for using Telangana Live. By accessing our website, you agree to comply with these terms. We provide helper information, news curation, and directory guides for public convenience; please read these terms to understand your usage rights and limitations.

We state that Telangana.live is an independent website and has no official affiliation with any government department. While we aim for accuracy, we do not guarantee the completeness or reliability of the information. Users are advised to confirm critical details on official government portals before taking action.`
  }
};

function getDistrictContent(slug, info) {
  const title = info.title;
  const subtitle = info.subtitle;
  const districtName = info.district;

  return {
    title: `${title} News, Civic Services & Local Rates - Telangana.live`,
    description: `Get the latest ${title} news today, local updates, daily rates, power alerts, and government services in ${districtName}.`,
    h1: `${title} — Real-Time Civic Portal`,
    h2s: ['Local News & Regional Bulletins', 'MeeSeva & Public Services in ' + districtName, 'Daily Rates & Weather Outlook'],
    content: `Welcome to the official real-time civic portal for ${title} on Telangana Live. This dedicated portal provides hyper-local updates, civic notifications, daily commodity rates, and emergency public services specifically tailored for the residents of ${districtName} district. 

Our portal ensures that citizens have immediate, mobile-first access to essential information without having to navigate multiple, siloed government websites. Whether you are looking for local news updates, municipal announcements, or public utility services, this page aggregates all relevant resources in one convenient dashboard.

### Local News, Regional Briefings & Civic Announcements
Stay informed with our automated news monitoring engine, which curates the latest updates, breaking news, traffic alerts, and civic notifications across ${districtName} and nearby areas. We cover important topics including municipal council updates, public safety warnings, transit schedules, and localized administrative announcements. Our platform keeps you connected to what is happening in your immediate neighborhood.

### Daily Civic Indicators & Market Rates in ${districtName}
Track standard market rates and resource levels updated throughout the day. Access current gold and silver rates in Hyderabad and Telangana, monitor local fuel prices (petrol and diesel), and review price trends for essential commodities. You can also view real-time updates on regional water reservoir levels, including capacities, inflows, and outflows for major dams in the state, ensuring you stay informed about crucial resource management.

### Government Schemes, MeeSeva Portal & Public Utilities
Explore a detailed directory of active Telangana government welfare schemes, including eligibility criteria, required documentation, and application instructions. This portal offers direct pathways to calculate property tax, check ration PDS card distribution schedules, search for local jobs, and access public health details for neighborhood Basthi Dawakhana clinics. Our goal is to make public services transparent and accessible for everyone in ${districtName}.`
  };
}

function prerenderRoute(routePath, meta) {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error(`❌ Template not found at: ${TEMPLATE_PATH}. Run vite build first.`);
    return;
  }

  let html = fs.readFileSync(TEMPLATE_PATH, 'utf8');

  // Strip existing noscript blocks to prevent duplicate H1/content
  html = html.replace(/<noscript>[\s\S]*?<\/noscript>/gi, '');

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/, `<title>${meta.title}</title>`);

  // Replace Description
  const metaDescRegex = /<meta[^>]+name=["']description["'][^>]*>/i;
  const newMetaDesc = `<meta name="description" content="${meta.description}" />`;
  if (metaDescRegex.test(html)) {
    html = html.replace(metaDescRegex, newMetaDesc);
  } else {
    html = html.replace('</head>', `  ${newMetaDesc}\n</head>`);
  }

  // Replace Canonical Link
  const canonicalUrl = `${BASE_URL}${routePath}`;
  const canonicalRegex = /<link[^>]+rel=["']canonical["'][^>]*>/i;
  const newCanonical = `<link rel="canonical" href="${canonicalUrl}" />`;
  if (canonicalRegex.test(html)) {
    html = html.replace(canonicalRegex, newCanonical);
  } else {
    html = html.replace('</head>', `  ${newCanonical}\n</head>`);
  }

  // Replace Social Metadata (Open Graph & Twitter Cards)
  html = html.replace(/<meta\s+(?:property|name)=["']og:url["']\s+content=["'].*?["']\s*\/?>/gi, `<meta property="og:url" content="${canonicalUrl}" />`);
  html = html.replace(/<meta\s+(?:property|name)=["']og:title["']\s+content=["'].*?["']\s*\/?>/gi, `<meta property="og:title" content="${meta.title}" />`);
  html = html.replace(/<meta\s+(?:property|name)=["']og:description["']\s+content=["'].*?["']\s*\/?>/gi, `<meta property="og:description" content="${meta.description}" />`);
  html = html.replace(/<meta\s+(?:property|name)=["']twitter:url["']\s+content=["'].*?["']\s*\/?>/gi, `<meta property="twitter:url" content="${canonicalUrl}" />`);
  html = html.replace(/<meta\s+(?:property|name)=["']twitter:title["']\s+content=["'].*?["']\s*\/?>/gi, `<meta property="twitter:title" content="${meta.title}" />`);
  html = html.replace(/<meta\s+(?:property|name)=["']twitter:description["']\s+content=["'].*?["']\s*\/?>/gi, `<meta property="twitter:description" content="${meta.description}" />`);

  // Inject dynamic structured data in head
  let schemaHtml = '';
  if (meta.districtName) {
    // District schema
    schemaHtml = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "AdministrativeArea",
      "name": "${meta.districtName}",
      "description": "${meta.description}",
      "containedInPlace": {
        "@type": "State",
        "name": "Telangana",
        "sameAs": "https://en.wikipedia.org/wiki/Telangana"
      }
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://telangana.live/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "${meta.districtName}",
          "item": "${canonicalUrl}"
        }
      ]
    }
    </script>
    `;
  }
  if (schemaHtml) {
    html = html.replace('</head>', `${schemaHtml}\n</head>`);
  }

  // Format body content
  const headingListHtml = meta.h2s.map(h2 => `<h2>${h2}</h2>`).join('\n');
  const formattedContent = meta.content
    .split('\n\n')
    .map(p => p.startsWith('###') ? `<h3>${p.replace('###', '').trim()}</h3>` : `<p>${p.trim()}</p>`)
    .join('\n');

  const noscriptHtml = `
      <noscript>
        <div class="seo-noscript-container" style="padding: 24px; max-width: 800px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #f5f5f7; line-height: 1.6;">
          <h1>${meta.h1}</h1>
          ${formattedContent}
          ${headingListHtml}
          <h3>Navigational Links</h3>
          <ul>
            <li><a href="https://telangana.live/dashboard">Civic Intelligence Dashboard</a></li>
            <li><a href="https://telangana.live/news">Live Municipal News & Briefings</a></li>
            <li><a href="https://telangana.live/rates/gold">Today's Gold & Silver Rates in Hyderabad</a></li>
            <li><a href="https://telangana.live/rates/fuel">Current Petrol & Diesel Prices in Telangana</a></li>
            <li><a href="https://telangana.live/schemes">Telangana Government Schemes Directory</a></li>
            <li><a href="https://telangana.live/emergency-contacts">Emergency Helplines & SOS Contacts</a></li>
            <li><a href="https://telangana.live/reservoirs">Reservoir Levels & Storage Monitor</a></li>
            <li><a href="https://telangana.live/meeseva">MeeSeva Online Citizen Services Guide</a></li>
          </ul>
        </div>
      </noscript>
  `;

  // Inject inside #root under the loading spinner
  const rootRegex = /(<div\s+id=["']root["'][^>]*>([\s\S]*?)<\/div>)/i;
  const rootMatch = html.match(rootRegex);
  if (rootMatch) {
    const rootOpening = rootMatch[0].split('>')[0] + '>';
    const rootInner = rootMatch[2];
    const newRootHtml = `${rootOpening}${rootInner}${noscriptHtml}</div>`;
    html = html.replace(rootMatch[0], newRootHtml);
  }

  // Write file
  const routeFolder = path.join(DIST_DIR, routePath);
  fs.mkdirSync(routeFolder, { recursive: true });
  const outputFilePath = path.join(routeFolder, 'index.html');
  fs.writeFileSync(outputFilePath, html);
  console.log(`  ✅ Pre-rendered route: ${routePath} -> ${outputFilePath}`);
}

// Function to pre-render dynamic guides from markdown documents
function prerenderDynamicGuides() {
  const docsDir = path.join(__dirname, '../src/content/docs');
  if (!fs.existsSync(docsDir)) return;

  const categories = fs.readdirSync(docsDir);
  categories.forEach(categoryDir => {
    const categoryPath = path.join(docsDir, categoryDir);
    if (fs.statSync(categoryPath).isDirectory()) {
      const files = fs.readdirSync(categoryPath);
      const categorySlug = categoryDir.replace(/^\d+-/, '');
      const categoryName = categorySlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      files.forEach(file => {
        if (file.endsWith('.md')) {
          const fileSlug = file.replace(/\.md$/, '');
          const filePath = path.join(categoryPath, file);
          const markdownContent = fs.readFileSync(filePath, 'utf8');

          // Simple Markdown Parsing
          const lines = markdownContent.split('\n');
          let pageTitle = '';
          const headings = [];
          const paragraphs = [];
          
          let currentParagraph = [];
          lines.forEach(line => {
            const cleanLine = line.trim();
            if (!cleanLine) {
              if (currentParagraph.length > 0) {
                paragraphs.push(currentParagraph.join(' '));
                currentParagraph = [];
              }
              return;
            }

            if (cleanLine.startsWith('# ')) {
              pageTitle = cleanLine.replace('# ', '').trim();
            } else if (cleanLine.startsWith('## ')) {
              headings.push(cleanLine.replace('## ', '').trim());
            } else if (cleanLine.startsWith('- ') || cleanLine.startsWith('* ') || /^\d+\./.test(cleanLine)) {
              currentParagraph.push(cleanLine);
            } else if (!cleanLine.startsWith('---') && !cleanLine.startsWith('>')) {
              currentParagraph.push(cleanLine);
            }
          });
          if (currentParagraph.length > 0) {
            paragraphs.push(currentParagraph.join(' '));
          }

          const pageHeading = pageTitle || fileSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          const title = `${pageHeading} Guide - ${categoryName} - Telangana.live`;
          const description = paragraphs[0] 
            ? paragraphs[0].substring(0, 150) + '...'
            : `Read our comprehensive citizen's helper guide on ${pageHeading} under the ${categoryName} directory.`;

          const contentText = paragraphs.join('\n\n');
          const routePath = `/services/${categorySlug}/${fileSlug}`;

          prerenderRoute(routePath, {
            title,
            description,
            h1: pageHeading,
            h2s: headings.slice(0, 3),
            content: contentText
          });
        }
      });
    }
  });
}

function main() {
  console.log('Starting static route pre-rendering (SSG)...');

  // 1. Pre-render Static Routes
  Object.keys(staticRouteMeta).forEach(route => {
    prerenderRoute(route, staticRouteMeta[route]);
  });

  // 2. Pre-render District Routes
  Object.keys(districts).forEach(slug => {
    const route = `/${slug}`;
    const meta = getDistrictContent(slug, districts[slug]);
    meta.districtName = districts[slug].district;
    prerenderRoute(route, meta);
  });

  // 3. Pre-render Dynamic Guide Documents (SSG)
  prerenderDynamicGuides();

  console.log('✅ Pre-rendering completed successfully!');
}

main();
