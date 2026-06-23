import { supabase } from './supabaseClient';

const MOCK_CLASSIFIEDS = [
    {
        id: 'c-1',
        category: 'Electronics',
        title: 'Sony PlayStation 5 (Used 3 months)',
        price: 38000,
        description: 'Selling my PS5 Disc Edition. Excellent condition, comes with 1 controller and Spider-Man 2.',
        whatsapp_number: '919876543210',
        lat: 17.4326, // Jubilee Hills approx
        lng: 78.4072,
        ward: 'Jubilee Hills',
        image_url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=400',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 72 * 3600000).toISOString()
    },
    {
        id: 'c-2',
        category: 'Vehicles',
        title: 'Royal Enfield Classic 350',
        price: 120000,
        description: '2019 Model, 15000 kms run. Single owner, insurance active till Dec.',
        whatsapp_number: '919876543211',
        lat: 17.4474, // Madhapur approx
        lng: 78.3762,
        ward: 'Madhapur',
        image_url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=400',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        expires_at: new Date(Date.now() + 48 * 3600000).toISOString()
    },
    {
        id: 'c-3',
        category: 'Furniture',
        title: 'IKEA 3-Seater Sofa',
        price: 15000,
        description: 'Grey color, very clean. Selling because moving out of city.',
        whatsapp_number: '919876543212',
        lat: 17.4401, // Banjara Hills approx
        lng: 78.4483,
        ward: 'Banjara Hills',
        image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400',
        created_at: new Date(Date.now() - 40000000).toISOString(),
        expires_at: new Date(Date.now() + 12 * 3600000).toISOString()
    }
];

export const classifiedsService = {
    async getActiveClassifieds() {
        if (!supabase) return MOCK_CLASSIFIEDS;
        
        try {
            const { data, error } = await supabase
                .from('smart_classifieds')
                .select('*')
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data && data.length > 0 ? data : MOCK_CLASSIFIEDS;
        } catch (error) {
            console.error('Error fetching classifieds:', error);
            return MOCK_CLASSIFIEDS;
        }
    },

    async postClassified(rawText, lat, lng, ward, whatsapp) {
        // AI parsing simulation for MVP (In production, this hits our backend)
        const categoryMatch = rawText.toLowerCase().match(/(bike|car|enfield|scooter|vehicle)/) ? 'Vehicles' : 
                             rawText.toLowerCase().match(/(sofa|bed|chair|table)/) ? 'Furniture' : 
                             rawText.toLowerCase().match(/(laptop|phone|tv|ps5|xbox)/) ? 'Electronics' : 'Miscellaneous';
                             
        // Extract numbers for price (simple regex for MVP)
        const priceMatch = rawText.match(/\d+(?:,\d+)*(?:\.\d+)?/);
        let parsedPrice = 0;
        if (priceMatch) {
            parsedPrice = parseInt(priceMatch[0].replace(/,/g, ''), 10);
        }

        const payload = {
            title: rawText.substring(0, 30) + '...',
            description: rawText,
            category: categoryMatch,
            price: parsedPrice,
            lat,
            lng,
            ward,
            whatsapp_number: whatsapp,
            status: 'active'
        };

        if (!supabase) {
            console.log('Mock inserting classified:', payload);
            return { id: `MOCK-${Date.now()}`, ...payload };
        }

        try {
            const { data, error } = await supabase
                .from('smart_classifieds')
                .insert([payload])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error posting classified:', error);
            return { id: `ERROR-${Date.now()}`, ...payload };
        }
    }
};
