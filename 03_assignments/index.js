const express=require('express');

//Importing internal modules
const app=express();

//essential instances and variables
const PORT=3000 || process.env.PORT;

//middlewares

//routes
app.get('/users',(req,res)=>{
   throw new Error('Something Went Wrong');
    res.send('Secret Rotue!!Only accessed by our array of users');
});


app.use((err,req,res,next)=>{
    res.status(404).json({error:err});
});

app.listen(PORT,()=>{
    console.log(`App is running on PORT ${PORT}`);
})

