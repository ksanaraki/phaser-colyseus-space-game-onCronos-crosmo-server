import Web3 from 'web3'
import HDWalletProvider from "@truffle/hdwallet-provider"

import { shooterContractAddr, shooterAbi } from './web3helper'
import { getScore, setScore } from '../rooms/state'

const userService = require('../services/user')
const scoreService = require('../services/score')
const log = require('log-to-file');

const saveScore = async (req, res, next) => {
  const {
    account,
    tokenId,
    shipName,
    tier,
  } = req.body

  const myPrivateKeyHex = process.env.PRIVATE_KEY!;
  const gateWay = process.env.GATE_WAY!;

  const init = async () => {
    const httpProvider = new Web3.providers.HttpProvider(gateWay);
    Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send
    const localKeyProvider = new HDWalletProvider({
      privateKeys: [myPrivateKeyHex],
      providerOrUrl: httpProvider,
    });
    const web3 = new Web3(localKeyProvider);
    const myAccount = web3.eth.accounts.privateKeyToAccount(myPrivateKeyHex);
    const myContract = new web3.eth.Contract(shooterAbi as any, shooterContractAddr);

    try {
      const receipt = await myContract.methods.playSession(score, account, tokenId).send({ from: myAccount.address });
    } catch (e) {
      console.log('error occured in sending reward token. try it again...')
      setTimeout(() => init(), 1000)
    }
  }
  const score = getScore();
  if (score > 0) {
    init()
  }

  const usr = await userService.findUserByAccount(account)
  if (usr) {
    const usrRes = await scoreService.saveScoreService(account, tokenId, shipName, tier, score)
    setScore(0)
    return res.json(usrRes)
  }

  return res.json({
    error: "Your account is not registered."
  })
}

const saveScoreLog = async (req, res, next) => {
  const {
    account,
    tokenId,
    shipName,
    tier,
    score
  } = req.body

  const usr = await userService.findUserByAccount(account)
  if (usr) {
    try{
      const date = new Date();
      const y = date.getUTCFullYear();
      const m = date.getUTCMonth();
      const d = date.getUTCDate();
      const t = date.getUTCHours();

      log(`Address:${account}, TokenID:${tokenId}, ShipName:${shipName}, Tier:${tier}, Score:${score}`, `./logs/${y}-${m + 1}-${d}-${t}.log`);
    }
    catch(e){
      console.log(`Log failed`, e);
    }

  }

  return res.json({
    error: "Your account is not registered."
  })
}

const getScores = async (req, res, next) => {
  const { period, league } = req.body

  const scores = await scoreService.getScoresService(period, league)
  return res.json(scores)
}

module.exports = {
  saveScore,
  saveScoreLog,
  getScores
}