import { e, d } from "../components/utils/crypto";

export const BASE_URL = "http://localhost:8989";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
        ...options,
    });

    if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);

        if (res.status === 401 && !endpoint.startsWith("/auth/")) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("isLoggedIn");
            window.location.href = "/login";
            throw new Error("Session expired. Please log in again.");
        }

        let errorMessage = text || "Something went wrong";
        try {
            const parsed = JSON.parse(text);
            if (parsed && typeof parsed.message === "string") {
                errorMessage = parsed.message;
            }
        } catch {
            // Keep raw text
        }
        throw new Error(errorMessage);
    }

    const text = await res.text();
    try {
        const decrypted = await d(text);
        const parsed = JSON.parse(decrypted) as T;
        return parsed;
    } catch {
        try {
            return JSON.parse(text) as T;
        } catch {
            return { message: text } as unknown as T;
        }
    }
}

export interface RegisterRequest {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    confirmpassword: string;
    mobile: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface MessageResponse {
    message: string;
}

export interface User {
    id: number;
    username: string;
    firstname?: string;
    lastname?: string;
    email: string;
    mobile?: string;
    password?: string;
    confirmpassword?: string;
    role?: string;
}

export interface Product {
    productId: number;
    productName: string;
    productPrice: string;
    productQuantity: string;
}

export interface Setting {}

export interface ForgotPasswordRequest {
    username: string;
}

export interface VerifyOtpRequest {
    username: string;
    otp: string;
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<MessageResponse> {
    return request<MessageResponse>("/forgotpassword", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function verifyOtp(data: VerifyOtpRequest): Promise<MessageResponse> {
    return request<MessageResponse>("/verifyotp", {
        method: "POST",
        body: JSON.stringify(data),
    });
}


export interface LoginResponse {
    id: number;
    accessToken: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    mobile: string;
    roles: string[];
}

export interface UserDto {
    username: string;
    firstname: string;
    lastname: string;
    mobile: string;
    email: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export async function registerUser(data: RegisterRequest): Promise<MessageResponse> {
    return request<MessageResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
    return request<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function getUserList(): Promise<User[]> {
    return request<User[]>("/userlist");
}

export async function getProductList(): Promise<Product[]> {
    return request<Product[]>("/master/products");
}

export async function getSettings(): Promise<Setting[]> {
    return request<Setting[]>("/settings");
}


export async function getUserById(id: number): Promise<UserDto> {
    return request<UserDto>(`/auth/user/${id}`);
}

export async function updateSettings(id: number, data: UserDto): Promise<MessageResponse> {
    return request<MessageResponse>(`/auth/settings/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function changePassword(data: ChangePasswordRequest): Promise<MessageResponse> {
    const token = localStorage.getItem("token");
    return request<MessageResponse>("/auth/change-password", {
        method: "PUT",
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
    });
}
