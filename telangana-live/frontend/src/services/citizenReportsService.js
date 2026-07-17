import { supabase } from './supabaseClient';

export const citizenReportsService = {
  /**
   * Fetch only approved reports for the public map
   */
  async getApprovedReports() {
    try {
      const { data, error } = await supabase
        .from('citizen_reports')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching citizen reports:', error);
      return [];
    }
  },

  /**
   * Submit a new citizen report; returns the created row (with tracking id).
   */
  async submitReport(reportData) {
    if (!supabase) {
      // Offline / no credentials – return a local mock tracking id
      return { id: `LOCAL-${Date.now()}`, status: 'pending_moderation' };
    }
    try {
      const payload = {
        category: reportData.category,
        description: reportData.description,
        lat: reportData.lat,
        lng: reportData.lng,
        ward: reportData.ward,
        corporation: reportData.corporation,
        status: 'pending_moderation',
        photo_url: reportData.photo || null,
        created_at: new Date().toISOString(),
      };
      const { data, error } = await supabase
        .from('citizen_reports')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error submitting citizen report:', error);
      // Graceful degradation: still give the user a local id
      return { id: `LOCAL-${Date.now()}`, status: 'pending_moderation' };
    }
  },

  /**
   * Subscribe to new approved reports (Realtime)
   */
  subscribeToReports(onNewReport) {
    // Realtime updates are unavailable when Supabase credentials are not configured
    if (!supabase) return null;
    return supabase
      .channel('public:citizen_reports')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'citizen_reports', filter: 'status=eq.approved' },
        (payload) => onNewReport(payload.new)
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'citizen_reports', filter: 'status=eq.approved' },
        (payload) => onNewReport(payload.new)
      )
      .subscribe();
  }
};
