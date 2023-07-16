const { check, validationResult } = require('express-validator')
const express = require('express')

const func = require('../src/func')

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

    const swapEvents = await func.fetchSwapEvents(poolAddress, toTokenAddress, startTimestamp, endTimestamp)
    const result = swapEvents.events.map(event => {
      return {
        sender: event.args.sender,
        to: event.args.to,
        fromToken: event.args.fromToken,
        toToken: event.args.toToken,
        fromAmount: event.args.fromAmount,
        toAmount: event.args.toAmount,
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
    res.json({ totalFee })
  },
)

module.exports = router
