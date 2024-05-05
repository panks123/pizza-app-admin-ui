import { Breadcrumb, Button, Drawer, Flex, Form, Space, Spin, Table, Typography, theme } from "antd";
import { RightOutlined, PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, getUsers } from "../../http/api";
import { User, UserFilterFormData, UserPayload } from "../../types";
import UsersFilter from "./UsersFilter";
import { useState } from "react";
import UserForm from "./forms/UserForm";
import { PER_PAGE } from "../../constants";

const columns = [
  {
    title: "Id",
    dataIndex: "id",
    key: "id"
  },
  {
    title: "First Name",
    dataIndex: "firstName",
    key: "firstName",
    render: (_text: string, record: User) => {
      return (
        <>
          { record. firstName } { record.lastName }
        </>
      )
    } 
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email"
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role"
  },
]

const Users = () => {
  const { token: { colorBgLayout } } = theme.useToken();
  const [open,setOpen] = useState(false);
  const [queryParams, setQueryParams] = useState({
    perPage: PER_PAGE,
    currentPage: 1
  })

  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const queryClient = useQueryClient();
  const { mutate : userMutate } = useMutation({
    mutationKey: ["users"],
    mutationFn: async (data: UserPayload) =>  createUser(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toggleDrawer();
      form.resetFields();
    }
  })

  const { data: users, isFetching, isError, error } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: () => {
      const filterdQyeryParams = Object.fromEntries(Object.entries(queryParams).filter((item) => !!item[1]));
      const queryString = new URLSearchParams(filterdQyeryParams as unknown as Record<string, string>).toString()
      console.log({queryString})
      return getUsers(queryString).then((res) => res.data );
    },
    placeholderData: keepPreviousData
  })

  const onFilterChange = (userFilterFormData: UserFilterFormData[]) => {
    console.log(userFilterFormData)
    const changedFilterFields = userFilterFormData.map((item) => ({
      [item.name[0]] : item.value
    })).reduce((acc, item) => ({...acc, ...item}), {});

    setQueryParams((prev) => ({...prev, ...changedFilterFields}))
  }

  const handleUserFormSubmit = async () => {
    await form.validateFields();
    const createUserPayload = form.getFieldsValue();
    userMutate(createUserPayload);
  }

  const toggleDrawer = () => {
    setOpen(!open);
  }

  return (
    <>
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Flex justify="space-between">
        <Breadcrumb items={[{ title: <Link to="/">Dashboard</Link> }, { title: "Users" }]} separator={<RightOutlined />}/>
        {isFetching && <Spin indicator={<LoadingOutlined style={{ fontSize: 22 }} spin />} />}
        {isError && <Typography.Text type="danger">{error.message}</Typography.Text>}
      </Flex>
      <Form onFieldsChange={onFilterChange} form={filterForm}>
        <UsersFilter>
          <Button icon={<PlusOutlined />} type="primary" onClick={toggleDrawer}>
            Create user
          </Button>
        </UsersFilter>
      </Form>
      <Table 
        columns={columns} 
        dataSource={users?.data} 
        rowKey={"id"}
        pagination={{
          total: users?.total,
          pageSize: queryParams.perPage,
          current: queryParams.currentPage,
          onChange: (page) => {
            setQueryParams((prev) => ({
              ...prev,
              currentPage: page,
            }))
          }
        }}
      />

      <Drawer
        title="Create User"
        width={540}
        onClose={toggleDrawer}
        open={open}
        destroyOnClose={true}
        styles={{ body: { background: colorBgLayout }} }
        extra= {
          <Space>
            <Button onClick={() => {
              form.resetFields();
              toggleDrawer();
            }}>Cancel</Button>
            <Button type="primary" onClick={handleUserFormSubmit}>Save</Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form}>
          <UserForm/>
        </Form>
      </Drawer>
    </Space>
    </>
  );
};

export default Users;
