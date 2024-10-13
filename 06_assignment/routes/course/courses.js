const { Router } = require('express');
const router = Router();
const { authMidd } = require('../../middlewares/middleware-imports');
/* Base Route:- /courses */

/*POST routes */
router.post('/:courseSlug/purchase', authMidd, (req, res) => {
    res.json({
        msg: '/courses/:courseSlug/purchase endpoint'
    })
});


/*GET routes*/

router.get("/:courseSlug", authMidd, (req, res) => {
    res.json({
        msg: '/courses/:courseSlug endpoint'
    })
});

router.get("/", (req, res) => {
    res.json({
        msg: '/courses endpoint'
    })
});

router.get("/:courseSlug/preview", (req, res) => {
    res.json({
        msg: '/courses/:courseSlug/preview endpoint'
    })
})

module.exports = router;