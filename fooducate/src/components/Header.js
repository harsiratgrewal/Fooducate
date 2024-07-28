import React, { useEffect, useState } from 'react';
import { auth, db, logout } from "../firebase/firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import { Box, Stack, Typography } from '@mui/material';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

function Header() {
 const [user, loading, error] = useAuthState(auth);
 const [name, setName] = useState("");


 const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: 10,
        backgroundColor: "#D6D9E8",
        color: "#75787E",
        '&:hover': {
            backgroundColor: "#E7E9F3",
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
   }));
    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));
    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        width: '100%',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            [theme.breakpoints.up('sm')]: {
            width: '16ch',
            '&:focus': {
                width: '24ch',
            },
            },
        },
    }));

    useEffect(() => {
        if (loading) return;
        fetchUserName();
    }, [user, loading]);

    const fetchUserName = async () => {
        try {
        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        const doc = await getDocs(q);
        const data = doc.docs[0].data();
        setName(data.name);
        
        } catch (err) {
        console.error(err);
        alert("An error occured while fetching user data");
        }
    };
  return (
    <React.Fragment>
        <Box sx={{display: 'flex', flexDirection: 'row', marginLeft: 1, justifyContent: 'between', alignItems: 'center'}}>
            <Typography variant="h6" color="#494949" sx={{ width: '75%', fontWeight: 'medium'}}>Welcome back, {name} </Typography>
            <div className="d-flex flex-row w-100 me-2 justify-content-end">
                <Search className="me-2">
                   <SearchIconWrapper>
                       <SearchIcon />
                          </SearchIconWrapper>
                              <StyledInputBase
                                 placeholder="Search…"
                                 inputProps={{ 'aria-label': 'search' }}
                                />
                                </Search>
                                <IconButton size="medium" sx={{ width: 40, borderRadius: 2, color: '#FFFFFF', backgroundColor: '#996BFF' }} onClick={logout}><LogoutIcon /></IconButton>
            </div>
        </Box>
    </React.Fragment>
  )
}

export default Header