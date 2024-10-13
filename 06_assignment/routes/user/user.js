const { Router } = require('express');
const router = Router();
const path = require('path');
const zod = require('zod');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../../config/.env') });
const { authMidd } = require('../../middlewares/middleware-imports');
const { userServices } = require('../../services/service-imports');

const JWT_SECRET = process.env.JWT_SECRET;

/* Base Route: /user */

/* POST Routes */
router.post('/signup', async (req, res) => {
    try {
        const user = req.body;
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

        const { success, error } = requiredBody.safeParse(user);
        if (success) {
            const result = await userServices.AddUserAsync(user);  // Correctly renamed from 'res' to 'result'

            return (result.errMsg) ? (res.status(401).json({ msg: result.errMsg })) : res.json({ msg: 'User Added' });

        }
        return res.status(400).json({ msg: 'Kindly provide complete User Credentials!!', error: error });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
});

router.post('/signin', async (req, res) => {
    // Signin route to be implemented
    try {
        const userCreds = req.body;
        const requiredBody = zod.object({
            email: zod.string().email(),
            password: zod.string()
        });
        const { success, error } = requiredBody.safeParse(userCreds);
        if (success) {
            const result = await userServices.FindUserAsync(userCreds);
            //signing the token
            const token = jwt.sign({ id: result._id }, JWT_SECRET);
            res.header("authorization",token);
            return (result.errMsg) ? res.status(403).json({ msg: errMsg }) : res.json({ user: result });
        }
        return res.status(400).json({ msg: 'Kindly provide complete User Credentials!!', error: error });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
});

//All the routes after it are authorized
router.use(authMidd(JWT_SECRET));

/* GET routes */
router.get('/purchases',  (req, res) => {
    // Purchases route logic
    res.send('hello, you are accessing /user/purchases route');
});

module.exports = router;
