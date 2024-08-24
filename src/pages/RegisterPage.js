import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Snackbar,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be 50 characters or less')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setServerError('');
    try {
      const res = await register(values);
      localStorage.setItem('token', res.data.token);
      setSuccessMessage(true);
    } catch (err) {
      setServerError(
        err.response && err.response.data && err.response.data.msg
          ? err.response.data.msg
          : 'Registration failed. Please try again.'
      );
    }
    setLoading(false);
    setSubmitting(false);
  };

  const handleSnackbarClose = () => {
    setSuccessMessage(false);
    navigate('/tasks'); 
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Register
        </Typography>
        <Formik
          initialValues={{ name: '', email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <Box mb={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
              </Box>
              <Box mb={2}>
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
              <Box mb={2}>
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
                  helperText={touched.password && errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              {serverError && (
                <Box mb={2}>
                  <Alert severity="error">{serverError}</Alert>
                </Box>
              )}
              <Box mb={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting || loading}
                  startIcon={loading ? <CircularProgress size="1rem" /> : null}
                >
                  Register
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
        <Snackbar
          open={successMessage}
          autoHideDuration={1000}
          onClose={handleSnackbarClose}
          message="Registration successful!"
        />
      </Box>
    </Container>
  );
};

export default RegisterPage;
