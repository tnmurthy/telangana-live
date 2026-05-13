import { supabase } from './supabaseClient';

// Static fallback alerts shown when Supabase / Redis are not configured.
const FALLBACK_ALERTS = [
    {
        id: 'fallback-1',
        message: 'Jubilee Hills (Ward 10): Planned maintenance shutdown',
        time: '09:00 - 13:00',
        type: 'power',
        link: null,
        area: 'Jubilee Hills',
    },
    {
        id: 'fallback-2',
        message: 'Banjara Hills (Ward 15): Grid upgrade work in progress',
        time: '14:00 - 18:00',
        type: 'power',
        link: null,
        area: 'Banjara Hills',
    },
];

export const powerAlertsService = {
    /**
     * Fetches real-time power alerts from Supabase.
     * Schema: id, area, from_time, to_time, reason, source_url, created_at
     * Falls back to static demo data when Supabase is not configured.
     */
    async getActiveAlerts() {
        if (!supabase) {
            return FALLBACK_ALERTS;
        }
        try {
            const { data, error } = await supabase
                .from('power_alerts')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) throw error;

            if (!data || data.length === 0) return FALLBACK_ALERTS;

            return data.map(item => ({
                id: `power-${item.id}`,
                message: `${item.area}: Power cut due to ${item.reason}`,
                time: `${item.from_time} - ${item.to_time}`,
                type: 'power',
                link: item.source_url,
                area: item.area
            }));
        } catch (error) {
            console.error('Error fetching power alerts:', error);
            return FALLBACK_ALERTS;
        }
    }
};
