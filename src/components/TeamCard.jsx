import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TeamCard = ({ team, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(team.name);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this team?")) return;
    try {
      await axios.delete(`/api/teams/${team._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Team deleted");
      onDelete(team._id);
    } catch (err) {
      console.error("Delete error", err);
      toast.error("Only admin can delete team");
    }
  };

  const handleEditSubmit = async () => {
    if (!editedName.trim()) return toast.error("Name cannot be empty");
    try {
      const res = await axios.put(
        `/api/teams/${team._id}`,
        { name: editedName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Team name updated");
      onEdit(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Edit error", err);
      toast.error("Only admin can update team");
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow bg-white space-y-2">
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            className="border w-full p-2 rounded"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleEditSubmit}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Update
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="text-xl font-semibold">{team.name}</h3>
          <p className="text-sm text-gray-500">Team ID: {team._id}</p>

          <div className="mt-2">
            <p className="text-sm font-medium mb-1">Members:</p>
            <ul className="list-disc ml-5 text-sm text-gray-700">
              {team.members && team.members.length > 0 ? (
                team.members.map((member, idx) => (
                  <li key={idx}>
                    <span className="font-medium">
                      {member.fullName || member.name || "Unnamed"}
                    </span>{" "}
                    <span className="text-gray-500">({member.email || "No Email"})</span>
                  </li>
                ))
              ) : (
                <li>No members yet</li>
              )}
            </ul>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
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
        </>
      )}
    </div>
  );
};

export default TeamCard;
