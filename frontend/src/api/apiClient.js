import axios from "axios";

const API_BASE_URL =
  import.meta.env.REACT_APP_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth APIs
export const registerUser = (userData) =>
  apiClient.post("/auth/register", userData);
export const loginUser = (userData) => apiClient.post("/auth/login", userData);
export const logoutUser = () => apiClient.get("/auth/logout");
export const getCurrentUser = () => apiClient.get("/auth/me");

// Item APIs
export const getAllItems = () => apiClient.get("/items");
export const getItemById = (id) => apiClient.get(`/items/${id}`);
export const createItem = (itemData) => apiClient.post("/items", itemData);
export const updateItem = (id, itemData) =>
  apiClient.put(`/items/${id}`, itemData);
export const deleteItem = (id) => apiClient.delete(`/items/${id}`);

// Stock In APIs
export const createStockIn = (data) => apiClient.post("/stock-in", data);
export const getStockInRecords = (params) =>
  apiClient.get("/stock-in", { params });
export const getStockInById = (id) => apiClient.get(`/stock-in/${id}`);
export const updateStockIn = (id, data) =>
  apiClient.put(`/stock-in/${id}`, data);
export const deleteStockIn = (id) => apiClient.delete(`/stock-in/${id}`);

// Stock Out APIs
export const createStockOut = (data) => apiClient.post("/stock-out", data);
export const getStockOutRecords = (params) =>
  apiClient.get("/stock-out", { params });
export const getStockOutById = (id) => apiClient.get(`/stock-out/${id}`);
export const updateStockOut = (id, data) =>
  apiClient.put(`/stock-out/${id}`, data);
export const deleteStockOut = (id) => apiClient.delete(`/stock-out/${id}`);

// Report APIs
export const getDailyStockReport = (params) =>
  apiClient.get("/reports/daily-stock", { params });
export const getDashboardStats = () =>
  apiClient.get("/reports/dashboard-stats");

export default apiClient;
