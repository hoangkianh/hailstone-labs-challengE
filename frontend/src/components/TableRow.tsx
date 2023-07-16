import React, { useState } from 'react'
import { TableCell, IconButton, Collapse, Box, Typography, Table, TableHead, TableBody, TableRow } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

import SwapEvent from '../types/SwapEvent'
import Interval from '../types/Invertal'
import useFetchSwapEvents from '../hooks/useFetchSwapEvents'
import { shortenAddress } from '../utils'
import { BigNumber, ethers } from 'ethers'

interface RowProps {
  row: {
    interval: Interval
    swapFee: number
  }
}

function Row(props: RowProps) {
  const { row } = props
  const [open, setOpen] = useState(false)

  const [events, setEvents] = useState<SwapEvent[]>([])
  const toTokenAddress = '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d' // USDC
  const { fetchSwapEvents, isLoading, error } = useFetchSwapEvents()

  const onOpenDetails = async () => {
    setOpen(!open)

    if (!open) {
      const _events = await fetchSwapEvents(
        process.env.REACT_APP_POOL_ADDRESS ?? '',
        toTokenAddress,
        row.interval.start,
        row.interval.end,
      )

      setEvents(_events)
    }
  }

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={onOpenDetails}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.interval.label}</TableCell>
        <TableCell>{row.swapFee.toFixed(4)} USDC</TableCell>
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
                  {events.map((eventRow: SwapEvent) => (
                    <TableRow key={eventRow.id}>
                      <TableCell>{shortenAddress(eventRow.sender)}</TableCell>
                      <TableCell>{shortenAddress(eventRow.to)}</TableCell>
                      <TableCell>{shortenAddress(eventRow.fromToken)}</TableCell>
                      <TableCell>{shortenAddress(eventRow.toToken)}</TableCell>
                      <TableCell>{Number(ethers.utils.formatEther(eventRow.toAmount)).toFixed(4)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default Row
