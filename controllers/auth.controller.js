const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { set } = require("../app");

exports.isAuth = async (req, res, next) => {
  try {
    if (req.originalUrl === "/api/users/login") return next();

    if (!req.headers.authorization)
      return res.status(403).json({ message: "no token" });

    const user = await User.findOne({ token: req.headers.authorization });

    if (!(user && user.token))
      return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(
      req.headers.authorization,
      process.env.JWT_TOKEN,
      (err, decode) => {
        if (err) return res.status(401).json({ message: "Unauthorized" });

        req.user = decode;

        next();
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).jsonp({
      message: error,
    });
  }
};
exports.isSuperuser = () => {
  return (req, res, next) => {
    if (req.user.roles.includes("SUPERUSER")) return next();
    return res.status(401).jsonp({
      message: "Unauthorized",
    });
  };
};
