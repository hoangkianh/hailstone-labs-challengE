import { useState, useEffect } from 'react'
import axios from 'axios'

const useFetchSwapEvents = (
  poolAddress: string,
  toTokenAddress: string,
  startTimestamp: number,
  endTimestamp: number,
) => {
  const [swapEvents, setSwapEvents] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const apiUrl = `${process.env.REACT_APP_API_URL}/swapEvents`

  useEffect(() => {
    const fetchSwapEvents = async () => {
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

        setSwapEvents(response.data.events)
      } catch (e: any) {
        setError(e.message)
      }

      setIsLoading(false)
    }

    fetchSwapEvents()
  }, [poolAddress, toTokenAddress, startTimestamp, endTimestamp])

  return { swapEvents, isLoading, error }
}

export default useFetchSwapEvents
