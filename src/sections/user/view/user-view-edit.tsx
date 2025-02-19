import { Box, Button, Card, FormLabel, TextField, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bounce, toast, ToastOptions } from 'react-toastify';
import { DashboardContent } from 'src/layouts/dashboard';
import { useRouter } from 'src/routes/hooks';

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

export function UserViewEdit() {
  const [nama, setNama] = useState<string>('');
  const [kelas, setKelas] = useState<string>('');
  const [sekolah, setSekolah] = useState<string>('');
  const [skorBangunDatar, setSkorBangunDatar] = useState('');
  const [skorLuasKeliling, setSkorLuasKeliling] = useState('');

  const router = useRouter();
  const { id } = useParams<Record<string, string>>();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = sessionStorage.getItem('token');

  const handleSubmitForm = async (id_user: String | undefined) => {
    if (Number(skorBangunDatar) > 100) {
      return toast.error('Skor Bangun Datar tidak bisa lebih dari 100', toastConfig);
    }

    if (Number(skorLuasKeliling) > 100) {
      return toast.error('Skor Luas & Keliling tidak bisa lebih dari 100', toastConfig);
    }

    try {
      const responseUserEditAPI = await fetch(`${API_BASE_URL}/siswa/${id_user}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nama,
          kelas,
          sekolah,
          skor_bangun_datar: skorBangunDatar,
          skor_luas_keliling: skorLuasKeliling,
        }),
      });

      if (responseUserEditAPI.status === 401) {
        router.push('/sign-in');
        return toast.error('Sesi anda telah habis. Silakan login kembali.', toastConfig);
      }

      if (!responseUserEditAPI.ok) {
        return toast.error('Terjadi kesalahan saat update data. Silakan coba kembali', toastConfig);
      }

      toast.success('Data Berhasil di update', toastConfig);
      router.push('/');
      return null;
    } catch (error) {
      const errorMessage = error?.message || 'Terjadi kesalahan';
      return toast.error(errorMessage, toastConfig);
    }
  };

  useEffect(() => {
    const getUserData = async (id_user: String | undefined) => {
      try {
        const responseUserDataIdAPI = await fetch(`${API_BASE_URL}/siswa/${id_user}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (responseUserDataIdAPI.status === 401) {
          toast.error('Sesi anda telah habis. Silakan login kembali.', toastConfig);
          return router.push('/sign-in');
        }

        if (!responseUserDataIdAPI.ok) {
          return toast.error(
            'Terjadi kesalahan saat meload data. Silakan refresh kembali',
            toastConfig
          );
        }

        const userDataAPI = await responseUserDataIdAPI.json();

        if (userDataAPI) {
          setNama(userDataAPI.nama);
          setKelas(userDataAPI.kelas);
          setSekolah(userDataAPI.sekolah);
          setSkorBangunDatar(userDataAPI.skor_bangun_datar);
          setSkorLuasKeliling(userDataAPI.skor_luas_keliling);
        }

        return null;
      } catch (error) {
        const errorMessage = error?.message || 'Terjadi kesalahan';
        return toast.error(errorMessage, toastConfig);
      }
    };

    getUserData(id);
  }, [id, token, API_BASE_URL, router]);

  const renderForm = (
    <Box>
      <TextField
        fullWidth
        required
        name="nama"
        label="Nama Siswa"
        placeholder="Nama Siswa"
        onChange={(e) => setNama(e.target.value)}
        value={nama}
        sx={{ mb: 5, mt: 5 }}
      />
      <TextField
        fullWidth
        required
        name="kelas"
        label="Kelas"
        onChange={(e) => setKelas(e.target.value)}
        value={kelas}
        placeholder="Kelas"
        sx={{ mb: 5 }}
      />
      <TextField
        fullWidth
        required
        name="sekolah"
        label="Sekolah"
        onChange={(e) => setSekolah(e.target.value)}
        value={sekolah}
        placeholder="Sekolah"
        sx={{ mb: 5 }}
      />
      <TextField
        fullWidth
        required
        name="skorBangunDatar"
        label="Skor Bangun Datar"
        placeholder="Skor Bangun Datar"
        type="number"
        onChange={(e) => {
          let value = e.target.value;

          if (value.length > 3) {
            value = value.slice(0, 3);
          }

          setSkorBangunDatar(value);
        }}
        value={skorBangunDatar}
        sx={{ mb: 5 }}
      />
      <TextField
        fullWidth
        required
        name="skorLuasKeliling"
        label="Skor Luas Keliling"
        placeholder="Skor Luas Keliling"
        type="number"
        onChange={(e) => {
          let value = e.target.value;

          if (value.length > 3) {
            value = value.slice(0, 3);
          }

          setSkorLuasKeliling(value);
        }}
        value={skorLuasKeliling}
        sx={{ mb: 5 }}
      />
      <Box display="flex" alignItems="center" justifyContent="center" mb={5}>
        <Button
          onClick={() => handleSubmitForm(id)}
          variant="contained"
          sx={{ px: '40px', py: '10px' }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );

  return (
    <DashboardContent>
      <Box mb={5}>
        <Typography variant="h4">Edit Data Siswa</Typography>
      </Box>

      <Card sx={{ paddingX: '4%', paddingY: '20px' }}>{renderForm}</Card>
    </DashboardContent>
  );
}
