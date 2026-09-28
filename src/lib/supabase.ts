import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bcjkvouxkscmtkehfvtn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjamt2b3V4a3NjbXRrZWhmdnRuIiwicm9sZSI6ImFub24iLCJpWFAtcCI6ImV5...';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);