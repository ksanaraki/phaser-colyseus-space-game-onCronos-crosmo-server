import mongoose from 'mongoose'

const ScoreSchema = new mongoose.Schema({
  account: {
    type: String,
    required: true,
  },
  tokenId: {
    type: String,
    required: true,
  },
  shipName: {
    type: String,
    required: true
  },
  tier: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  datetime: {
    type: Date,
    required: true
  },
})

module.exports = mongoose?.model('Score', ScoreSchema);