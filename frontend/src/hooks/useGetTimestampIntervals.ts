import { useState, useEffect } from 'react'
import Interval from '../types/Invertal'

const useTimestampIntervals = (): Interval[] => {
  const [timestampIntervals, setTimestampIntervals] = useState<Interval[]>([])

  useEffect(() => {
    const now = Math.floor(Date.now() / 1000)
    const oneMinute = 60
    const fiveMinutes = 5 * 60
    const fifteenMinutes = 15 * 60
    const oneHour = 60 * 60

    const intervals = [
      { label: '1 minute', start: now - oneMinute, end: now },
      { label: '5 minutes', start: now - fiveMinutes, end: now },
      { label: '15 minutes', start: now - fifteenMinutes, end: now },
      { label: '1 hour', start: now - oneHour, end: now },
    ]

    setTimestampIntervals(intervals)
  }, [])

  return timestampIntervals
}

export default useTimestampIntervals
