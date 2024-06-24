import { Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { auth, db, logout } from "../firebase/firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import AddGrocery from './AddGrocery';
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";

export default function FullGroceryList() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");

  return (
    <React.Fragment>
        <React.Fragment>
            <Typography variant="h6" color="#494949" sx={{ fontWeight: 'medium'}}>
               Grocery List
            </Typography>
            <AddGrocery />
            
        </React.Fragment>
    </React.Fragment>
  )
}