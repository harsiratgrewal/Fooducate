import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link,useNavigate } from "react-router-dom";
import { TextField, Button, Stepper, Step, StepLabel, Container, Box, Typography, Stack, Divider } from '@mui/material';
import {
  auth,
  signInWithGoogle,
} from "../firebase/firebase";
import { styled } from '@mui/material/styles';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Paper from '@mui/material/Paper';
import setUserDocument from '../firebase/setUserDocument';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import PropTypes from 'prop-types';
import Check from '@mui/icons-material/Check';


const steps = [{number: '01', name: 'Account details'}, {number: '02', name: 'Meal targets'}, {number: '03', name: 'Health goals'}];

const Connector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const StepIconRoot = styled('div')(({ theme, ownerState }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  ...(ownerState.active && {
    color: '#8B61E8',
  }),
  '& .StepIcon-completedIcon': {
    color: '#8B61E8',
    zIndex: 1,
    fontSize: 20,
  },
  '& .StepIcon-circle': {
    width: 15,
    height: 15,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}));

StepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
};


function StepIcon(props) {
  const { active, completed, className } = props;

  return (
    <StepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="StepIcon-completedIcon" />
      ) : (
        <div className="StepIcon-circle" />
      )}
    </StepIconRoot>
  );
}

function Register() {
  const [activeStep, setActiveStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fats, setFats] = useState('');
  const [proteins, setProteins] = useState('');
  const [carbs, setCarbs] = useState('');
  const [goals, setGoals] = useState(['', '', '']);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleGoalChange = (index, value) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);
  };
  

  const handleRegister = async () => {
    setError(null);
    try {
      if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
        throw new Error('Name, Email, and Password cannot be empty.');
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setUserDocument(userCredential.user, { firstName, lastName, password, fats, proteins, carbs, goals });
      console.log('User registered and document created');
      navigate('/dashboard'); // Redirect to the dashboard
    } catch (error) {
      setError(error.message);
      console.error('Error registering user: ', error);
    }
  };
  
  return (
    <>
    <Box sx={{ width: '100%',  height: '100vh', bgcolor: '#F0F3FF', display: 'flex', alignItems: 'center', flexDirection: 'column', padding: 5}}>

            <Paper elevation={1}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '60%',
                bgcolor: '#FFFFFF',
                height: '100vh',
                borderRadius: 3
              }}
            
            >
            <Stepper sx={{ padding: 3, width: '100%'  }} connector={<Connector />} activeStep={activeStep}>
              {steps.map((label) => (
                <Step key={label}>
                  
                  <StepLabel StepIconComponent={StepIcon}>
                    <Stack gap={1} alignItems="center" direction="row">
                      <Typography color="#494949" sx={{ fontSize: 20, fontWeight: 'bold'}}>{label.number}</Typography>
                      <Typography color="#494949" sx={{ fontSize: 16}}>{label.name}</Typography>
                    </Stack>
                    </StepLabel>   
                </Step>
              ))}
            </Stepper>
            <Divider flexItem />
            <Box sx={{ padding: 3, marginTop: 3 }}>
              {activeStep === 0 && (
                <>
                  <Typography color="#494949" sx={{ fontSize: 20, fontWeight: 'bold'}}> Create an account </Typography>
                  <Typography color="#494949" sx={{ fontSize: 15, fontWeight: 'regular',  marginBottom: 2}}> Enter your account details </Typography>
                  <TextField
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    variant="outlined"
                    sx={{ width: '49%', marginBottom: 2 }}
                    margin="normal"
                  />
                  <TextField
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    variant="outlined"
                    sx={{ width: '49%', marginLeft: 1, marginBottom: 2}}
                    margin="normal"
                  />
                  <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                    margin="normal"
                  />
                  <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                    margin="normal"
                  />
                  {error && <p style={{ color: 'red' }}>{error}</p>}
                </>
              )}
                {activeStep === 1 && (
                  <>
                    <Typography color="#494949" sx={{ fontSize: 20, fontWeight: 'bold'}}> Meal targets </Typography>
                    <Typography color="#494949" sx={{ fontSize: 15, fontWeight: 'regular',  marginBottom: 2}}> Enter your daily target goal for each macronutrient in grams </Typography>
                    <TextField
                      label="Fats (grams)"
                      value={fats}
                      onChange={(e) => setFats(e.target.value)}
                      variant="outlined"
                      sx={{ marginBottom: 2}}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Proteins (grams)"
                      value={proteins}
                      onChange={(e) => setProteins(e.target.value)}
                      variant="outlined"
                      sx={{ marginBottom: 2}}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Carbs (grams)"
                      value={carbs}
                      onChange={(e) => setCarbs(e.target.value)}
                      variant="outlined"
                      sx={{ marginBottom: 2}}
                      fullWidth
                      margin="normal"
                    />
                  </>
                )}
                  {activeStep === 2 && (
                    <>
                      <Typography color="#494949" sx={{ fontSize: 20, fontWeight: 'bold'}}> Health goals </Typography>
                      <Typography color="#494949" sx={{ fontSize: 15, fontWeight: 'regular',  marginBottom: 2}}> Enter 3 health goals you want to achieve through using Fooducate</Typography>
                      <TextField
                        label="Health Goal 1"
                        value={goals[0]}
                        onChange={(e) => handleGoalChange(0, e.target.value)}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        label="Health Goal 2"
                        value={goals[1]}
                        onChange={(e) => handleGoalChange(1, e.target.value)}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        label="Health Goal 3"
                        value={goals[2]}
                        onChange={(e) => handleGoalChange(2, e.target.value)}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                    </>
                  )}
                  </Box>
                   <Box mt={4} sx={{width: '100%', padding: 3 }} display="flex" justifyContent="space-between">
                      {activeStep !== 0 && (
                        <Button 
                          variant="outlined"
                          sx={{ borderColor: '#996BFF', color: "#996BFF", width: 200, height: 40}}
                          onClick={handleBack}>
                            Back
                        </Button>
                      )}
                      {activeStep === steps.length - 1 ? (
                        <Button
                          variant="contained"
                          sx={{ bgcolor: '#996BFF', width: 200, height: 40}}
                          onClick={handleRegister}
                        >
                          Register
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ bgcolor: '#996BFF', width: 200, height: 40}}
                          onClick={handleNext}
                        >
                          Next
                        </Button>
                      )}
                    </Box>
            
            </Paper>
            </Box>
        </>
  );
}
export default Register;

