const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv').config({ path: path.resolve(__dirname , '../modules/.env') });

const secret = process.env.JWT_SECRET;

function authMidd(req, res, next) {
    //I will be using _id of mongodb as the key to sign-on
    const authorization = req.headers.authorization;
    //assuming authorization type is given in the authorization field
    const token = authorization.split(" ")[1];
    const decodedInfo = jwt.verify(token, secret);
    const id=decodedInfo.id;

    if(id){
        req.userId=id;
        next();
    }else
    res.status(403).json({msg:'Authorized route!! Kindly sign-in again'});
}

module.exports=authMidd;