function errorMidd(err,req,res,next){
    console.log(`Error at ${req.method} Route ${req.url}`);
    console.log(err);
    res.status(500).json({msg:'Internal Server Error!!'});
}

module.exports=errorMidd;