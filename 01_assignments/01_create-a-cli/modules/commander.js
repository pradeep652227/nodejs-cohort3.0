const fs = require("fs");
const { Command } = require("commander");
const program = new Command();

program.name('File Counter')
  .description('CLI to do file based tasks, mainly counting the words or sentences')
  .version('1.0.0');

program.command('count_words')
  .description('Counts total number of words in a file')
  .argument('<file>', 'file to count')
  .action(file => {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (err)
        console.log(err);
      else {
        const wordsArray=data.split(' ');
        const words = wordsArray.length;
        console.log(`There are a total of ${words} word(s) in ${file}`);
      }
    });
  });

  program.command('count_sentences')
  .description('Counts total number of sentences in a file')
  .argument('<file>', 'file to count')
  .action(file => {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (err)
        console.log(err);
      else {
        const sentencesArray=data.split('\n');
        const sentences = sentencesArray.length;
        console.log(`There are a total of ${sentences} senetence(s) in ${file}`);
      }
    });
  });

module.exports=program;