
//Importing internal modules
const app=require('./modules/rateLimitter');

//essential instances and variables
const PORT=3000 || process.env.PORT;


//routes
app.get('/users',(req,res)=>{
    res.send('Secret Rotue!!Only accessed by our array of users');
});

app.listen(PORT,()=>{
    console.log(`App is running on PORT ${PORT}`);
})

