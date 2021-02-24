const Category = require('../models/category');
const Product = require('../models/product');
const Cart = require('../models/cart');
const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const category = require('../models/category');
const PAGELIMIT = 9;
class SiteControllers {
  homepage(req, res, next) {
    if (!req.session.isLogin || !req.session.loginUser.isAdmin) {
      let findcurrentuser = 0;
      Product.find({})
        .limit(3)
        .sort({ createdAt: -1 })
        .exec(async function (err, product) {
          try {
            if (err) return handleError(err);
            if (req.session.isLogin) {
              findcurrentuser = await Cart.find({
                cart_username_id: req.session.loginUser._id,
              })
                .countDocuments()
                .exec();
            }
            const category = await Category.find().exec();
            res.render('home', {
              findcurrentuser: findcurrentuser,
              category: multipleMongooseToObject(category),
              product: multipleMongooseToObject(product),
            });
          } catch {
            res.redirect('/');
          }
        });
    } else {
      Product.find({})
        .sort({ createdAt: -1 })
        .exec(async function (err, product) {
          try {
            if (err) return handleError(err);
            const category = await Category.find().exec();
            const cartAdminCheck = await Cart.find({
              cart_isBuyCheck: true,
              cart_isAdminCheck: false,
            })
              .populate('cart_product_id cart_username_id')
              .exec();
            const cartReceivedCheck = await Cart.find({ cart_isReceived: true })
              .populate('cart_product_id cart_username_id')
              .exec();
            const cartDenyCheck = await Cart.find({ cart_isAdminDeny: true })
              .populate('cart_product_id cart_username_id')
              .exec();
            res.render('manager/admin', {
              cartAdminCheck: multipleMongooseToObject(cartAdminCheck),
              cartReceivedCheck: multipleMongooseToObject(cartReceivedCheck),
              cartDenyCheck: multipleMongooseToObject(cartDenyCheck),
              category: multipleMongooseToObject(category),
              product: multipleMongooseToObject(product),
            });
          } catch {
            res.redirect('/');
          }
        });
    }
  }
  async shop(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    var startIndex = (page - 1) * PAGELIMIT;
    Product.find({})
      .skip(startIndex)
      .limit(PAGELIMIT)
      .sort({ createdAt: -1 })
      .exec(async function (err, product) {
        try {
          if (err) console.log(err);
          const PageNumber = await Product.countDocuments();
          const NextPage = page + 1;
          const PrePage = page - 1;
          let category = await Category.find().exec();
          //const find=await Product.find({product_name: new RegExp(req.query.q, 'i')}).exec();

          const pageitem = [];
          const pageLimit = Math.ceil(PageNumber / PAGELIMIT);
          for (let i = 1; i <= pageLimit; i++) {
            const item = {
              value: i,
              isActive: i === page,
            };
            pageitem.push(item);
          }
          res.render('site/shop', {
            page: page,
            pagenumber: pageitem,
            nextpage: NextPage,
            prepage: PrePage,
            goback: page > 1,
            gonext: page < pageLimit,
            category: multipleMongooseToObject(category),
            product: multipleMongooseToObject(product),
          });
        } catch (error) {}
      });
  }
  about(req, res) {
    res.render('site/about');
  }
  contact(req, res) {
    res.render('site/contact');
  }
}
module.exports = new SiteControllers();
