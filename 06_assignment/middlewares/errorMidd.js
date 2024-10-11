function errorMidd(err,req,res,next){
    console.log(`Error at ${req.method} Route ${req.url}`);
    console.log(err);
    next();
}

module.exports=errorMidd;