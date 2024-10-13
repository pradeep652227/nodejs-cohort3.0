const { Router } = require('express');
const router = Router();
const { authMidd } = require('../../middlewares/middleware-imports');
const { courseServices } = require('../../services/service-imports');

/* Base Route:- /courses */

const JWT_SECRET_USER = process.env.JWT_SECRET;
const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN;

router.get("/", async (req, res) => {
    console.log('at /courses/ route');
    const result = await courseServices.GetAllCoursesAsync();
    if (result.errMsg)
        return res.status(result.statusCode || 404).json({ msg: result.errMsg });
    return res.json(result);
});

//only preview the course details
router.get("/:courseSlug/preview", async (req, res) => {
    const courseSlug = req.params.courseSlug;
    const result = await courseServices.GetCourseAsync(courseSlug);
    if (result.errMsg)
        return res.status(result.statusCode).json({ msg: result.errMsg });
    return res.json(result);
})

router.use(authMidd(JWT_SECRET_USER));

/*POST routes */
router.post('/:courseSlug/purchase', async (req, res) => {
    const userId = req.Id;
    const courseId = req.body.courseId || req.body._id;
    if (courseId) {
        const result = await courseServices.PurchaseCourseAsync(userId, courseId);
        if (result.errMsg)
            return res.status(result.statusCode).json({ msg: result.errMsg });
        else
            return res.json(result);
    }
    else
        return res.status(400).json({ msg: 'Kindly send courseId' });
});


/*GET routes*/
//will see all the course contents also.
router.get("/:courseSlug", async (req, res) => {
    const courseSlug = req.params.courseSlug;
    const result = await courseServices.GetCourseAsync(courseSlug);
    if (result.errMsg)
        return res.status(result.statusCode).json({ msg: result.errMsg });
    return res.json(result);
});


module.exports = router;