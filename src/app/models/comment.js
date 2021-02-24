const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const Comment = new Schema(
  {
    comment_product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    comment_username_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    comment: { type: String },
    like: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: 'comments',
  },
);

module.exports = mongoose.model('Comment', Comment);
