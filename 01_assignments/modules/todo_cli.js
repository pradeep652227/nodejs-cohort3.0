const fs = require('fs');
const path = require('path');

const todoFile = path.join(__dirname, '../todo.txt');

const { Command } = require('commander');
const Program = new Command();

Program.name('Todo with CLI')
    .description('A Todo like functionality added to this application using CLI. Add a Todo, Delete a Todo. Mark a Todo as Done')
    .version('1.0.0');

Program.command('Add')
    .description('Add a Todo')
    .argument('<item>', 'Todo to Add')
    .action(item => {
           const newItem =item+'\n';
        fs.appendFile(todoFile, newItem, 'utf-8', (err) => {
            if (err)
                console.log(err);
            else
                console.log(`Successfully Added ${item} into the Todo list`);
        })
    });

Program.command('List')
    .description('List All the Todos')
    .action(() => {
        fs.readFile(todoFile, 'utf-8', (err, data) => {
            if (err)
                console.log(err);
            else {
                console.log(data);
            }
        })
    });

Program.command('Remove')
    .description('Remove a Todo')
    .argument('<item>', 'item to delete')
    .action((item) => {
        fs.readFile(todoFile, 'utf-8', (err, data) => {
            if (err)
                console.log(err);
            else {
                /*Find the item using .includes() then remove that content from the string and overwrite the file using .writeFile*/
                if (data.includes(item)) {
                    // let reg=new RegExp(`\\n?${item}`, 'gm');
                    // const newData = data.replace(reg,'');
                    const newData = data
                        .split('\n')  // Split the content into an array of lines
                        .filter(line => line.trim() !== item.trim())  // Remove the matching item
                        .join('\n');  // Join the lines back with newline characters
                    fs.writeFile(todoFile, newData, 'utf-8', (err) => {
                        if (err)
                            console.log(err);
                        else
                            console.log(`Successfully removed ${item} from the Todo`);
                    })
                } else {
                    console.error(`No such Item exists in the Todo`);
                }
            }
        })
    });

//exporting the instance of Command class
module.exports = Program;