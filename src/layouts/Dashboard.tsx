import { useMemo, useState } from "react";
import {  Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import { BellFilled} from "@ant-design/icons";
import { Avatar, Badge, Dropdown, Flex, Layout, Menu, Space, theme } from "antd";
import Logo from "../components/icons/Logo";
import { useMutation } from "@tanstack/react-query";
import {logout as logoutApi} from "../http/api";
import { getRoleBasedNavItems } from "./navItems";

const { Sider, Header, Content, Footer } = Layout;

const Dashboard = () => {
  const {logout: logoutFromStore, user } = useAuthStore();
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);

  const { mutate: logoutMutate } = useMutation({
    mutationKey: ['logout'],
    mutationFn: logoutApi,
    onSuccess: async () => {
      logoutFromStore();
      navigate("/auth/login", {  replace: true });
      return;
    }
  })

  const navItems = useMemo(() => {
    return getRoleBasedNavItems(user?.role as string);
  }, [user])

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
          <Menu theme="light" defaultSelectedKeys={['/']} mode="inline" items={navItems} />
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
