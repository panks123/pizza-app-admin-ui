import { Card, Col, Form, Input, Row } from "antd"
import React, { ReactNode } from "react"

type TenantFilterProps = {
    children: ReactNode
}

const TenantFilter: React.FC<TenantFilterProps> = ({children}) => {
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
            </Row>
        </Col>
        <Col span={8} style={{ display: "flex", justifyContent: "end"}}>
            {children}
        </Col>
      </Row>
    </Card>
  )
}

export default TenantFilter
