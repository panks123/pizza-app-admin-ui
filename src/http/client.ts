import axios from "axios";
import { useAuthStore } from "../store";

export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
})

const refreshToken = async () => {
    await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/auth/refresh`, {}, { withCredentials: true });
}

api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;
    if(error.response.status === 401 && !originalRequest._isRetry) {
        try {
            originalRequest._isRetry = true;
            await refreshToken();
            const headers = { ...originalRequest.headers}
            return api.request({...originalRequest, headers })
        }
        catch(err) {
            console.error("Token request error", err);
            useAuthStore.getState().logout();
            return Promise.reject(err);
        }
    }
    return Promise.reject(error);
})