const express = require('express');
const router = express.Router();
const register = require('../middleware/adminmiddleware');
const registerlogin = require('../middleware/loginmiddleware');

const productController = require('../app/controllers/ProductController');

router.get('/add', register, productController.showadd);
router.post('/addcomment/:id', registerlogin, productController.addcomment);
router.get('/edit/:id', register, productController.showupdate);
router.put('/edit/:id', register, productController.update);
router.delete('/delete/:id', register, productController.delete);
router.post('/add', register, productController.create);
router.get('/:slug', productController.showDetailProduct);
router.get('/', register, productController.show);

module.exports = router;
