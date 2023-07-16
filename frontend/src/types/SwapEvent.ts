type SwapEvent = {
  txHash: string
  sender: string
  fromToken: string
  toToken: string
  fromAmount: string
  toAmount: string
  to: string
  fee: number
}

export default SwapEvent
