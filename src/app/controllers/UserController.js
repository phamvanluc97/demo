const User=require('../models/user');
const {multipleMongooseToObject}=require('../../util/mongoose');
const {mongooseToObject}=require('../../util/mongoose');
const category = require('../models/category');
const PAGELIMIT= 9;
class UserControllers{
    login(req,res)
    {
        
            res.render('user/login',{
                layout:false
            })
               
    }
    register(req,res)
    {
        
            res.render('user/register',{
                layout:false
            })
               
    }
    async confirmregister(req,res)
    {
        if(req.body.username==""||req.body.password==""||req.body.name==""||req.body.birthday==""||req.body.email==""||req.body.phone==""||req.body.address=="")
        {
            return res.render('user/register',
                {
                    layout:false,
                    err:'Please check your infomation!!!'
                })
        }
        if(req.body.password!=req.body.confirmpassword)
        {
            return res.render('user/register',
                {
                    layout:false,
                    err:"Confirm password doesn't match!!!"
                })
        }
        const checusernamekexist=await User.findOne({username:req.body.username}).exec()
        {
            if(checusernamekexist)
            {
                return res.render('user/register',
                {
                    layout:false,
                    err:'Username existed!!!'
                })
            }
        }
        const checkemailexist=await User.findOne({email:req.body.email}).exec()
        {
            if(checkemailexist)
            {
                return res.render('user/register',
                {
                    layout:false,
                    err:'Email existed!!!'
                })
            }
        }
        const user=new User(req.body);
            user.save()
            .then(()=>res.redirect('/user/login'))
            .catch(err=>{
                res.json(err);
        });

    }
    async confirmlogin(req,res,next)
    {
        const user=await User.findOne({username:req.body.username,
                                            password:req.body.password}).exec();
        if(!user)
        {
            return res.render('user/login',
            {
                layout:false,
                err:'Invalid username or password'
            })
        }
        else{
            delete user.password;
            req.session.isLogin=true;
            req.session.loginUser=user;
            //const url=req.query.retURL||'/';
            res.redirect('/');
        }

    }
    profile(req,res)
    {
        res.render('user/profile')
    }
    logout(req,res)
    {
        req.session.isLogin=false;
        req.session.loginUser=null;
        res.redirect(req.headers.referer);
    }

}
module.exports=new UserControllers;