export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "superadmin" | "operator";
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AdminUser;
}
