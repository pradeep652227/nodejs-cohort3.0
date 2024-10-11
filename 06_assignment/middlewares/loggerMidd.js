function loggerMidd(req,res,next){
    console.log(`Request came at ${req.url} of ${req.method} method`);
    next();
}

module.exports=loggerMidd;