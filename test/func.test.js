const { ethers, BigNumber, utils } = require('ethers')

const logger = require('../src/logger')
const helper = require('../src/helper')
const func = require('../src/func')

jest.mock('ethers', () => {
  const originEthers = jest.requireActual('ethers')
  return {
    ...originEthers,
    ethers: {
      providers: {
        JsonRpcProvider: jest.fn(),
      },
      Contract: jest.fn(),
    },
  }
})

jest.mock('../src/helper', () => ({
  getBlockNoByTimestamp: jest.fn(),
}))

jest.mock('../src/logger', () => ({
  error: jest.fn(),
}))

describe('fetchSwapEvents', () => {
  const poolAddress = '0x312Bc7eAAF93f1C60Dc5AfC115FcCDE161055fb0'
  const toTokenAddress = '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d'
  const startTimestamp = 1689396159
  const endTimestamp = 1689393756

  beforeEach(() => {
    process.env.RPC_URL = 'http://localhost:8545'
    jest.mocked(ethers.Contract).mockReturnValue({
      filters: {
        Swap: jest.fn(),
      },
      queryFilter: jest.fn(),
      decimals: jest.fn(),
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should fetch swap events within the specified range', async () => {
    const mockedGetBlockNoByTimestamp = jest.mocked(helper.getBlockNoByTimestamp)
    const startBlock = mockedGetBlockNoByTimestamp.mockReturnValue(123456)
    const endBlock = mockedGetBlockNoByTimestamp.mockReturnValue(123457)

    const mockedQueryFilter = jest.mocked(ethers.Contract().queryFilter)

    const swapEvent1 = {
      args: {
        sender: '0x19609b03c976cca288fbdae5c21d4290e9a4add7',
        fromToken: '0xcafcbf0e34024d2fc72cf076abeee38bc6bd1362',
        toToken: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
        fromAmount: '1',
        toAmount: '0.9999',
        to: '0x19609b03c976cca288fbdae5c21d4290e9a4add7',
      },
    }
    const swapEvent2 = {
      args: {
        sender: '0x19609b03c976cca288fbdae5c21d4290e9a4add7',
        fromToken: '0xcafcbf0e34024d2fc72cf076abeee38bc6bd1362',
        toToken: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
        fromAmount: '10',
        toAmount: '9.999',
        to: '0x19609b03c976cca288fbdae5c21d4290e9a4add7',
      },
    }
    mockedQueryFilter.mockResolvedValueOnce([swapEvent1, swapEvent2])

    const events = await func.fetchSwapEvents(poolAddress, toTokenAddress, startTimestamp, endTimestamp)
    expect(mockedQueryFilter).toHaveBeenCalledWith(
      jest.mocked(ethers.Contract().filters.Swap()),
      startBlock(),
      endBlock(),
    )
    expect(events.events).toEqual([swapEvent1, swapEvent2])
  })

  test('should return an empty array and log an error if an exception occurs', async () => {
    const mockedGetBlockNoByTimestamp = jest.mocked(helper.getBlockNoByTimestamp)
    mockedGetBlockNoByTimestamp.mockRejectedValueOnce(new Error('Mocked error'))

    const events = await func.fetchSwapEvents(poolAddress, toTokenAddress, startTimestamp, endTimestamp)

    // Verify the function calls and returned result
    expect(ethers.providers.JsonRpcProvider).toHaveBeenCalledTimes(1)
    expect(mockedGetBlockNoByTimestamp).toHaveBeenCalledTimes(1)
    expect(events.events).toEqual([])
    expect(logger.error).toHaveBeenCalledWith('fetchSwapEvents: Error: Mocked error')
  })
})

describe('calculateSwapFeeSum', () => {
  const poolAddress = '0x312Bc7eAAF93f1C60Dc5AfC115FcCDE161055fb0'
  const toTokenAddress = '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d'
  const startTimestamp = 1689396159
  const endTimestamp = 1689393756

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should calculate the sum of swap fees correctly', async () => {
    const swapEvents = [
      {
        args: {
          toToken: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
          toAmount: utils.parseUnits('100', 18),
        },
      },
      {
        args: {
          toToken: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
          toAmount: utils.parseUnits('200', 18),
        },
      },
      {
        args: {
          toToken: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
          toAmount: utils.parseUnits('300', 18),
        },
      },
    ]

    const mockedQueryFilter = jest.mocked(ethers.Contract().queryFilter)
    mockedQueryFilter.mockResolvedValueOnce(swapEvents)

    const decimals = jest.mocked(ethers.Contract().decimals)
    decimals.mockResolvedValueOnce(18)

    const swapFeeSum = await func.calculateSwapFeeSum(poolAddress, toTokenAddress, startTimestamp, endTimestamp)
    expect(swapFeeSum).toEqual(0.06)
  })

  test('should return 0 if there are no swap events', async () => {
    const mockedQueryFilter = jest.mocked(ethers.Contract().queryFilter)
    mockedQueryFilter.mockResolvedValueOnce([])

    const swapFeeSum = await func.calculateSwapFeeSum(poolAddress, toTokenAddress, startTimestamp, endTimestamp)

    expect(swapFeeSum).toEqual(0)
  })

  test('should return 0 if fetchSwapEvents throws an error', async () => {
    const mockedQueryFilter = jest.mocked(ethers.Contract().queryFilter)
    mockedQueryFilter.mockResolvedValueOnce([])

    jest.spyOn(func, 'fetchSwapEvents').mockRejectedValue(new Error('Mocked error'))

    const swapFeeSum = await func.calculateSwapFeeSum(poolAddress, toTokenAddress, startTimestamp, endTimestamp)

    expect(swapFeeSum).toBe(0)
  })
})
