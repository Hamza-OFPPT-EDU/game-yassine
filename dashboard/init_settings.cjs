const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5ZG1lZnVkcGN6cHhycmVzZmx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzODY3MzgsImV4cCI6MjA4OTk2MjczOH0.J5hl1AbF_WcF1Kr8MPDC501eDc2MJeeL4OxJiaE0-6c';

const supabase = createClient(supabaseUrl, supabaseKey);

async function initSettings() {
  const settings = [
    {
      key: 'global_free_exploration',
      value: false,
      description: 'Active le mode exploration libre pour tous les utilisateurs (déverrouille toutes les villes et missions).'
    },
    {
      key: 'xp_multiplier',
      value: 1,
      description: 'Multiplicateur de gain d\'XP global.'
    }
  ];

  const { data, error } = await supabase
    .from('app_settings')
    .insert(settings)
    .select();
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Settings Initialized:', data);
  }
}

initSettings();
