import React, { useState } from 'react';
import { Button, Drawer, List, ListItem, ListItemText, Toolbar } from '@mui/material';
import { UserButton, UserProfile } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [toggleDrawer,setToggleDrawer]=useState(false);
  return (
    <>
    <Button   variant="contained"
                  color="secondary"
                   onClick={()=>{setToggleDrawer(true)}}>Open SideBar</Button>
    <Drawer
    open={toggleDrawer} onClose={()=>{setToggleDrawer(false)}}
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <List>
        <ListItem button component={Link} to="/rooms">
          <ListItemText primary="Rooms" />
        </ListItem>
        <ListItem button component={Link} to="/hostels">
          <ListItemText primary="Hostels" />
        </ListItem>
        {/* Add more list items here as needed */}
      </List>
    </Drawer>
    </>
    
  );
};

export default Sidebar;
