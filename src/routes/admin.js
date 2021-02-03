const express=require('express');
const router=express.Router();
const register=require('../middleware/adminmiddleware')

const adminController =require('../app/controllers/AdminController');

router.get('/',register,adminController.show);

module.exports=router;