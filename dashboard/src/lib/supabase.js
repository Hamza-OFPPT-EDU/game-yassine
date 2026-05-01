import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rydmefudpczpxrresflx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5ZG1lZnVkcGN6cHhycmVzZmx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzODY3MzgsImV4cCI6MjA4OTk2MjczOH0.J5hl1AbF_WcF1Kr8MPDC501eDc2MJeeL4OxJiaE0-6c';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
