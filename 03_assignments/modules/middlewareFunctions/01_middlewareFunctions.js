let numberOfUserRequests = 0;

function checkNumberOfRequests(req, res, next) {
    if (numberOfUserRequests >= 2) {
        res.status(403).send('Number of User requests exceeded');
    } else {
        numberOfUserRequests++;
        next();
    }
}

module.exports = {
    checkNumberOfRequests: checkNumberOfRequests,
    getNumberOfUserRequests:()=> numberOfUserRequests
};