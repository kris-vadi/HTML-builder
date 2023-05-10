const fs = require('fs');
const path = require('path');

const readFromTerminal = process.stdin;
const writeInTerminal = process.stdout;
const writeableStream = fs.createWriteStream(path.resolve(__dirname, 'text.txt'), 'utf-8');

readFromTerminal.pipe(writeableStream);

console.log('Enter text below:\n');

readFromTerminal.on('data', (chunk) => {
  const chunkStringified = chunk.toString();

  if (chunkStringified.match('exit')) {
    readFromTerminal.unpipe(writeableStream);
    console.log('Have a nice day!');
  }
})

process.on('SIGINT', () => {
  readFromTerminal.unpipe(writeableStream);
  console.log('Have a nice day!');
})
