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

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        breakpoint="lg"
        collapsedWidth="80"
        style={{ backgroundColor: '#001529' }}
      >
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<HomeOutlined />}>
            Hostels
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            Residents
          </Menu.Item>
          <Menu.Item key="3" icon={<DollarOutlined />}>
            Payments
          </Menu.Item>
          <Menu.Item key="4" icon={<SettingOutlined />}>
            Settings
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            fontSize: '20px',
            fontWeight: 'bold',
          }}
        >
          Beiyo Dashboard
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: '24px',
            background: '#fff',
            minHeight: '280px',
          }}
        >
          <HostelOverview />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
