import { Breadcrumb, Button, Drawer, Flex, Form, Space, Spin, Table, Typography, theme } from "antd";
import { Link, Navigate } from "react-router-dom";
import { RightOutlined, PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTenant, getTenants } from "../../http/api";
import { useMemo, useState } from "react";
import TenantForm from "./forms/TenantForm";
import TenantFilter from "./forms/TenantFilter";
import { FilterFormData, TenantPayload } from "../../types";
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
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const [tenantForm] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [queryParams, setQueryParams] =useState({
        currentPage: 1,
        perPage: PER_PAGE
    })
    const [form] = Form.useForm();
    const { data: tenants, isFetching, isError, error } = useQuery({
        queryKey: ["tenants", queryParams],
        queryFn: () => {
            const filterdQyeryParams = Object.fromEntries(Object.entries(queryParams).filter((item) => !!item[1]));
            const queryString = new URLSearchParams(filterdQyeryParams as unknown as Record<string, string>).toString();
            return getTenants(queryString).then((res) => res.data);
        },
        placeholderData: keepPreviousData
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

    const debounceQUpdate = useMemo(() => {
        return debounce((value: string | undefined) => {
          setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }));
        }, 600);
      }, []);

    const onFilterChange = (tenantFilterFormData: FilterFormData[]) => {
        const changedFilterFields = tenantFilterFormData.map((item) => ({
            [item.name[0]] : item.value
          })).reduce((acc, item) => ({...acc, ...item}), {});

          if('q' in changedFilterFields) {
            debounceQUpdate(changedFilterFields.q);
          }
        //   else {
        //     setQueryParams((prev) => ({...prev, ...changedFilterFields, currentPage: 1}));
        //   }
      }

    const toggleDrawer = () => {
        setOpen(!open);
    }

    const handleTenantFormSubmit = async () => {
        await form.validateFields();
        const createTenantPayload = form.getFieldsValue();
        tenantMutate(createTenantPayload);
      }

      if (user?.role !== UserRole.ADMIN) {
        return <Navigate to="/" replace={true} />;
    }

  return (
    <>
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
    <Flex justify="space-between">
    <Breadcrumb items={[{ title: <Link to="/">Dashboard</Link> }, { title: "Restaurants" }]} separator={<RightOutlined />}/>
        {isFetching && <Spin indicator={<LoadingOutlined style={{ fontSize: 22 }} spin />} />}
        {isError && <Typography.Text type="danger">{error.message}</Typography.Text>}
    </Flex>
      <Form form={tenantForm} onFieldsChange={onFilterChange}>
        <TenantFilter >
            <Button icon={<PlusOutlined />} type="primary" onClick={toggleDrawer}>
            Create a restaurant
            </Button>
        </TenantFilter>
      </Form>
      <Table 
        columns={columns} 
        dataSource={tenants?.data} 
        rowKey={"id"}
        pagination={{
            total: tenants?.total,
            pageSize: queryParams.perPage,
            current: queryParams.currentPage,
            onChange: (page) => {
                console.log(":Pagination", {page})
                setQueryParams((prev) => ({ ...prev, currentPage: page }))
            },
            showTotal: (total, range) => {
                return <div>Showing <b>{range[0]}-{range[1]}</b> of <b>{total}</b> items</div>
            }
        }}
    />
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
