const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const User = new Schema(
  {
    username: { type: String },
    password: { type: String },
    name: { type: String },
    birthday: { type: Date },
    email: { type: String },
    address: { type: String },
    phone: { type: Number },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: 'users',
  },
);

module.exports = mongoose.model('User', User);
