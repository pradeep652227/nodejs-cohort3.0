/*packages*/
const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();  // Load environment variables

/*internal modules*/
const middlewares = require('./modules/middlewares');
const dbService = require('./services/dbService');
dbService.dbConnect('todo-application');
const userServices = require('./services/backend-services/user-services');
const todoServices = require('./services/backend-services/todo-services');

/*essential instances and variables*/
const app = express();
const PORT = process.env.PORT || 3000;

/*Middlewares*/
app.use(express.json());  // Parse incoming request bodies (Important for JSON request bodies)
app.use(middlewares.logger);

/*Routes*/

// POST /signup
app.post('/signup', async (req, res) => {
    const user = req.body;

    if (user.email && user.password && user.name) {
        const result = await userServices.AddUserAsync(user);
        if (result.errMsg) {
            // Respond with appropriate status code based on the error
            return res.status(400).json({ msg: result.error });
        }
        return res.status(201).send('User added');
    } else {
        return res.status(400).json({ msg: 'Kindly provide complete user credentials: email, password, and name' });
    }
});

// POST /signin
app.post('/signin', async (req, res) => {
    const userObj = req.body;
    if (userObj.email && userObj.password) {
        const user = await userServices.FindUserAsync(userObj.email, userObj.password);
        if (user.errMsg)
            return res.status(403).json({ msg: user.error });
        else {
            const token = jwt.sign({
                id: (user._id.toString())
            }, process.env.JWT_SECRET);  // JWT signing with secret from .env
            return res.send({ token });
        }
    }
    return res.status(400).json({ msg: 'Kindly provide complete user credentials!! email, password' });
});

// Protected route to add a todo
app.post('/todo', middlewares.auth, async (req, res) => {
    const todo = req.body;
    const result = await todoServices.AddTodoAsync(todo);
    if(result.errMsg){
        res.status(400).json({msg:result.errMsg});
    }
    else
    res.send(result);
});

// Protected route to get todos
app.get('/todos', middlewares.auth, async (req, res) => {
    const todos = await todoServices.GetTodosAsync(req.userId);  // Assuming auth middleware sets req.user
    if(todos.errMsg)
        res.status(400).json({msg:todos.errMsg});
    else{
        res.send(todos);
    }
    
});

// Error Handler middleware
app.use(middlewares.errorHandler);

/*server start*/
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
