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

        // Try to decrypt the error response; fall back to raw text
        let errorMessage = text || "Something went wrong";
        try {
            const decrypted = await d(text);
            errorMessage = JSON.parse(decrypted) || errorMessage;
        } catch {
            // Response wasn't encrypted (e.g. plain Spring error) — use raw text
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
    mobile: String;
}

export interface LoginRequest {
    username: string;
    password: string;
}


export interface MessageResponse {
    message: string;
}



// defining users here 
export interface User {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    mobile: string;
    password: string;
    confirmpassword: string;
}

export interface Setting {

}

export interface State {
    id: number;
    statename: string;
    status: number
}


export interface District {
    id: number;
    districtname: string;
    stateid: number;
    status: number
}

export interface Department {
    id: number;
    departmentname: string;
    status: number;
}

export interface ForgotPasswordRequest {
    username: string;
}

export interface VerifyOtpRequest {
    username: string;
    otp: string;
}

export async function forgotPassword(
    data: ForgotPasswordRequest
): Promise<MessageResponse> {

    return request<MessageResponse>("/forgotpassword", {
        method: "POST",
        body: JSON.stringify(data),
    });

}

export async function verifyOtp(
    data: VerifyOtpRequest
): Promise<MessageResponse> {

    return request<MessageResponse>("/verifyotp", {
        method: "POST",
        body: JSON.stringify(data),
    });
}


export interface Organisation {
    id: number;
    orgname: string;
    status: number;

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

// export interface ChangePasswordResponse {
//   message: string;
// }


export async function registerUser(data: RegisterRequest): Promise<MessageResponse> {
    const encrypted = await e(JSON.stringify(data));
    return request<MessageResponse>("/auth/registers", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: encrypted,
    });
}

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
    const encrypted = await e(JSON.stringify(data));
    return request<LoginResponse>("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: encrypted,
    });
}


export async function getUserList(): Promise<User[]> {
    return request<User[]>("/userlist")
}

export async function getSettings(): Promise<Setting[]> {
    return request<Setting[]>("/settings")
}

export async function getStateDropdown(): Promise<{ label: string; value: number }[]> {
    const states = await getStateMaster();
    return states.map((s) => ({ label: s.statename, value: s.id }));
}


export async function getStateMaster(): Promise<State[]> {
    return request<State[]>("/master/stateMaster")
}

export async function saveState(data: Omit<State, "id" | "status">): Promise<MessageResponse> {
    return request<MessageResponse>("/master/saveState", { method: "POST", body: JSON.stringify(data) });
}

export async function updateState(data: Partial<State> & { id: number }): Promise<MessageResponse> {
    return request<MessageResponse>("/master/saveState", { method: "POST", body: JSON.stringify(data) });
}

export async function deleteState(id: number): Promise<MessageResponse> {
    return request<MessageResponse>(`/master/deleteState/${id}`, { method: "DELETE" });
}

export async function getDistrictMaster(): Promise<District[]> {
    return request<District[]>("/master/districtMaster")
}

export async function saveDistrict(data: Omit<District, "id" | "status">): Promise<MessageResponse> {
    return request<MessageResponse>("/master/saveDistrict", { method: "POST", body: JSON.stringify(data) });
}

export async function updateDistrict(data: Partial<District> & { id: number }): Promise<MessageResponse> {
    return request<MessageResponse>("/master/saveDistrict", { method: "POST", body: JSON.stringify(data) });
}

export async function getOrgMaster(): Promise<Organisation[]> {
    return request<Organisation[]>("/master/orgMaster")
}

export async function saveOrg(data: Omit<Organisation, "id" | "status">): Promise<MessageResponse> {
    return request<MessageResponse>("/master/saveOrg", { method: "POST", body: JSON.stringify(data) });
}

export async function updateOrg(data: Partial<Organisation> & { id: number }): Promise<MessageResponse> {
    return request<MessageResponse>("/master/saveOrg", { method: "POST", body: JSON.stringify(data) });
}

export async function deleteOrg(id: number): Promise<MessageResponse> {
    return request<MessageResponse>(`/master/deleteOrg/${id}`, { method: "DELETE" });
}

export async function updateStatus(tablename: string, id: number, status: number): Promise<MessageResponse> {
    return request<MessageResponse>(`/master/updatestatus?id=${id}&status=${status}&tablename=${tablename}`, {
        method: "POST",
    });
}

export async function getDepartmentMaster(): Promise<Department[]> {
    return request<Department[]>("/master/departmentMaster");
}

export async function saveDepartment(
    data: Omit<Department, "id" | "status">
): Promise<MessageResponse> {
    return request<MessageResponse>("/master/saveDepartment", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function updateDepartment(
    data: Partial<Department> & { id: number }
): Promise<MessageResponse> {
    return request<MessageResponse>(`/master/updateDepartment/${data.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function deleteDepartment(id: number): Promise<MessageResponse> {
    return request<MessageResponse>(`/master/deleteDepartment/${id}`, {
        method: "DELETE",
    });

}

export async function getUserById(id: number): Promise<UserDto> {
    return request<UserDto>(`/auth/user/${id}`);
}

export async function updateSettings(id: number, data: UserDto): Promise<MessageResponse> {
    //const encrypted = await e(JSON.stringify(data));
    return request<MessageResponse>(`/auth/settings/${id}`, {
        method: "PUT",
        // headers: { "Content-Type": "text/plain" },
        // body: encrypted,
        body: JSON.stringify(data),
    });
}

export async function changePassword(
    data: ChangePasswordRequest
): Promise<MessageResponse> {
    const encrypted = await e(JSON.stringify(data));
    const token = localStorage.getItem("token");
    return request<MessageResponse>("/auth/change-password", {
        method: "PUT",
        headers: {
            "Content-Type": "text/plain",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: encrypted,
    });
}
