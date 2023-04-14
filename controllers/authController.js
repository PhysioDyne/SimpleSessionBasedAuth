const bcrypt = require("bcrypt");
const User = require("../models/authModel");
const transporter = require("../services/emailService");
const crypto = require("crypto");
const { Op } = require("sequelize");
require("dotenv").config();
exports.get_register = async (req, res) => {
  return res.send({
    title: "Register",
  });
};
exports.post_register = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    if (password.length >= 8 && password.length <= 16) {
      hashedPassword = await bcrypt.hash(password, 10);
    } else {
      res.send({
        title: "Register",
        message: "Password should be in between of 8 and 16",
      });
    }
    const user = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
      roleId: 2,
    });

    transporter.sendMail({
      from: process.env.email,
      to: user.email,
      subject: "Registiration Successed",
      text: "You're welcome!",
    });
    res.send({
      title: "Register",
      message: "Registiration Successed!",
    });
  } catch (error) {
    if (
      error.name == "SequelizeUniqueConstraintError" ||
      error.name == "SequelizeValidationError"
    ) {
      const errmess = [];
      for (err of error.errors) {
        errmess.push(err.message);
      }
      return res.send({
        title: "Register",
        message: errmess,
      });
    } else {
      next(error);
    }
  }
};

exports.get_login = async (req, res) => {
  const message = req.session.message;
  delete req.session.message;
  return res.send({
    title: "Login",
    message: message,
  });
};
exports.post_login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.send({
        title: "Login",
        message: "There is no such a email",
      });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.send({
        title: "Login",
        message: "Password is wrong, please try again!",
      });
    }
    const token = crypto.randomBytes(8).toString("hex");
    const tokenDate = Date.now() + 1000 * 60 * 60;
    user.loginToken = token;
    user.loginTokenExp = tokenDate;
    await user.save();
    transporter.sendMail(
      {
        from: process.env.email,
        to: user.email,
        subject: "Login Verification",
        text: "If it is you, you can click the button to complete verification!",
        html: `<p>Token: ${token}</p><a href = "http://localhost:3000/account/confirm?token=${token}">Confirm</a>`,
      },
      (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      }
    );
    return res.send({
      title: "Login",
      message: "Check your email for complete the verification.",
    });
  } catch (error) {
    next(error);
  }
};
exports.login_validation = async (req, res, next) => {
  const token = req.query.token;
  const targetUrl = req.query.targetUrl;
  try {
    const user = await User.findOne({
      where: {
        loginToken: token,
        loginTokenExp: {
          [Op.gt]: Date.now(),
        },
      },
    });
    if (!user) {
      req.session.message = "Login Time is out";

      res.status(302).redirect("/account/login");
    }

    user.loginToken = null;
    user.loginTokenExp = null;
    await user.save();
    req.session.isAuth = true;
    req.session.roleId = user.roleId;
    if (targetUrl) {
      return res.status(302).redirect(targetUrl);
    }
    return res.status(302).redirect("/");
  } catch (error) {
    next(error);
  }
};
exports.get_reset_password = async (req, res) => {
  return res.send({
    title: "Reset Password",
  });
};
exports.post_reset_password = async (req, res, next) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      res.send({
        title: "Reset Password",
        message: "There is no such a email.",
      });
    }
    const token = crypto.randomBytes(8).toString("hex");
    const tokenDate = Date.now() + 1000 * 60 * 60;
    user.resetToken = token;
    user.resetTokenExp = tokenDate;
    await user.save();
    transporter.sendMail({
      from: process.env.email,
      to: user.email,
      subject: "Reset Password",
      html: `<p>Token: ${token}</p><a href = "http://localhost:3000/account/new-password/${token}">Confirm</a>`,
    });
    return res.send({
      title: "Reset Password",
      message: "Check your email to reset password",
    });
  } catch (error) {
    next(error);
  }
};
exports.get_new_password = async (req, res) => {
  return res.send({
    message: "New Password",
  });
};
exports.post_new_password = async (req, res, next) => {
  const password = req.body.password;
  const token = req.params.token;
  try {
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExp: {
          [Op.gt]: Date.now(),
        },
      },
    });
    if (!user) {
      req.session.message = "Login Time is out";
      res.status(302).redirect("/account/login");
    }
    if (password.length >= 8 && password.length <= 16) {
      hashedPassword = await bcrypt.hash(password, 10);
    } else {
      return res.send({
        title: "Register",
        message: "Password should be in between of 8 and 16",
      });
    }
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExp = null;
    await user.save();
    req.session.message = "password reset successed";
    return res.redirect("/account/login");
  } catch (error) {
    console.log(error);
  }
};
exports.get_logout = async (req, res) => {
  req.session.destroy();
  return res.status(302).redirect("/account/login");
};
