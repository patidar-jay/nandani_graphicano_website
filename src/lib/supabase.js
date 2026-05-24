import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lcudchwoimjpatbxgsho.supabase.co';
const SUPABASE_KEY = 'sb_publishable_F1v0RXWHEr-MCYlJaue4SA_SVjYHHAd';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
