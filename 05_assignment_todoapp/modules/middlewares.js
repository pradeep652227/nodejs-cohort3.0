const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config({ path: './.env' });

function logger(req, res, next) {
    console.log(`${req.method} Route came at ${req.url}`);
    next();
}

function auth(req, res, next) {
    const token = req.headers.token;
    const decodedInfo = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedInfo) {
        req.userId = decodedInfo.id;
        next();
    } else {
        res.status(401).json({ msg: 'User is not authorized' });
    }
}

function errorHandler(err,req,res,next){
    console.log(`Error occurred at ${req.url} with Method ${req.method}`);
    next();
}

module.exports = {
    logger: logger,
    auth: auth,
    errorHandler:errorHandler
};