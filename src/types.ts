export type Credentials = {
    email: string;
    password: string
}

export type User = {
    id: number;
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    tenant: Tenant | null
    createdAt: string;
}

export type UserPayload = {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: string;
    tenantId: number;
}

export type Tenant = {
    id: number;
    name: string;
    address: string;
}

export type TenantPayload = {
    name: string;
    address: string;
}

export type FilterFormData = {
    name: string[],
    value?: string;
}

export interface PriceConfiguration {
    [key: string]: {
        priceType: "base" | "aditional";
        availableOptions: string[];
    };
}

export interface Attribute {
    name: string;
    widgetType: "switch" | "radio";
    defaultValue: string;
    availableOptions: string[];
}

export interface Category {
    name: string;
    _id: string;
    priceConfiguration: PriceConfiguration;
    attributes: Attribute[];
}

export type ProductAttribute = {
    name: string;
    value: string | boolean | number;
}

export type Product = {
    _id: string;
    name: string;
    description: string;
    categoryId: string;
    tenantId: string;
    priceConfiguration: PriceConfiguration,
    attributes: ProductAttribute[];
    isPublish: boolean;
    createdAt: string;
    image: string;
}
export type ImageFileType = { file: File };
export type CreateProductData = Product & { image : ImageFileType }

export enum PaymentMode {
    CARD = "card",
    CASH = "cash",
}

export enum OrderStatus {
    RECIEVED = "received",
    CONFIRMED = "confirmed",
    PREPARED = "prepared",
    OUT_FOR_DELIVERY = "out_for_delivery",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
}

export enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed",
}

export type Topping =  {
    _id: string;
    name: string;
    image: string;
    price: number;
    isAvailable: boolean;
};

export interface CartItem
  extends Pick<Product, "_id" | "name" | "image" | "priceConfiguration"> {
  chosenConfiguration: {
    priceConfiguration: {
      [key: string]: string;
    };
    selectedToppings: Topping[];
  };
  qty: number;
  hash?: string;
}

export interface Order {
    _id: string;
    cart: CartItem[];
    customerInfo: User;
    total: number;
    discount: number;
    taxes: number;
    deliveryCharges: number;
    address: string;
    tenantId: string;
    comment: string;
    orderStatus: OrderStatus;
    paymentMode: PaymentMode;
    paymentStatus: PaymentStatus;
    paymentId?: string;
    createdAt: string;
}