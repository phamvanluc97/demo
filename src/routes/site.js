const express = require('express');
const router = express.Router();
//const register=require('../middleware/adminmiddleware')

const sitecontroller = require('../app/controllers/SiteController');
router.get('/shop', sitecontroller.shop);
router.get('/contact', sitecontroller.contact);
router.get('/about', sitecontroller.about);
router.get('/', sitecontroller.homepage);

module.exports = router;
