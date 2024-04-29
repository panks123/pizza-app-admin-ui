import { useState } from "react";
import { NavLink, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store";
import Icon, { BellFilled} from "@ant-design/icons";
import { Avatar, Badge, Dropdown, Flex, Layout, Menu, Space, theme } from "antd";
import Logo from "../components/icons/Logo";
import UserIcon from "../components/icons/UserIcon";
import { FoodIcon } from "../components/icons/FoodIcon";
import BasketIcon from "../components/icons/BasketIcon";
import GiftIcon from "../components/icons/GiftIcon";
import DashboardIcon from "../components/icons/DashboardIcon";
import { useMutation } from "@tanstack/react-query";
import {logout as logoutApi} from "../http/api";

const { Sider, Header, Content, Footer } = Layout;

const items = [
  {
    key: "/",
    icon: <Icon component={DashboardIcon}/>,
    label: <NavLink to="/">Dashboard</NavLink>
  },
  {
    key: "/users",
    icon: <Icon component={UserIcon}/>,
    label: <NavLink to="/users">Users</NavLink>
  },
  {
    key: "/restaurants",
    icon: <Icon component={FoodIcon}/>,
    label: <NavLink to="/restaurants">Restaurants</NavLink>
  },
  {
    key: "/products",
    icon: <Icon component={BasketIcon}/>,
    label: <NavLink to="/products">Products</NavLink>
  },
  {
    key: "/promos",
    icon: <Icon component={GiftIcon}/>,
    label: <NavLink to="/promos">Promos</NavLink>
  },
]

const Dashboard = () => {
  const {logout: logoutFromStore, user } = useAuthStore();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);
  // const { user } = useAuthStore();

  const { mutate: logoutMutate } = useMutation({
    mutationKey: ['logout'],
    mutationFn: logoutApi,
    onSuccess: async () => {
      logoutFromStore();
      return;
    }
  })

  if(user === null){
    return <Navigate to="/auth/login" replace/>
  }

  return (
    <div>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider theme="light" collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div className="logo">
            <Logo/>
          </div>
          <Menu theme="light" defaultSelectedKeys={['/']} mode="inline" items={items} />
        </Sider>
        <Layout>
          <Header style={{ padding: "0 16px", background: colorBgContainer }}>
            <Flex gap="middle" align="start" justify="space-between">
              <Badge text={user.role === "admin" ? "Admin" : user.tenant?.name} status="success"/>
              <Space size={16}>
                <Badge dot={true}>
                  <BellFilled />
                </Badge>
                <Dropdown
                  menu={{ 
                    items: [
                      { key: "logout", label: "Logout", onClick: () => logoutMutate() }
                    ]
                  }} 
                  placement="bottomRight"
                >
                  <Avatar style={{ backgroundColor: "#fde3cf", color: "#f56a00"}}>U</Avatar>
                </Dropdown>
              </Space>
            </Flex>
          </Header>
          <Content style={{ margin: '18px' }}>
            <Outlet />
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Pizza Shop ©{new Date().getFullYear()} Created by Pankaj Kumar
          </Footer>
        </Layout>
      </Layout>
    </div>
  )
}

export default Dashboard;
