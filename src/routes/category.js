const express=require('express');
const router=express.Router();
const register=require('../middleware/adminmiddleware')

const categorycontroller =require('../app/controllers/CategoryController');
router.get('/add',register,categorycontroller.createCategory);
router.post('/add',register,categorycontroller.add);
router.get('/edit/:id',register,categorycontroller.showupdate);
router.put('/edit/:id',register,categorycontroller.update);
router.delete('/delete/:id',register,categorycontroller.delete);
router.get('/:slug',categorycontroller.showProductOfCategory);
router.get('/',register,categorycontroller.show);

module.exports=router;