const express=require('express');
const router=express.Router();
const register=require('../middleware/loginmiddleware')

const Messagecontroller =require('../app/controllers/MessageController');
//router.get('/',register,Messagecontroller.showmessage);
router.get('/',register,Messagecontroller.showtest);
router.post('/',register,Messagecontroller.sendmessage);

module.exports=router;