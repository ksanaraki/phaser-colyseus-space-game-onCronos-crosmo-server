const User = require('../models/user')

const findUserByAccount = async account => {
  const usr = await User.findOne({ account: account })
  return usr;
}

const addUser = async (account) => {
  const userData = {
    account
  }
  const usr = new User(userData)
  const userRes = await usr.save()
  return userRes
}

const updateUser = async (account, score) => {

  // const usr = User.findOne({ account: account })
  // await User.findOneAndUpdate({ account: account }, { scores: [...usr.scores, { score: score, datatime: moment() }] })
  // const res = await User.findOne({ account: account })
  // return res
}

const getUsers = async () => {

  const users = await User.aggregate([
    {
      $group: {
        _id: "$_id",
        account: { $first: "$account" },
        score: { $sum: { $sum: "$scores.score" } },
        count: { $sum: { $sum: 1 } },
      }
    },
    {
      $sort: { score: -1 }
    }
  ])
}

module.exports = {
  addUser,
  updateUser,
  getUsers,
  findUserByAccount
}