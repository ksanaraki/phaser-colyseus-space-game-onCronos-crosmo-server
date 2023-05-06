import jwt from "jsonwebtoken"
import dotenv from 'dotenv'

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

  let usr = await userService.findUserByAccount(account)

  if (!usr) {
    const usrRes = await userService.addUser(account)
    usr = await userService.findUserByAccount(account)
  }

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