import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { authApi } from "../api";

const TOKEN_KEY = "blog_token";
const USER_KEY = "blog_user";

function storedUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) || null;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export const useUserStore = defineStore("user", () => {
  const token = ref(localStorage.getItem(TOKEN_KEY));
  const user = ref(storedUser());
  const initialized = ref(false);

  const isAuthenticated = computed(() => Boolean(token.value && user.value));
  const isAdmin = computed(() => user.value?.role === "admin");

  function saveSession(data) {
    token.value = data.token;
    user.value = data.user;
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  async function login(credentials) {
    const data = await authApi.login(credentials);
    saveSession(data);
    return data;
  }

  async function register(credentials) {
    const data = await authApi.register(credentials);
    saveSession(data);
    return data;
  }

  async function initializeAuth() {
    if (!token.value) {
      initialized.value = true;
      return;
    }

    try {
      const data = await authApi.getCurrentUser();
      user.value = data.user;
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    } catch {
      logout();
    } finally {
      initialized.value = true;
    }
  }

  return {
    token,
    user,
    initialized,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    initializeAuth,
  };
});
