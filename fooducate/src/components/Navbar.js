import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import { NavLink } from "react-router-dom";
import AssessmentIcon from '@mui/icons-material/Assessment';
import ChecklistIcon from '@mui/icons-material/Checklist';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import logoFooducate from '../img/logo-fooducate.svg'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';


const drawerWidth = 190;

export default function Navbar() {
    return (
        <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: "#28243D"
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
        <img src={logoFooducate} alt="logo"/>
        <Typography variant="h6" color="#cecae3" sx={{ marginLeft: 2 }} noWrap component="div">
            Fooducate
        </Typography>
        </Toolbar>
        <Divider />
        <List>
          <NavLink to="/dashboard" exact style={({ isActive }) => ({
            color: isActive ? '#ffffff' : '#cecae3',
            backgroundColor: isActive ? '#996bff' : '#28243d',
            textDecoration: 'none'
          })}>
           <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <AssessmentIcon sx={{ color: "#cecae3"}} />
                </ListItemIcon>
                <ListItemText>
                  Dashboard
                </ListItemText>
              </ListItemButton>
            </ListItem>
            </NavLink>
            <NavLink to="/meals" style={({ isActive }) => ({
            color: isActive ? '#ffffff' : '#cecae3',
            background: isActive ? '#996BFF' : '#28243D',
            textDecoration: 'none'
          })}>
           <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <MenuBookIcon sx={{ color: "#cecae3"}}/>
                </ListItemIcon>
                <ListItemText>
                  Recipes
                </ListItemText>
              </ListItemButton>
            </ListItem>
            </NavLink>
             <NavLink to="/nutrients"  style={({ isActive }) => ({
            color: isActive ? '#ffffff' : '#cecae3',
            background: isActive ? '#996BFF' : '#28243D',
            textDecoration: 'none'
          })}>
           <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <DocumentScannerIcon sx={{ color: "#cecae3"}}/>
                </ListItemIcon>
                <ListItemText>
                  Find nutrients
                </ListItemText>
              </ListItemButton>
            </ListItem>
            </NavLink>
            <NavLink to="/mealplan"  style={({ isActive }) => ({
            color: isActive ? '#ffffff' : '#cecae3',
            background: isActive ? '#996BFF' : '#28243D',
            textDecoration: 'none'
          })}>
           <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <CalendarMonthIcon sx={{ color: "#cecae3"}}/>
                </ListItemIcon>
                <ListItemText>
                  Meal planner
                </ListItemText>
              </ListItemButton>
            </ListItem>
            </NavLink>
            <NavLink to="/grocerylist"  style={({ isActive }) => ({
            color: isActive ? '#ffffff' : '#cecae3',
            background: isActive ? '#996BFF' : '#28243D',
            textDecoration: 'none'
          })}>
           <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <ChecklistIcon sx={{ color: "#cecae3"}} />
                </ListItemIcon>
                <ListItemText>
                  Grocery list
                </ListItemText>
              </ListItemButton>
            </ListItem>
            </NavLink>
            <NavLink to="/objectives"  style={({ isActive }) => ({
            color: isActive ? '#ffffff' : '#cecae3',
            background: isActive ? '#996BFF' : '#28243D',
            textDecoration: 'none'
          })}>
           <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <EmojiEventsIcon sx={{ color: "#cecae3"}} />
                </ListItemIcon>
                <ListItemText>
                  Health goals
                </ListItemText>
              </ListItemButton>
            </ListItem>
            </NavLink>
        </List>
      </Drawer>
    )
}