import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Navbar from '../components/Navbar';
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import Paper from '@mui/material/Paper';
import DailyNutrients from '../components/DailyNutrients';
import 'bootstrap/dist/css/bootstrap.css';
import WeeklySuggestions from '../components/WeeklySuggestions';
import WeeklyNutrients from '../components/MonthlyNutrients';
import { auth, db } from "../firebase/firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import Header from "../components/Header";
import { Typography } from "@mui/material";
import carbsIcon from '../img/wheatcarbs.svg';
//import EditIcon from '@mui/icons-material/Edit';
import proteinIcon from '../img/proteindrumstick2.svg';
import fatsIcon from '../img/droplet.svg';
//import TopFavoritedMeals from "../components/TopFavoriteMeals";
import ObjectivesCard from "../components/ObjectivesCard";
import FavoriteMealsCarousel from "../components/FavoriteMealsCarousel";
import EditDialog from "../components/EditDialog";
import EditProtein from "../components/EditProtein";
import EditCarbs from "../components/EditCarbs";

function Dashboard() {
  const [user, loading ] = useAuthState(auth);
  const [userInfo, setUserInfo] = useState({})

  const navigate = useNavigate();

   useEffect(() => {
    const fetchUserName = async () => {
        if (user) {
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            if (doc.docs.length > 0) {
            const data = doc.docs[0].data();
            setUserInfo(data);
            }
        } catch (err) {
            console.error(err);
        }
        }
    };   
    if (loading) return; // Wait for loading to complete
    if (!user) {
      navigate("/");
    } else {
      fetchUserName();
    }
  }, [user, loading, navigate]);

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
                <Grid container sx={{ paddingLeft: 1.5, height: '100vh'  }} spacing={1.5} columns={18}>
                        <Grid item xs={14} xl={13} lg={13} sx={{ paddingBottom: 1 }}>
                        <div className="row mt-1 g-2">
                            <div className="col-12">
                                <div className="row mb-2">
                                    <Header />
                                </div>
                            </div>
                        


                            <div className="col-12">
                                <div className="row g-2">
                                    <div className="col-8">
                                        <Paper
                                        elevation={0}
                                            sx={{
                                                p: 2,
                                                display: 'flex',
                                                backgroundColor: "#FEFEFF",
                                                flexDirection: 'column',
                                                height: 400,
                                                borderRadius: 4,
                                                width: '100%'
                                                
                                                }}
                                                > 
                                                <WeeklyNutrients />  
                                                    
                                        </Paper>
                                    </div>
                                    <div className="col-4 d-flex flex-column">
                                        <div style={{ height: '100%', marginBottom: '0.75rem' }}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                display: 'flex',
                                                backgroundColor: "#FEFEFF",
                                                flexDirection: 'row',
                                                justifyContent: 'start',
                                                alignItems: 'center',
                                                height: '100%',
                                                borderRadius: 4,
                                                alignContent: 'center'
                                            }}
                                            >
                                            <Box sx={{ display: 'flex', width: '20%', color: '#232530', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 1, height: '80%', borderRadius: 2, backgroundColor: 'rgba(231, 233, 243, 0.60)'}}>
                                                <img src={fatsIcon} alt="protein icon" style={{ width: 40, height: 40 }} />
                                            </Box>
                                            <Box sx={{ width: '70%', marginLeft: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                <Typography sx={{ color: '#232530' }} variant="h4">{userInfo.fats}g</Typography>
                                                <Typography sx={{ color: '#232530' }} variant="body1">Daily fats intake goal</Typography>
                                            </Box> 
                                            <Box sx={{ paddingTop: 1, alignItems: 'center', width: '10%', height: '100%', display: 'flex', flexDirection: 'column' }}>  
                                                <EditDialog />
                                            </Box>
                                                     
                                        </Paper>
                                        </div>
                                        <div style={{ height: '100%', marginBottom: '0.75rem'}}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                display: 'flex',
                                                backgroundColor: "#FEFEFF",
                                                flexDirection: 'row',
                                                justifyContent: 'start',
                                                alignItems: 'center',
                                                height: '100%',
                                                borderRadius: 4,
                                                alignContent: 'center'
                                            }}
                                            >
                                            <Box sx={{ display: 'flex', width: '20%', color: '#232530', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 1, height: '80%', borderRadius: 2, backgroundColor: 'rgba(231, 233, 243, 0.60)'}}>
                                                    <img src={proteinIcon} alt="protein icon" style={{ width: 40, height: 40, transform: 'rotate(180deg)' }} />
                                            </Box>
                                            <Box sx={{ width: '70%', marginLeft: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                <Typography sx={{ color: '#232530' }} variant="h4">{userInfo.proteins}g</Typography>
                                                <Typography sx={{ color: '#232530' }} variant="body1">Daily protein intake goal</Typography>
                                            </Box>
                                            <Box sx={{ paddingTop: 1, alignItems: 'center', width: '10%', height: '100%', display: 'flex', flexDirection: 'column' }}>  
                                                <EditProtein />
                                            </Box>    
                                        </Paper>
                                        </div>
                                        <div style={{ height: '100%'}}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                display: 'flex',
                                                backgroundColor: "#FEFEFF",
                                                flexDirection: 'row',
                                                justifyContent: 'start',
                                                alignItems: 'center',
                                                height: '100%',
                                                borderRadius: 4,
                                                alignContent: 'center'
                                                }}
                                            >    
                                                <Box sx={{ display: 'flex', width: '20%', color: '#232530', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 1, height: '80%', borderRadius: 2, backgroundColor: 'rgba(231, 233, 243, 0.60)'}}>
                                                    <img src={carbsIcon} alt="protein icon" style={{ width: 40, height: 40 }} />
                                                </Box>
                                                <Box sx={{ width: '70%', marginLeft: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                   <Typography sx={{ color: '#232530' }} variant="h4">{userInfo.carbs}g</Typography>
                                                    <Typography sx={{ color: '#232530' }} variant="body1">Daily carb intake goal</Typography>
                                                </Box>
                                                <Box sx={{ paddingTop: 1, alignItems: 'center', width: '10%', height: '100%', display: 'flex', flexDirection: 'column' }}>  
                                                <EditCarbs />
                                                </Box>    
                                        </Paper>
                                        </div>



                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4 col-md-4 col-lg-5 col-xl-4 col-xxl-4">
                                <div style={{ height: '100%' }}>
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
                                            <FavoriteMealsCarousel />
                                                 
                                        </Paper>
                                </div>
                                        
                            </div>
                            <div className="col-sm- col-md-8 col-lg-7 col-xl-8 col-xxl-8">
                                <div style={{ height: '100%' }}>
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

                                            <WeeklySuggestions />      
                                        </Paper>
                                </div>
                                        
                            </div>
                            
                        </div>
                        </Grid>
                        <Grid item xs={4} lg={5} xl={5} sx={{ paddingBottom: 0, paddingTop: 0 }}>
                            
                                <Paper
                                    elevation={0}
                                    sx={{
                                        borderRadius: 0,
                                        padding: 2,
                                        display: 'flex',
                                        backgroundColor: "#FEFEFF",
                                        flexDirection: 'column',
                                        height: '100%'
                                        
                                        }}
                                        >
                                    <div style={{ height: '45%' }}>
                                    <DailyNutrients />
                                    </div>
                                    <div style={{ height: '55%' }}>
                                    <ObjectivesCard />
                                    </div>
                                   
                                </Paper>
                           
                        </Grid>

                </Grid>
            </Box>


       </Box>
    )
}

export default Dashboard;
