
const siteRouter=require('./site');
const cartRouter=require('./cart');
const categoryRouter=require('./category');
const productRouter=require('./product');
const userRouter=require('./user');
const messageRouter=require('./message');
const adminRouter=require('./admin');

function route(app)
{
      app.use('/category',categoryRouter);
      app.use('/message',messageRouter);
      app.use('/cart',cartRouter);
      app.use('/user',userRouter);
      app.use('/product',productRouter);
      app.use('/admin',adminRouter);
      app.use('/',siteRouter);
      app.use(function(req,res)
      {
            res.render('404',
            {layout:false})
      })
      
}
module.exports=route;