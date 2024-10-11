/*packages*/
const express = require('express');
const jwt = require('jsonwebtoken');
const path=require('path');
const dotenv = require('dotenv').config({path:path.join(__dirname,'./modules/.env')});  // Load environment variables
const zod=require('zod');

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
    const requiredBody=zod.object({
        name:zod.string().min(3).max(100),
        email:zod.string().min(3).max(100).email(),
        password:zod.string().min(3).max(30)
    }).superRefine(({ password }, checkPassComplexity) => {
        const containsUppercase = (ch) => /[A-Z]/.test(ch);
        const containsLowercase = (ch) => /[a-z]/.test(ch);
        const containsSpecialChar = (ch) =>
          /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
        let countOfUpperCase = 0,
          countOfLowerCase = 0,
          countOfNumbers = 0,
          countOfSpecialChar = 0;
    
        for (let i = 0; i < password.length; i++) {
          let ch = password.charAt(i);
          if (!isNaN(+ch)) countOfNumbers++;
          else if (containsUppercase(ch)) countOfUpperCase++;
          else if (containsLowercase(ch)) countOfLowerCase++;
          else if (containsSpecialChar(ch)) countOfSpecialChar++;
        }
    
        let errObj = {
          upperCase: { pass: true, message: "add upper case." },
          lowerCase: { pass: true, message: "add lower case." },
          specialCh: { pass: true, message: "add special ch." },
          totalNumber: { pass: true, message: "add number." },
        };
    
        if (countOfLowerCase < 1) {
          errObj = { ...errObj, lowerCase: { ...errObj.lowerCase, pass: false } };
        }
        if (countOfNumbers < 1) {
          errObj = {
            ...errObj,
            totalNumber: { ...errObj.totalNumber, pass: false },
          };
        }
        if (countOfUpperCase < 1) {
          errObj = { ...errObj, upperCase: { ...errObj.upperCase, pass: false } };
        }
        if (countOfSpecialChar < 1) {
          errObj = { ...errObj, specialCh: { ...errObj.specialCh, pass: false } };
        }
    
        if (
          countOfLowerCase < 1 ||
          countOfUpperCase < 1 ||
          countOfSpecialChar < 1 ||
          countOfNumbers < 1
        ) {
          checkPassComplexity.addIssue({
            code: "custom",
            path: ["password"],
            message: errObj,
          });
        }
      });
    const {success,data,error}=requiredBody.safeParse(user);
    console.log(data);
    if (success) {
        const result = await userServices.AddUserAsync(user);
        if (result.errMsg) {
            // Respond with appropriate status code based on the error
            return res.status(400).json({ msg: result.error });
        }
        return res.status(201).send('User added');
    } else {
        return res.status(400).json({ msg: 'Kindly provide complete user credentials: email, password, and name',error:error });
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
