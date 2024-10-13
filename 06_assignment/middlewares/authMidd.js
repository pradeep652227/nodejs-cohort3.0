const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../config/.env') });

function authMidd(JWT_PASSWORD) {
    return function (req, res, next) {
        // Get the authorization header
        const authorization = req.headers.authorization;
        
        // Check if the token is present and in the correct format
        if (!authorization || !authorization.startsWith("Bearer ")) {
            return res.status(401).json({ msg: 'Authorization token missing or invalid format' });
        }

        // Extract the token
        const token = authorization.split(" ")[1];
        
        try {
            // Verify the JWT token
            const decodedInfo = jwt.verify(token, JWT_PASSWORD);
            const id = decodedInfo.id;

            // Check if the ID exists in the token payload
            if (id) {
                req.Id = id;  // Attach the decoded ID to the request object
                next();  // Continue to the next middleware or route handler
            } else {
                return res.status(403).json({ msg: 'Unauthorized access. Please sign in again.' });
            }
        } catch (err) {
            console.log(err);  // Log the error for debugging
            return res.status(403).json({ msg: 'Invalid or expired token. Please sign in again.' });
        }
    };
}

module.exports = authMidd;
