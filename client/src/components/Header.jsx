import React from 'react';
import { AppBar, Stack, Toolbar, Typography } from '@mui/material';
import Sidebar from './Sidebar';


const Header = () => {
  return (
    <AppBar position="fixed" sx={{ zIndex: 1 }}>
      <Toolbar sx={{display:'flex', justifyContent:'space-between' }} >
 
    <Typography variant="h6" noWrap component="div">
          Dashboard
        </Typography>
        <Sidebar />

        
      </Toolbar>
     
    </AppBar>
  );
};

export default Header;
