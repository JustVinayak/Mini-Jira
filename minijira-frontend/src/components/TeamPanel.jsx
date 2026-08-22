import { useEffect, useState } from "react";
import {
    addMember,
    removeMember,
} from "../api/projectApi";
import { getAllUsers } from "../api/userApi";

export default function TeamPanel({ project, onMemberAdded }) {
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getAllUsers()
            .then((res) => {
                setAllUsers(res.data);
            })
            .catch((err) => {
                console.error("Failed to load users:", err);
                setError("Failed to load users");
            });
    }, []);

    const memberIds = new Set(
        (project.members || []).map((member) => member.id)
    );

    const nonMembers = allUsers.filter(
        (user) => !memberIds.has(user.id)
    );

    const handleAdd = async () => {
        if (!selectedUserId) return;

        setError("");
        setLoading(true);

        try {
            await addMember(
                project.id,
                Number(selectedUserId)
            );

            setSelectedUserId("");
            await onMemberAdded();
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Failed to add member"
            );
        } finally {
            setLoading(false);
        }
    };

const handleRemove = async (userId) => {
    const confirmed = window.confirm(
        "Remove this member from the project?"
    );

    if (!confirmed) {
        return;
    }

    setError("");

    try {
        await removeMember(project.id, userId);
        await onMemberAdded();
    } catch (err) {
        setError(
            err.response?.data?.error ||
            "Failed to remove member"
        );
    }
};

    return (
        <div className="team-panel">
            <div className="team-panel-header">
                <div>
                    <h3>Team</h3>
                    <p className="muted">
                        Manage project members
                    </p>
                </div>

                <span className="task-count">
                    {(project.members || []).length}
                </span>
            </div>

            <div className="member-chip-list">
                {(project.members || []).map((member) => (
                    <span
                        key={member.id}
                        className="member-chip"
                    >
                        <span>{member.name}</span>

                        <button
                            type="button"
                            className="chip-remove"
                            onClick={() =>
                                handleRemove(member.id)
                            }
                            title={`Remove ${member.name}`}
                            aria-label={`Remove ${member.name}`}
                        >
                            ×
                        </button>
                    </span>
                ))}

                {(!project.members ||
                    project.members.length === 0) && (
                    <span className="muted">
                        No members yet
                    </span>
                )}
            </div>

            <div className="add-member-row">
                <select
                    value={selectedUserId}
                    onChange={(e) =>
                        setSelectedUserId(e.target.value)
                    }
                >
                    <option value="">
                        Add a member...
                    </option>

                    {nonMembers.map((user) => (
                        <option
                            key={user.id}
                            value={user.id}
                        >
                            {user.name} ({user.email})
                        </option>
                    ))}
                </select>

                <button
                    type="button"
                    onClick={handleAdd}
                    className="secondary-button"
                    disabled={!selectedUserId || loading}
                >
                    {loading ? "Adding..." : "Add"}
                </button>
            </div>

            {nonMembers.length === 0 && (
                <p className="muted team-panel-note">
                    All users are already members of this project.
                </p>
            )}

            {error && (
                <p className="error">
                    {error}
                </p>
            )}
        </div>
    );
}