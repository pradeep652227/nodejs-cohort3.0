const { AdminModel } = require('../../dbContext/mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function AddAdminAsync(admin) {
    try {
        const hashedPassword = await bcrypt.hash(admin.password, saltRounds);
        //wait for the hashedPassword value to be filled.
        const res = await AdminModel.create({ ...admin, password: hashedPassword });
        return res;
    } catch (err) {
        // Handle duplicate key error (like email already exists)
        if (err.code === 11000) {  // 11000 is the MongoDB duplicate key error code
            console.log('Duplicate Key Error: ', err);
            //This status code indicates that the request conflicts with the current state of the server (e.g., a resource already exists).
            return { errMsg: 'Admin with the same credential(s) already exists', statusCode: 409 };
        }

        // Handle validation errors
        if (err.name === 'ValidationError') {
            console.log('Validation Error: ', err);
            //This status code indicates that the server could not process the request due to a client-side issue, such as invalid input.
            return { errMsg: 'Validation failed', details: err.errors, statusCode: 400 };
        }

        // Handle general errors
        console.log('General MongoDB Error: ', err);
        return { errMsg: 'Internal Server Error', statusCode: 500 };
    }
}

async function FindAdminAsync({ email, password }) {
    try {
        const admin = await AdminModel.findOne({ email: email }).lean();
        if (admin) {
            const isPassMatch = await bcrypt.compare(password, admin.password);
            return isPassMatch ? { ...admin, password: '' } : { errMsg: 'Wrong Password!!', statusCode: 401 }
        } else {
            return { errMsg: 'Admin Not Found', statusCode: 404 };
        }
    } catch (err) {
        console.log(err);
        return { errMsg: 'Internal DB Server Error at FindAdminAsync!!' };
    }
}
module.exports = {
    AddAdminAsync,
    FindAdminAsync
}