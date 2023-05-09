import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
const log = require('log-to-file');

const userService = require('../services/user')
dotenv.config()

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const login = async (req, res, next) => {
  const {
    account,
  } = req.body

  if (!account)
    return res.json({
      error: "Fields must not be empty."
    })
  const date = new Date();
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  const d = date.getUTCDate();
  const t = date.getUTCHours();
  let usr = await userService.findUserByAccount(account)

  if (!usr) {

    const usrRes = await userService.addUser(account);

    log(`${account} is signed up.`, `./logs/${y}-${m + 1}-${d}-${t}.log`);

    usr = await userService.findUserByAccount(account);
  }
  log(`${account} logged in.`, `./logs/${y}-${m + 1}-${d}-${t}.log`);

  const token = jwt.sign(
    { _id: usr._id },
    JWT_SECRET_KEY
  )

  const encode = jwt.verify(token, JWT_SECRET_KEY)
  return res.json({
    token: token,
    user: encode
  })
}

const getMe = (req, res, next) => {
  res.json({
    account: req.account
  })
}

module.exports = {
  login,
  getMe,
}