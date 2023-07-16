import React from 'react'
import { TableCell, IconButton, Collapse, Box, Typography, Table, TableHead, TableBody, TableRow } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

import SwapEvent from '../types/SwapEvent'

interface RowProps {
  row: {
    granularity: string
    swapFee: number
    events: SwapEvent[]
  }
}

function Row(props: RowProps) {
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

export default Row
