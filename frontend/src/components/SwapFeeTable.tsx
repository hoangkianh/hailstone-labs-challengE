import { useEffect, useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Row from './TableRow'
import useFetchSwapFee from '../hooks/useFetchSwapFee'
import Interval from '../types/Invertal'

type RowData = { interval: Interval; swapFee: number }

function SwapFeeTable() {
  const [rows, setRows] = useState<RowData[]>([])
  const toTokenAddress = '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d' // USDC
  const { swapFeeData, isLoading, error } = useFetchSwapFee(process.env.REACT_APP_POOL_ADDRESS ?? '', toTokenAddress)

  useEffect(() => {
    const _rows: RowData[] = []
    swapFeeData.map(item => {
      _rows.push({
        interval: item.interval,
        swapFee: item.swapFee,
      })
    })

    setRows(_rows)
  }, [swapFeeData, isLoading, error])

  return (
    <div className="md:w-1/2">
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
                    {rows.map((row: { interval: Interval; swapFee: number }) => (
                      <Row key={row.interval.label} row={row} />
                    ))}
                  </>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default SwapFeeTable
