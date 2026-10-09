-- Applied to Talia on 2026-10-09.
-- These eight tables had RLS off. anon/authenticated hold no grants on them and
-- the site's jobs use the service role (which bypasses RLS), so enabling RLS
-- with no policies changes no access today; it closes the gap if a grant is
-- ever added.
ALTER TABLE telangana.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE telangana.constituencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE telangana.schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE telangana.tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE telangana.news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE telangana.grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE telangana.budget_heads ENABLE ROW LEVEL SECURITY;
ALTER TABLE telangana.scraper_log ENABLE ROW LEVEL SECURITY;
