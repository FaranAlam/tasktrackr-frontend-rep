// src/components/TaskCard.jsx
import React, { useState } from "react";
import EditTaskModal from "./EditTaskModal";
import axios from "axios";
import { toast } from "react-toastify";

const TaskCard = ({ task, onUpdate }) => {
  const [showEdit, setShowEdit] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await axios.patch(
        `/api/tasks/${task._id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Task status updated");
      onUpdate(); // refresh task list
    } catch (err) {
      toast.error("Failed to update status");
      console.error("Status update failed", err);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/tasks/${task._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Task deleted successfully");
      onUpdate();
    } catch (err) {
      toast.error("Only admin can delete tasks");
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow bg-white space-y-2">
      <h3 className="font-semibold text-lg">{task.title}</h3>
      <p className="text-sm text-gray-700">{task.description}</p>
      <p className="text-sm text-gray-500">
        Due: {new Date(task.dueDate).toLocaleDateString()}
      </p>

      <div className="flex items-center space-x-2">
        <select
          value={task.status}
          onChange={handleStatusChange}
          className="border px-2 py-1 rounded text-sm"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button
          onClick={() => setShowEdit(true)}
          className="bg-yellow-500 text-white px-3 py-1 rounded"
        >
          Edit
        </button>

        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      </div>

      {showEdit && (
        <EditTaskModal
          task={task}
          onClose={() => setShowEdit(false)}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
};

export default TaskCard;
