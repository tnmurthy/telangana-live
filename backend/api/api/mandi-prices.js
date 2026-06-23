// api/mandi-prices.js - Vercel Edge Function
// Fetches live mandi/crop prices for Telangana from CEDA Agmarknet API

export const config = { runtime: 'edge' };

const TELANGANA_MARKETS = [
  'Hyderabad',
  'Warangal',
  'Karimnagar',
  'Nizamabad',
  'Khammam'
];

const KEY_COMMODITIES = [
  'Rice',
  'Paddy',
  'Cotton',
  'Maize',
  'Red Gram',
  'Jowar',
  'Tomato',
  'Onion',
  'Potato',
  'Chilli'
];

// FALLBACK data when API fails (sample data for Hyderabad)
const FALLBACK = {
  market: 'Hyderabad',
  date: new Date().toISOString().split('T')[0],
  commodities: [
    { name: 'Rice', minPrice: 2800, maxPrice: 3200, modalPrice: 3000, unit: 'Quintal' },
    { name: 'Tomato', minPrice: 1500, maxPrice: 2000, modalPrice: 1800, unit: 'Quintal' },
    { name: 'Onion', minPrice: 1200, maxPrice: 1600, modalPrice: 1400, unit: 'Quintal' },
    { name: 'Potato', minPrice: 1800, maxPrice: 2200, modalPrice: 2000, unit: 'Quintal' },
    { name: 'Chilli', minPrice: 8000, maxPrice: 12000, modalPrice: 10000, unit: 'Quintal' }
  ],
  lastUpdated: new Date().toISOString(),
  source: 'fallback'
};

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const market = searchParams.get('market') || 'Hyderabad';
    const commodity = searchParams.get('commodity') || null;

    // CEDA Agmarknet API endpoint
    const apiUrl = 'https://api.ceda.ashoka.edu.in/v1/agmarknet/prices';
    
    // Build query parameters
    const params = new URLSearchParams({
      state: 'Telangana',
      market: market,
      limit: '10'
    });

    if (commodity) {
      params.append('commodity', commodity);
    }

    const response = await fetch(`${apiUrl}?${params}`, {
      headers: {
        'User-Agent': 'Telangana.live/1.0',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Agmarknet API failed: ${response.status}`);
    }

    const data = await response.json();

    // Process and structure the data
    const processedData = {
      market: market,
      state: 'Telangana',
      date: new Date().toISOString().split('T')[0],
      commodities: [],
      lastUpdated: new Date().toISOString(),
      source: 'CEDA Agmarknet',
      valid: true
    };

    // Parse API response (adjust based on actual API structure)
    if (data && data.records) {
      processedData.commodities = data.records.map(record => ({
        name: record.commodity || record.Commodity,
        variety: record.variety || record.Variety || '',
        minPrice: parseFloat(record.min_price || record.MinPrice || 0),
        maxPrice: parseFloat(record.max_price || record.MaxPrice || 0),
        modalPrice: parseFloat(record.modal_price || record.ModalPrice || 0),
        unit: record.unit || 'Quintal',
        arrivalDate: record.arrival_date || record.Date || processedData.date
      }));
    }

    // Filter for key commodities if no specific commodity requested
    if (!commodity && processedData.commodities.length > 0) {
      processedData.commodities = processedData.commodities.filter(c => 
        KEY_COMMODITIES.some(key => c.name.toLowerCase().includes(key.toLowerCase()))
      );
    }

    // Validate data has content
    if (processedData.commodities.length === 0) {
      console.warn('No commodity data found, using fallback');
      return new Response(JSON.stringify(FALLBACK), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(processedData), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=21600' // Cache for 6 hours
      }
    });

  } catch (error) {
    console.error('Mandi prices API error:', error);
    return new Response(JSON.stringify({ 
      ...FALLBACK, 
      error: error.message 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
