import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from "antd";
import { Link } from "react-router-dom";
import { RightOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTenant, getTenants } from "../../http/api";
import { useState } from "react";
import TenantForm from "./forms/TenantForm";
import TenantFilter from "./forms/TenantFilter";
import { TenantPayload } from "../../types";

const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id"
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
  ]

const Tenants = () => {
    const { token: { colorBgLayout } } = theme.useToken();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const { data: tenants, isLoading, isError, error } = useQuery({
        queryKey: ["tenants"],
        queryFn: () => {
            return getTenants().then((res) => res.data);
        }
    })

    const { mutate: tenantMutate } = useMutation({
        mutationKey: ["tenants"],
        mutationFn: async (data: TenantPayload) => createTenant(data).then(res => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tenants"] });
            toggleDrawer();
            form.resetFields();
        }
    }) 

    const onFilterChange = (filterName: "search", filterValue?: string) => {
        console.log({filterName, filterValue})
      }

    const toggleDrawer = () => {
        setOpen(!open);
    }

    const handleTenantFormSubmit = async () => {
        await form.validateFields();
        const createTenantPayload = form.getFieldsValue();
        tenantMutate(createTenantPayload);
      }

  return (
    <>
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Breadcrumb items={[{ title: <Link to="/">Dashboard</Link> }, { title: "Restaurants" }]} separator={<RightOutlined />}/>
      {isLoading && <div>Loading...</div>}
      {isError && <div>{error.message}</div>}
      <TenantFilter onFilterChange={onFilterChange}>
        <Button icon={<PlusOutlined />} type="primary" onClick={toggleDrawer}>
          Create a restaurant
        </Button>
      </TenantFilter>
      <Table columns={columns} dataSource={tenants} rowKey={"id"}/>
      <Drawer
        title="Create a restaurant"
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
            <Button type="primary" onClick={handleTenantFormSubmit}>Save</Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form}>
          <TenantForm />
        </Form>
      </Drawer>
    </Space>
    </>
  )
}

export default Tenants
