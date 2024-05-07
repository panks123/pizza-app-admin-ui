import { Breadcrumb, Button, Drawer, Flex, Form, Space, Spin, Table, Typography, theme } from "antd";
import { RightOutlined, PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, getUsers, updateUser } from "../../http/api";
import { User, FilterFormData, UserPayload } from "../../types";
import UsersFilter from "./UsersFilter";
import { useMemo, useRef, useState } from "react";
import UserForm from "./forms/UserForm";
import { PER_PAGE, UserRole } from "../../constants";
import { debounce } from "lodash";
import { useAuthStore } from "../../store";

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
  {
    title: "Tenant",
    dataIndex: "tenant",
    key: "tenant",
    render: (_text: string, record: User) => {
      return (
        <div>{record.tenant?.name}</div>
      )
    }
  },
]

const Users = () => {
  const { token: { colorBgLayout } } = theme.useToken();
  const [open,setOpen] = useState(false);
  const [queryParams, setQueryParams] = useState({
    perPage: PER_PAGE,
    currentPage: 1
  })
  const currentEditingUserRef = useRef<User | null>(null);
  const { user } = useAuthStore();
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
  const { mutate : updateUserMutate } = useMutation({
    mutationKey: ["update-user"],
    mutationFn: async (data: UserPayload) =>  updateUser(data, currentEditingUserRef.current!.id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toggleDrawer();
    }
  })

  const { data: users, isFetching, isError, error } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: () => {
      const filterdQyeryParams = Object.fromEntries(Object.entries(queryParams).filter((item) => !!item[1]));
      const queryString = new URLSearchParams(filterdQyeryParams as unknown as Record<string, string>).toString()
      return getUsers(queryString).then((res) => res.data );
    },
    placeholderData: keepPreviousData
  })

  const debounceQUpdate = useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }))
    }, 600);
  }, []);

  const onFilterChange = (userFilterFormData: FilterFormData[]) => {
    const changedFilterFields = userFilterFormData.map((item) => ({
      [item.name[0]] : item.value
    })).reduce((acc, item) => ({...acc, ...item}), {});

    if('q' in changedFilterFields) {
      debounceQUpdate(changedFilterFields.q);
    }
    else {
      setQueryParams((prev) => ({...prev, ...changedFilterFields, currentPage: 1}));
    }
  }

  const handleUserFormSubmit = async () => {
    await form.validateFields();
    const isEditMode = !!currentEditingUserRef.current;
    if(isEditMode) {
      const updateUserPayload = form.getFieldsValue();
      updateUserMutate(updateUserPayload);
    }
    else {
      console.log("CREAATE")
      const createUserPayload = form.getFieldsValue();
      userMutate(createUserPayload);
    }
  }

  const toggleDrawer = () => {
    if(open && currentEditingUserRef.current) {
      currentEditingUserRef.current = null;
      form.resetFields();
    }
    setOpen(!open);
  }

  const onEdit = (userToEdit: User) => {
    currentEditingUserRef.current = userToEdit;
    toggleDrawer();
    form.setFieldsValue({...userToEdit, tenantId: userToEdit.tenant?.id});
  }

  if (user?.role !== UserRole.ADMIN) {
      return <Navigate to="/" replace={true} />;
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
        columns={[...columns, {
          title: "Actions",
          render: (_: string, record: User) => {
            return (
              <Space>
                <Button type="link" onClick={() => onEdit(record)}>Edit</Button>
              </Space>
            )
          }
        }]} 
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
          },
          showTotal: (total , range) => {
            return <div>Showing <b>{range[0]}-{range[1]}</b> of <b>{total}</b> items</div>
          }
        }}
      />

      <Drawer
        title={ !currentEditingUserRef.current ? "Create User" : "Modify User"}
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
          <UserForm isEditMode = {!!currentEditingUserRef.current}/>
        </Form>
      </Drawer>
    </Space>
    </>
  );
};

export default Users;
