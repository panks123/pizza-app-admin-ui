import { Credentials, TenantPayload, UserPayload } from "../types";
import { api } from "./client";

export const login = (credentials: Credentials) => api.post("/auth/login", credentials);
export const self = () => api.get("/auth/self");
export const logout = () => api.post("/auth/logout");
export const getUsers = (queryString: string) => api.get(`/users?${queryString}`);
export const createUser = (user: UserPayload) => api.post("/users", user);
export const updateUser = (user: UserPayload, userId: number) => api.patch(`/users/${userId}`, user);
export const getTenants = (queryString: string) => api.get(`/tenants?${queryString}`);
export const createTenant = (tenant: TenantPayload) => api.post("/tenants", tenant);