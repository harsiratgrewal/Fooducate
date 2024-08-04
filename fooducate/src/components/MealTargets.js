import { Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Card from '@mui/material/Card';
import { auth, db, logout } from "../firebase/firebase";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuthState } from "react-firebase-hooks/auth";
import EditDialog from './EditDialog';
import { onAuthStateChanged } from 'firebase/auth';


export default function MealTargets() {
  const [userInfo, setUserInfo] = useState({});
  const [user, loading, error] = useAuthState(auth);
  const [userId, setUserId] = useState(null);
  const [fats, setFats] = useState();
  const [proteins, setProteins] = useState();
  const [carbs, setCarbs] = useState();

  useState(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        console.log(user.uid)
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchUserMealTargets = async () => {
        try {
          const docRef = doc(db, 'users', userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFats(data.fats);
            setProteins(data.proteins);
            setCarbs(data.carbs);
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user meal targets:', error);
        }
      };

      fetchUserMealTargets();
    }
  }, [userId]);
  
  return (
    <React.Fragment>
        <React.Fragment>
            <Stack spacing={2} direction="row" justifyContent="space-between" alignItems="center" sx={{ paddingBottom: 2 }}>
                <Typography variant="h6" color="#494949" sx={{ fontWeight: 'medium'}}>
                    Meal Targets
                </Typography>
                <EditDialog />
            </Stack>
            <Stack spacing={2} direction="row" justifyContent="space-between" alignItems="center">
                <Card variant="outlined" sx={{ borderColor: "#E4E6F0", borderWidth: 2, display: 'flex', justifyContent: 'space-between', flexDirection: 'row', width: '100%',  alignItems: 'center', padding: 1, borderRadius: 2}}>
                    <Typography color="#3F3F3F" className="fw-medium" variant="body1">
                        Carbs
                    </Typography>
                    <Stack direction="row" justifyContent="space-around" alignItems="flex-end">
                    <Typography color="#6D4CB5" fontSize={20} lineHeight={1}>
                        {carbs}
                    </Typography>
                    <Typography color="#6B747E" variant="body2" lineHeight={1}>
                        gm
                    </Typography>
                    </Stack>
                </Card>
                <Card variant="outlined" sx={{ borderColor: "#E4E6F0", borderWidth: 2, display: 'flex', justifyContent: 'space-between', flexDirection: 'row', width: '100%', alignItems: 'center', padding: 1, borderRadius: 2}}>
                    <Typography className="fw-medium" variant="body1" color="#3F3F3F">
                        Protein
                    </Typography>
                    <Stack direction="row" justifyContent="space-around" alignItems="flex-end">
                    <Typography color="#35348A" fontSize={20} lineHeight={1}>
                        {proteins}
                    </Typography>
                    <Typography color="#6B747E" variant="body2" lineHeight={1}>
                        gm
                    </Typography>
                    </Stack>
                </Card>
                <Card variant="outlined" sx={{ borderColor: "#E4E6F0", borderWidth: 2, display: 'flex', justifyContent: 'space-between', flexDirection: 'row', width: '100%', alignItems: 'center', padding: 1, borderRadius: 2}}>
                    <Typography className="fw-medium" variant="body1" color="#3F3F3F">
                        Fats
                    </Typography>
                    <Stack direction="row" justifyContent="space-around" alignItems="flex-end">
                    <Typography color="#6971B9" fontSize={20} lineHeight={1}>
                        {fats}
                    </Typography>
                    <Typography color="#6B747E" variant="body2" lineHeight={1}>
                        gm
                    </Typography>
                    </Stack>
                </Card>
            </Stack>
        </React.Fragment>
    </React.Fragment>
  )
}

