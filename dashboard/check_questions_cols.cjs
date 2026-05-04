const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Try to find .env in root or dashboard
const envPath = fs.existsSync('.env') ? '.env' : '../.env';
require('dotenv').config({ path: envPath });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function getQuestionsColumns() {
  const { data, error } = await supabase.from('questions').select('*').limit(1);
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Questions columns:', data ? Object.keys(data[0] || {}) : 'No data');
}

getQuestionsColumns();
