const express=require('express');

//essential instances and variables
const app=express();

//importing middleware functions
const middlewareModule_02=require('./middlewareFunctions/02_middlewareFunctions');

app.use(middlewareModule_02.rateLimitter);

module.exports=app;
