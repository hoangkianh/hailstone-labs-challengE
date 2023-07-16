const { check, validationResult } = require('express-validator')
const express = require('express')
const { ethers } = require('ethers')

const func = require('../src/func')
const erc20ABI = require('../abi/ERC20.json')

const router = express.Router()

router.get(
  '/swapEvents',
  [
    check('poolAddress').exists().isLength({ min: 42, max: 42 }).withMessage('poolAddress is missing'),
    check('toTokenAddress').exists().isLength({ min: 42, max: 42 }).withMessage('toTokenAddress is missing'),
    check('startTimestamp').exists().isNumeric().withMessage('startTimestamp is missing'),
    check('endTimestamp').exists().isNumeric().withMessage('endTimestamp is missing'),
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { poolAddress, toTokenAddress, startTimestamp, endTimestamp } = req.query

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
    const swapEvents = await func.fetchSwapEvents(poolAddress, toTokenAddress, startTimestamp, endTimestamp)

    const erc20Contract = new ethers.Contract(toTokenAddress, erc20ABI, provider)
    const decimals = await erc20Contract.decimals()

    const result = swapEvents.events.map(event => {
      return {
        txHash: event.transactionHash,
        sender: event.args.sender,
        to: event.args.to,
        fromToken: event.args.fromToken,
        toToken: event.args.toToken,
        fromAmount: event.args.fromAmount,
        toAmount: event.args.toAmount,
        fee: ethers.utils.formatUnits(event.args.toAmount, decimals) * 0.0001, // 0.01% fee,
      }
    })
    res.json(result)
  },
)

router.get(
  '/swapFee',
  [
    check('poolAddress').exists().isLength({ min: 42, max: 42 }).withMessage('poolAddress is missing'),
    check('toTokenAddress').exists().isLength({ min: 42, max: 42 }).withMessage('toTokenAddress is missing'),
    check('startTimestamp').exists().isNumeric().withMessage('startTimestamp is missing'),
    check('endTimestamp').exists().isNumeric().withMessage('endTimestamp is missing'),
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { poolAddress, toTokenAddress, startTimestamp, endTimestamp } = req.query

    const totalFee = await func.calculateSwapFeeSum(poolAddress, toTokenAddress, startTimestamp, endTimestamp)
    res.json(totalFee)
  },
)

module.exports = router
