const users = [
    { username: 'user-1', numberOfRequests: 0, isUserLogged: 0 },
    { username: 'user-2', numberOfRequests: 0, isUserLogged: 0 },
    { username: 'user-3', numberOfRequests: 0, isUserLogged: 0 }
];

function resetRequestCount(user) {
    //this check will only create 01 setInterval function per-user
    if (!user.isUserLogged) {
        user.isUserLogged = 1;
        setInterval(() => {
            user.numberOfRequests = 0;
            console.log(`Interval for ${user}`);
        }, 5000);
    }
}

function rateLimitter(req, res, next) {
    // Get the username from headers
    const username = req.headers.username;
    console.log(`Username is ${username}`);

    // Find the user in the users array
    let user = users.find(user => user.username === username);

    if (!user) {
        return res.status(400).send(`No Such User Exists`);
    } else {
        // Increment the number of requests for the user
        user.numberOfRequests++;

        // Check if the request count exceeds the limit
        if (user.numberOfRequests > 2) {
            return res.status(404).send(`Number of Requests exceeded for user ${username}`);
        }

        // Reset the request count for the user if not already being reset
        resetRequestCount(user);

        // Move to the next middleware
        next();
    }
}

module.exports = { rateLimitter: rateLimitter };
