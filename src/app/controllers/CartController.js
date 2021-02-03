const Cart=require('../models/cart');
const Product=require('../models/product');
const {multipleMongooseToObject}=require('../../util/mongoose');
const {mongooseToObject}=require('../../util/mongoose');
const category = require('../models/category');
const PAGELIMIT= 9;
class SiteControllers{
    showcart(req,res)
    {
        Cart.find({cart_username_id:req.session.loginUser._id}).populate('cart_product_id').exec(function (err,cart) {
            let totalprice=0;
            for (let price of cart) {
                totalprice=totalprice+parseInt(price.cart_number_product)*parseInt(price.cart_product_id.product_price);
            }
            if (err) return handleError(err);
            res.render('cart/cart',{
                totalprice:totalprice,
                cart:multipleMongooseToObject(cart)
            })
          })     
    }
    async showProductBuy(req,res)
    {  
        const FindProductBySlug=await Product.findOne({slug:req.params.slug}).exec();
        Cart.findOne({cart_username_id:req.session.loginUser._id,
                    cart_product_id:FindProductBySlug._id
        }).populate('cart_product_id').exec(function (err,cart) {
            const totalprice=parseInt(cart.cart_number_product)*parseInt(cart.cart_product_id.product_price);
            if (err) return handleError(err);
            res.render('cart/buyProduct',{
                cart:mongooseToObject(cart),
                totalprice:totalprice,
            })
          })
    }
    async addproduct(req,res)
    {
        const findproductid=await Cart.findOne({cart_product_id:req.body.product_id,cart_isReceived:false}).exec();
        if(findproductid)
        {
        let updateamount=parseInt((findproductid.cart_number_product)+parseInt(req.body.product_quanity));
            
        Cart.updateOne({
            _id:findproductid._id,cart_isReceived:false
        },
        {
            cart_product_id:req.body.product_id,
            cart_username_id:req.session.loginUser._id,
            cart_number_product:updateamount,
        }
        )
        .then(()=>res.redirect('back'))
        .catch(err=>{
            res.json(err);
        });
        }
        else{
            const cart=new Cart({
                cart_product_id:req.body.product_id,
                cart_username_id:req.session.loginUser._id,
                cart_number_product:req.body.product_quanity                
            })
            cart.save()
            .then(()=>res.redirect('back'))
            .catch(err=>{
                res.json(err);
            });
        };
                
    }
    async addgetproduct(req,res)
    {
        const findproductid=await Cart.findOne({cart_product_id:req.params.id,cart_isReceived:false}).exec();
        if(findproductid)
        {
        Cart.updateOne({
            _id:findproductid._id
        },
        {
            cart_product_id:req.params.id,
            cart_username_id:req.session.loginUser._id,
            cart_number_product:parseInt(findproductid.cart_number_product)+1,
        })
        .then(()=>res.redirect('back'))
        .catch(err=>{
            res.json(err);
        });
        }
        else{
            const cart=new Cart({
                cart_product_id:req.params.id,
                cart_username_id:req.session.loginUser._id,
                cart_number_product:1
            });
            cart.save()
            .then(()=>res.redirect('back'))
            .catch(err=>{
                res.json(err);
            });
        }    
    }
    deleteproduct(req,res,next)
    {
        Cart.deleteOne({_id:req.params.id})
        .then(res.redirect('back'))
        .catch(next)
    }
    confirmBuyProduct(req,res,next)
    {
        Cart.updateOne({_id:req.params.id},
            {
                cart_isBuyCheck:true,
                cart_number_product:req.body.cart_number_product,
                detaildescription:req.body.detaildescription
            })
        .then(res.redirect('/cart'))
        .catch(next)
    }
    AdminconfirmBuyProduct(req,res,next)
    {
        Cart.updateOne({_id:req.params.id},
            {
                cart_isBuyCheck:false,
                cart_isAdminCheck:true
            })
        .then(res.redirect('back'))
        .catch(next)
    }
    AdminDenyBuyProduct(req,res,next)
    {
        Cart.updateOne({_id:req.params.id},
            {
                cart_isBuyCheck:false,
                cart_isAdminDeny:true
            })
        .then(res.redirect('back'))
        .catch(next)
    }
    ReceivedBuyProduct(req,res,next)
    {
        Cart.updateOne({_id:req.params.id},
            {
                cart_isBuyCheck:false,
                cart_isAdminDeny:false,
                cart_isAdminCheck:false,
                cart_isReceived:true,
            })
        .then(res.redirect('back'))
        .catch(next)
    }

}
module.exports=new SiteControllers;