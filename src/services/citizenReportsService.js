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
   * Subscribe to new approved reports (Realtime)
   */
  subscribeToReports(onNewReport) {
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
