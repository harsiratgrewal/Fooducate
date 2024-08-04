
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button, TextField, Typography, Stack, Box, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import logo from '../img/illustration.png';
import logoFooducate from '../img/signin-logo.svg';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';





function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/dashboard");
  }, [user, loading]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>

        <Grid container columns={12} component="main" sx={{ height: '100vh'}}>
          <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              `url(${logo})`,
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? '#6F6DCF' : t.palette.grey[900],
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: '70%',
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
              <Typography sx={{ fontSize: 38}} color="#494949">
                  Fooducate
              </Typography>
            </Stack>
            <Typography sx={{ fontSize: 25, marginBottom: 2}} color="#494949"> Login</Typography>
              <TextField 
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                sx={{ marginBottom: 3}}
              />
              <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    sx={{ marginBottom: 2}}
              />
              <Box sx={{ display: 'flex', marginBottom: 4, flexDirection: 'column', alignItems: 'center'}}>
              <Link to="/reset">Forgot Password?</Link>
              </Box>
                <Stack direction="row" mb={5} spacing={3}>
                  <Button variant="contained" sx={{ bgcolor: '#996BFF', width: 300, height: 40 }} onClick={() => logInWithEmailAndPassword(email, password)}>Log in</Button>
                </Stack>           
                <div>
                Don't have an account? <Link to="/register">Register</Link> now.
                </div>            
          </Box>
        </Grid>
        </Grid>
        </Box>
  );
}

export default SignIn