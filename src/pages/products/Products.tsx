import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Image,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  theme,
} from "antd";
import { Link } from "react-router-dom";
import {
  RightOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import ProductsFilter from "./components/ProductsFilter";
import { useMemo, useRef, useState } from "react";
import { PER_PAGE, UserRole } from "../../constants";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduct, getProducts, updateProduct } from "../../http/api";
import { FilterFormData, Product } from "../../types";
import { format } from "date-fns";
import { debounce } from "lodash";
import { useAuthStore } from "../../store";
import ProductForm from "./forms/ProductForm";
import { makeFormData } from "./helper";

const columns = [
  {
    title: "Product",
    dataIndex: "name",
    key: "name",
    render: (_: string, record: Product) => {
      return (
        <Space>
          <Image
            src={`${record.image}?h=60`}
            width={60}
            preview={false}
            style={{ borderRadius: "7px" }}
          />
          <Typography.Text>{record.name}</Typography.Text>
        </Space>
      );
    },
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Status",
    dataIndex: "isPublish",
    key: "isPublish",
    render: (_text: boolean, record: Product) => {
      return record.isPublish ? (
        <Tag color="green">Published</Tag>
      ) : (
        <Tag color="red">Draft</Tag>
      );
    },
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text: string) => {
      return (
        <Typography.Text>
          {format(new Date(text), "dd/mm/yyyy hh:mm a")}
        </Typography.Text>
      );
    },
  },
];

const Products = () => {
  const { token: { colorBgLayout } } = theme.useToken();
  const [open,setOpen] = useState(false);
  const [form] = Form.useForm();
  const { user } = useAuthStore();
  const currentEditingProductRef = useRef<Product | null>(null);
  const [queryParams, setQueryParams] = useState({
    limit: PER_PAGE,
    page: 1,
    tenantId: user!.role !== UserRole.ADMIN ? user?.tenant?.id : undefined,
  });
  const [filterForm] = Form.useForm();
  const {
    data: products,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: () => {
      const filterdQyeryParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1])
      );
      const queryString = new URLSearchParams(
        filterdQyeryParams as unknown as Record<string, string>
      ).toString();
      return getProducts(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });

  const debounceQUpdate = useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({ ...prev, q: value, page: 1 }));
    }, 600);
  }, []);

  const onFilterChange = (productFilterFormData: FilterFormData[]) => {
    const changedFilterFields = productFilterFormData
      .map((item) => ({
        [item.name[0]]: item.value,
      }))
      .reduce((acc, item) => ({ ...acc, ...item }), {});

    if ("q" in changedFilterFields) {
      debounceQUpdate(changedFilterFields.q);
    } else {
      setQueryParams((prev) => ({ ...prev, ...changedFilterFields, page: 1 }));
    }
  };

  const toggleDrawer = () => {
    if(open && currentEditingProductRef.current) {
      currentEditingProductRef.current = null;
      form.resetFields();
    }
    setOpen(!open);
  }

  const onEdit = (productToEdit: Product) => {
    currentEditingProductRef.current = productToEdit;
    const priceConfiguration = Object.entries(productToEdit.priceConfiguration).reduce((acc, [key, value]) => {
      const stringifiedKey = JSON.stringify({
        configKey: key,
        priceType: value.priceType
      });
      return {
        ...acc,
        [stringifiedKey]: value.availableOptions
      }
    }, {});

    const attributes = productToEdit.attributes.reduce((acc, item) => {
      return {
        ...acc,
        [item.name]: item.value
      }
    }, {})

    toggleDrawer();
    form.setFieldsValue({
      ...productToEdit,
      priceConfiguration,
      attributes,
      tenantId: productToEdit.tenantId,
      categoryId: productToEdit.categoryId,
    });
  }
  const queryClient = useQueryClient();
  const { mutate: productMutate, isPending: isCreateProductPending } = useMutation({
    mutationKey: ["product"],
    mutationFn: async (data: FormData) => {
      if(currentEditingProductRef.current?._id) {
        return updateProduct(currentEditingProductRef.current._id, data);
      }
      return createProduct(data).then((res) => res.data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"]});
      toggleDrawer();
      form.resetFields();
      return;
    }
  })

  const handleProductFormSubmit = async () => {
    await form.validateFields();
    const priceConfiguration =form.getFieldValue("priceConfiguration");
    const pricing = Object.entries(priceConfiguration).reduce((acc, [key, value]) => {
      const parsedKey = JSON.parse(key);
      return {
        ...acc,
        [parsedKey.configKey] : {
           priceType: parsedKey.priceType,
           availableOptions: value
        }
      }
    }, {});
    const attributes = Object.entries(form.getFieldValue("attributes")).map(([key, value]) => {
      return {
        name: key,
        value
      }
    })
    const productData = {
      ...form.getFieldsValue(),
      tenantId: user?.role === UserRole.MANAGER ? user.tenant?.id : form.getFieldValue("tenantId"),
      isPublish: form.getFieldValue("isPublish") ? true : false,
      priceConfiguration: pricing,
      attributes
    }
    const formData = makeFormData(productData)
    await productMutate(formData);
  }
  
  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Flex justify="space-between">
          <Breadcrumb
            items={[
              { title: <Link to="/">Dashboard</Link> },
              { title: "Products" },
            ]}
            separator={<RightOutlined />}
          />
          {isFetching && (
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 22 }} spin />}
            />
          )}
          {isError && (
            <Typography.Text type="danger">{error.message}</Typography.Text>
          )}
        </Flex>
        <Form onFieldsChange={onFilterChange} form={filterForm}>
          <ProductsFilter>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={toggleDrawer}
            >
              Add Product
            </Button>
          </ProductsFilter>
        </Form>
        <Table
          columns={[
            ...columns,
            {
              title: "Actions",
              render: (_: string, record: Product) => {
                return (
                  <Space>
                    <Button type="link" onClick={() => onEdit(record)}>
                      Edit
                    </Button>
                  </Space>
                );
              },
            },
          ]}
          dataSource={products?.data}
          rowKey={"id"}
          pagination={{
            total: products?.total,
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
        <Drawer
          title={!currentEditingProductRef.current ? "Add Product" : "Modify Product"}
          width={540}
          onClose={toggleDrawer}
          open={open}
          destroyOnClose={true}
          styles={{ body: { background: colorBgLayout } }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  form.resetFields();
                  toggleDrawer();
                }}
              >
                Cancel
              </Button>
              <Button type="primary" onClick={handleProductFormSubmit} loading={isCreateProductPending}>
                Save
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" form={form}>
            <ProductForm isEditMode={!!currentEditingProductRef.current} form={form}/>
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Products;
