const Category = require('../models/category');
const Product = require('../models/product');
const Cart = require('../models/cart');
const { multipleMongooseToObject } = require('../../util/mongoose');
class AdminControllers {
  show(req, res, next) {
    Product.find({})
      .sort({ createdAt: -1 })
      .exec(async function (err, product) {
        try {
          if (err) return handleError(err);
          const category = await Category.find().exec();
          res.render('manager/admin', {
            category: multipleMongooseToObject(category),
            product: multipleMongooseToObject(product),
          });
        } catch {
          res.redirect('/');
        }
      });
  }
}
module.exports = new AdminControllers();
