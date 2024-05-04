import { Card, Col, Input, Row } from "antd"
import React, { ReactNode } from "react"

type TenantFilterProps = {
    children: ReactNode
    onFilterChange: (filterName: "search", filterValue: string) => void
}

const TenantFilter: React.FC<TenantFilterProps> = ({children, onFilterChange}) => {
  return (
    <Card>
      <Row justify="space-between">
        <Col span={16}>
            <Row gutter={18}>
                <Col span={10}>
                    <Input.Search placeholder="Search" onChange={(e) => onFilterChange("search", e.target.value)} allowClear/>
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
