import { supabase, SUPABASE_SCHEMA } from './supabaseClient';

// Under RLS the public key can insert a pending report but cannot read it
// back (only approved reports are public), so the id is made here and the
// insert does not request the row.
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
   * Submit a new citizen report. Returns { id, status } on success and null
   * on failure: never a made-up tracking id for a report that was not saved.
   */
  async submitReport(reportData) {
    const id = crypto.randomUUID();
    const payload = {
      id,
      category: reportData.category,
      description: reportData.description,
      lat: reportData.lat,
      lng: reportData.lng,
      ward: reportData.ward,
      corporation: reportData.corporation,
      status: 'pending_moderation',
      photo_url: reportData.photo || null,
    };
    const { error } = await supabase.from('citizen_reports').insert([payload]);
    if (error) {
      console.error('Error submitting citizen report:', error);
      return null;
    }
    return { id, status: 'pending_moderation' };
  },

  /**
   * Subscribe to new approved reports (Realtime)
   */
  subscribeToReports(onNewReport) {
    return supabase
      .channel('telangana:citizen_reports')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: SUPABASE_SCHEMA, table: 'citizen_reports', filter: 'status=eq.approved' },
        (payload) => onNewReport(payload.new)
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: SUPABASE_SCHEMA, table: 'citizen_reports', filter: 'status=eq.approved' },
        (payload) => onNewReport(payload.new)
      )
      .subscribe();
  }
};
