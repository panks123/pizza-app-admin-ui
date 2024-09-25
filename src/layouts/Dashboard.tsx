import { useEffect, useMemo, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import { BellFilled } from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Dropdown,
  Flex,
  Layout,
  Menu,
  Space,
  theme,
  notification
} from "antd";
import Logo from "../components/icons/Logo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logoutApi } from "../http/api";
import { getRoleBasedNavItems } from "./navItems";
import socket from "../lib/socket";

const { Sider, Header, Content, Footer } = Layout;

const Dashboard = () => {
  const { logout: logoutFromStore, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [api, contextHolder] = notification.useNotification();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);

  const { mutate: logoutMutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logoutApi,
    onSuccess: async () => {
      logoutFromStore();
      navigate("/auth/login", { replace: true });
      return;
    },
  });

  const navItems = useMemo(() => {
    return getRoleBasedNavItems(user?.role as string);
  }, [user]);

  useEffect(() => {
    if (user?.tenant) {
      socket.on("join", (data) => {
        console.log("Joined in : ", data.roomId);
      });

      socket.emit("join", { tenantId: user.tenant.id });

      socket.on("order-update", (data) => {
        console.log("Recieved order-update of order: ", data);
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        setTimeout(() => {
          api.success({
            key:`open${Date.now()}`,
            message: "Order Update",
            description: "New order recieved",
            placement: "bottomRight",
          });
        }, 0);
        const notificationSound = new Audio("/notification.wav");
          notificationSound.play()
          .then(() => console.log("Playing notification sound"))
          .catch((err) => console.log("Error playing sound", err));
      });
    }

    return () => {
      if (socket.connected) {
        socket.off("join");
        socket.off("order-update");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (user === null) {
    return (
      <Navigate to={`/auth/login?returnTo=${location.pathname}`} replace />
    );
  }

  return (
    <div>
      {contextHolder}
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className="logo">
            <Logo />
          </div>
          <Menu
            theme="light"
            defaultSelectedKeys={[location.pathname]}
            mode="inline"
            items={navItems}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: "0 16px", background: colorBgContainer }}>
            <Flex gap="middle" align="start" justify="space-between">
              <Badge
                text={user.role === "admin" ? "Admin" : user.tenant?.name}
                status="success"
              />
              <Space size={16}>
                <Badge dot={true}>
                  <BellFilled />
                </Badge>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "logout",
                        label: "Logout",
                        onClick: () => logoutMutate(),
                      },
                    ],
                  }}
                  placement="bottomRight"
                >
                  <Avatar
                    style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}
                  >
                    U
                  </Avatar>
                </Dropdown>
              </Space>
            </Flex>
          </Header>
          <Content style={{ margin: "18px" }}>
            <Outlet />
          </Content>
          <Footer style={{ textAlign: "center" }}>
            PizzoMoto ©{new Date().getFullYear()} Created by Pankaj Kumar
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default Dashboard;
