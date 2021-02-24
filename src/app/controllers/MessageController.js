const Message = require('../models/message');
const User = require('../models/user');
const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
//const {mongooseToObject}=require('../../resources/public/upload');
const path = require('path');

var multer = require('multer');
var storage = multer.diskStorage({
  destination: path.join(__dirname, '../../resources/public/upload'),
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
var upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype == 'image/bmp' ||
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg' ||
      file.mimetype == 'image/gif'
    ) {
      cb(null, true);
    } else {
      return cb(new Error('Only image allowed!'));
    }
  },
}).single('category_image');

class MessageControllers {
  showmessage(req, res) {
    let allchat = [];
    let checkchat = [];
    Message.find({ message_user_sender: req.session.loginUser._id })
      .sort({ createdAt: 1 })
      .exec(async function (err, msg) {
        if (err) return handleError(err);
        const adminSend = await Message.find({
          message_user_receiver: req.session.loginUser._id,
        })
          .sort({ createdAt: 1 })
          .exec();
        allchat = msg.concat(adminSend);
        for (const value of allchat) {
          const item = {
            message: value.message,
            check:
              value.message_user_sender.toString() ===
              req.session.loginUser._id.toString(),
            time: value.createdAt,
          };
          checkchat.push(item);
        }
        checkchat.sort((a, b) => (a.time > b.time ? 1 : -1));
        res.render('message/message', {
          adminSend: multipleMongooseToObject(adminSend),
          msg: multipleMongooseToObject(msg),
          checkchat: checkchat,
        });
      });
  }
  showtest(req, res) {
    let allchat = [];
    let checkchat = [];
    Message.find({ message_user_sender: req.session.loginUser._id })
      .sort({ createdAt: 1 })
      .exec(async function (err, msg) {
        if (err) return handleError(err);
        const adminSend = await Message.find({
          message_user_receiver: req.session.loginUser._id,
        })
          .sort({ createdAt: 1 })
          .exec();
        allchat = msg.concat(adminSend);
        for (const value of allchat) {
          const item = {
            message: value.message,
            check:
              value.message_user_sender.toString() ===
              req.session.loginUser._id.toString(),
            time: value.createdAt,
          };
          checkchat.push(item);
        }
        checkchat.sort((a, b) => (a.time > b.time ? 1 : -1));
        res.render('message/test', {
          adminSend: multipleMongooseToObject(adminSend),
          msg: multipleMongooseToObject(msg),
          checkchat: checkchat,
          user: req.session.loginUser.name,
        });
      });
  }

  async sendmessage(req, res, next) {
    const user = await User.findOne({ isAdmin: true }).exec();
    const message = new Message({
      message_user_sender: req.session.loginUser._id,
      message_user_receiver: user._id,
      message: req.body.input,
    });
    message
      .save()
      .then(() => res.redirect('back'))
      .catch((err) => {
        console.log(err);
      });
  }
}
module.exports = new MessageControllers();
