import { useQuery } from "@tanstack/react-query"
import { Card, Col, Form, Input, Row, Select, Space, Switch, Typography } from "antd"
import React, { ReactNode } from "react"
import { getCategories, getTenants } from "../../../http/api"
import { Category, Tenant } from "../../../types"
import { useAuthStore } from "../../../store"
import { UserRole } from "../../../constants"

type UserFilterProps = {
    children: ReactNode
}
const ProductsFilter: React.FC<UserFilterProps> = ({children}) => {
    const {user} = useAuthStore();
    const { data: restaurants } = useQuery({
        queryKey: ["restaurants"],
        queryFn: () => {
            // TODO: Make it dynamic by search
            return getTenants(`perPage=100&currentPage=1`).then((res) => res.data);
        }
    });
    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: () => {
            // TODO: Make it dynamic by search
            return getCategories().then((res) => res.data);
        }
    });

  return (
    <Card>
        <Row justify="space-between">
            <Col span={16}>
            <Row gutter={18}>
                <Col span={6}>
                    <Form.Item name="q">
                        <Input.Search placeholder="Search" allowClear/>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item name="categoryId">
                        <Select style={{ width: "100%" }} placeholder="Select category" allowClear >
                            {   
                                categories?.map((category: Category) => (
                                    <Select.Option value={category._id}>{category.name}</Select.Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                </Col>
                {
                    user?.role === UserRole.ADMIN && 
                    <Col span={6}>
                        <Form.Item name="tenantId">
                            <Select style={{ width: "100%" }} placeholder="Select reastaurant" allowClear >
                                {
                                    restaurants?.data.map((restaurant: Tenant) => (
                                        <Select.Option value={restaurant.id} key={restaurant.id}>{restaurant.name}</Select.Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                }
                <Col span={6}>
                    <Space>
                        <Form.Item name="isPublish">
                            <Switch defaultChecked={false} onChange={() => {}}/>
                        </Form.Item>
                        <Typography.Text style={{ display: "block", marginBottom: "22px"}}>Show only Published</Typography.Text>
                    </Space>
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

export default ProductsFilter
