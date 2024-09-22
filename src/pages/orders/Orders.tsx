import { useState, useEffect } from "react";
import { Breadcrumb, Flex, Form, Space, Table, Tag, Typography } from "antd";
import { Link } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import { FilterFormData, Order } from "../../types";
import OrderFilters from "./components/OrderFilters";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "../../http/api";
import { format } from "date-fns";
import { orderStatusColors } from "../../constants";
import { capitalize } from "lodash";
import socket from "../../lib/socket";
import { useAuthStore } from "../../store";

const columns = [
  {
    title: "Order Id",
    dataIndex: "_id",
    key: "_id",
    render: (_: string, record: Order) => (
      <Typography.Text>{record._id}</Typography.Text>
    ),
  },
  {
    title: "Customer",
    dataIndex: "customerId",
    key: "customerInfo._id",
    render: (_: string, record: Order) => (
      <Typography.Text>
        {record.customerInfo?.firstName} {record.customerInfo?.lastName}
      </Typography.Text>
    ),
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    render: (_: string, record: Order) => (
      <Typography.Text>{record.address}</Typography.Text>
    ),
  },
  {
    title: "Comment",
    dataIndex: "comment",
    key: "comment",
    render: (_: string, record: Order) => (
      <Typography.Text>{record.comment}</Typography.Text>
    ),
  },
  {
    title: "Payment Mode",
    dataIndex: "paymentMode",
    key: "paymentMode",
    render: (_: string, record: Order) => (
      <Typography.Text>{record.paymentMode.toUpperCase()}</Typography.Text>
    ),
  },
  {
    title: "Payment Status",
    dataIndex: "paymentStatus",
    key: "paymentStatus",
    render: (_: string, record: Order) => (
      <Typography.Text>{capitalize(record.paymentStatus)}</Typography.Text>
    ),
  },
  {
    title: "Order Status",
    dataIndex: "orderStatus",
    key: "orderStatus",
    render: (_: string, record: Order) => (
      <Tag bordered={false} color={orderStatusColors[record.orderStatus]}>
        {capitalize(record.orderStatus)}
      </Tag>
    ),
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    render: (_: string, record: Order) => (
      <Typography.Text>₹{record.total}</Typography.Text>
    ),
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (_: string, record: Order) =>
      record.createdAt ? (
        <Typography.Text>
          {format(new Date(record.createdAt), "dd/mm/yyyy hh:mm a")}
        </Typography.Text>
      ) : null,
  },
  {
    title: "Actions",
    dataIndex: "_id",
    key: "_id",
    render: (_: string, record: Order) => (
      <Link to={`/orders/${record._id}`}>Details</Link>
    ),
  },
];

const Orders = () => {
  const { user } = useAuthStore();
  const [filterForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState({
    limit: 10,
    page: 1,
  });

  const { data: ordersData } = useQuery<{
    data: Order[];
    total: number;
    page: number;
    limit: number;
    currentPage: number;
  }>({
    queryKey: ["orders", queryParams],
    queryFn: () => {
      const filterdQyeryParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1])
      );
      const queryString = new URLSearchParams(
        filterdQyeryParams as unknown as Record<string, string>
      ).toString();
      return getOrders(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });

  const onFilterChange = (orderFilter: FilterFormData[]) => {
    console.log({ orderFilter });
    const changedFilterFields = orderFilter
      .map((item) => ({
        [item.name[0]]: item.value,
      }))
      .reduce((acc, item) => ({ ...acc, ...item }), {});

    setQueryParams((prev) => ({ ...prev, ...changedFilterFields, page: 1 }));
  };

  useEffect(() => {
  console.log("useEffect", {user});
    if (user?.tenant) {
      socket.on("join", (data) => {
        console.log("Joined in : ", data.roomId);
      });

      socket.emit("join", { tenantId: user.tenant });

      socket.on("order-update", (data) => {
        console.log("Recieved order-update of order: ", data); 
      })
    }

    return () => {
      if(socket.connected) {
        console.log("Disconnecting socket connection");
        socket.off("join");
        socket.off("order-update");
        // socket.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Flex justify="space-between">
        <Breadcrumb
          items={[
            { title: <Link to="/">Dashboard</Link> },
            { title: "Orders" },
          ]}
          separator={<RightOutlined />}
        />
      </Flex>
      <Form onFieldsChange={onFilterChange} form={filterForm}>
        <OrderFilters />
      </Form>
      <Table
        columns={[
          ...columns,
          // {
          //   title: "Actions",
          //   render: (_: string, record: Product) => {
          //     return (
          //       <Space>
          //         <Button type="link" onClick={() => onEdit(record)}>
          //           Edit
          //         </Button>
          //       </Space>
          //     );
          //   },
          // },
        ]}
        dataSource={ordersData?.data || []}
        rowKey={"_id"}
        pagination={{
          total: ordersData?.total,
          pageSize: queryParams.limit,
          current: queryParams.page,
          onChange: (page) => {
            setQueryParams((prev) => ({
              ...prev,
              page,
            }));
          },
          showTotal: (total, range) => {
            return (
              <div>
                Showing{" "}
                <b>
                  {range[0]}-{range[1]}
                </b>{" "}
                of <b>{total}</b> items
              </div>
            );
          },
        }}
      />
    </Space>
  );
};

export default Orders;
