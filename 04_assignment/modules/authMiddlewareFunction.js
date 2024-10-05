const jwt=require('jsonwebtoken');
const path=require('path');
const dotenv=require('dotenv').config({path:'./.env'});

const secret=process.env.JWT_SECRET;
function authMiddFunction(req,res,next){
    const token=req.headers.token;
    const decodedInfo=jwt.verify(token,secret);

    if(decodedInfo.username){
        req.username=decodedInfo.username;//sending this username to the route handler
        next();
    }else{
        res.status(400).json({msg:"User is not logged in!!"});
    }
}

function logger(req,res,next){
    console.log(`${req.method} request came for this route ${req.url}`);
    next();
}

module.exports={
    authMiddFunction:authMiddFunction,
    logger:logger
};