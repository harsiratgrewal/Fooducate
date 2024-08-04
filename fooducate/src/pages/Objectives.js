import React, { useState, useEffect } from "react";
import { collection, query, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { db, auth } from '../firebase/firebase';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import ObjectiveCategories from '../components/ObjectiveCategories';
import CategoryPieChart from '../components/CategoryPieChart';
import DevelopedAreas from '../components/DevelopedAreas';
import Journal from "../components/Journal";
import AddObjective from "../components/AddObjective";

const categories = ['Health', 'Fitness', 'Personal Development', 'Wellbeing', 'Fun & Recreational', 'Nutritional'];

export default function ObjectivesPage() {
  const [user, setUser] = useState(null);
  const [objectives, setObjectives] = useState([]);
  const [objectivesCount, setObjectivesCount] = useState({});
  const [completedCount, setCompletedCount] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchObjectives(user.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchObjectives = async (uid) => {
    try {
      const q = query(collection(db, `users/${uid}/objectives`));
      const querySnapshot = await getDocs(q);
      const objectivesArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setObjectives(objectivesArray);
      calculateCounts(objectivesArray);
    } catch (error) {
      console.error("Error fetching objectives: ", error);
    }
  };

  const calculateCounts = (objectives) => {
    const count = {};
    const completed = {};

    categories.forEach(category => {
      count[category] = objectives.filter(obj => obj.category === category).length;
      completed[category] = objectives.filter(obj => obj.category === category && obj.completed).length;
    });

    setObjectivesCount(count);
    setCompletedCount(completed);
  };

  const pieChartData = categories.map(category => ({
    id: category,
    value: objectivesCount[category] || 0,
    label: category
  }));

  const developedAreasData = categories.map(category => ({
    category,
    completedPercentage: (completedCount[category] / objectivesCount[category]) * 100 || 0
  }));

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          bgcolor: '#F0F3FF',
          height: '100vh',
          overflow: 'auto',
          width: '100%',
        }}
      >
        <Grid container sx={{ paddingLeft: 1.5 }} spacing={1.5} columns={16}>
          <Grid item xs={11}>
            <div className="row mt-1 g-2">
              <div className="col-12">
                <div className="row mb-2">
                  <Header />
                </div>
              </div>
              <div className="col-12">
                <div style={{ height: '100%' }}>
                  <AddObjective/>
                </div>
              </div>
              <div className="col-12">
                <div style={{ height: '100%' }}>
                  <ObjectiveCategories />
                </div>
              </div>
               <div className="col-12">
                <Journal />
              </div>
            </div>
          </Grid>

          <Grid item xs={5} sx={{ paddingBottom: 0, paddingTop: 0 }}>
            <Paper
              elevation={2}
              sx={{
                display: 'flex',
                backgroundColor: "#FEFEFF",
                flexDirection: 'column',
                height: '100%',
                padding: 0.75,
                
              }}
            >
              <CategoryPieChart data={pieChartData} />
              <DevelopedAreas data={developedAreasData} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}