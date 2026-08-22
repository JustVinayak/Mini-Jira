import { useState } from "react";
import { createTask } from "../api/taskApi";

export default function CreateTaskModal({
    projectId,
    members,
    onClose,
    onCreated,
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("MEDIUM");
    const [assigneeId, setAssigneeId] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSubmitting(true);

        try {
            const res = await createTask(
                {
                    title,
                    description,
                    priority,
                },
                projectId,
                assigneeId || null
            );

            onCreated(res.data);
            onClose();
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Failed to create task"
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="modal-backdrop"
            onClick={onClose}
        >
            <div
                className="modal-card"
                onClick={(e) => e.stopPropagation()}
            >
                <h2>New Task</h2>

                <form onSubmit={handleSubmit}>
                    <div className="login-field">
                        <label htmlFor="task-title">
                            Title
                        </label>

                        <input
                            id="task-title"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            required
                            autoFocus
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="task-description">
                            Description
                        </label>

                        <textarea
                            id="task-description"
                            rows={3}
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="task-priority">
                            Priority
                        </label>

                        <select
                            id="task-priority"
                            value={priority}
                            onChange={(e) =>
                                setPriority(e.target.value)
                            }
                        >
                            <option value="LOW">
                                Low
                            </option>
                            <option value="MEDIUM">
                                Medium
                            </option>
                            <option value="HIGH">
                                High
                            </option>
                        </select>
                    </div>

                    <div className="login-field">
                        <label htmlFor="task-assignee">
                            Assignee
                        </label>

                        <select
                            id="task-assignee"
                            value={assigneeId}
                            onChange={(e) =>
                                setAssigneeId(e.target.value)
                            }
                        >
                            <option value="">
                                Unassigned
                            </option>

                            {(members || []).map((member) => (
                                <option
                                    key={member.id}
                                    value={member.id}
                                >
                                    {member.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {error && (
                        <p className="error">
                            {error}
                        </p>
                    )}

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="login-button"
                            disabled={submitting}
                        >
                            {submitting
                                ? "Creating..."
                                : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}