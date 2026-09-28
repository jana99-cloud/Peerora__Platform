import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'رابط_مشروعك_في_سابابيز';
const supabaseAnonKey = 'مفتاح_الـ_anon_ الخاص بك';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
