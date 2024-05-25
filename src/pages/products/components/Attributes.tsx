import React from "react";
import { Category } from "../../../types"
import { Card, Col, Form, Radio, Row, Switch, Typography } from "antd";

type AttributeProps = {
  selectedCategory: Category
}
const Attributes: React.FC<AttributeProps> = ({selectedCategory}) => {
  if(!selectedCategory) return null;
  return (
    <Card title={<Typography.Text>Product Price</Typography.Text>} bordered={false}>
      { selectedCategory.attributes.map((attribute) => (
        <div key={attribute.name}>
          {
            attribute.widgetType === "radio" ? (
              <Form.Item 
                label={attribute.name} 
                name={["attributes", attribute.name]}
                initialValue={attribute.defaultValue}
                rules={[
                  {
                    required: true,
                    message: "Required field"
                  }
                ]}
              >
                <Radio.Group>
                  {
                    attribute.availableOptions.map((option) => (
                      <Radio.Button value={option} key={option}>{option}</Radio.Button>
                    ))
                  }
                </Radio.Group>
              </Form.Item>
            ) : attribute.widgetType === "switch" ? (
              <Row>
                <Col>
                  <Form.Item 
                    name={["attributes", attribute.name]} 
                    valuePropName="checked" 
                    initialValue={attribute.defaultValue}
                    label={attribute.name}
                  >
                    <Switch checkedChildren="Yes" unCheckedChildren="No" />
                  </Form.Item>
                </Col>
              </Row>
            ) : null
          }
        </div>
      ))}
    </Card>
  )
}

export default Attributes
