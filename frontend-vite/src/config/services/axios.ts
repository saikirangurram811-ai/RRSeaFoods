import axios, {
    type AxiosInstance,
    type InternalAxiosRequestConfig,
} from "axios";

const BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8989";

declare module "axios" {
    export interface InternalAxiosRequestConfig {
        encrypted?: boolean;
    }

    export interface AxiosRequestConfig {
        encrypted?: boolean;
    }
}

export const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export function setAuthToken(token: string | null) {
    if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common.Authorization;
    }
}