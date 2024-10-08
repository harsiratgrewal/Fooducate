import React, { useEffect, useState } from 'react';
import { auth, db, logout } from "../firebase/firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useAuthState } from "react-firebase-hooks/auth";
import AssistantIcon from '@mui/icons-material/Assistant';
import { useNavigate } from "react-router-dom";

function Header() {
  const [user, loading] = useAuthState(auth); //removed error
  const [name, setName] = useState("");
  const [logoutLoading, setLogoutLoading] = useState(false);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false); //removed isAuthenticated

  const handleChatClick = () => {
    navigate('/nutrients');
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout();
      setIsAuthenticated(false);
      navigate('/');
    } catch (err) {
      console.error(err);
      setLogoutLoading(false);
      alert("An error occurred while logging out");
    }
  };

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        const doc = await getDocs(q);
        const data = doc.docs[0].data();
        setName(data.firstName);
      } catch (err) {
        console.error(err);
        alert("An error occurred while fetching user data");
      }
    };
    if (loading) return;
    if (user) {
      setIsAuthenticated(true);
      fetchUserName();
    } else {
      setIsAuthenticated(false);
    }
  }, [user, loading, isAuthenticated]);


  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', flexDirection: 'row', marginLeft: 1, justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" color="#232530" sx={{ width: '75%' }}>Welcome back, {name} </Typography>
        <div className="d-flex flex-row w-100 me-2 justify-content-end">
          <Button disableElevation
            variant="contained"
            size="medium"
            onClick={handleChatClick}
            sx={{
              borderRadius: 2,
              marginRight: 1,
              backgroundColor: '#996BFF',
              color: '#FFFFFF',
              width: 100,
              '&:hover': {
                backgroundColor: '#6E4ABE',
              },
            }}
            startIcon={<AssistantIcon />}>
            Chat
          </Button>
          <IconButton
            size="medium"
            sx={{
              width: 40,
              borderRadius: 2,
              color: '#FFFFFF',
              backgroundColor: '#996BFF',
              '&:hover': {
                backgroundColor: '#6E4ABE',
              },
            }}
            onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </div>
      </Box>
      {logoutLoading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 2 }}>
          <CircularProgress />
          <Typography variant="h6" color="#232530" sx={{ marginTop: 1 }}>Logging out...</Typography>
        </Box>
      )}
    </React.Fragment>
  );
}

export default Header;
