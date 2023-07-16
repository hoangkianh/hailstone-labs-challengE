import React, { useEffect, useState } from 'react'
import SwapEvent from '../types/SwapEvent'
import { BigNumber } from 'ethers'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Row from './TableRow'

function SwapFeeTable() {
  const [granularity, setGranularity] = useState(60)
  const [swapEvents, setSwapEvents] = useState<SwapEvent[]>([])

  const rows = [
    { granularity: '1 min', swapFee: 0.2, events: swapEvents },
    { granularity: '5 mins', swapFee: 0.2, events: swapEvents },
    { granularity: '10 mins', swapFee: 0.2, events: swapEvents },
    { granularity: '1 hour', swapFee: 0.2, events: swapEvents },
  ]

  useEffect(() => {
    fetchSwapEvents()
  }, [granularity])

  const fetchSwapEvents = () => {
    const mockSwapEvents: SwapEvent[] = [
      {
        id: 0,
        sender: '0x1234',
        fromToken: '0x1234',
        toToken: '0x1234',
        fromAmount: BigNumber.from(1),
        toAmount: BigNumber.from(2),
        to: '0x4567',
      },
      {
        id: 1,
        sender: '0x4567',
        fromToken: '0x1234',
        toToken: '0x1234',
        fromAmount: BigNumber.from(1),
        toAmount: BigNumber.from(2),
        to: '0x1234',
      },
      {
        id: 2,
        sender: '0x1234',
        fromToken: '0x1234',
        toToken: '0x1234',
        fromAmount: BigNumber.from(1),
        toAmount: BigNumber.from(2),
        to: '0x4567',
      },
    ]
    setSwapEvents(mockSwapEvents)
  }

  return (
    <div className="w-1/2">
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Granularities</TableCell>
              <TableCell>Swap Fee</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: { granularity: string; swapFee: number; events: SwapEvent[] }) => (
              <Row row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default SwapFeeTable
