import { useQuery } from "@tanstack/react-query"
import { Card, Col, Form, Input, Row, Select, Space } from "antd"
import { getTenants } from "../../../http/api";
import { Tenant } from "../../../types";

const UserForm = ({isEditMode = false} : { isEditMode: boolean}) => {
    const { data : tenants }= useQuery({
        queryKey: ["tenants"],
        queryFn: () => {
            // TODO: make this dynamic, like search for tenants in the input
            return getTenants(`perPage=100&currentPage=1`).then((res) => res.data);
        }
    })

  return (
    <Row>
        <Col span={24}>
            <Space size="middle" direction="vertical">
                <Card title= "Basic info" >
                    <Row gutter={18}>
                        <Col span={12}>
                            <Form.Item label="First Name" name="firstName" rules={[
                                {
                                    required: true,
                                    message: "Required field!"
                                }
                            ]}>
                                <Input size="large"/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Last Name" name="lastName" rules={[
                                {
                                    required: true,
                                    message: "Required field!"
                                }
                            ]}>
                                <Input size="large"/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Email" name="email" rules={[
                                {
                                    required: true,
                                    message: "Required field!"
                                },
                                {
                                    type: "email",
                                    message: "Invalid email format!"
                                }
                            ]}>
                                <Input size="large"/>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
                {
                    !isEditMode && (
                        <Card title= "Security info" >
                            <Row gutter={18}>
                                <Col span={12}>
                                    <Form.Item label="Password" name="password" rules={[
                                        {
                                            required: true,
                                            message: "Required field!"
                                        },
                                        {
                                            min: 8,
                                            message: "Should be minimum 8 characters long"
                                        }
                                    ]}>
                                        <Input size="large"/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    ) 
                }
                <Card title= "Restaurant & Role info" >
                    <Row gutter={18}>
                        <Col span={12}>
                            <Form.Item label="Restaurant" name="tenantId" rules={[
                                {
                                    required: true,
                                    message: "Required field!"
                                }
                            ]}>
                                <Select size="large" style={{ width: "100%" }} placeholder="Select restaurant" onChange={() => {}} >
                                    {
                                        tenants?.data.map((tenant: Tenant) => (
                                            <Select.Option key={tenant.id} value={tenant.id}>{tenant.name}</Select.Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Role" name="role" rules={[
                                {
                                    required: true,
                                    message: "Required field!"
                                }
                            ]}>
                                <Select size="large" style={{ width: "100%" }} placeholder="Select role" onChange={() => {}} >
                                    <Select.Option value="admin">Admin</Select.Option>
                                    <Select.Option value="manager">Manager</Select.Option>
                                    <Select.Option value="customer">Customer</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
            </Space>
        </Col>
    </Row>
  )
}

export default UserForm
