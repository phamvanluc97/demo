const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

  const Cart = new Schema({
    cart_product_id:{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
      ref:'Product'
    },
    cart_username_id:{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
      ref:'User'
    },
    cart_number_product:{type:Number},
    detaildescription:{type:String,default:""},
    cart_isAdminDeny:{type:Boolean,
      default:false},
    cart_isBuyCheck:{type:Boolean,
    default:false},
    cart_isReceived:{type:Boolean,
      default:false},
    cart_isAdminCheck:{type:Boolean,
      default:false},
  },{
    timestamps:true,
    collection:'carts'
  });

  module.exports=mongoose.model('Cart',Cart);