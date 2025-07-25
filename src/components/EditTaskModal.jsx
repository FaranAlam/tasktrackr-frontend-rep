import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const EditTaskModal = ({ task, onClose, onUpdate }) => {
  const [form, setForm] = useState({
    title: task.title,
    description: task.description,
    deadline: task.deadline ? task.deadline.split("T")[0] : "",
    assignedTo: task.assignedTo?._id || "", // or task.assignedTo if it's string
    team: task.team?._id || "", // or task.team if it's string
    status: task.status || "pending",
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make PUT request to update task
      await axios.put(`/api/tasks/${task._id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Task updated successfully!");
      onUpdate(); // Refresh task list or data after update
      onClose();  // Close modal
    } catch (error) {
      console.error("Failed to update task", error);
      toast.error("Only admin can update tasks");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 space-y-3">
        <h2 className="text-lg font-semibold">Edit Task</h2>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Title"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Description"
          required
        />
        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        {/* If you want dropdowns for assignedTo and team, add them here */}
        <input
          name="assignedTo"
          value={form.assignedTo}
          onChange={handleChange}
          placeholder="Assigned To (User ID)"
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="team"
          value={form.team}
          onChange={handleChange}
          placeholder="Team ID"
          className="w-full p-2 border rounded"
          required
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-1 bg-green-600 text-white rounded"
            type="submit"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
