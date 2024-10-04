const fs = require("fs");
const path = require("path");

// function NumberOfWords() {

//   const fileName=process.argv[2];
//   const path1 = path.join(__dirname, fileName);
//   fs.readFile(path1, "utf-8", (err, data) => {
//     if (err) console.log(err);
//     else {
//       let total = 0;
//       for (let i = 0; i < data.length; i++) {
//         if (data[i] === " ") total++;
//       }

//       console.log(`There are ${total===0?total:total+1} words in ${fileName}`);
//     }
//   });


// }
// NumberOfWords();


/*
//With Commander
const Program=require('./modules/commander');

Program.parse();
*/

/*//Assignment-02*/
const Program1=require('./modules/todo_cli');
Program1.parse();