import {
  Avatar,
  Breadcrumb,
  Card,
  Col,
  Flex,
  List,
  Row,
  Select,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { Link, useParams } from "react-router-dom";
import { RightOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { orderStatusColors } from "../../constants";
import { capitalize } from "lodash";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changeOrderStatus, getOrderDetails } from "../../http/api";
import { Order, OrderStatus, PaymentStatus } from "../../types";
import { format } from "date-fns";

const OrderDetails = () => {
  const { id } = useParams();
  const orderId = id as string;
  const { data: orderDetails } = useQuery<Order>({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const queryString = new URLSearchParams({
        fields:
          "cart,address,paymentMode,paymentStatus,price,total,taxes,deliveryCharges,orderStatus,comment,paymentStatus,createdAt,tenantId,discount,couponCode",
      }).toString();
      return await getOrderDetails(orderId, queryString).then(
        (res) => res.data
      );
    },
  });

  const queryClient = useQueryClient();

  const { mutate: updateOrderStatus } = useMutation({
    mutationKey: ["order-status", orderId],
    mutationFn: async (status: OrderStatus) => {
      
      return await changeOrderStatus(orderId, status).then(
        (res) => res.data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    }
  });

  const handleOrderStatusChange = (value: OrderStatus) => {
    updateOrderStatus(value);
  };

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

        <Select
          key={orderDetails.orderStatus}
          disabled={orderDetails.orderStatus === OrderStatus.DELIVERED || orderDetails.orderStatus === OrderStatus.CANCELLED}
          defaultValue={orderDetails.orderStatus}
          style={{ width: 200 }}
          onChange={handleOrderStatusChange}
          options={[
            { label: "Received", value: OrderStatus.RECIEVED, disabled: Object.values(OrderStatus).slice(1).includes(orderDetails.orderStatus) },
            { label: "Confirmed", value: OrderStatus.CONFIRMED, disabled: Object.values(OrderStatus).slice(2).includes(orderDetails.orderStatus) },
            { label: "Prepared", value: OrderStatus.PREPARED, disabled: Object.values(OrderStatus).slice(3).includes(orderDetails.orderStatus) },
            { label: "Out for Delivery", value: OrderStatus.OUT_FOR_DELIVERY, disabled: Object.values(OrderStatus).slice(4).includes(orderDetails.orderStatus) },
            { label: "Delivered", value: OrderStatus.DELIVERED },
            { label: "Cancelled", value: OrderStatus.CANCELLED },
          ]}
        />
      </Flex>

      <Row gutter={24}>
        <Col span={14}>
          <Card
            title="Order Details"
            extra={
              <Space size={"large"}>
                <div>
                  <Typography.Text type="secondary">
                    Order Time:{" "}
                  </Typography.Text>
                  <Typography.Text>
                    {format(
                      new Date(orderDetails.createdAt),
                      "dd/mm/yyyy hh:mm a"
                    )}
                  </Typography.Text>
                </div>
                <Tag
                  bordered={false}
                  color={
                    orderStatusColors[orderDetails.orderStatus] ?? "processing"
                  }
                >
                  {capitalize(orderDetails.orderStatus)}
                </Tag>
              </Space>
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
          <Card title="Payment Details" style={{ marginTop: 16 }}>
            <Row gutter={24} style={{ padding: "0 24px" }}>
              <Col span={12}>
                <Space direction="vertical">
                  <Flex style={{ flexDirection: "column" }}>
                    <Typography.Text type="secondary">
                      Payment Mode
                    </Typography.Text>
                    <Typography.Text>
                      {orderDetails.paymentMode.toUpperCase()}
                    </Typography.Text>
                  </Flex>
                  <Flex style={{ flexDirection: "column" }}>
                    <Typography.Text type="secondary">
                      Payment Status
                    </Typography.Text>
                    <Typography.Text>
                      {capitalize(orderDetails.paymentStatus)}
                    </Typography.Text>
                  </Flex>
                  {orderDetails.paymentStatus === PaymentStatus.PAID && (
                    <Flex style={{ flexDirection: "column" }}>
                      <Typography.Text type="secondary">
                        Payment Ref Id:
                      </Typography.Text>
                      <Typography.Text>
                        {orderDetails.paymentId}
                      </Typography.Text>
                    </Flex>
                  )}
                </Space>
              </Col>
              <Col span={12}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Flex justify="space-between" align="center">
                    <Typography.Text type="secondary">
                      Order Total
                    </Typography.Text>
                    <Typography.Text>₹{orderDetails.price}</Typography.Text>
                  </Flex>
                  <Flex justify="space-between" align="center">
                    <Typography.Text type="secondary">
                      Tax Amount
                    </Typography.Text>
                    <Typography.Text>₹{orderDetails.taxes}</Typography.Text>
                  </Flex>
                  <Flex justify="space-between" align="center">
                    <Typography.Text type="secondary">
                      Delivery Charge
                    </Typography.Text>
                    <Typography.Text>
                      ₹{orderDetails.deliveryCharges}
                    </Typography.Text>
                  </Flex>
                  {orderDetails.discount > 0 && (
                    <Flex justify="space-between" align="center">
                      <Tooltip
                        title={`Coupon Code: ${orderDetails.couponCode}`}
                      >
                        <Typography.Text type="secondary">
                          Discount Amount <InfoCircleOutlined size={10} />
                        </Typography.Text>
                      </Tooltip>
                      <Typography.Text>
                        - ₹{orderDetails.discount}
                      </Typography.Text>
                    </Flex>
                  )}
                  <Flex justify="space-between" align="center">
                    <Typography.Text strong>
                      <strong>Final Total</strong>
                    </Typography.Text>
                    <Typography.Text strong>
                      ₹ {orderDetails.total}
                    </Typography.Text>
                  </Flex>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={10}>
          <Card title="Customer Details">
            <Space direction="vertical">
              <Flex style={{ flexDirection: "column" }}>
                <Typography.Text type="secondary">Name</Typography.Text>
                <Typography.Text>
                  {orderDetails.customerId.firstName}{" "}
                  {orderDetails.customerId.lastName}
                </Typography.Text>
              </Flex>
              <Flex style={{ flexDirection: "column" }}>
                <Typography.Text type="secondary">Address</Typography.Text>
                <Typography.Text>{orderDetails.address}</Typography.Text>
              </Flex>
              {orderDetails.comment && (
                <Flex style={{ flexDirection: "column" }}>
                  <Typography.Text type="secondary">Comments</Typography.Text>
                  <Typography.Text>{orderDetails.comment}</Typography.Text>
                </Flex>
              )}
            </Space>
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default OrderDetails;
