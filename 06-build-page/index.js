const fs = require('fs');
const { writeFile } = require('fs/promises');
const fsPromises = fs.promises;
const path = require('path');
const { Transform, pipeline } = require('stream');

const newProjectDist = path.join(__dirname, 'project-dist');
const componentsDir = path.join(__dirname, 'components');
const assetsDir = path.join(__dirname, 'assets');
const stylesDir = path.join(__dirname, 'styles');

const createDir = (src, cb) => {
  fsPromises.mkdir(src, { recursive: true }).then(
    cb
  ).catch(function() {
    console.log('failed to create directory');
  });
}

const copyDir = (fromDir, toDir) => {
  fs.readdir(fromDir, {withFileTypes: true}, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      if (file.isDirectory()) {
        createDir(path.join(toDir, file.name), copyDir(path.join(fromDir, file.name), path.join(toDir, file.name)));
      }

      if (file.isFile()) {
        fs.copyFile(path.join(fromDir, file.name) , path.join(toDir, file.name), (err) => {
          if (err) throw err;
        })
      }
    })

  })
}

const mergeStyles = (fromDir, toDir) => {
  const writableStream = fs.createWriteStream(path.join(toDir, 'style.css'), 'utf-8');

  fs.readdir(fromDir, {withFileTypes: true}, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      if (file.isFile && path.extname(file.name) === '.css') {
        const readableStream = fs.createReadStream(path.join(fromDir, file.name));

        readableStream.pipe(writableStream).on('error', (err) => console.log(`Error: ${err}`));
      }
    })

  })
}

const buildHtml = (fromDir, toDir) => {
  const template = path.join(__dirname, 'template.html');

  const readableStream = fs.createReadStream(template);
  const writeableStream = fs.createWriteStream(path.join(toDir, 'index.html'));

  const transform = new Transform({
    transform(chunk, enc, cb) {
      let chunkStringified = chunk.toString();

      fs.readdir(componentsDir, (err, files) => {
        if (err) throw err;

        files.forEach((file) => {   
          const componentHtml = fs.createReadStream(path.join(componentsDir, file), {encoding: 'utf8'});
          let components = [];

          componentHtml.on('data', (component) => {
            const name = file.replace(path.extname(file), '');
            components.push({'name': name, 'text': component});
            for(let component of components) {
              chunkStringified = chunkStringified.replace(`{{${component.name}}}`, component.text);
            }
            writeFile(path.join(toDir, 'index.html'), chunkStringified);
          })
        })
      })

      this.push(chunkStringified);
      cb();
    }
  });

  readableStream.pipe(transform).pipe(writeableStream).on('error', (err) => console.log(`Error: ${err}`));
}

const createProjectDist = (newDist) => {
  const newAssets = path.join(newDist, 'assets');
  fsPromises.mkdir(newAssets, { recursive: true });
  copyDir(assetsDir, newAssets);
  mergeStyles(stylesDir, newDist);
  buildHtml(componentsDir, newDist);
  
}

fsPromises.mkdir(newProjectDist, { recursive: true }).then(
  createProjectDist(newProjectDist)
).catch(function() {
  console.log('failed to create directory');
});


