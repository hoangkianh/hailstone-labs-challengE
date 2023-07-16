import { useState, useCallback } from 'react'
import axios from 'axios'

const useFetchSwapEvents = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const apiUrl = `${process.env.REACT_APP_API_URL}/swapEvents`

  const fetchSwapEvents = useCallback(
    async (poolAddress: string, toTokenAddress: string, startTimestamp: number, endTimestamp: number) => {
      setIsLoading(true)

      try {
        const response = await axios.get(apiUrl, {
          params: {
            poolAddress,
            toTokenAddress,
            startTimestamp,
            endTimestamp,
          },
        })

        setIsLoading(false)
        return response.data
      } catch (e: any) {
        setIsLoading(false)
        setError(e.message)
        return []
      }
    },
    [],
  )

  return { fetchSwapEvents, isLoading, error }
}

export default useFetchSwapEvents
