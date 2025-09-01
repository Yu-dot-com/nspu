import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://hjgbaakpsgllnjgkjmmh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqZ2JhYWtwc2dsbG5qZ2tqbW1oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzE5MjM2NywiZXhwIjoyMDY4NzY4MzY3fQ.EXzYv5dYOfYE22bLYRdCWl8_RMb9PW10X6YfJUr95YE';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseKey,{
  auth:{persistSession:true,autoRefreshToken:false}
});

export default supabaseAdmin;