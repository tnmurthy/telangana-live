import { supabase } from './supabaseClient';

// Listings come only from the database. The old fallback showed three
// invented listings with made-up WhatsApp numbers whenever the list was
// empty or failed to load (docs/DATA_STANDARDS.md, rule 1).

export const classifiedsService = {
    async getActiveClassifieds() {
        try {
            const { data, error } = await supabase
                .from('smart_classifieds')
                .select('*')
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching classifieds:', error);
            return [];
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
            status: 'active',
            // Featuring is a paid upgrade; the public key may not set it
            // (RLS policy "post unfeatured classified").
            is_featured: false
        };

        // The public key cannot read rows back under RLS, so the row the page
        // shows is built here. Returns null when the listing was not saved.
        const now = new Date();
        const row = {
            id: crypto.randomUUID(),
            ...payload,
            created_at: now.toISOString(),
            expires_at: new Date(now.getTime() + 7 * 86400000).toISOString(),
        };
        const { error } = await supabase.from('smart_classifieds').insert([row]);
        if (error) {
            console.error('Error posting classified:', error);
            return null;
        }
        return row;
    }
};
