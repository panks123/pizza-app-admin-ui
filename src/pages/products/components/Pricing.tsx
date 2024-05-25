import React from "react"
import { Card, Col, Form, InputNumber, Row, Space, Typography } from "antd";
import { Category } from "../../../types";
type PricingProps = {
  selectedCategory: Category
}
const Pricing: React.FC<PricingProps> = ({selectedCategory}) => {
  if(!selectedCategory) return null;
  return (
    <Card title={<Typography.Text>Product Price</Typography.Text>} bordered={false}>
      {
        Object.entries(selectedCategory.priceConfiguration).map(([configKey, configValue]) => {
          return (
            <div key={configKey}>
              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                <Typography.Text>{`${configKey} (${configValue.priceType})`}</Typography.Text>
                <Row gutter={20}>
                  {configValue.availableOptions.map((option) => (
                    <Col span={8}>
                      <Form.Item label={option} name={["priceConfiguration", 
                        JSON.stringify({
                          configKey,
                          priceType: configValue.priceType
                        }),
                        option
                      ]}>
                        <InputNumber controls={false} addonBefore="₹"/>
                      </Form.Item>
                    </Col>
                  ))}
                </Row>
              </Space>
            </div>
          )
         })
      }
    </Card>
  )
}

export default Pricing
