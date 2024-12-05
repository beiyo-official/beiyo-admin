import React, { useContext } from 'react'
import { Flex, Layout, Menu } from 'antd';
const { Header, Sider, Content } = Layout;
import {
    UserOutlined,
    HomeOutlined,
    DollarOutlined,
    SettingOutlined,
  } from '@ant-design/icons';
import AuthContext from '../context/AuthContext';

const SideBar = () => {
  const {user,logout}=useContext(AuthContext)
  return (
    <div>
        <Sider
    collapsible
    breakpoint="lg"
    collapsedWidth="80"
    style={{ backgroundColor: '#001529',minHeight:'100vh',minWidth:'30%',position:'fixed' }}
  >
    <div style={{display:'flex',flexDirection:'column',gap:'0'}}>
      <p style={{color:'white'}}>{user&&user.name}</p>
      <p style={{color:'white'}}>{user&&user.post}</p>
    </div>
    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
    <a href="/hostels"><Menu.Item key="1" icon={<HomeOutlined />}>
        Hostels
      </Menu.Item></a>
      <a href="/rooms">
      <Menu.Item key="4" icon={<HomeOutlined />}>
        Rooms
      </Menu.Item>
      </a>
      <a href="/resident">
      <Menu.Item key="2" icon={<UserOutlined />}>
        Residents
      </Menu.Item>
      </a>
    <a href="/payment">
    <Menu.Item key="3" icon={<DollarOutlined />}>
        Payments
      </Menu.Item>
    </a>
    <a href="/rent-summary">
    <Menu.Item key="3" icon={<DollarOutlined />}>
        Rent Summary
      </Menu.Item>
    </a>
    <a href="/monthly-expenses">
    <Menu.Item key="4" icon={<DollarOutlined />}>
       Monthly expenses
      </Menu.Item>
    </a>
    <button onClick={logout}>
      logout
    </button>


    </Menu>

  </Sider></div>
  )
}

export default SideBar