module.exports = function (req, res, next) {
  if (!req.session.isLogin) {
    return res.redirect(`/user/login?retURL=${req.originalUrl}`);
  }
  next();
};
