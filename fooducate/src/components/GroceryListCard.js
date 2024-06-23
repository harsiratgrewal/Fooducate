import { Stack, Typography } from '@mui/material'
import React from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

export default function GroceryListCard() {
  return (
    <React.Fragment>
        <React.Fragment>
            <Typography variant="h6" color="#494949" sx={{ fontWeight: 'medium'}}>
                Grocery list
            </Typography>
            <List sx={{ width: '100%' }}>
                <ListItem sx={{padding: 0.5, width: '100%' }} secondaryAction={<ListItemText><Typography sx={{ fontSize: 15, color: '#636768' }}>2 dozen</Typography></ListItemText>}>
                    <ListItemButton sx={{ paddingLeft: 0 }}>
                        <ListItemIcon>
                            <Checkbox edge="start"/>
                        </ListItemIcon>
                        <ListItemText><Typography sx={{ fontSize: 18, color: '#4D5151' }}> Eggs </Typography></ListItemText>
                    </ListItemButton>
                </ListItem>

            </List>
        </React.Fragment>
    </React.Fragment>
  )
}