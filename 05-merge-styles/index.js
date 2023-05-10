const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'styles');
const projectPath = path.join(__dirname, 'project-dist')

const writableStream = fs.createWriteStream(path.join(projectPath, 'bundle.css'), 'utf-8');

fs.readdir(src, {withFileTypes: true}, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    if (file.isFile && path.extname(file.name) === '.css') {
      const readableStream = fs.createReadStream(path.join(src, file.name));

      readableStream.pipe(writableStream).on('error', (error) => console.log(error.message));
    }
  })

})