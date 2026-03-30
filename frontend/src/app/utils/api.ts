const BASE_URL = "http://localhost:5000/api/v1";

// ================= AUTH =================

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return res.json();
};

// ================= TASK =================

export const getTasks = async (token: string) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    headers: {
      Authorization: token,
    },
  });

  return res.json();
};

export const createTask = async (token: string, title: string) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ title }),
  });

  return res.json();
};

export const updateTask = async (token: string, id: string, title: string) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ title }),
  });

  return res.json();
};

export const deleteTask = async (token: string, id: string) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  });

  return res.json();
};