import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { STORAGE_KEYS } from "@shared/constants";
import { setCookie, getCookie, deleteCookie } from "@shared/utils";
import type { AdminUser, LoginCredentials } from "../types/auth.types";
import { authApi } from "../api/auth.api";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<AdminUser | null>(null);
  const accessToken = ref<string | null>(null);

  const isAuthenticated = computed(() => !!accessToken.value);

  function setToken(token: string | null) {
    accessToken.value = token;
    if (token) {
      setCookie(STORAGE_KEYS.ACCESS_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    } else {
      deleteCookie(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    }
  }

  function setUser(userData: AdminUser | null) {
    user.value = userData;
    if (userData) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }

  function initAuth() {
    const token = getCookie(STORAGE_KEYS.ACCESS_TOKEN) || localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

    if (token) {
      accessToken.value = token;
    }
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser);
      } catch (err) {
        console.error("Failed to parse stored user", err);
      }
    }
  }

  async function login(credentials: LoginCredentials) {
    // If backend doesn't have custom admin/login yet, provide seamless mock/fallback
    try {
      const response = await authApi.login(credentials);
      setToken(response.accessToken);
      setUser(response.user);
      return response;
    } catch (error) {
      // Development fallback for initial skeleton exploration if API endpoint is not yet mounted
      if (import.meta.env.DEV && credentials.email.includes("admin")) {
        const dummyToken = "mock_admin_token_" + Date.now();
        const dummyUser: AdminUser = {
          id: "admin-1",
          name: "Quản trị viên Hệ thống",
          email: credentials.email,
          role: "superadmin",
        };
        setToken(dummyToken);
        setUser(dummyUser);
        return { accessToken: dummyToken, user: dummyUser };
      }
      throw error;
    }
  }

  async function logout() {
    setToken(null);
    setUser(null);
  }

  return {
    user,
    accessToken,
    isAuthenticated,
    setToken,
    setUser,
    initAuth,
    login,
    logout,
  };
});
