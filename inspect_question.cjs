const fs = require('fs');
const data = JSON.parse(fs.readFileSync('game_content_export.json', 'utf8'));
const rabat = data.find(c => c.city_id === 'rabat');

function inspectQuestion(id) {
  for (const m of rabat.missions) {
    const q = m.exercises.find(ex => ex.id === id);
    if (q) {
      console.log(JSON.stringify(q, null, 2));
      return;
    }
  }
  console.log('Not found:', id);
}

inspectQuestion(process.argv[2] || '047e74f0-116d-4e05-9ff0-f14125630b1d');
