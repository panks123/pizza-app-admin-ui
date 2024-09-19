import {
  Avatar,
  Breadcrumb,
  Card,
  Col,
  Flex,
  List,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import { Link, useParams } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import { orderStatusColors } from "../../constants";
import { capitalize } from "lodash";
import { useQuery } from "@tanstack/react-query";
import { getOrderDetails } from "../../http/api";
import { Order } from "../../types";

const OrderDetails = () => {
  const { id } = useParams();
  const orderId = id as string;
  const { data: orderDetails } = useQuery<Order>({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const queryString = new URLSearchParams({
        fields:
          "cart,address,paymentMode,paymentStatus,total,orderStatus,comment,paymentStatus",
      }).toString();
      return await getOrderDetails(orderId, queryString).then(
        (res) => res.data
      );
    },
  });
  if (!orderDetails) {
    return <p>Cannot find this order</p>;
  }
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Flex justify="space-between">
        <Breadcrumb
          items={[
            { title: <Link to="/">Dashboard</Link> },
            { title: <Link to="/orders">Orders</Link> },
            { title: `Order #${id}` },
          ]}
          separator={<RightOutlined />}
        />
      </Flex>

      <Row gutter={24}>
        <Col span={14}>
          <Card
            title="Order Details"
            extra={
              <Tag
                bordered={false}
                color={
                  orderStatusColors[orderDetails.orderStatus] ?? "processing"
                }
              >
                {capitalize(orderDetails.orderStatus)}
              </Tag>
            }
          >
            <List
              itemLayout="horizontal"
              dataSource={orderDetails.cart}
              renderItem={(item, index) => {
                const toppingsList = item.chosenConfiguration.selectedToppings
                  .map((topping) => topping.name)
                  .join(", ");
                const configuration = Object.entries(
                  item.chosenConfiguration?.priceConfiguration
                )
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(", ");
                let description = "";
                if (toppingsList) {
                  description += `Toppings: ${toppingsList}`;
                }
                return (
                  <List.Item key={index}>
                    <List.Item.Meta
                      avatar={<Avatar src={item.image} />}
                      title={item.name}
                      description={
                        <Space size={"large"}>
                          <Typography.Text>{description}</Typography.Text>
                          <Typography.Text>{configuration}</Typography.Text>
                        </Space>
                      }
                    />
                    <Typography.Text>
                      {item.qty} {item.qty > 1 ? "items" : "item"}
                    </Typography.Text>
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>
        <Col span={10}>
          <Card title="Customer Details">Card Content</Card>
        </Col>
      </Row>
    </Space>
  );
};

export default OrderDetails;
