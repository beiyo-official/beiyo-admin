// Layout.js
import React from 'react';
import { useLocation } from 'react-router-dom';
// Import your Navbar component

import SideBar from '../components/Sider';

const Layout = ({ children }) => {
  const location = useLocation();
  
  // Define paths where the navbar should not be displayed
  const noSidebarPaths = ['/'];
 
  // Check if the current path is in the no-navbar paths list
  const showNavbar = !noSidebarPaths.includes(location.pathname);
 
  return (
    <div>
      {showNavbar && <SideBar />}
      <main>{children}</main>
    </div>
  );
};

export default Layout;