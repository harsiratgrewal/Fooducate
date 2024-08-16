import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Stepper, Step, StepLabel, Box, Typography, Stack, Divider, Grid, InputLabel, Select, Chip, MenuItem, FormControl } from '@mui/material';
import {
  auth,
} from "../firebase/firebase";
import { styled } from '@mui/material/styles';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Paper from '@mui/material/Paper';
import setUserDocument from '../firebase/setUserDocument';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import PropTypes from 'prop-types';
import Check from '@mui/icons-material/Check';


const steps = [{number: '01', name: 'Account details'}, {number: '02', name: 'Nutritional daily targets'}, {number: '03', name: 'Personal info'}];

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
      borderRadius: 7
    },
    '&:hover fieldset': {
      borderColor: '#996BFF', // Border color on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#996BFF', // Border color when focused
    },
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
  const [budgetGoal, setBudgetGoal] = useState('');
  const [macronutrientToImprove, setMacronutrientToImprove] = useState("");
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [fats, setFats] = useState('');
  const [proteins, setProteins] = useState('');
  const [carbs, setCarbs] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const macronutrientOptions = ["Fats", "Proteins", "Carbs"];
  const likeOptions = ["High Protein", "Low Carbs", "Sweet", "Salty", "Spicy", "Vegetarian", "Vegan"];
  const dislikeOptions = ["High Sugar", "Gluten", "Dairy", "Fried Foods", "Bitter Foods"];
  const handleChipClick = (option, type) => {
    if (type === "like") {
      setLikes((prev) =>
        prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
      );
    } else if (type === "dislike") {
      setDislikes((prev) =>
        prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
      );
    }
  };


  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleRegister = async () => {
    setError(null);
    try {
      if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
        throw new Error('Name, Email, and Password cannot be empty.');
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setUserDocument(userCredential.user, { firstName, lastName, password, fats, proteins, carbs, budgetGoal, likes, dislikes, macronutrientToImprove  });
      console.log('User registered and document created');
      navigate('/dashboard'); // Redirect to the dashboard
    } catch (error) {
      setError(error.message);
      console.error('Error registering user: ', error);
    }
  };
  
  return (
    <>
    <Box sx={{ width: '100%', justifyContent: 'center', height: '100vh', bgcolor: '#F0F3FF', display: 'flex', alignItems: 'center', flexDirection: 'column', padding: 2}}>

            <Paper elevation={1}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '50%',
                overflow: 'auto',
                bgcolor: '#FFFFFF',
                borderRadius: 3
              }}
            
            >
            <Stepper sx={{ padding: 3, width: '100%'  }} connector={<Connector />} activeStep={activeStep}>
              {steps.map((label) => (
                <Step key={label}>
                  
                  <StepLabel StepIconComponent={StepIcon}>
                    <Stack gap={1} alignItems="center" direction="row">
                      <Typography color="#494949" sx={{ fontSize: 20, fontWeight: 'bold'}}>{label.number}</Typography>
                      <Typography color="#494949" sx={{ fontSize: 18, textAlign: 'center'}}>{label.name}</Typography>
                    </Stack>
                    </StepLabel>   
                </Step>
              ))}
            </Stepper>
            <Divider flexItem />
              {activeStep === 0 && (
                <Box sx={{ paddingLeft: 3, paddingRight: 2, paddingBottom: 3,  marginTop: 1 }}>
                <div className="w-100 d-flex pb-4 flex-column justify-content-start align-content-center">
                  <Typography variant="h5" color="#232530"> Create an account </Typography>
                  <Typography  color="#232530" variant="subtitle1"> Enter your account details </Typography>
                  </div>
                  <Grid container rowSpacing={3} columnSpacing={3}>
                    <Grid item xs={6}>
                  <CustomTextField
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    variant="outlined"
                    fullWidth
                    
                  />
                  </Grid>
                  <Grid item xs={6}>
                  <CustomTextField
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    variant="outlined"
                    fullWidth
                    
                  />
                  </Grid>
                  <Grid item xs={12}>
                  <CustomTextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    sx={{ paddingTop: 0 }}
                    
                  />
                  </Grid>
                  <Grid item xs={12}>
                  <CustomTextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    
                  />
                  </Grid>
                  {error && <p style={{ color: 'red' }}>{error}</p>}
                  </Grid>
                </Box>
              )}
                {activeStep === 1 && (
                  
                  <Box sx={{ width: '100%', paddingLeft: 3, paddingRight: 3, paddingBottom: 3,  marginTop: 1 }}>
                    <div className="w-100 d-flex pb-4 pt-2 flex-column justify-content-start align-content-center">
                      <Typography variant="h5" color="#232530"> Daily macronutrients targets </Typography>
                      <Typography  color="#232530" variant="subtitle1">Enter your daily target goal for each macronutrient in grams </Typography>
                    </div>
                    <Grid container rowSpacing={3} columnSpacing={3}>
                    <Grid item xs={12}>
                    <CustomTextField
                      label="Fats (grams)"
                      value={fats}
                      onChange={(e) => setFats(e.target.value)}
                      variant="outlined"
                      fullWidth
                     
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <CustomTextField
                      label="Proteins (grams)"
                      value={proteins}
                      onChange={(e) => setProteins(e.target.value)}
                      variant="outlined"
                      fullWidth
                      
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <CustomTextField
                      label="Carbs (grams)"
                      value={carbs}
                      onChange={(e) => setCarbs(e.target.value)}
                      variant="outlined"
                      fullWidth
                      
                    />
                    </Grid>
                    </Grid>
                    </Box>
                  
                )}
                  {activeStep === 2 && (
              <Box sx={{ width: "100%", paddingLeft: 3, paddingRight: 3, paddingBottom: 3, marginTop: 1 }}>
                <div className="w-100 d-flex pb-4 pt-2 flex-column justify-content-start align-content-center">
                  <Typography variant="h5" color="#232530">
                    Personal info
                  </Typography>
                  <Typography color="#232530" variant="subtitle1">
                    Enter setup information
                  </Typography>
                </div>
                <Grid container rowSpacing={3} columnSpacing={3}>
                  <Grid item xs={12}>
                    <CustomTextField
                      label="Weekly grocery budget goal"
                      value={budgetGoal}
                      onChange={(e) => setBudgetGoal(e.target.value)}
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>What macronutrient do you want to improve your intake for?</InputLabel>
                      <Select
                        value={macronutrientToImprove}
                        onChange={(e) => setMacronutrientToImprove(e.target.value)}
                        label="What macronutrient do you want to improve your intake for?"
                      >
                        {macronutrientOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" color="#232530">
                      Likes
                    </Typography>
                    <Stack direction="row" gap={1} flexWrap="wrap">
                      {likeOptions.map((option) => (
                        <Chip
                          key={option}
                          label={option}
                          clickable
                          sx={{
                            backgroundColor: likes.includes(option) ? "#996BFF" : "default",
                            color: likes.includes(option) ? "#fff" : "default",
                            "&:hover": {
                              backgroundColor: likes.includes(option) ? "#996BFF" : "#e0e0e0",
                            },
                          }}
                          onClick={() => handleChipClick(option, "like")}
                        />
                      ))}
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" color="#232530">
                      Dislikes
                    </Typography>
                    <Stack direction="row" gap={1} flexWrap="wrap">
                      {dislikeOptions.map((option) => (
                        <Chip
                          key={option}
                          label={option}
                          clickable
                          sx={{
                            backgroundColor: dislikes.includes(option) ? "#996BFF" : "default",
                            color: dislikes.includes(option) ? "#fff" : "default",
                            "&:hover": {
                              backgroundColor: dislikes.includes(option) ? "#996BFF" : "#e0e0e0",
                            },
                          }}
                          onClick={() => handleChipClick(option, "dislike")}
                        />
                      ))}
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
        )}
                  
                   <Box sx={{width: '100%', paddingLeft: 3, paddingRight: 3, paddingBottom: 4 }} display="flex" justifyContent="space-between">
                      {activeStep !== 0 && (
                        <Button 
                          variant="outlined"
                          sx={{ 
                            borderColor: '#767676', 
                            color: "#767676", 
                            width: 120, 
                            height: 40,
                            '&:hover': {
                              backgroundColor: 'rgba(118, 118, 118, 0.15)', // Custom hover background color
                              borderColor: '#767676'
                            }, 
                          
                          }}
                          onClick={handleBack}>
                            Back
                        </Button>
                      )}
                      {activeStep === steps.length - 1 ? (
                        <Button
                          variant="contained"
                          disableElevation
                          sx={{ 
                            bgcolor: '#996BFF', 
                            width: 120, 
                            height: 40,
                            '&:hover': {
                            backgroundColor: '#6E4ABE', // Custom hover background color
                            },
                          }}
                          onClick={handleRegister}
                        >
                          Register
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          disableElevation
                          sx={{ 
                            bgcolor: '#996BFF', 
                            width: 120, 
                            height: 40,
                            '&:hover': {
                            backgroundColor: '#6E4ABE', // Custom hover background color
                            },
                          }}
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

