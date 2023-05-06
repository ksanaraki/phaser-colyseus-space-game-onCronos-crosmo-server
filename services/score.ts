const Score = require('../models/score')
const moment = require('moment')

const saveScoreService = async (account, tokenId, shipName, tier, score) => {
  const datetime = moment()
  const scoreData = {
    account, tokenId, shipName, tier, score, datetime
  }
  const res = new Score(scoreData)
  const scoreRes = await res.save()
  return scoreRes
}

const getScoresService = async (period, league) => {

  let days = new Date(0, 0, 0)
  if (period === 'weekly') days = moment().subtract(7, 'days').toDate()
  if (period === 'monthly') days = moment().subtract(30, 'days').toDate()

  const scores = await Score.aggregate([
    {
      $match: {
        datetime: { $gte: days },
        tier: { $eq: league }
      }
    },
    {
      $sort: { score: -1 }
    },
    {
      $group: {
        _id: "$tokenId",
        shipName: { $first: "$shipName" },
        score: { $first: "$score" },
        account:{ $first:"$account"}
      }
    },
    {
      $sort: { score: -1 }
    },
  ])
  return scores
}

module.exports = {
  saveScoreService,
  getScoresService,
}