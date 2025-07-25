import React, { useEffect, useState } from "react";
import axios from "../utils/api";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    // Fetch user info
    const fetchUser = async () => {
      try {
        const res = await axios.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    // Fetch task stats
    const fetchStats = async () => {
      try {
        const res = await axios.get("/tasks/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStats(res.data);
      } catch (err) {
        console.error("Failed to load task stats");
      }
    };

    fetchUser();
    fetchStats();
  }, [navigate]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Welcome, {user.fullName}</h1>
      <p className="text-gray-600 mb-6">Role: {user.role}</p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded text-center">
          <h3 className="text-lg font-bold">Total Tasks</h3>
          <p className="text-2xl">{stats.total}</p>
        </div>
        <div className="bg-green-100 p-4 rounded text-center">
          <h3 className="text-lg font-bold">Completed</h3>
          <p className="text-2xl">{stats.completed}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded text-center">
          <h3 className="text-lg font-bold">Pending</h3>
          <p className="text-2xl">{stats.pending}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
