const fs = require('fs');
const data = JSON.parse(fs.readFileSync('game_content_export.json', 'utf8'));
const rabat = data.find(c => c.city_id === 'rabat');

for (const m of rabat.missions) {
  for (const ex of m.exercises) {
    if (ex.type === 'ranking' || ex.type === 'team_roles' || ex.type === 'matching' || ex.type === 'error_detection') {
      console.log(`Mission: ${m.title_fr}, ID: ${ex.id}, Type: ${ex.type}`);
      console.log(`Question: ${ex.question_fr}`);
      console.log(`Explanation: ${ex.explanation.fr}`);
      console.log(`Correct Answer: ${ex.correct_answer}`);
      console.log(`Options:`, JSON.stringify(ex.options, null, 2));
      console.log('---');
    }
  }
}
