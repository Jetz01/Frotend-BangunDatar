import type { TableRowProps } from '@mui/material/TableRow';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Typography, Box } from '@mui/material';

// ----------------------------------------------------------------------

type TableEmptyRowsProps = TableRowProps & {
  emptyRows: number;
  height?: number;
};

export function TableEmptyRows({ emptyRows, height, sx, ...other }: TableEmptyRowsProps) {
  if (!emptyRows) {
    return null;
  }

  return (
    <TableRow
      sx={{
        ...(height && {
          height: height * emptyRows,
        }),
        ...sx,
      }}
      {...other}
    >
      <TableCell colSpan={9}>
        <Box sx={{ py: 15, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Data Kosong
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
}
