const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWTSECRET

exports.adminAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "Not authorized , ERR" });
      } else {
        if (decodedToken.role !== "admin") {
          return res.status(401).json({ message: "Not authorized" });
        } else {
          next();
        }
      }
    });
  } else {
    return res.status(401).json({ message: "Not authorized" });
  }
};

exports.userAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "Not authorized, ERR" });
      } else {
        if (decodedToken.role == "" || decodedToken.role == "user" || decodedToken.role == "admin") {
          next();
        } else {
          return res.status(401).json({ message: "Not authorized" });
        }
      }
    });
  } else {
    return res.redirect('/login')
  }
};