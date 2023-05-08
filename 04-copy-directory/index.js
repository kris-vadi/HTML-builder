const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const src = path.join(__dirname, 'files');
const newDir = path.join(__dirname, 'files-copy');

fsPromises.mkdir(newDir, { recursive: true }).then(

  fs.readdir(src,  {withFileTypes: true}, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      if (file.isFile()) {
        fs.copyFile(path.join(src, file.name) , path.join(newDir, file.name), (err) => {
          if (err) throw err;
        })
      }
    })

  })

).catch(function() {
  console.log('failed to create directory');
});