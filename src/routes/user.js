const express=require('express');
const router=express.Router();
const register=require('../middleware/loginmiddleware')

const usercontroller =require('../app/controllers/UserController');
router.get('/login',usercontroller.login);
router.post('/login',usercontroller.confirmlogin);
router.get('/register',usercontroller.register);
router.get('/profile',register,usercontroller.profile);
router.post('/register',usercontroller.confirmregister);
router.post('/logout',usercontroller.logout);


module.exports=router;