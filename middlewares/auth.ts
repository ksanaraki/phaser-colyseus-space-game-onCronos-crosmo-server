const jwt = require("jsonwebtoken");
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const authenticate = (req, res, next) => {
  try {
    let token = req.headers.token;
    let decode = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decode;
    next();
  } catch (err) {
    res.json({
      error: "You must be logged in",
    });
  }
}

const authError = (err, req, res, next) => {
  res.json(err)
}

module.exports = {
  authenticate,
  authError
}
