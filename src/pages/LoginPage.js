import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Snackbar,
  Paper,
  IconButton,
  InputAdornment,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const LoginPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [retryAfter, setRetryAfter] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let timer;
    if (retryAfter) {
      timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = retryAfter - now;

        if (distance < 0) {
          clearInterval(timer);
          setTimeLeft(null);
          setRetryAfter(null);
        } else {
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setTimeLeft(`${minutes}m ${seconds}s`);
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [retryAfter]);

  // Validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required'),
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setServerError('');
    try {
      const res = await login(values);
      localStorage.setItem('token', res.data.token);
      setOpenSnackbar(true);

      setTimeout(() => {
        navigate('/tasks');
      }, 1000);
    } catch (err) {
      if (err.response && err.response.status === 429) {
        const retryAfterSeconds = parseInt(err.response.data.retryAfter, 10);
        const retryAfterDate = new Date(Date.now() + retryAfterSeconds * 1000).getTime();

        setRetryAfter(retryAfterDate);
        setServerError('Too many login attempts. Please try again after:');
      } else {
        setServerError(
          err.response && err.response.data && err.response.data.msg
            ? err.response.data.msg
            : 'Incorrect email or password. Please try again.'
        );
      }
    }
    setLoading(false);
    setSubmitting(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Login
          </Typography>
          {serverError && (
            <Box mb={2}>
              <Alert severity="error">
                {serverError}
                {timeLeft && <Typography variant="h6">{timeLeft}</Typography>}
              </Alert>
            </Box>
          )}
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form>
                <Box mb={3}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Box>
                <Box mb={3}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password ? 'Incorrect password' : ''}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <Box mb={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isSubmitting || loading || retryAfter}
                    startIcon={loading ? <CircularProgress size="1rem" /> : null}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Login successful!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoginPage;
