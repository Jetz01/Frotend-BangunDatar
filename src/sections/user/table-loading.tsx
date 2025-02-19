import type { TableRowProps } from '@mui/material/TableRow';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Box, CircularProgress } from '@mui/material';

// ----------------------------------------------------------------------

type TableLoadingProps = TableRowProps & {
  emptyRows: number;
  height?: number;
};

export function TableLoading({ emptyRows, height, sx, ...other }: TableLoadingProps) {
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
          <CircularProgress />
        </Box>
      </TableCell>
    </TableRow>
  );
}
