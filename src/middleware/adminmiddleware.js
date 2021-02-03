module.exports=function(req,res,next) {
        if(!req.session.isLogin)
        {
            return res.redirect('/');
        }
        if(!req.session.loginUser.isAdmin)
        {
            return res.redirect('/');
        }           
        next();
}