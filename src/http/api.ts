import { Credentials, TenantPayload, UserPayload } from "../types";
import { api } from "./client";

export const AUTH_SERVICE = "/api/auth";
export const CATALOG_SERVICE = "/api/catalog";

// auth service
export const login = (credentials: Credentials) => api.post(`${AUTH_SERVICE}/auth/login`, credentials);
export const self = () => api.get(`${AUTH_SERVICE}/auth/self`);
export const logout = () => api.post(`${AUTH_SERVICE}/auth/logout`);
export const getUsers = (queryString: string) => api.get(`${AUTH_SERVICE}/users?${queryString}`);
export const createUser = (user: UserPayload) => api.post(`${AUTH_SERVICE}/users`, user);
export const updateUser = (user: UserPayload, userId: number) => api.patch(`${AUTH_SERVICE}/users/${userId}`, user);
export const getTenants = (queryString: string) => api.get(`${AUTH_SERVICE}/tenants?${queryString}`);
export const createTenant = (tenant: TenantPayload) => api.post(`${AUTH_SERVICE}/tenants`, tenant);

// catalog service
export const getCategories = () => api.get(`${CATALOG_SERVICE}/categories`);
export const getProducts = (queryString: string) => api.get(`${CATALOG_SERVICE}/products?${queryString}`);
export const createProduct = (product: FormData) => api.post(`${CATALOG_SERVICE}/products`, product, {
    headers: {
        "Content-Type": "multipart/form-data"
    }
});
export const updateProduct = (productId: string, product: FormData) => api.put(`${CATALOG_SERVICE}/products/${productId}`, product, {
    headers: {
        "Content-Type": "multipart/form-data"
    }
});