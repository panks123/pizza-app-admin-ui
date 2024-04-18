import { Button, Card, Checkbox, Flex, Form, Input, Layout, Space } from "antd";
import { LockFilled, UserOutlined, LockOutlined } from "@ant-design/icons";
import Logo from "../../components/icons/logo";

const LoginPage = () => {
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
            <Form initialValues={{ remember: true }} >
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
                <a  id="login-form-forgot" href="#">Forgot password</a>
              </Flex>

              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
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
