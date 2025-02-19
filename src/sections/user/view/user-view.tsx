import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'src/routes/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { Button } from '@mui/material';
import { Bounce, toast, ToastOptions } from 'react-toastify';

import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import * as XLSX from 'xlsx';
import { fDate } from 'src/utils/format-time';

import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { UserProps } from '../user-table-row';
import { TableLoading } from '../table-loading';
// ----------------------------------------------------------------------

const toastConfig: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
  theme: 'colored',
  transition: Bounce,
};

export function UserView() {
  const table = useTable();
  const tableRef = useRef(null);

  const [filterName, setFilterName] = useState('');
  const [userData, setUserData] = useState<UserProps[]>([]);

  const router = useRouter();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = sessionStorage.getItem('token');
  const apiBaseUrlRef = useRef(API_BASE_URL);

  const deleteUserData = async (id: string) => {
    try {
      const responseDeleteUserAPI = await fetch(`${API_BASE_URL}/siswa/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      if (responseDeleteUserAPI.status === 401) {
        toast.error('Sesi anda telah habis. Silakan login kembali.', toastConfig);
        return router.push('/sign-in');
      }

      if (!responseDeleteUserAPI.ok) {
        return toast.error(
          'Terjadi kesalahan saat menghapus data. Silakan coba lagi nanti',
          toastConfig
        );
      }

      setUserData(userData.filter((user) => user.id !== id));

      return toast.success('Data Berhasil Dihapus', toastConfig);
    } catch (error) {
      const errorMessage = error?.message || 'Terjadi kesalahan';
      return toast.error(errorMessage, toastConfig);
    }
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const responseUserDataAPI = await fetch(`${apiBaseUrlRef.current}/siswa`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
        });

        if (responseUserDataAPI.status === 401) {
          toast.error('Sesi anda telah habis. Silakan login kembali.', toastConfig);
          return router.push('/sign-in');
        }

        const userDataJSON = await responseUserDataAPI.json();

        return setUserData(userDataJSON);
      } catch (error) {
        const errorMessage = error?.message || 'Terjadi kesalahan';
        return toast.error(errorMessage, toastConfig);
      }
    };

    getUserData();
  }, [token, router]);

  const handleExportExcel = (data: UserProps[]) => {
    if (data.length === 0) {
      toast.error('Data Kosong', toastConfig);
    } else {
      const newData = data.map(
        (
          { id, nama, kelas, sekolah, skor_bangun_datar, skor_luas_keliling, created_at },
          index
        ) => ({
          no: index + 1,
          nama,
          kelas,
          sekolah,
          skor_bangun_datar,
          skor_luas_keliling,
          tanggal_submit: fDate(created_at._seconds * 1000),
        })
      );
      const worksheet = XLSX.utils.json_to_sheet(newData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Siswa');
      XLSX.writeFile(workbook, 'Data-Scratch-Siswa.xlsx');
    }
  };

  const dataFiltered: UserProps[] = useMemo(
    () =>
      applyFilter({
        inputData: userData,
        comparator: getComparator(table.order, table.orderBy),
        filterName,
      }),
    [userData, table.order, table.orderBy, filterName]
  );

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Data Siswa
        </Typography>
        <Button variant="contained" color="info" onClick={() => handleExportExcel(userData)}>
          Export Excel
        </Button>
      </Box>

      <Card>
        <UserTableToolbar
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }} ref={tableRef}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                onSort={table.onSort}
                headLabel={[
                  { id: 'nama', label: 'Nama' },
                  { id: 'kelas', label: 'Kelas' },
                  { id: 'sekolah', label: 'Sekolah' },
                  { id: 'skor_bangun_datar', label: 'Skor Bangun Datar', align: 'center' },
                  { id: 'skor_luas_dan_keliling', label: 'Skor Luas & Keliling', align: 'center' },
                  { id: 'tanggal_submit', label: 'Tanggal Submit', align: 'center' },
                  { id: '' },
                ]}
              />

              <TableBody>
                {!dataFiltered ? (
                  <TableLoading height={68} emptyRows={0} />
                ) : (
                  dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row, index) => (
                      <UserTableRow
                        key={row.id}
                        no={index}
                        row={row}
                        deleteUserData={deleteUserData}
                      />
                    ))
                )}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, _users.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={_users.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    rowsPerPage,
    onResetPage,
    onChangePage,
    onChangeRowsPerPage,
  };
}
