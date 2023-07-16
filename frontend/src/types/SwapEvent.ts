import { BigNumber } from 'ethers'

type SwapEvent = {
  txHash: string
  sender: string
  fromToken: string
  toToken: string
  fromAmount: BigNumber
  toAmount: BigNumber
  to: string
  fee: number
}

export default SwapEvent
