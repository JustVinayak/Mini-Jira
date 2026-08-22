import { useState } from "react";
import { createProject } from "../api/projectApi";

export default function CreateProjectModal({
    ownerId,
    onClose,
    onCreated,
}) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const res = await createProject(
                { name, description },
                ownerId
            );

            onCreated(res.data);
            onClose();
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Failed to create project"
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
                <h2>New Project</h2>

                <form onSubmit={handleSubmit}>
                    <div className="login-field">
                        <label htmlFor="project-name">
                            Project name
                        </label>

                        <input
                            id="project-name"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            required
                            autoFocus
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="project-description">
                            Description
                        </label>

                        <textarea
                            id="project-description"
                            rows={3}
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                        />
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
                                : "Create Project"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}