// Search titles and descriptions for routes whose page sets none, and the
// canonical URL for every route. index.html used to carry one fixed
// canonical ("/"), which told search engines every page was the home page.
// Pages with their own <Helmet> title still win: they render later.

export const ORIGIN = 'https://www.telangana.live';

export const STATIC_META = {
    '/transport/metro': ['Hyderabad Metro', 'Hyderabad Metro Rail lines, stations and timings.'],
    '/health/basthi-dawakhana': ['Basthi Dawakhana Clinics', 'Free Basthi Dawakhana neighbourhood clinics in Hyderabad: services and how to use them.'],
    '/emergency-contacts': ['Emergency Numbers in Telangana', 'Police, ambulance, fire, women and disaster helplines for Telangana.'],
    '/emergency': ['Emergency Numbers in Telangana', 'Police, ambulance, fire, women and disaster helplines for Telangana.'],
    '/water-supply': ['Water Supply in Hyderabad', 'HMWSSB water supply schedules and updates for Hyderabad.'],
    '/ration-pds': ['Ration Cards & PDS in Telangana', 'Ration card services and public distribution system information for Telangana.'],
    '/jobs': ['Jobs in Telangana', 'Government and private job openings in Telangana, with closing dates.'],
    '/events': ['Events & Holidays in Telangana', 'Festivals, public holidays and events in Telangana.'],
    '/panchang': ["Today's Panchang", 'Daily Telugu panchang for Hyderabad: tithi, nakshatra, sunrise and sunset.'],
    '/budget': ['Telangana Budget Tracker', 'How the Telangana state budget is allocated across departments.'],
    '/politicians': ['Telangana MLAs & MPs', 'Elected representatives for Telangana constituencies.'],
    '/property-tax': ['GHMC Property Tax', 'How to check and pay GHMC property tax in Hyderabad.'],
    '/schemes': ['Government Schemes in Telangana', 'Central and Telangana government schemes and who is eligible.'],
    '/report': ['Report a Civic Issue', 'Report potholes, garbage, water and streetlight problems in Telangana.'],
    '/weather': ['Weather in Telangana', 'Current weather and forecasts for Hyderabad and Telangana districts.'],
    '/weather/forecast': ['Telangana Weather Forecast', 'Weather forecast for Hyderabad and Telangana districts.'],
    '/reservoirs': ['Telangana Reservoir Levels', 'Water levels in Telangana reservoirs, with the date of each reading.'],
    '/parks': ['Parks in Hyderabad', 'Parks and green spaces in Hyderabad.'],
    '/farmers': ['Farmers Portal: Telangana', 'Mandi prices, schemes and resources for farmers in Telangana.'],
    '/meeseva': ['MeeSeva Services', 'MeeSeva services in Telangana: what you can apply for and how.'],
    '/classifieds': ['Classifieds in Telangana', 'Local classifieds in Telangana.'],
    '/privacy': ['Privacy Policy', 'How Telangana.live collects and uses data, including advertising cookies.'],
    '/terms': ['Terms of Service', 'Terms of use for Telangana.live.'],
    '/services': ['Telangana Government Services Guide', 'Step-by-step guides to certificates, bills, land, pensions, police and other government services in Telangana.'],
};

// Never indexed: internal tools and search result pages.
const NOINDEX_PREFIXES = ['/admin', '/search'];

export function canonicalFor(pathname) {
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : '/';
    return `${ORIGIN}${path}`;
}

export function isNoIndex(pathname) {
    return NOINDEX_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** First prose paragraph of a guide, trimmed to a search-snippet length. */
export function guideDescription(markdown, max = 155) {
    const para = markdown
        .split(/\n\s*\n/)
        .map((block) => block.trim())
        .find((block) => block && !block.startsWith('#') && !block.startsWith('-') && !block.startsWith('|'));
    if (!para) return '';
    const text = para.replace(/\s+/g, ' ').replace(/[*_`]/g, '');
    if (text.length <= max) return text;
    return `${text.slice(0, text.lastIndexOf(' ', max - 1))}…`;
}
