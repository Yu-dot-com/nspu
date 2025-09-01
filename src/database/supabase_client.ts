import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hjgbaakpsgllnjgkjmmh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqZ2JhYWtwc2dsbG5qZ2tqbW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxOTIzNjcsImV4cCI6MjA2ODc2ODM2N30.lfDwDDhuNaRZaxymL9ZIMEbFYilQggcDE27pM6moY8o';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey,{
  auth:{persistSession:true,autoRefreshToken:false}
});

export default supabase;