import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('supabase_url');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('supabase_key');

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Fail gracefully if keys are missing to prevent hard crash on app boot
// Using a Proxy to avoid "cannot read property from of null" while configuring
const dummyAuth = {
  getSession: () => Promise.resolve({ data: { session: null } }),
  onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  signInWithOAuth: () => Promise.reject("Supabase not configured"),
  signInWithPassword: () => Promise.reject("Supabase not configured"),
  signUp: () => Promise.reject("Supabase not configured"),
  signOut: () => Promise.resolve()
};

const dummyClient = {
  from: () => ({
    select: () => ({
      order: () => Promise.resolve({ data: [] }),
      eq: () => ({ 
        single: () => Promise.resolve({ data: null }),
        order: () => Promise.resolve({ data: [] })
      }),
      gt: () => ({ order: () => Promise.resolve({ data: [] }) }),
    }),
    insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: { id: 'temp' } }) }) }),
    upsert: () => Promise.resolve({ error: null }),
    update: () => ({ eq: () => Promise.resolve({ error: null }) }),
  }),
  channel: () => ({
    on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
    subscribe: () => ({ unsubscribe: () => {} }),
  }),
  auth: dummyAuth,
  removeChannel: () => {}
};

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : dummyClient as any;

if (!supabase) {
  console.warn("Supabase configuration missing. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.");
}
