import React, { useState } from 'react'
import { TableCell, IconButton, Collapse, Box, Typography, Table, TableHead, TableBody, TableRow } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

import SwapEvent from '../types/SwapEvent'
import Interval from '../types/Invertal'
import useFetchSwapEvents from '../hooks/useFetchSwapEvents'
import { getExplorerLink, shortenAddress } from '../utils'
import { ethers } from 'ethers'

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
                    <TableCell>TxHash</TableCell>
                    <TableCell>From</TableCell>
                    <TableCell>To</TableCell>
                    <TableCell>Input</TableCell>
                    <TableCell>Output</TableCell>
                    <TableCell>Fee</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell>Loading...</TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {error ? (
                        <TableRow>
                          <TableCell>Could not load data</TableCell>
                        </TableRow>
                      ) : (
                        <>
                          {events.length > 0 ? (
                            <>
                              {events.map((eventRow: SwapEvent) => (
                                <TableRow key={eventRow.txHash}>
                                  <TableCell>
                                    <a
                                      className="underline"
                                      href={getExplorerLink(eventRow.txHash, 'transaction')}
                                      target="_blank"
                                    >
                                      {shortenAddress(eventRow.txHash)}
                                    </a>
                                  </TableCell>
                                  <TableCell>
                                    <a
                                      className="underline"
                                      href={getExplorerLink(eventRow.sender, 'address')}
                                      target="_blank"
                                    >
                                      {shortenAddress(eventRow.sender)}
                                    </a>
                                  </TableCell>
                                  <TableCell>
                                    <a
                                      className="underline"
                                      href={getExplorerLink(eventRow.to, 'address')}
                                      target="_blank"
                                    >
                                      {shortenAddress(eventRow.to)}
                                    </a>
                                  </TableCell>
                                  <TableCell>{shortenAddress(eventRow.fromToken)}</TableCell>
                                  <TableCell>{shortenAddress(eventRow.toToken)}</TableCell>
                                  <TableCell>{eventRow.fee.toFixed(4)}</TableCell>
                                </TableRow>
                              ))}
                            </>
                          ) : (
                            <TableRow>
                              <TableCell>No events</TableCell>
                            </TableRow>
                          )}
                        </>
                      )}
                    </>
                  )}
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
