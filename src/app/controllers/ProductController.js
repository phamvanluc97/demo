const Product=require('../models/product');
const Category=require('../models/category');
const {multipleMongooseToObject}=require('../../util/mongoose');
const {mongooseToObject}=require('../../util/mongoose');
const Comment=require('../models/comment');
const path=require('path');

var multer=require('multer');

var storage=multer.diskStorage({
    destination:path.join(__dirname,'../../resources/public/upload'),
    filename:function(req,file,cb)
    {
        cb(null,Date.now()+file.originalname);
    }
})
var upload =multer({
    storage:storage,
    fileFilter:function(req,file,cb)
    {
        if(file.mimetype=='image/bmp'||file.mimetype=='image/png'||file.mimetype=='image/jpg'||file.mimetype=='image/jpeg'||file.mimetype=='image/gif')
        {
            cb(null,true)
        }
        else{
            return cb(new Error('Only image allowed!'))
        }
    }
}).single('product_image');

class ProductControllers{
    show(req,res,next)
    {
        Product.find().sort({createdAt:-1})
        .then(product=>res.render('product/showallproduct',
        {
            layout:false,
            product:multipleMongooseToObject(product)
        }))
        .catch(next)
    }
    shop(req,res,next)
    {
        Product.find()
        .then(product=>res.render('product/shopproduct',
        {
            product:multipleMongooseToObject(product)
        }))
        .catch(next)
    }
    showadd(req,res,next)
    {
        Category.find()
        .then(category=>res.render('product/createproduct',
        {
            category:multipleMongooseToObject(category),
            layout:false
        }))
        .catch(next)
        //res.render('product/createproduct');
    }
    create(req,res)
    {
        upload(req,res,async (err)=>{
                req.body.product_image=req.file.filename;
                const product=new Product(
                    req.body
                );
                product.save()
                .then(()=>res.redirect('/admin'))
                .catch(err=>{
                    res.json(err);
                });
        })
    }
    showupdate(req,res,next)
    {
        Product.findById(req.params.id)
        .then(product=>res.render('product/editproduct',
        {
            product:mongooseToObject(product)
        }))
        .catch(next)
    }
    showDetailProduct(req,res,next)
    {
       
            Product.findOne({slug:req.params.slug}).exec(async function (err,product) {
            try{
            if (err) return handleError(err);
            const findproduct=await Product.findOne({slug:req.params.slug}).exec();
            const produccommnent=await Comment.find({comment_product_id:findproduct._id}).limit(3).sort({createdAt:-1}).populate('comment_username_id').exec();
            const comments=await Comment.find({comment_product_id:findproduct._id}).countDocuments().exec();
            const category=await Category.findById(findproduct.product_category);
            const allproduct=await Product.find({product_category:findproduct.product_category}).exec();
            res.render('product/showDetailProduct',{
                comments:comments,
                produccommnent:multipleMongooseToObject(produccommnent),
                category:mongooseToObject(category),
                product:mongooseToObject(product),
                allproduct:multipleMongooseToObject(allproduct)
            })
            }
            catch{
                res.redirect('/')
            }
          })
    }
    addcomment(req,res)
    {
                const comment=new Comment(
                    {
                        comment_product_id:req.params.id,
                        comment_username_id:req.session.loginUser._id,
                        comment:req.body.comment,
                    }
                );
                comment.save()
                .then(()=>res.redirect('back'))
                .catch(err=>{
                    res.json(err);
                });
    }
    delete(req,res,next)
    {
        Product.deleteOne({_id:req.params.id})
        .then(res.render('cart/cart'))
        .catch(next)
    }
    update(req,res,next)
    {
        upload(req,res,(err)=>{
        req.body.product_image=req.file.filename;
        Product.updateOne({_id:req.params.id},req.body)
        .then(user=>res.redirect('/admin'))
        .catch(next)
    })

    }
}
module.exports=new ProductControllers;