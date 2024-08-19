import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button, TextField, Typography, Stack, Box, Paper, CircularProgress, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/system';
import logo from '../img/illustration.png';
import logoFooducate from '../img/signin-logo.svg';

const StyledLink = styled(RouterLink)(({ theme }) => ({
  color: '#39379C',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
    color: '#3734FF',
  },
}));

const CustomTextField = styled(TextField)(({ theme }) => ({
  '& label.Mui-focused': {
    color: '#996BFF', // Color of the label when focused
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#996BFF', // Color of the underline when focused
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#c4c4c4', // Default border color
    },
    '&:hover fieldset': {
      borderColor: '#996BFF', // Border color on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#996BFF', // Border color when focused
    },
  },
}));

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, authError] = useAuthState(auth);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const handleLogin = async () => {
    try {
      setLoginError("");
      await logInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error("Login error:", error); // Log the error to the console
      setLoginError("Invalid credentials. Please try again.");
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
      <Grid container columns={12} component="main" sx={{ height: '100vh'}}>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${logo})`,
            backgroundColor: (t) => t.palette.mode === 'light' ? '#6F6DCF' : t.palette.grey[900],
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            //backgroundSize: '70%',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Stack justifyContent="center" alignItems="center" mb={3} spacing={2} direction="row">
              <img src={logoFooducate} alt="logo"/>
              <Typography sx={{ fontSize: 38}} color="#232530">
                  Fooducate
              </Typography>
            </Stack>
            <Typography sx={{ fontSize: 25, marginBottom: 2}} color="#232530"> Login</Typography>
            {loginError && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {loginError}
              </Alert>
            )}
            <CustomTextField 
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              sx={{ marginBottom: 3}}
            />
            <CustomTextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              sx={{ marginBottom: 2}}
            />
            {authError && <Typography color="error">{authError.message}</Typography>}
            {loading ? (
              <CircularProgress />
            ) : (
              <>
                <Box sx={{ display: 'flex', marginBottom: 4, flexDirection: 'column', alignItems: 'center'}}>
                  <StyledLink to="/reset">Forgot Password?</StyledLink>
                </Box>
                <Stack direction="row" mb={5} spacing={3}>
                  <Button variant="contained" disableElevation 
                  sx={{ 
                    bgcolor: '#996BFF', 
                    width: 300, 
                    '&:hover': {
                      backgroundColor: '#6E4ABE', // Custom hover background color
                    },
                    height: 40 
                  }} 
                  onClick={handleLogin}>
                    Log in
                  </Button>
                </Stack>           
                <div>
                  Don't have an account? <StyledLink to="/register">Register</StyledLink> now.
                </div>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SignIn;