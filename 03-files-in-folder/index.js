const path = require("path");
const fs = require("fs");

const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, {withFileTypes: true}, (err, content) => {
  if (err) throw err;
  const files = content.filter((f) => f.isFile());
  
  files.forEach((file) => {
    const name = file.name;
    const extention = path.extname(file.name);
    const filePath = path.join(dirPath, file.name);

    
    const size = fs.stat(filePath, (err, stats) => { 
      if (err) throw err;
      console.log(`${name} - ${extention} - ${stats.size}b`);
    })
  })
})