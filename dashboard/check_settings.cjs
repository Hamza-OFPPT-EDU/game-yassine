const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Try to find Supabase credentials
const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5ZG1lZnVkcGN6cHhycmVzZmx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzODY3MzgsImV4cCI6MjA4OTk2MjczOH0.J5hl1AbF_WcF1Kr8MPDC501eDc2MJeeL4OxJiaE0-6c';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSettings() {
  const { data, error } = await supabase
    .from('app_settings')
    .select('*');
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Current Settings:');
    console.table(data);
  }
}

checkSettings();
