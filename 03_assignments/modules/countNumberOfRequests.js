const express=require('express');

//Importing internal modules
const middlewaresModule=require('./middlewareFunctions');

const app=express();

//middlewares
app.use(middlewaresModule.checkNumberOfRequests);

//exporting
module.exports=app;
