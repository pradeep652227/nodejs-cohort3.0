const {Router}=require('express');
const router=Router();
const path=require('path');
const {authMidd}=require('../../middlewares/middleware-imports');

console.log('user-module');

/*Base Route:- /user */

/*POST Routes*/
router.post('/signup',(req,res)=>{

});

router.post('/signin',(req,res)=>{

});

/*GET routes*/
router.get('/purchases',authMidd,(req,res)=>{

});

module.exports=router;