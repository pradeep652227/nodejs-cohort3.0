const { CourseModel, PurchasesModel } = require('../../dbContext/mongoose');


async function GetCourseAsync(courseSlug) {
    try {
        const result = await CourseModel.findOne({ courseSlug: courseSlug });
        if (result)
            return result;
        return { errMsg: 'Course Not Found!!', statusCode:404 };
    }
    catch (err) {
        console.log(err);
        return { errMsg: 'Internal DB error at GetCourseAsync',statusCode:500 };
    }

}

async function GetAllCoursesAsync() {
    try {
        const result = await CourseModel.find({});
        if (result.length)
            return result;
        return { errMsg: 'No Courses are there', statusCode: 404 };
    } catch (err) {
        console.log(err);
        return { errMsg: 'Internal DB error at GetAllCoursesAsync',statusCode:500 };
    }
}

async function PurchaseCourseAsync(userId, courseId) {
    try {
        const res = await PurchasesModel.create({ userId: userId, courseId: courseId });
        return res;
    }
    catch (err) {
        if (err.code === 11000) {  // 11000 is the MongoDB duplicate key error code
            console.log('Duplicate Key Error: ', err);
            return { errMsg: 'Course already purchased by the user',statusCode:409 };
        }

        // Handle validation errors
        if (err.name === 'ValidationError') {
            console.log('Validation Error: ', err);
            return { errMsg: 'Validation failed', details: err.errors, statusCode:400 };
        }

        // Handle general errors
        console.log('General MongoDB Error: ', err);
        return { errMsg: 'Internal Server Error', statusCode:500 };
    }
}

module.exports = {
    GetCourseAsync,
    GetAllCoursesAsync,
    PurchaseCourseAsync
}