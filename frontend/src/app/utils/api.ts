const BASE_URL = "http://localhost:5000/api/v1";

export const apiRequest = async (
  endpoint: string,
  method: string,
  body?: any,
  token?: string
) => {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }), // ✅ FIXED
      },
      ...(body && { body: JSON.stringify(body) }),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    return { success: false, message: "Network error" };
  }
};

// ================= AUTH =================
export const loginUser = (email: string, password: string) =>
  apiRequest("/login", "POST", { email, password });

export const registerUser = (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => apiRequest("/register", "POST", data);

// ================= TASK =================
export const getTasks = (token: string) =>
  apiRequest("/tasks", "GET", null, token);

export const createTask = (token: string, data: any) =>
  apiRequest("/tasks", "POST", data, token);

export const updateTask = (token: string, id: string, data: any) =>
  apiRequest(`/tasks/${id}`, "PUT", data, token);

export const deleteTask = (token: string, id: string) =>
  apiRequest(`/tasks/${id}`, "DELETE", null, token);