import React, { useState, useEffect } from "react";
import { collection, query, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Box, Grid, Paper } from '@mui/material';
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
  const [objectivesCount, setObjectivesCount] = useState({});
  const [completedCount, setCompletedCount] = useState({});

  useEffect(() => {
    const fetchObjectives = async (uid) => {
      try {
        const q = query(collection(db, `users/${uid}/objectives`));
        const querySnapshot = await getDocs(q);
        const objectivesArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        calculateCounts(objectivesArray); // Pass fetched objectives directly to the calculation
      } catch (error) {
        console.error("Error fetching objectives: ", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchObjectives(user.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [user]);

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

  // Function to assign colors to categories
  const getColorForCategory = (index) => {
    const colors = ['#FF4500', '#4EE6D1', '#FFF275', '#E0479E', '#8B61E8', '#00BBF9']; // Your custom colors
    return colors[index % colors.length];
  };

  const pieChartData = categories.map((category, index) => ({
    id: category,
    value: objectivesCount[category] || 0,
    label: category,
    color: getColorForCategory(index) // Assign a color based on the category index
  }));

  const developedAreasData = categories.map(category => ({
    category,
    completedPercentage: (completedCount[category] / (objectivesCount[category] || 1)) * 100 // Avoid division by zero
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
                  <AddObjective />
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
              elevation={0}
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