const dbService = require('../dbService');

const models = dbService.models;
const UserModel = models.UserModel;

// Add a new user
async function AddUserAsync(user) {
    try {
        let res = await UserModel.create(user);
        return res;  // No need to check res.errmsg; errors will be caught in the catch block
    } catch (err) {
        // Handle duplicate key error (like email already exists)
        if (err.code === 11000) {  // 11000 is the MongoDB duplicate key error code
            console.log('Duplicate Key Error: ', err);
            return { errorMsg: 'User with this email already exists' };
        }

        // Handle validation errors
        if (err.name === 'ValidationError') {
            console.log('Validation Error: ', err);
            return { errorMsg: 'Validation failed', details: err.errors };
        }

        // Handle general errors
        console.log('General MongoDB Error: ', err);
        return { errorMsg: 'Internal Server Error' };
    }
}

// Find a user by email and password
async function FindUserAsync(email, password) {
    try {
        let user = await UserModel.findOne({ email: email, password: password });  // Corrected query
        return user;
    } catch (err) {
        console.log('Error Finding User: ', err);
        return { error: 'Internal Server Error' };
    }
}

module.exports = {
    AddUserAsync: AddUserAsync,
    FindUserAsync: FindUserAsync
};
