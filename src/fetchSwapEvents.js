const { ethers } = require('ethers')

const helper = require('./helper')
const logger = require('./logger')
const poolABI = require('../abi/Pool.json')

const fetchSwapEvents = async function (poolAddress, toTokenAddress, startTimestamp, endTimestamp) {
  try {
    const rpcUrl = process.env.RPC_URL || ''

    if (!rpcUrl) {
      throw '⛔️ RPC_URL not detected! Add it to the .env file!'
    }

    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    const poolContract = new ethers.Contract(poolAddress, poolABI, provider)

    // Convert timestamps to block numbers
    const startBlock = await helper.getBlockNoByTimestamp(startTimestamp)
    const endBlock = await helper.getBlockNoByTimestamp(endTimestamp)

    const filter = poolContract.filters.Swap()
    let events = []
    let errorMsg = ''
    try {
      const swapEvents = await poolContract.queryFilter(filter, startBlock, endBlock)

      events = swapEvents.filter(event => {
        return event.args.toToken.toLowerCase() === toTokenAddress.toLowerCase()
      })
    } catch (error) {
      logger.error(`queryFilter: ${error}`)
      errorMsg = error
    }

    return { events, error: errorMsg }
  } catch (error) {
    logger.error(`fetchSwapEvents: ${error}`)
    return { events: [], error: errorMsg }
  }
}

module.exports = fetchSwapEvents
