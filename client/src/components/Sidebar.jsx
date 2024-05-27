import React, { useState } from 'react';
import { Button, Drawer, List, ListItem, ListItemText, Toolbar } from '@mui/material';
import { UserButton, UserProfile } from '@clerk/clerk-react';

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
        <ListItem>
          <UserButton/>
        </ListItem>
        <ListItem button>
          
          <ListItemText primary="Rooms" />

        </ListItem>
        {/* Add more navigation items here */}
      </List>
    </Drawer>
    </>
    
  );
};

export default Sidebar;
