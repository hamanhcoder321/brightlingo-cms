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
    const response = await authApi.login(credentials);
    setToken(response.accessToken);
    setUser(response.user);
    return response;
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
