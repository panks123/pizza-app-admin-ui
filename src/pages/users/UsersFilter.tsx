import { Card, Col, Form, Input, Row, Select } from "antd";

import { ReactNode } from "react";

type UserFilterProps = {
    children: ReactNode
}

const UsersFilter: React.FC<UserFilterProps> = ({children}) => {
  return (
    <Card>
      <Row justify="space-between">
        <Col span={16}>
            <Row gutter={18}>
                <Col span={10}>
                    <Form.Item name="q">
                        <Input.Search placeholder="Search" allowClear/>
                    </Form.Item>
                </Col>
                <Col span={7}>
                    <Form.Item name="role">
                        <Select style={{ width: "100%" }} placeholder="Select role" allowClear >
                            <Select.Option value="admin">Admin</Select.Option>
                            <Select.Option value="manager">Manager</Select.Option>
                            <Select.Option value="customer">Customer</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                {/* <Col span={7}>
                    <Select style={{ width: "100%" }} placeholder="Status" onChange={(selectedValue) => onFilterChange("status", selectedValue)} allowClear>
                        <Select.Option value="active">Active</Select.Option>
                        <Select.Option value="ban">Inactive</Select.Option>
                    </Select>
                </Col> */}
            </Row>
        </Col>
        <Col span={8} style={{ display: "flex", justifyContent: "end"}}>
            {children}
        </Col>
      </Row>
    </Card>
  )
}

export default UsersFilter
