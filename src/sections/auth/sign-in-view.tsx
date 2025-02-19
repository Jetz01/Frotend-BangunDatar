import React, { useState, useCallback, useRef } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { Bounce, toast, ToastOptions } from 'react-toastify';

// ----------------------------------------------------------------------

const toastConfig: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
  theme: 'colored',
  transition: Bounce,
};

export function SignInView() {
  const router = useRouter();

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    if (username == null || username === '') {
      return toast.error('Username Tidak Boleh Kosong', toastConfig);
    }

    if (password == null || password === '') {
      return toast.error('Password Tidak Boleh Kosong', toastConfig);
    }

    try {
      const responseLogin = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const dataLogin = await responseLogin.json();

      if (!dataLogin.success) {
        return toast.error(dataLogin.message, toastConfig);
      }

      if (!dataLogin.success) {
        return toast.error(dataLogin.message, toastConfig);
      }

      sessionStorage.setItem('token', dataLogin.token);
      toast.success('Login Berhasil', toastConfig);
      return router.push('/');
    } catch (error) {
      const errorMessage = error?.message || 'Terjadi kesalahan';
      return toast.error(errorMessage, toastConfig);
    }
  };

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        required
        name="username"
        placeholder="input username"
        inputRef={usernameRef}
        label="Username"
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        required
        name="password"
        label="Password"
        placeholder="input password"
        inputRef={passwordRef}
        InputLabelProps={{ shrink: true }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSubmit}
      >
        Sign in
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in</Typography>
      </Box>

      {renderForm}
    </>
  );
}
