import { BigNumber } from 'ethers'

type SwapEvent = {
  id: number
  sender: string
  fromToken: string
  toToken: string
  fromAmount: BigNumber
  toAmount: BigNumber
  to: string
}

export default SwapEvent
