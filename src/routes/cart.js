const express=require('express');
const router=express.Router();
const register=require('../middleware/loginmiddleware')
const registeradmin=require('../middleware/adminmiddleware')

const cartcontroller =require('../app/controllers/CartController');
router.post('/add',register,cartcontroller.addproduct)
router.delete('/delete/:id',register,cartcontroller.deleteproduct)
router.get('/add/:id',register,cartcontroller.addgetproduct);
router.get('/buy/:slug',register,cartcontroller.showProductBuy);
router.put('/buy/:id',register,cartcontroller.confirmBuyProduct);
router.put('/confirm/:id',registeradmin,cartcontroller.AdminconfirmBuyProduct);
router.put('/deny/:id',registeradmin,cartcontroller.AdminDenyBuyProduct);
router.put('/received/:id',register,cartcontroller.ReceivedBuyProduct);
router.get('/',register,cartcontroller.showcart);

module.exports=router;