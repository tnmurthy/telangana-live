import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// The site's tables live in this schema of a Supabase project shared with
// other apps (supabase/migrations/20261004_telangana_schema.sql).
export const SUPABASE_SCHEMA = 'telangana';

// Minimal no-op mock used when credentials are not configured.
// This prevents a module-level crash (createClient throws if URL is missing)
// while still allowing all services to degrade gracefully.
const mockSubscription = { unsubscribe: () => {} };
const mockChannel = {
    on() { return this; },
    subscribe: () => mockSubscription,
};
const mockQuery = {
    select() { return this; },
    eq() { return this; },
    order() { return this; },
    limit() { return Promise.resolve({ data: [], error: null }); },
    single() { return Promise.resolve({ data: null, error: null }); },
    insert() { return Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }); },
};
const mockClient = {
    from: () => mockQuery,
    channel: () => mockChannel,
};

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. Emergency status and power alerts will use defaults.');
}

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey, { db: { schema: SUPABASE_SCHEMA } })
    : mockClient;
