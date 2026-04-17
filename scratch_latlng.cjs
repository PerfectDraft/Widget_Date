const fs = require('fs');

const content = fs.readFileSync('d:\\UET\\Nam_2\\KNKN\\Widget_Date\\src\\data.tsx', 'utf8');

const startIdx = content.indexOf('export const REAL_LOCATIONS = ');
if (startIdx === -1) throw new Error('Not found');

const bracketIdx = content.indexOf('[', startIdx);
const endIdx = content.lastIndexOf('];');

const arrayStr = content.substring(bracketIdx, endIdx + 1);

const locations = JSON.parse(arrayStr);

locations.forEach(loc => {
  if (loc.imageUrl) {
    const match = loc.imageUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      loc.lat = parseFloat(match[1]);
      loc.lng = parseFloat(match[2]);
    }
  }
});

const newArrayStr = JSON.stringify(locations, null, 2);
const newContent = content.substring(0, bracketIdx) + newArrayStr + content.substring(endIdx + 1);

fs.writeFileSync('d:\\UET\\Nam_2\\KNKN\\Widget_Date\\src\\data.tsx', newContent, 'utf8');
console.log('Done adding lat/lng');
