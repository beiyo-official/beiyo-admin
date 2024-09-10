import React from 'react';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  DollarOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import './styles/dashboard.css';
import HostelOverview from '../components/HostelOverview';
import SideBar from '../components/Sider';

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  return (
      
    <div style={{minHeight:'100vh'}}>
          <div style={{minHeight:'200px'}}>
    <HostelOverview/>
    </div>
    </div>
  
  );
};

export default Dashboard;
