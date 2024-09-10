import React from 'react'
import { Layout, Menu } from 'antd';
const { Header, Sider, Content } = Layout;
import {
    UserOutlined,
    HomeOutlined,
    DollarOutlined,
    SettingOutlined,
  } from '@ant-design/icons';
const SideBar = () => {
  return (
    <div>
        <Sider
    collapsible
    breakpoint="lg"
    collapsedWidth="80"
    style={{ backgroundColor: '#001529',minHeight:'100%',minWidth:'30%' }}
  >
    <div className="logo" />
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

    </Menu>
  </Sider></div>
  )
}

export default SideBar