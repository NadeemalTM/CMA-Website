const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\INTERN_01\\.gemini\\antigravity\\brain\\cadfddcb-89cb-4395-ae40-39338393afad\\.system_generated\\logs\\transcript.jsonl';

if (!fs.existsSync(logPath)) {
  console.log('Transcript log not found at ' + logPath);
  process.exit(1);
}

const rl = readline.createInterface({
  input: fs.createReadStream(logPath),
  output: process.stdout,
  terminal: false
});

let lineCount = 0;
rl.on('line', (line) => {
  lineCount++;
  try {
    const step = JSON.parse(line);
    const content = step.content || '';
    if (content.toLowerCase().includes('kataragama') || content.toLowerCase().includes('bangalow') || content.toLowerCase().includes('booking')) {
      console.log(`[Step ${step.step_index || lineCount}] Source: ${step.source}, Type: ${step.type}`);
      // Print first 500 characters of matching content
      console.log(content.substring(0, 800) + '...\n');
    }
  } catch (err) {
    // console.error('Failed to parse line', err);
  }
});
