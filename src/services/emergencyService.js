import { supabase } from './supabaseClient';

/**
 * Emergency Service
 * Handles fetching and updating the global emergency status from Supabase.
 */
export const emergencyService = {
    /**
     * Fetch the current global emergency status
     */
    async getStatus() {
        try {
            const { data, error } = await supabase
                .from('emergency_status')
                .select('*')
                .eq('id', 1)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching emergency status:', error.message);
            return { active: false, type: 'none', severity: 'low' };
        }
    },

    /**
     * Subscribe to realtime updates for emergency status
     * @param {function} onUpdate - Callback function when status changes
     */
    subscribe(onUpdate) {
        // Realtime updates are unavailable when Supabase credentials are not configured
        if (!supabase) return null;
        return supabase
            .channel('emergency-changes')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'emergency_status' },
                (payload) => {
                    onUpdate(payload.new);
                }
            )
            .subscribe();
    }
};
