import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("blog_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (axiosError) => {
    const responseData = axiosError.response?.data;
    const message = axiosError.response
      ? responseData?.message || "The request could not be completed."
      : "Unable to reach the API. Make sure the backend server is running.";
    const error = new Error(message);

    error.status = axiosError.response?.status;
    error.details = responseData?.errors || [];

    return Promise.reject(error);
  }
);

export const authApi = {
  async register(credentials) {
    const response = await api.post("/auth/register", credentials);
    return response.data;
  },
  async login(credentials) {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },
  async getCurrentUser() {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

export const postsApi = {
  async getAll() {
    const response = await api.get("/posts");
    return response.data;
  },
  async getById(id) {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },
  async create(post) {
    const response = await api.post("/posts", post);
    return response.data;
  },
  async update(id, post) {
    const response = await api.patch(`/posts/${id}`, post);
    return response.data;
  },
  async remove(id) {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },
  async addComment(id, content) {
    const response = await api.post(`/posts/${id}/comments`, { content });
    return response.data;
  },
};

export default api;
