const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}
const files = walk('./src');
let changed = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/')) {
    content = content.replace(/https:\/\/rydmefudpczpxrresflx\.supabase\.co\/storage\/v1\/object\/public\/[^\s\'\"\`\)]+/g, (match) => {
      const parts = match.split('/');
      const name = decodeURIComponent(parts[parts.length-1]);
      return '/assets/supabase/' + name.replace(/%20/g, ' ').replace(/\s+/g, '_');
    });
    fs.writeFileSync(file, content);
    changed++;
  }
});
console.log('Replaced in ' + changed + ' files');
