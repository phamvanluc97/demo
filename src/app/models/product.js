const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const Product = new Schema(
  {
    product_name: { type: String },
    product_description: { type: String },
    product_price: { type: Number },
    product_image: { type: String },
    product_category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    slug: { type: String, slug: 'product_name', unique: true },
    // product_category_name:{type:String},
  },
  {
    timestamps: true,
    collection: 'products',
  },
);

module.exports = mongoose.model('Product', Product);
