import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/api"; // ✅ use this instead of axios directly
import TeamCard from "../components/TeamCard";

const TeamPage = () => {
  const [teams, setTeams] = useState([]);
  const [newTeam, setNewTeam] = useState("");
  const [joinedTeamId, setJoinedTeamId] = useState("");

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await api.get("/api/teams");
      setTeams(res.data);
    } catch (err) {
      console.error("Failed to fetch teams", err);
      toast.error("Failed to load teams");
    }
  };

  const createTeam = async () => {
    if (!newTeam.trim()) return toast.error("Enter a valid team name");
    try {
      await api.post("/api/teams", { name: newTeam.trim() });
      toast.success("Team created successfully!");
      setNewTeam("");
      fetchTeams();
    } catch (err) {
      console.error("Failed to create team", err);
      toast.error(err?.response?.data?.message || "Failed to create team");
    }
  };

  const joinTeam = async () => {
    if (!joinedTeamId.trim()) return toast.error("Enter a valid Team ID");
    try {
      await api.post("/api/teams/join", { teamId: joinedTeamId.trim() });
      toast.success("Joined team successfully!");
      setJoinedTeamId("");
      fetchTeams();
    } catch (err) {
      console.error("Failed to join team", err);
      toast.error(err?.response?.data?.message || "Failed to join team");
    }
  };

  const handleDeleteTeam = (deletedId) => {
    setTeams((prev) => prev.filter((team) => team._id !== deletedId));
  };

  const handleEditTeam = (updatedTeam) => {
    setTeams((prev) =>
      prev.map((t) => (t._id === updatedTeam._id ? updatedTeam : t))
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Teams</h2>

      {/* Create Team */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="New Team Name"
          value={newTeam}
          onChange={(e) => setNewTeam(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
        <button
          onClick={createTeam}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          Create Team
        </button>
      </div>

      {/* Join Team */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Team ID to Join current user"
          value={joinedTeamId}
          onChange={(e) => setJoinedTeamId(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
        <button
          onClick={joinTeam}
          className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
        >
          Join Team
        </button>
      </div>

      {/* List of Teams */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.length > 0 ? (
          teams.map((team) => (
            <TeamCard
              key={team._id}
              team={team}
              onDelete={handleDeleteTeam}
              onEdit={handleEditTeam}
            />
          ))
        ) : (
          <p className="text-gray-600">No teams found.</p>
        )}
      </div>
    </div>
  );
};

export default TeamPage;
