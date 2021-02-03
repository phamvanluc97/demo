const Category=require('../models/category');
const {multipleMongooseToObject}=require('../../util/mongoose');
const {mongooseToObject}=require('../../util/mongoose');
const Product=require('../models/product');
const path=require('path');
const PAGELIMIT= 9;

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
}).single('category_image');

class CategoryControllers{
    createCategory(req,res)
    {
        res.render('category/createCategory',
        {layout:false});
    }

    show(req,res,next)
    {
        Category.find()
        .then(category=>res.render('category/showallcategory',
        {
            category:multipleMongooseToObject(category)
        }))
        .catch(next)
    }
    add(req,res,next)
    {
        upload(req,res,async (err)=>{
            req.body.category_image=req.file.filename;
            const category=new Category(req.body);
            category.save()
            .then(()=>res.redirect('/admin'))
            .catch(err=>{
                console.log(err);
            });
    })
    }
    async showProductOfCategory(req,res,next)
    {
        const findIdOfCategory=await Category.findOne({slug:req.params.slug}).exec();
        const page=parseInt(req.query.page)||1;
        var startIndex=(page-1)*PAGELIMIT;
            Product.find({product_category:findIdOfCategory._id}).skip(startIndex).limit(PAGELIMIT).sort({createdAt:-1}).exec(async function (err,product) {
                try{
                    if (err) console.log(err);
                    const PageNumber=await Product.find({product_category:findIdOfCategory._id}).countDocuments();
                    const countCategoryProduct=await Product.find({product_category:findIdOfCategory._id}).countDocuments().exec();
                    const NextPage=page+1;
                    const PrePage=page-1;
                    const pageitem=[];
                    const findAllCategoryName=await Category.find({}).exec();
                    const pageLimit=Math.ceil(PageNumber/PAGELIMIT);
                    for(let i=1;i<=pageLimit;i++)
                    {
                        const item={
                            value:i,
                            isActive:i===page
                        }
                        pageitem.push(item);
                    }
                    const activecategory=[];
                    for (const value of findAllCategoryName) {
                        const item={
                            name:value.category_name.toString(),
                            slug:value.slug.toString(),
                            isActiveCategory:value._id.toString()===findIdOfCategory._id.toString()
                        }
                        activecategory.push(item);
                    }

                    res.render('category/showProductOfCategory',{
                        findAllCategoryName:multipleMongooseToObject(findAllCategoryName),
                        countCategoryProduct:countCategoryProduct,
                        page:page,
                        activecategory:activecategory,
                        pagenumber:pageitem,
                        nextpage:NextPage,
                        prepage:PrePage,
                        goback:page>1,
                        gonext:page<pageLimit,
                        product:multipleMongooseToObject(product)
                    })
                }
                catch(error){
                        console.log(error)
                    }
                })
        
    }    
    showupdate(req,res,next)
    {
        Category.findById(req.params.id)
        .then(category=>res.render('category/editcategory',
        {
            category:mongooseToObject(category)
        }))
        .catch(next)
    }
    update(req,res,next)
    {
        upload(req,res,(err)=>{
            req.body.category_image=req.file.filename;
            Category.updateOne({_id:req.params.id},req.body)
            .then(category=>res.redirect('/admin'))
            .catch(next)
        })
    }
    delete(req,res,next)
    {
        Category.deleteOne({_id:req.params.id})
        .then(res.redirect('back'))
        .catch(next)
    }
}
module.exports=new CategoryControllers;