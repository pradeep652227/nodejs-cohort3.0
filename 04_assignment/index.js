const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

//essential variables and instances
const users = [];
const generateToken = require('./modules/generateToken');
//middlewares
app.use(express.json());//to parse incoming req.body object data

/*Routes*/

//POST
app.post('/signup', (req, res) => {

    const data = req.body;
    users.push({
        username: data.username,
        password: data.password,
        token: data.token
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
            const token = generateToken(user.username);
            user.token = token;
            console.log(users);
        }
        return res.status(404).json({ msg: 'No Such User Found' });
    }
    return res.status(400).json({ msg: 'Invalid Request object' });
})

//listen
app.listen(PORT, () => {
    console.log(`App is running and listening on Port ${PORT}`);
})