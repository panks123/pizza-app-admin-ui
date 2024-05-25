import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Col,
  Form,
  FormInstance,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Typography,
} from "antd";
import { getCategories, getTenants } from "../../../http/api";
import { Category, Tenant } from "../../../types";
import Pricing from "../components/Pricing";
import Attributes from "../components/Attributes";
import React, { useMemo } from "react";
import ProductImage from "./ProductImage";
import { useAuthStore } from "../../../store";
import { UserRole } from "../../../constants";

const ProductForm: React.FC<{form: FormInstance, isEditMode: boolean}> = ({ isEditMode = false, form }) => {
    const {user} = useAuthStore();
  const selectedCategory = Form.useWatch("categoryId");
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      // TODO: Make it dynamic by search
      return getCategories().then((res) => res.data);
    },
  });

  const { data: tenants } = useQuery({
    queryKey: ["tenants"],
    queryFn: () => {
      // TODO: make this dynamic, like search for tenants in the input
      return getTenants(`perPage=100&currentPage=1`).then((res) => res.data);
    },
  });

  const categoryMap = useMemo(() => {
    const map = new Map();
    categories?.forEach((item: Category) => {
      map.set(item._id, item);
    });
    return map;
  }, [categories]);

  return (
    <Row>
      <Col span={24}>
        <Space size="middle" direction="vertical">
          <Card title="Product info">
            <Row gutter={18}>
              <Col span={12}>
                <Form.Item
                  label="Product Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Required field!",
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Category"
                  name="categoryId"
                  rules={[
                    {
                      required: true,
                      message: "Required field!",
                    },
                  ]}
                >
                  <Select
                    size="large"
                    style={{ width: "100%" }}
                    placeholder="Select Category"
                    onChange={() => {}}
                    allowClear={!isEditMode}
                  >
                    {categories?.map((category: Category) => (
                      <Select.Option key={category._id} value={category._id}>
                        {category.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Description"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Required field!",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={2}
                    maxLength={100}
                    size="large"
                    style={{ resize: "none" }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title="Product Image">
            <Row gutter={18}>
              <Col span={12}>
                <ProductImage initialImage={isEditMode ? form.getFieldValue("image") : null}/>
              </Col>
            </Row>
          </Card>
          {
            user?.role === UserRole.ADMIN && 
            <Card title="Restaurant info">
                <Row gutter={18}>
                <Col span={24}>
                    <Form.Item
                    label="Restaurant"
                    name="tenantId"
                    rules={[
                        {
                        required: true,
                        message: "Required field!",
                        },
                    ]}
                    >
                    <Select
                        size="large"
                        style={{ width: "100%" }}
                        placeholder="Select restaurant"
                        onChange={() => {}}
                    >
                        {tenants?.data.map((tenant: Tenant) => (
                        <Select.Option key={tenant.id} value={String(tenant.id)}>
                            {tenant.name}
                        </Select.Option>
                        ))}
                    </Select>
                    </Form.Item>
                </Col>
                </Row>
            </Card>
          }
          {selectedCategory && (
            <>
              <Pricing selectedCategory={categoryMap.get(selectedCategory)} />
              <Attributes
                selectedCategory={categoryMap.get(selectedCategory)}
              />
            </>
          )}
          <Card title="Other properties">
            <Row gutter={18}>
              <Col span={24}>
                <Space>
                  <Form.Item name="isPublish">
                    <Switch
                      defaultChecked={false}
                      onChange={() => {}}
                      checkedChildren="Yes"
                      unCheckedChildren="No"
                    />
                  </Form.Item>
                  <Typography.Text
                    style={{ display: "block", marginBottom: "22px" }}
                  >
                    Set Published
                  </Typography.Text>
                </Space>
              </Col>
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default ProductForm;
