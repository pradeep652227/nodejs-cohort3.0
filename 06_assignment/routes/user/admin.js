const { Router, json } = require('express');
const router = Router();
const path = require('path');
const zod = require('zod');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../../config/.env') });
const { authMidd } = require('../../middlewares/middleware-imports');
const { adminServices } = require('../../services/service-imports');

const JWT_SECRET = process.env.JWT_SECRET_ADMIN;

router.post('/signup', async (req, res) => {
    try {
        const admin = req.body;
        const requiredBody = zod.object({
            firstName: zod.string().min(3).max(100),
            lastName: zod.string().min(3).max(100),
            email: zod.string().min(3).max(100).email(),
            password: zod.string().min(8).max(30)
        }).superRefine(({ password }, checkPassComplexity) => {
            // check if password contains special char, lowercase, uppercase
            const containsUpper = (ch) => /[A-Z]/.test(ch);
            const containsLower = (ch) => /[a-z]/.test(ch);
            let countUpper = 0, countLower = 0, countSpecial = 0, countNums = 0;

            // Iterate over each character in the password
            for (let ch of password) {
                if (!isNaN(+ch)) {
                    countNums++;
                } else if (containsUpper(ch)) {
                    countUpper++;
                } else if (containsLower(ch)) {
                    countLower++;
                } else {
                    countSpecial++;
                }
            }

            let errorObj = {};
            if (!countLower)
                errorObj = { ...errorObj, lowerCase: { msg: "Add a Lower Case character!!" } };
            if (!countUpper)
                errorObj = { ...errorObj, upperCase: { msg: "Add an Upper Case character!!" } };
            if (!countSpecial)
                errorObj = { ...errorObj, specialCase: { msg: "Add a Special character!!" } };
            if (!countNums)
                errorObj = { ...errorObj, numChar: { msg: "Add a Numerical character!!" } };

            if (!countLower || !countUpper || !countSpecial || !countNums) {
                checkPassComplexity.addIssue({
                    code: "custom",  // Corrected code type
                    path: ["password"],
                    message: errorObj
                });
            }
        });
        const { success, error } = requiredBody.safeParse(admin);
        if (success) {
            const result = await adminServices.AddAdminAsync(admin);
            return result.errMsg ? res.status(result.statusCode).json({ msg: result.errMsg })
                : res.json({ msg: 'Admin Added' });
        }
        return res.status(400).json({ msg: 'Kindly provide Correct/Complete Admin Credentials', error: error });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal Server Error at /admin/signup route' });
    }
})

router.post('/signin', async (req, res) => {
    try {
        const adminCreds = req.body;
        const requiredBody = zod.object({
            email: zod.string().email(),
            password: zod.string().min(8)
        });
        const { success, error } = requiredBody.safeParse(adminCreds);
        if (success) {
            const result = await adminServices.FindAdminAsync(adminCreds);
            if (!result.errMsg) {
                const token = jwt.sign({ id: result._id }, JWT_SECRET);
                res.header("authorization", token);
                return res.send(result);
            }
            return res.status(result.statusCode).json({ msg: result.errMsg });
        }
        return res.status(400).json({ msg: 'Kindly provide Correct/Complete Admin Credentials', error: error });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal Server Error at /admin/signin route' });
    }
});

//Below it are the authorized routes
router.use(authMidd(JWT_SECRET));

router.post("/create-course", async (req, res) => {
    const courseObj = req.body;
    const adminId = req.Id;
    //validate the courseObj first
    const requiredCourse = zod.object({
        title: zod.string(),
        description: zod.string(),
        price: zod.number(),
        imageUrl: zod.string()
    });
    const { success, error } = requiredCourse.safeParse(courseObj);
    if (success) {
        const result = await adminServices.CreateCourseAsync(adminId, courseObj);
        return res.json(result);
    }
    return res.status(401).json({ msg: 'Course object validation failed.', error: error });
})

router.put("/course", async (req, res) => {
    const adminId = req.Id;
    const courseObj = req.body;
    const courseId = courseObj._id;
    //remove sensitive fields from the object
    delete courseObj.creatorId;
    delete courseObj._id;

    const result = await adminServices.UpdateCourseAsync(adminId, courseId, courseObj);
    if (result.errMsg) {
        return res.status(result.statusCode).json({ msg: result.errMsg });
    }
    return res.json(result);  // Return success response
});

router.get("/course/bulk", (req, res) => {
    res.json({
        msg: '/admin/course/bulk route'
    });
});

module.exports = router;