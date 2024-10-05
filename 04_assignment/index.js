const express = require('express');
const jwt=require('jsonwebtoken');
const env=require('./modules/.env');
const path=require('path');
const dotenv=require('dotenv').config({path:'./modules/.env'});

//internal modules import
const middlewareFuncModules=require('./modules/authMiddlewareFunction');

//essential variables and instances
const users = [];
const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json());//to parse incoming req.body object data
app.use(middlewareFuncModules.logger);
/*Routes*/

//POST
app.post('/signup', (req, res) => {
    console.log(process.env.JWT_SECRET);
    const data = req.body;
    users.push({
        username: data.username,
        password: data.password
    });
    console.log(users);

    res.send('User Added');
});

app.post('/signin', (req, res) => {
    const reqUser = req.body;
    if (reqUser?.username && users.length > 0) {
        const user = users.find(user => user.username === reqUser.username && user.password === reqUser.password);
        if (user) {
            if (user.token) {
                const token = user.token;
                return res.send({ token });
            }
            const token = jwt.sign({
                username:user.username
            },process.env.JWT_SECRET);

            user.token = token;
            console.log(users);
        }
        return res.status(404).json({ msg: 'No Such User Found' });
    }
    return res.status(400).json({ msg: 'Invalid Request object' });
})

app.get('/me',middlewareFuncModules.authMiddFunction, (req, res) => {
    try {
        const username =req.username;
        const user = users.find(user => user.username === username);
        if (user) {
            res.send(user);
        } else {
            res.status(404).send('User Not Found');
        }
    } catch (err) {
        res.status(401).send('Invalid Token');
    }
});



//listen
app.listen(PORT, () => {
    console.log(`App is running and listening on Port ${PORT}`);
})