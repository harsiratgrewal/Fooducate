import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Navbar from '../components/Navbar';
import Button from '@mui/material/Button';
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import Paper from '@mui/material/Paper';
import MealTargets from '../components/MealTargets';
import DailyNutrients from '../components/DailyNutrients';
import WeeklySuggestions from '../components/WeeklySuggestions';
import LogoutIcon from '@mui/icons-material/Logout';
import MonthlyNutrients from '../components/MonthlyNutrients';
import GroceryList from './GroceryList';
import IconButton from '@mui/material/IconButton';
import { auth, db, logout } from "../firebase/firebase";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { query, collection, getDocs, where } from "firebase/firestore";

import GroceryListCard from '../components/GroceryListCard';
import { Typography } from "@mui/material";

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      console.log(data)
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
  }, [user, loading]);

    return (
       <Box sx={{ display: 'flex', width: '100%' }}>
            <Navbar/>
            <Box
            component="main"
            sx={{
                bgcolor: '#F0F3FF',
                height: '100vh',
                overflow: 'auto',
                width: '100%',
                padding: 2
            }}
            >
                <Grid container spacing={1.5} columns={12}>
                    <Grid item xs={12}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="h6" color="#494949" sx={{ fontWeight: 'medium'}}>
                                Welcome back, {name}
                            </Typography>
                            <IconButton sx={{ width: 40, color: '#FFFFFF', backgroundColor: '#996BFF' }} onClick={logout}><LogoutIcon /></IconButton>
                        </Stack>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                backgroundColor: "#FEFEFF",
                                flexDirection: 'column',
                                height: 300,
                                borderRadius: 4,
                                
                                }}
                                > 

                            <DailyNutrients/>         
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper
                            
                            sx={{
                                p: 2,
                                display: 'flex',
                                backgroundColor: "#FEFEFF",
                                flexDirection: 'column',
                                height: 300,
                                borderRadius: 4
                                }}
                                >
                            <WeeklySuggestions />          
                        </Paper>
                    </Grid>
                    
                        <Grid item xs={8}>
                            <Paper
                                
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    backgroundColor: "#FEFEFF",
                                    flexDirection: 'column',
                                    justifyContent: 'space-evenly',
                                    height: 150,
                                    borderRadius: 4
                                    }}
                                    >  
                                    <MealTargets />        
                            </Paper>
                            <Paper
                                
                                sx={{
                                    p: 2,
                                    marginTop: 1.5,
                                    display: 'flex',
                                    backgroundColor: "#FEFEFF",
                                    flexDirection: 'column',
                                    height: 450,
                                    borderRadius: 4
                                    }}
                                    > 
                                <MonthlyNutrients />         
                            </Paper>
                        </Grid>

                    <Grid item xs={4}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                backgroundColor: "#FEFEFF",
                                flexDirection: 'column',
                                height: '100%',
                                borderRadius: 4
                                }}
                                >      
                            <GroceryListCard />    
                        </Paper>
                    </Grid>
                </Grid>
            </Box>


       </Box>
    )
}

export default Dashboard
