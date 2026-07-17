const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Static fallback alerts shown when API is unreachable
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
     * Fetches real-time power alerts from the Civic Gateway API.
     */
    async getActiveAlerts() {
        try {
            const response = await fetch(`${API_URL}/api/civic/alerts`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();

            if (!data || data.length === 0) return FALLBACK_ALERTS;

            // Filter for power alerts and map to frontend format
            const powerData = data.filter(item => item.type === 'power').map(item => ({
                id: `power-${item.id}`,
                message: item.message,
                time: item.time,
                type: item.type,
                link: null,
                area: item.district || 'Telangana'
            }));

            return powerData.length > 0 ? powerData : FALLBACK_ALERTS;
        } catch (error) {
            console.error('Error fetching power alerts from API:', error);
            // In a real environment, you might try Supabase as a secondary fallback here
            return FALLBACK_ALERTS;
        }
    }
};
