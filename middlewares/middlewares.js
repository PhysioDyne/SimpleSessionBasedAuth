exports.authProtection = async (req, res, next) => {
  if (!req.session.isAuth) {
    return res.redirect(`/account/login?targetUrl=${req.originalUrl}`);
  }
  next();
};

exports.adminProtection = async (req, res, next) => {
  if (req.session.roleId != 1) {
    return res.redirect(`/account/login?targetUrl=${req.originalUrl}`);
  }
  next();
};
