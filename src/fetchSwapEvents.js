const { ethers } = require('ethers')

const helper = require('./helper')
const logger = require('./logger')
const poolABI = require('../abi/Pool.json')

const fetchSwapEvents = async function (poolAddress, startTimestamp, endTimestamp) {
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
    try {
      events = await poolContract.queryFilter(filter, startBlock, endBlock)
    } catch (error) {
      logger.error(`queryFilter: ${error}`)
    }

    return events
  } catch (error) {
    logger.error(`fetchSwapEvents: ${error}`)
    return []
  }
}

module.exports = fetchSwapEvents
