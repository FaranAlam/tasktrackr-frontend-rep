import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AnalyticsPage = () => {
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);

  const [selectedTeam, setSelectedTeam] = useState("all");
  const [selectedUser, setSelectedUser] = useState("all");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [statusCount, setStatusCount] = useState({
    Pending: 0,
    "In Progress": 0,
    Completed: 0,
  });
  const [unknownCount, setUnknownCount] = useState(0);

  useEffect(() => {
    fetchTeams();
    fetchUsers();
    fetchTasks();
  }, []);

  useEffect(() => {
    let filteredTasks = tasks;

    if (selectedTeam !== "all") {
      filteredTasks = filteredTasks.filter((task) => task.team === selectedTeam);
    }
    if (selectedUser !== "all") {
      filteredTasks = filteredTasks.filter((task) => (task.assignedTo && (task.assignedTo._id || task.assignedTo)) === selectedUser);
    }
    if (startDate) {
      filteredTasks = filteredTasks.filter(
        (task) => new Date(task.createdAt) >= new Date(startDate)
      );
    }
    if (endDate) {
      filteredTasks = filteredTasks.filter(
        (task) => new Date(task.createdAt) <= new Date(endDate)
      );
    }

    countTaskStatus(filteredTasks);
  }, [tasks, selectedTeam, selectedUser, startDate, endDate]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("/api/tasks", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await axios.get("/api/teams", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTeams(res.data);
    } catch (err) {
      console.error("Failed to fetch teams", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const countTaskStatus = (taskList) => {
    const counts = { Pending: 0, "In Progress": 0, Completed: 0 };
    let unknown = 0;

    taskList.forEach((task) => {
      const status = task.status?.toLowerCase().trim();
      if (status === "pending") counts["Pending"]++;
      else if (status === "in-progress" || status.includes("progress"))
        counts["In Progress"]++;
      else if (status === "completed") counts["Completed"]++;
      else unknown++;
    });

    setStatusCount(counts);
    setUnknownCount(unknown);
  };

  const barData = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [
      {
        label: "Tasks",
        data: [
          statusCount["Pending"],
          statusCount["In Progress"],
          statusCount["Completed"],
        ],
        backgroundColor: ["#f87171", "#facc15", "#4ade80"],
        borderRadius: 4,
      },
    ],
  };

  const exportCSV = () => {
    let csv = "Status,Count\n";
    csv += `Pending,${statusCount["Pending"]}\n`;
    csv += `In Progress,${statusCount["In Progress"]}\n`;
    csv += `Completed,${statusCount["Completed"]}\n`;
    if (unknownCount > 0) csv += `Unknown,${unknownCount}\n`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "task_analytics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">Task Analytics</h2>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        {/* Team Filter */}
        <div className="flex items-center">
          <label htmlFor="teamSelect" className="font-semibold mr-2">
            Filter by Team:
          </label>
          <select
            id="teamSelect"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">All Teams</option>
            {teams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        {/* User Filter */}
        <div className="flex items-center">
          <label htmlFor="userSelect" className="font-semibold mr-2">
            Filter by User:
          </label>
          <select
            id="userSelect"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">All Users</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.fullName || user.name || user.email}
              </option>
            ))}
          </select>
        </div>

        {/* Date From */}
        <div className="flex items-center">
          <label htmlFor="startDate" className="font-semibold mr-2">
            From:
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>

        {/* Date To */}
        <div className="flex items-center">
          <label htmlFor="endDate" className="font-semibold mr-2">
            To:
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>

        {/* Export Button */}
        <button
          onClick={exportCSV}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Export CSV
        </button>
      </div>

      {tasks.length > 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "2rem",
            flexWrap: "wrap", // optional for responsiveness
            gap: "1rem",              // Adds space between child elements
          }}
        >
          {/* Bar Chart container */}
          <div
            style={{
              width: "600px",
              height: "300px",
              backgroundColor: "white",
              borderRadius: "0.75rem",
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h3 className="text-lg font-semibold mb-2">Tasks by Status (Bar)</h3>
            <div style={{ width: "100%", height: "100%" }}>
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true } },
                }}
              />
            </div>
          </div>

          {/* Summary */}
          <div
            style={{
              width: "600px",
              height: "300px",
              backgroundColor: "white",
              borderRadius: "0.75rem",
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h3 className="text-lg font-semibold mb-2">Summary</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>
                Total Tasks:{" "}
                {tasks.filter((task) => {
                  if (selectedTeam !== "all" && task.team !== selectedTeam)
                    return false;
                  if (selectedUser !== "all" && task.assignedTo !== selectedUser)
                    return false;
                  if (startDate && new Date(task.createdAt) < new Date(startDate))
                    return false;
                  if (endDate && new Date(task.createdAt) > new Date(endDate))
                    return false;
                  return true;
                }).length}
              </li>
              <li>Pending: {statusCount["Pending"]}</li>
              <li>In Progress: {statusCount["In Progress"]}</li>
              <li>Completed: {statusCount["Completed"]}</li>
              {unknownCount > 0 && <li>Unknown/Other: {unknownCount}</li>}
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">No tasks found to display analytics.</p>
      )}

    </div>
  );
};

export default AnalyticsPage;
