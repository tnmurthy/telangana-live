import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
    insert() { return Promise.resolve({ data: null, error: null }); },
};
const mockClient = {
    from: () => mockQuery,
    channel: () => mockChannel,
};

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. Live data features will be unavailable.');
}

export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : mockClient;
