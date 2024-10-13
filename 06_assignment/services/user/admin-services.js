const { AdminModel, CourseModel } = require('../../dbContext/mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

function random2DigitsNumber() {
    return Math.floor(Math.random() * 100) + 1;
}

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

async function CreateCourseAsync(adminId, courseObj) {
    try {
        const courseSlug = courseObj.title
        .toLowerCase()
        .replace(/\s+/g, '-')  // Replace spaces with dashes
        .replace(/[^a-z0-9\-]/g, '')  // Remove any special characters
        + '-' + random2DigitsNumber() 
        + '-' + adminId.substring(0, 10);  // Correct method for substring
        const result = await CourseModel.create({ ...courseObj, courseSlug: courseSlug, creatorId: adminId });
        return result;
    } catch (err) {
        console.log('MongoDB Error at CreateCourseAsync:', err);
        return { errMsg: 'Internal DB Error' };
    }
}
async function UpdateCourseAsync(adminId, courseId, courseObj) {
    try {
        const result = await CourseModel.updateOne({ _id: courseId, creatorId: adminId }, courseObj);
        if (result.matchedCount == 0)
            return { errMsg: 'This Course created by this Admin is not found!!', statusCode: 404 }
        else if (result.modifiedCount == 0)
            return { errMsg: 'This Course created by this Admin is not updated!!', statusCode: 204 }
        else
            return result;
    } catch (err) {
        console.log(err);
        return { errMsg: 'DB Error in Updating the Course', statusCode: 500 };
    }
}

module.exports = {
    AddAdminAsync,
    FindAdminAsync,
    CreateCourseAsync,
    UpdateCourseAsync
}