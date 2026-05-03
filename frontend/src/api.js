import axios from "axios";

const API_URL = "/api";

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = (credentials) => {
  return api.post("/auth/login", credentials);
};

export const register = (credentials) => {
  return api.post("/auth/register", credentials);
};

export const getAuditLogs = (page = 0, size = 10) => {
  return api.get("/audit", { params: { page, size } });
};

export const searchAuditLogs = (query, page = 0, size = 10) => {
  return api.get("/audit/search", { params: { q: query, page, size } });
};

export const createAuditLog = (log) => {
  return api.post("/audit", [log]);
};

export const updateAuditLog = (id, log) => {
  return api.put(`/audit/${id}`, log);
};

export const deleteAuditLog = (id) => {
  return api.delete(`/audit/${id}`);
};

export const getStats = () => {
  return api.get("/audit/stats");
};

export const getAuditLogById = (id) => {
  return api.get(`/audit/${id}`);
};

export const getActions = () => {
  return api.get("/audit/actions");
};

export const filterLogs = (params) => {
  return api.get("/audit/filter", { params });
};

export const exportLogs = () => {
  return api.get("/audit/export", { responseType: "blob" });
};

export const uploadLogs = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/audit/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getAnalytics = () => {
  return api.get("/audit/analytics");
};

export default api;

