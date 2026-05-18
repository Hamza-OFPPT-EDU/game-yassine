const fs = require('fs');
const data = JSON.parse(fs.readFileSync('game_content_export.json', 'utf8'));

for (const city of data) {
  for (const m of city.missions) {
    for (const ex of m.exercises) {
      if (ex.type === 'ranking') {
        console.log(`City: ${city.name_fr}, Mission: ${m.title_fr}, Exercise: ${ex.id}`);
        console.log(JSON.stringify(ex.options, null, 2));
      }
    }
  }
}
