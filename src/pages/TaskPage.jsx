import React, { useEffect, useState } from "react";
import api from "../utils/api"; // ✅ use this instead of axios directly
import TaskCard from "../components/TaskCard";
import CreateTaskForm from "../components/CreateTaskForm";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  // const fetchTasks = async () => {
  //   const token = localStorage.getItem("token");

  //   if (!token) {
  //     toast.error("You must be logged in");
  //     navigate("/login");
  //     return;
  //   }

  //   try {
  //     const res = await api.get("/api/tasks/my");

  //     console.log("API /api/tasks/my response:", res.data); // 🧪 Add this

  //     // Make sure it's an array before calling map
  //     if (Array.isArray(res.data)) {
  //       setTasks(res.data);
  //     } else if (res.data.tasks && Array.isArray(res.data.tasks)) {
  //       setTasks(res.data.tasks); // in case backend sends { tasks: [...] }
  //     } else {
  //       console.warn("Unexpected response format:", res.data);
  //       setTasks([]); // fallback to empty array
  //     }
  //   } catch (err) {
  //     console.error("Failed to fetch tasks", err.response?.data || err.message);
  //     toast.error("Failed to fetch tasks. Please try again.");
  //     if (err.response?.status === 401) {
  //       navigate("/login");
  //     }
  //   }
  // };

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must be logged in");
      navigate("/login");
      return;
    }

    try {
      const res = await api.get("/api/tasks/my");

      console.log("API /api/tasks/my response:", res.data);

      let fetchedTasks = [];

      if (Array.isArray(res.data)) {
        fetchedTasks = res.data;
      } else if (res.data.tasks && Array.isArray(res.data.tasks)) {
        fetchedTasks = res.data.tasks;
      }

      setTasks(fetchedTasks);
    } catch (err) {
      console.error("Failed to fetch tasks", err.response?.data || err.message);
      toast.error("Failed to fetch tasks. Please try again.");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredTasks = Array.isArray(tasks)
    ? tasks.filter((task) => (filter === "all" ? true : task.status === filter))
    : [];

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Tasks</h2>

      <div className="items-center mb-4 gap-4">
        <select
          onChange={handleFilterChange}
          value={filter}
          className="p-2 border rounded mb-4"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In-Progress</option>
          <option value="completed">Completed</option>
        </select>

        <CreateTaskForm onTaskCreated={fetchTasks} />
      </div>

      <div className="grid gap-4">
        {Array.isArray(filteredTasks) && filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard key={task._id} task={task} onUpdate={fetchTasks} />
          ))
        ) : (
          <p className="text-gray-500">No tasks found.</p>
        )}

      </div>
    </div>
  );
};

export default TaskPage;
