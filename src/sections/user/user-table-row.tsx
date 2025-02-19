import { useState, useCallback } from 'react';
import { useRouter } from 'src/routes/hooks';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export type UserProps = {
  id: string;
  nama: string;
  kelas: string;
  sekolah: string;
  skor_bangun_datar: string;
  skor_luas_keliling: string;
  created_at: {
    _seconds: number;
    _nanoseconds: number;
  };
};

type UserTableRowProps = {
  no: number;
  row: UserProps;
  deleteUserData: Function;
};

export function UserTableRow({ row, no, deleteUserData }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const route = useRouter();

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    handleClosePopover();
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox">
        <TableCell align="center" padding="normal">
          {no + 1}
        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            {row.nama}
          </Box>
        </TableCell>

        <TableCell>{row.kelas}</TableCell>

        <TableCell>{row.sekolah}</TableCell>

        <TableCell align="center">
          <Label color="success">{row.skor_bangun_datar ? row.skor_bangun_datar : '-'}</Label>
        </TableCell>

        <TableCell align="center">
          <Label color="success">{row.skor_luas_keliling ? row.skor_luas_keliling : '-'}</Label>
        </TableCell>

        <TableCell align="center">{fDate(row.created_at._seconds * 1000)}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem
            onClick={() => {
              route.push(`/siswa/edit/${row.id}`);
              handleClosePopover();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleOpenDialog} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>

          {/* Dialog Konfirmasi */}
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
            <DialogContent>
              <p>Apakah Anda yakin ingin menghapus data {row.nama}?</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Batal
              </Button>
              <Button
                onClick={() => {
                  if (row.id) {
                    deleteUserData(row.id);
                    handleCloseDialog();
                  }
                }}
                color="error"
              >
                Hapus
              </Button>
            </DialogActions>
          </Dialog>
        </MenuList>
      </Popover>
    </>
  );
}
