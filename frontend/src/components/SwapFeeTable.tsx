import React, { useEffect, useState } from 'react'
import SwapEvent from '../types/SwapEvent'
import { BigNumber } from 'ethers'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

function createData(granularity: string, swapFee: number, events: SwapEvent[]) {
  return {
    granularity,
    swapFee,
    events,
  }
}

// @ts-ignore
function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props
  const [open, setOpen] = React.useState(false)

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.granularity}</TableCell>
        <TableCell>{row.swapFee}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Events
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>From</TableCell>
                    <TableCell>To</TableCell>
                    <TableCell>Input</TableCell>
                    <TableCell>Output</TableCell>
                    <TableCell>Fee</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.events.map((eventRow: SwapEvent) => (
                    <TableRow key={eventRow.id}>
                      <TableCell>{eventRow.sender}</TableCell>
                      <TableCell>{eventRow.to}</TableCell>
                      <TableCell>{eventRow.fromToken}</TableCell>
                      <TableCell>{eventRow.toToken}</TableCell>
                      <TableCell>{eventRow.toAmount.toString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

function SwapFeeTable() {
  const [granularity, setGranularity] = useState(60)
  const [swapEvents, setSwapEvents] = useState<SwapEvent[]>([])

  const rows = [
    createData('1 min', 0.2, swapEvents),
    createData('5 mins', 0.3, swapEvents),
    createData('15 mins', 0.4, swapEvents),
    createData('1 hour', 0.5, swapEvents),
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
            {rows.map((row: any) => (
              <Row key={row.name} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default SwapFeeTable
