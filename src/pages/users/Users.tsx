import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from "antd";
import { RightOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../http/api";
import { User } from "../../types";
import UsersFilter from "./UsersFilter";
import { useState } from "react";
import UserForm from "./forms/UserForm";

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

  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => {
      return getUsers().then((res) => res.data );
    }
  })

  const onFilterChange = (filterName: "status" | "role" | "search", filterValue?: string) => {
    console.log({filterName, filterValue})
  }

  const toggleDrawer = () => {
    setOpen(!open);
  }

  return (
    <>
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Breadcrumb items={[{ title: <Link to="/">Dashboard</Link> }, { title: "Users" }]} separator={<RightOutlined />}/>
      {isLoading && <div>Loading...</div>}
      {isError && <div>{error.message}</div>}
      <UsersFilter onFilterChange={onFilterChange}>
        <Button icon={<PlusOutlined />} type="primary" onClick={toggleDrawer}>
          Create user
        </Button>
      </UsersFilter>
      <Table columns={columns} dataSource={users} rowKey={"id"}/>

      <Drawer
        title="Create User"
        width={540}
        onClose={toggleDrawer}
        open={open}
        destroyOnClose={true}
        styles={{ body: { background: colorBgLayout }} }
        extra= {
          <Space>
            <Button>Cancel</Button>
            <Button type="primary">Save</Button>
          </Space>
        }
      >
        <Form layout="vertical">
          <UserForm/>
        </Form>
      </Drawer>
    </Space>
    </>
  );
};

export default Users;
