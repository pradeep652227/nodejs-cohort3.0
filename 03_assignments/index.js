
//Importing internal modules
const middlewaresModule=require('./modules/middlewareFunctions');
const app=require('./modules/countNumberOfRequests');

//essential instances and variables
const PORT=3000 || process.env.PORT;


//routes
app.get('/user',(req,res)=>{
    const numberOfUserRequests=middlewaresModule.getNumberOfUserRequests();
    res.send(`user is logged-in. Number of Requests till now:- ${numberOfUserRequests}`);
})

app.listen(PORT,()=>{
    const numberOfUserRequests=middlewaresModule.getNumberOfUserRequests();
    console.log(`App is running on PORT ${PORT} and Number Of User Requests= ${numberOfUserRequests}`);
})

