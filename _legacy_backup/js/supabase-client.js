// supabase-client.js
// Supabase connection setup

const SUPABASE_URL = 'https://lcudchwoimjpatbxgsho.supabase.co';
const SUPABASE_KEY = 'sb_publishable_F1v0RXWHEr-MCYlJaue4SA_SVjYHHAd';

// Create a single supabase client for interacting with your database
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
