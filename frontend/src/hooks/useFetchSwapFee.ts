import { useEffect, useState } from 'react'
import axios from 'axios'
import useTimestampIntervals from './useGetTimestampIntervals'
import Interval from '../types/Invertal'

type SwapFeeData = {
  interval: Interval
  swapFee: number
}

type UseFetchSwapFeeResult = {
  swapFeeData: SwapFeeData[]
  isLoading: boolean
  error: string | null
}
const useFetchSwapFee = (poolAddress: string, toTokenAddress: string): UseFetchSwapFeeResult => {
  const timestampIntervals = useTimestampIntervals()
  const apiUrl = `${process.env.REACT_APP_API_URL}/swapFee`

  const [swapFeeData, setSwapFeeData] = useState<SwapFeeData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSwapFee = async () => {
      setIsLoading(true)

      try {
        const promises = timestampIntervals.map(interval => {
          return axios.get(apiUrl, {
            params: {
              poolAddress,
              toTokenAddress,
              startTimestamp: interval.start,
              endTimestamp: interval.end,
            },
          })
        })

        const responses = await Promise.all(promises)
        const data: SwapFeeData[] = responses.map((response, index) => {
          return {
            interval: timestampIntervals[index],
            swapFee: response.data,
          }
        })
        setSwapFeeData(data)
      } catch (e: any) {
        setError(e.message)
      }

      setIsLoading(false)
    }

    fetchSwapFee()
  }, [poolAddress, toTokenAddress, timestampIntervals])

  return { swapFeeData, isLoading, error }
}

export default useFetchSwapFee
