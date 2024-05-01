import { Breadcrumb, Space, Table } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../http/api";
import { User } from "../../types";
import UsersFilter from "./UsersFilter";

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

  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => {
      return getUsers().then((res) => res.data );
    }
  })

  const onFilterChange = (filterName: "status" | "role" | "search", filterValue?: string) => {
    console.log({filterName, filterValue})
  } 

  return (
    <>
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Breadcrumb items={[{ title: <Link to="/">Dashboard</Link> }, { title: "Users" }]} separator={<RightOutlined />}/>
      {isLoading && <div>Loading...</div>}
      {isError && <div>{error.message}</div>}
      <UsersFilter onFilterChange={onFilterChange}/>
      <Table columns={columns} dataSource={users} rowKey={"id"}/>
    </Space>
    </>
  );
};

export default Users;
