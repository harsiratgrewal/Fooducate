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
import 'bootstrap/dist/css/bootstrap.css';
import WeeklySuggestions from '../components/WeeklySuggestions';
import LogoutIcon from '@mui/icons-material/Logout';
import HealthGoals from "../components/HealthGoals";
import MonthlyNutrients from '../components/MonthlyNutrients';
import IconButton from '@mui/material/IconButton';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { auth, db, logout } from "../firebase/firebase";
import Stack from '@mui/material/Stack';
import { query, collection, getDocs, where } from "firebase/firestore";
import GroceryListCard from '../components/GroceryListCard';
import { autocompleteClasses, Typography } from "@mui/material";
import Header from "../components/Header";

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [userInfo, setUserInfo] = useState({})

  const navigate = useNavigate();
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      setUserInfo(data)
      console.log(userInfo)
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
            }}
            >
                <Grid container sx={{ paddingLeft: 1.5  }} spacing={1.5} columns={18}>
                        <Grid item xs={14} xl={13} lg={13} sx={{ paddingBottom: 1 }}>
                        <div className="row mt-1 g-2">
                            <div className="col-12">
                                <div className="row mb-2">
                                    <Header />
                                </div>
                            </div>
                        


                            <div className="col-12">
                                <div className="row g-2">
                                    <div className="col-6">
                                        <Paper
                                        elevation={0}
                                            sx={{
                                                p: 2,
                                                display: 'flex',
                                                backgroundColor: "#FEFEFF",
                                                flexDirection: 'column',
                                                height: 300,
                                                borderRadius: 4,
                                                width: '100%'
                                                
                                                }}
                                                > 

                                            <DailyNutrients/>         
                                        </Paper>
                                    </div>
                                    <div className="col-6">
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                display: 'flex',
                                                backgroundColor: "#FEFEFF",
                                                flexDirection: 'column',
                                                height: 300,
                                                borderRadius: 4
                                                }}
                                                >
                                            <MonthlyNutrients />          
                                        </Paper>

                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="row g-2">
                                    <div className="col-7">
                                        <div className="col-12">
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                display: 'flex',
                                                backgroundColor: "#FEFEFF",
                                                flexDirection: 'column',
                                                height: '100%',
                                                borderRadius: 4,
                                                
                                                }}
                                                > 

                                            <MealTargets />        
                                        </Paper>
                                        </div>
                                        <div className="col-12 h-75">
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                marginTop: 1,
                                                p: 2,
                                                display: 'flex',
                                                backgroundColor: "#FEFEFF",
                                                flexDirection: 'column',
                                                height: '100%',
                                                borderRadius: 4,
                                                
                                                }}
                                                > 
                                                
                                        <HealthGoals />
                                        </Paper>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        </Grid>
                        <Grid item xs={4} lg={5} xl={5} sx={{ paddingBottom: 0, paddingTop: 0, height: '100%' }}>
                            <div>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        borderRadius: 0,
                                        padding: 0,
                                        display: 'flex',
                                        backgroundColor: "#FEFEFF",
                                        flexDirection: 'column',
                                        
                                        }}
                                        >
                                    <WeeklySuggestions />
                                </Paper>
                            </div>
                        </Grid>

                </Grid>
            </Box>


       </Box>
    )
}

export default Dashboard;
