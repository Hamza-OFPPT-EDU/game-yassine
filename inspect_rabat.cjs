const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('game_content_export.json', 'utf8'));
const rabat = data.find(c => c.city_id === 'rabat');

console.log('City:', rabat.name_fr);
console.log('Missions:');
rabat.missions.forEach((m, idx) => {
  console.log(`${idx + 1}. [${m.id}] ${m.title_fr} (${m.type})`);
  console.log(`   - Exercises:`);
  m.exercises.forEach((ex, eIdx) => {
    console.log(`     ${idx + 1}.${eIdx + 1} [${ex.id}] ${ex.type}: ${ex.question_fr.substring(0, 60)}...`);
  });
});
