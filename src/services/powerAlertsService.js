import { supabase } from './supabaseClient';

export const powerAlertsService = {
    /**
     * Fetches real-time power alerts from Supabase.
     * Schema: id, area, from_time, to_time, reason, source_url, created_at
     */
    async getActiveAlerts() {
        try {
            const { data, error } = await supabase
                .from('power_alerts')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) throw error;

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
            return [];
        }
    }
};
