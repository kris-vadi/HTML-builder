const fs = require('fs');
const path = require('path');

const readFromTerminal = process.stdin;
const writeInTerminal = process.stdout;
const writeableStream =fs.createWriteStream(path.resolve(__dirname, 'text.txt'), 'utf-8');

readFromTerminal.pipe(writeableStream);

writeInTerminal.write('Enter text below:\n')

readFromTerminal.on('data', (chunk) => {
  const chunkStringified = chunk.toString();

  if (chunkStringified.match('exit')) {
    readFromTerminal.unpipe(writeableStream);
    writeInTerminal.write('Have a nice day!');
  }
})