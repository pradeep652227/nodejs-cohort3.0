const { Router } = require('express');
const router = Router();
const {authMidd}=require('../../middlewares/middleware-imports');
/* Base Route:- /courses */

/*POST routes */
router.post('/:courseSlug/purchase',authMidd,(req, res) => {

});


/*GET routes*/

router.get("/:courseSlug",authMidd, (req, res) => {

});

router.get("/", (req, res) => {

});

module.exports = router;