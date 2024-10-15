import React from 'react';
import {  Layout, Menu } from 'antd';
import {Grid} from '@mui/material';
import {
  UserOutlined,
  HomeOutlined,
  DollarOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import './styles/dashboard.css';
import HostelOverview from '../components/HostelOverview';
import SideBar from '../components/Sider';
import RoomOverview from '../components/RoomOverview';

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  return (
      
    <div style={{minHeight:'100vh',minWidth:'100%', paddingLeft:'9rem'}}>
      {/* <SideBar/> */}
     <Grid item xs={12} sm={6} md={4}  >
     <HostelOverview/>
     <RoomOverview/>
      </Grid>     
    
    
    </div>
  
  );
};

export default Dashboard;
