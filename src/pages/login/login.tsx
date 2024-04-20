import { Alert, Button, Card, Checkbox, Flex, Form, Input, Layout, Space } from "antd";
import { LockFilled, UserOutlined, LockOutlined } from "@ant-design/icons";
import Logo from "../../components/icons/logo";
import { Credentials } from "../../../src/types"
import { useMutation, useQuery } from "@tanstack/react-query";
import { login, self, logout as logoutApi } from "../../http/api";
import { useAuthStore } from "../../store";
import { usePermisson } from "../../hooks/usePermission";

const loginUser = async (credentials: Credentials) => {
  const { data } = await login(credentials);
  return data;
}

const getSelf = async () => {
  const { data } = await self();
  return data;
} 

const LoginPage = () => {
  const { isAllowed } = usePermisson();
  const { setUser, logout } = useAuthStore();

  const { refetch } = useQuery({
    queryKey: ["self"],
    queryFn: getSelf,
    enabled: false
  })

  const { mutate: logoutMutate } = useMutation({
    mutationKey: ['login'],
    mutationFn: logoutApi,
    onSuccess: async () => {
      logout();
      return;
    }
  })

  const { mutate: loginMutate, isPending, isError, error } = useMutation({
    mutationKey: ['login'],
    mutationFn: loginUser,
    onSuccess: async () => {
      const selfUserDataPr = await refetch();
      const user = selfUserDataPr.data;
      if(!isAllowed(user)) {
        logoutMutate();
        return;
      }
      setUser(user);
    }
  });

  return (
    <>
      <Layout style={{ height: "100vh", display: "grid", placeItems: "center" }}>
        <Space direction="vertical" align="center" size="large">
          <Layout.Content style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Logo />
          </Layout.Content>
          <Card
            style={{ width: 300 }}
            bordered= {false}
            title={
              <Space style={{ width: "100%", justifyContent: "center", fontSize: 16 }}>
                <LockFilled/>
                Sign in
              </Space>
            }
          >
            <Form
              initialValues={{ remember: true }}
              onFinish={(values) =>{
                loginMutate({ email: values.username, password: values.password })
              }}
            >
              {
                isError && <Alert message = {error.message} type="error" style={{ marginBottom: 24 }}/>
              }
              <Form.Item name="username" rules={[
                { required: true, message: "Username is required!" },
                { type: "email", message: "Must be in email format!" }
              ]}>
                <Input placeholder="Username" prefix={<UserOutlined />} />
              </Form.Item>
              
              <Form.Item name="password" rules={[
                { required: true, message: "Password is required!" },
              ]}>
                <Input.Password placeholder="Password" prefix={<LockOutlined />} />
              </Form.Item>

              <Flex justify="space-between">
                <Form.Item name="remember" valuePropName="checked">
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <a id="login-form-forgot" href="#">Forgot password</a>
              </Flex>

              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: "100%" }} loading = {isPending}>
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Space>
      </Layout>
    </>
  )
}

export default LoginPage;
