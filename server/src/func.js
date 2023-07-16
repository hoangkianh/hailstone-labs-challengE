const { ethers, utils } = require('ethers')

const helper = require('./helper')
const logger = require('./logger')
const poolABI = require('../abi/Pool.json')
const erc20ABI = require('../abi/ERC20.json')

const fetchSwapEvents = async function (poolAddress, toTokenAddress, startTimestamp, endTimestamp) {
  try {
    const rpcUrl = process.env.RPC_URL || ''

    if (!rpcUrl) {
      throw '⛔️ RPC_URL not detected! Add it to the .env file!'
    }

    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    const poolContract = new ethers.Contract(poolAddress, poolABI, provider)

    // Convert timestamps to block numbers
    const [startBlock, endBlock] = await Promise.all([
      helper.getBlockNoByTimestamp(startTimestamp),
      helper.getBlockNoByTimestamp(endTimestamp),
    ])

    const filter = poolContract.filters.Swap()
    let events = []
    let errorMsg = ''
    try {
      const swapEvents = await poolContract.queryFilter(filter, startBlock, endBlock)

      events = swapEvents.filter(event => {
        return (
          event.args.fromToken.toLowerCase() === toTokenAddress.toLowerCase() ||
          event.args.toToken.toLowerCase() === toTokenAddress.toLowerCase()
        )
      })
    } catch (error) {
      logger.error(`queryFilter: ${error}`)
      errorMsg = error
    }

    return { events, error: errorMsg }
  } catch (error) {
    logger.error(`fetchSwapEvents: ${error}`)
    return { events: [], error: error }
  }
}

const calculateSwapFeeSum = async function (poolAddress, toTokenAddress, startTimestamp, endTimestamp) {
  let swapFeeSum = 0
  try {
    const rpcUrl = process.env.RPC_URL || ''

    if (!rpcUrl) {
      throw '⛔️ RPC_URL not detected! Add it to the .env file!'
    }

    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    const swapEvents = await fetchSwapEvents(poolAddress, toTokenAddress, startTimestamp, endTimestamp)

    const erc20Contract = new ethers.Contract(toTokenAddress, erc20ABI, provider)
    const decimals = await erc20Contract.decimals()

    swapEvents.events.forEach(event => {
      const toAmount = event.args['toAmount']
      const swapFee = utils.formatUnits(toAmount, decimals) * 0.0001 // 0.01% fee
      swapFeeSum += swapFee
    })
  } catch (error) {
    console.log(error)
    logger.error(`calculateSwapFeeSum: ${error}`)
  }
  return swapFeeSum
}

module.exports = {
  fetchSwapEvents,
  calculateSwapFeeSum,
}
