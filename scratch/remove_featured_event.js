const fs = require('fs');

// 1. Remove from index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Remove event-featured-card block
indexHtml = indexHtml.replace(/<!-- Featured Large Event -->[\s\S]*?<div class="event-featured-card">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '');

// Remove modal-event-annualday block
indexHtml = indexHtml.replace(/<div class="content-modal" id="modal-event-annualday"[\s\S]*?<\/div>\s*<\/div>/, '');

fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('index.html updated!');

// 2. Remove from events.html
let eventsHtml = fs.readFileSync('events.html', 'utf8');
eventsHtml = eventsHtml.replace(/<!-- Featured Event -->[\s\S]*?<div class="event-featured-card">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '');
fs.writeFileSync('events.html', eventsHtml, 'utf8');
console.log('events.html updated!');
