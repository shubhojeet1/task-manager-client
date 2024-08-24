import React, { useState } from 'react';
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
} from '@mui/material';

const LoginPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

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
      setOpenSnackbar(true); // Open success snackbar

      setTimeout(() => {
        navigate('/tasks'); // Navigate to tasks after 1 second
      }, 1000); // 1-second delay
    } catch (err) {
      setServerError(
        err.response && err.response.data && err.response.data.msg
          ? err.response.data.msg
          : 'Incorrect email or password. Please try again.'
      );
    }
    setLoading(false);
    setSubmitting(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
              <Alert severity="error">{serverError}</Alert>
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
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password ? 'Incorrect password' : ''}
                  />
                </Box>
                <Box mb={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isSubmitting || loading}
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
        autoHideDuration={1000} // Hide after 1 second
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
