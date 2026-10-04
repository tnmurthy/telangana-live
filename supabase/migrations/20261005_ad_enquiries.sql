-- Enquiries from the /advertise page. The public key may insert only; nobody
-- can read them except through the dashboard / service key.
CREATE TABLE telangana.ad_enquiries (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
    business   TEXT NOT NULL CHECK (char_length(business) BETWEEN 2 AND 150),
    contact    TEXT NOT NULL CHECK (char_length(contact) BETWEEN 5 AND 150),
    interest   TEXT NOT NULL CHECK (interest IN ('top_banner', 'sidebar', 'area_spotlight', 'other')),
    area       TEXT CHECK (char_length(area) <= 100),
    message    TEXT CHECK (char_length(message) <= 1500),
    status     TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE telangana.ad_enquiries ENABLE ROW LEVEL SECURITY;
GRANT INSERT ON telangana.ad_enquiries TO anon, authenticated;
GRANT ALL ON telangana.ad_enquiries TO service_role;
CREATE POLICY "submit enquiry" ON telangana.ad_enquiries
    FOR INSERT TO anon, authenticated WITH CHECK (status = 'new');
