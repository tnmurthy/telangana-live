-- Resolved reports were approved first; keep them public so the grievance
-- dashboard can show real resolution figures (TL-19). Pending and rejected
-- reports stay private.
DROP POLICY IF EXISTS "read approved reports" ON telangana.citizen_reports;
CREATE POLICY "read published reports" ON telangana.citizen_reports
    FOR SELECT TO anon, authenticated USING (status IN ('approved', 'resolved'));
