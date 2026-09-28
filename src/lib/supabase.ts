import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nsefeeocunphxynutjhj.supabase.co';
const supabaseAnonKey = 'sb_publishable_f3DorCu_lwHKYcyQa5XS8A_v-flrmah';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
