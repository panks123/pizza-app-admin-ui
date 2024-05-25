export type Credentials = {
    email: string;
    password: string
}

export type User = {
    id: number;
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