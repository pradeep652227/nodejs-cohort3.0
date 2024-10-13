const { UserModel } = require('../../dbContext/mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function AddUserAsync(user) {
    try {
        // Hash the user's password with bcrypt
        const hash = await bcrypt.hash(user.password, saltRounds);  // Using await to handle asynchronous bcrypt.hash
        // Create the user in MongoDB
        const res = await UserModel.create({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: hash
        });
        return res;  // Return the created user object
    } catch (err) {
        // Handle duplicate key error (like email already exists)
        if (err.code === 11000) {  // 11000 is the MongoDB duplicate key error code
            console.log('Duplicate Key Error: ', err);
            return { errMsg: 'User with the same credential already exists' };
        }

        // Handle validation errors
        if (err.name === 'ValidationError') {
            console.log('Validation Error: ', err);
            return { errMsg: 'Validation failed', details: err.errors };
        }

        // Handle general errors
        console.log('General MongoDB Error: ', err);
        return { errMsg: 'Internal Server Error' };
    }
}

async function FindUserAsync({email, password}) {
    try {
        const user = await UserModel.findOne({ email: email }).lean();
        //.lean() will convert the document to a simple plane object by removing all the meta data abou the document
        if (user) {
            const hashPassword = user.password;
            const isPassMatch = await bcrypt.compare(password, hashPassword);
            if (isPassMatch) {
                //delete user.password
                return { ...user, password: '' }
            }
            else
                return { errMsg: 'Incorrect Password!!' };
        }
        return { errMsg: 'Incorrect Email!! User does not exist for this Email' }
    } catch (err) {
        console.log(err);
        return { errMsg: 'Internal DB error' };
    }
};


module.exports = {
    AddUserAsync,
    FindUserAsync
};
