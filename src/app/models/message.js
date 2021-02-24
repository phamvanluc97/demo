const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const Message = new Schema(
  {
    message_user_sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    message_user_receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    message: { type: String },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: 'messages',
  },
);

module.exports = mongoose.model('Message', Message);
