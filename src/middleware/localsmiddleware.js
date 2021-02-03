const Cart=require('../app/models/cart');
const Product=require('../app/models/product');

module.exports=async function(app) {
    app.use(async function(req,res,next) {
      let findcurrentuser=0;
        if(req.session.isLogin===null)
        {
          req.session.isLogin=false;
          req.session.loginUser=null;
        }
        else{
        res.locals.isLogin=req.session.isLogin;
        res.locals.loginUser=req.session.loginUser;
        if(res.locals.isLogin)
        {
          findcurrentuser=await Cart.find({cart_username_id:req.session.loginUser._id}).countDocuments().exec();         
        }
        res.locals.currentuser=findcurrentuser;
      }
        const productcount=await Product.find().countDocuments().exec();
        res.locals.productcount=productcount;
        next();
      })
  }