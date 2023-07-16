const { ethers } = require('ethers')
const dotenv = require('dotenv')

const logger = require('./logger')

dotenv.config()

const helper = {
  getBlockNoByTimestamp: async function (timestamp) {
    try {
      const apiKey = process.env.BSCSCAN_API_KEY || ''

      if (!apiKey) {
        throw new Error('⛔️ BSCSCAN_API_KEY not detected! Add it to the .env file!')
      }

      // Use BSC API to get block number by timestamp
      const response = await fetch(
        `https://api.bscscan.com/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${apiKey}`,
      )
      logger.info('Call BSCScan API')
      const data = await response.json()

      if (data.status === '1') {
        return Number(data.result)
      }
    } catch (error) {
      const rpcUrl = process.env.RPC_URL || ''

      if (!rpcUrl) {
        throw new Error('⛔️ RPC_URL not detected! Add it to the .env file!')
      }

      // Otherwise, call RPC
      const closestBlockNumber = await this.binarySearchBlock(rpcUrl, timestamp)

      return closestBlockNumber
    }
  },
  binarySearchBlock: async function (rpcUrl, timestamp) {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    let minBlockNumber = 0
    let maxBlockNumber = await provider.getBlockNumber()

    while (minBlockNumber <= maxBlockNumber) {
      const closestBlockNumber = Math.floor((minBlockNumber + maxBlockNumber) / 2)
      const closestBlock = await provider.getBlock(closestBlockNumber)

      if (closestBlock.timestamp === timestamp) {
        return closestBlockNumber
      } else if (closestBlock.timestamp > timestamp) {
        maxBlockNumber = closestBlockNumber - 1
      } else {
        minBlockNumber = closestBlockNumber + 1
      }
    }

    return minBlockNumber - 1
  },
}

module.exports = helper
