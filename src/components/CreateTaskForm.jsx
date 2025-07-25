// src/components/CreateTaskForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CreateTaskForm = ({ onTaskCreated }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    assignedTo: "",
    team: "",
  });

  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch users and teams
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, teamsRes] = await Promise.all([
          axios.get("/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/teams", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUsers(usersRes.data);
        setTeams(teamsRes.data);
      } catch (err) {
        console.error("Error fetching users/teams", err);
        toast.error("Failed to load users or teams");
      }
    };
    fetchData();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/tasks", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Task created successfully!");
      setForm({
        title: "",
        description: "",
        dueDate: "",
        assignedTo: "",
        team: "",
      });
      onTaskCreated();
    } catch (err) {
      console.error("Create task failed", err.response?.data || err);
      toast.error("Failed to create task.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-center">
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Task title"
        className="border p-2 rounded w-1/4"
        required
      />
      <input
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="border p-2 rounded w-1/4"
        required
      />
      <input
        type="date"
        name="dueDate"
        value={form.dueDate}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />
      <select
        name="assignedTo"
        value={form.assignedTo}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      >
        <option value="">Assign To</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name || user.email}
          </option>
        ))}
      </select>
      <select
        name="team"
        value={form.team}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      >
        <option value="">Select Team</option>
        {teams.map((team) => (
          <option key={team._id} value={team._id}>
            {team.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create Task
      </button>
    </form>
  );
};

export default CreateTaskForm;
