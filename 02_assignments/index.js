const fs = require('fs');
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000 || process.env.PORT;

app.get("/files", (req, res) => {
    //get all the filenames
    fs.readdir("./files", (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({ msg: "Error in getting all the file names", error: err });
        }
        else {
            console.log(data);
            res.send(data);
        }
    })
});

app.get("/file/:filename", (req, res) => {
    //get the filename
    const fileName = req.params.filename;
    //find the file with its name in the file directory.
    fs.readdir('./files', (err, data) => {
        if (err)
            return res.status(500).json({ msg: "Error reading the directory", error: err });

        //check whether the file contains any extension
        const hasExtension = path.extname(fileName) !== '';
        let matchedFile;
        if (hasExtension)
            matchedFile = data.find(file => file === fileName);
        else
            matchedFile = data.find(file => path.parse(file).name === fileName);

        if (!matchedFile)
            return res.status(404).json({ msg: "File Not Found", error: err });

        fs.readFile(`./files/${matchedFile}`, 'utf-8', (err, data) => {
            if (err) {
                console.log(err);
                res.status(500).json({ msg: "Error in getting the file details", error: err });
            } else {
                res.send(data);
            }
        })
    })

});

app.listen(PORT, () => {
    console.log(`Server is listening on PORT:- ${PORT}`);
})