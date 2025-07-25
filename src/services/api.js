import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ✅ Fetch tasks assigned to the logged-in user
export const fetchTasks = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(`${API_URL}/tasks/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    throw new Error("Failed to fetch tasks");
  }
};

// ✅ Update a specific task by ID (requires token)
export const updateTask = async (taskId, updatedData) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.put(`${API_URL}/tasks/${taskId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    throw new Error("Failed to update task");
  }
};

// ✅ Fetch current logged-in user details
export const fetchUser = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    throw new Error("Failed to fetch user");
  }
};
