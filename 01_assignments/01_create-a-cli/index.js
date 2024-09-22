const fs = require("fs");
const path = require("path");
const { program } = require("commander");

function NumberOfWords(fileName) {
  const path1 = path.join(__dirname, fileName);
  fs.readFile(path1, "utf-8", (err, data) => {
    if (err) console.log(err);
    else {
      let total = 0;
      for (let i = 0; i < data.length; i++) {
        if (data[i] === " ") total++;
      }

      console.log(total===0?total:total+1);
    }
  });
}

NumberOfWords("a.txt");
