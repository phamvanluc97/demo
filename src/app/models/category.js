const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const Category = new Schema(
  {
    category_name: { type: String, unique: true },
    category_image: { type: String },
    slug: { type: String, slug: 'category_name', unique: true },
  },
  {
    timestamps: true,
    collection: 'categories',
  },
);

module.exports = mongoose.model('Category', Category);
