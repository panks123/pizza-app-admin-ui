import { useQuery } from "@tanstack/react-query";
import { Card, Col, Form, Row, Select } from "antd";
import { getTenants } from "../../../http/api";
import { Tenant } from "../../../types";
import { useAuthStore } from "../../../store";
import { UserRole } from "../../../constants";

const OrderFilters = () => {
  const {user} = useAuthStore();
  const { data: restaurants } = useQuery({
    queryKey: ["restaurants"],
    queryFn: () => {
      // TODO: Make it dynamic by search
      return getTenants(`perPage=100&currentPage=1`).then((res) => res.data);
    },
  });
  if(user?.role === UserRole.ADMIN) // Since currently we have only tenant Id filter
  return (
    <Card>
      <Row justify="space-between">
        <Col span={24}>
          <Row gutter={18}>
            {/* <Col span={6}> // TODO: Add pattern search by id later
              <Form.Item name="q">
                <Input.Search placeholder="Search order id" allowClear />
              </Form.Item>
            </Col> */}
            {
              user?.role === UserRole.ADMIN &&
              <Col span={6}>
                <Form.Item name="tenantId">
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select reastaurant"
                    allowClear
                  >
                    {restaurants?.data.map((restaurant: Tenant) => (
                      <Select.Option value={restaurant.id} key={restaurant.id}>
                        {restaurant.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            }
          </Row>
        </Col>
      </Row>
    </Card>
  );
  else return null;
};

export default OrderFilters;
