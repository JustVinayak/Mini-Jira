import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProjects, deleteProject } from "../api/projectApi";
import { useAuth } from "../context/AuthContext";
import CreateProjectModal from "../components/CreateProjectModal";

export default function ProjectListPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const navigate = useNavigate();
    const { logoutUser, role, email, userId } = useAuth();

    useEffect(() => {
        getAllProjects()
            .then((res) => {
                setProjects(res.data);
            })
            .catch((err) => {
                console.error("Failed to fetch projects:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const openProject = (projectId) => {
        navigate(`/projects/${projectId}`);
    };

    // Lives in the component body, above the return — this is plain JS,
    // not JSX, so it must NOT be inside the returned markup below.
    const handleDelete = async (event, projectId) => {
        event.stopPropagation();

        const confirmed = window.confirm(
            "Delete this project and all its tasks? This cannot be undone."
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteProject(projectId);
            setProjects((prev) =>
                prev.filter((project) => project.id !== projectId)
            );
        } catch (err) {
            alert(err.response?.data?.error || "Failed to delete project");
        }
    };

    if (loading) {
        return (
            <div className="page-shell">
                <div className="container">
                    <p className="muted">Loading projects...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-shell">
            <div className="container">
                <header className="topbar">
                    <div className="topbar-brand">
                        <div className="brand-mark">M</div>
                        MiniJira
                    </div>

                    <span title={email} className="topbar-role">
                        {role}
                    </span>

                    {role === "ADMIN" && (
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() => navigate("/team")}
                        >
                            Team
                        </button>
                    )}

                    <button
                        type="button"
                        className="logout-button"
                        onClick={logoutUser}
                    >
                        Log Out
                    </button>
                </header>

                <section className="page-heading">
                    <div className="page-heading-row">
                        <div>
                            <h1>Projects</h1>
                            <p>Manage your projects and keep your team moving.</p>
                        </div>

                        {role === "ADMIN" && (
                            <button
                                className="login-button"
                                onClick={() => setShowCreateModal(true)}
                            >
                                + New Project
                            </button>
                        )}
                    </div>
                </section>

                {showCreateModal && (
                    <CreateProjectModal
                        ownerId={userId}
                        onClose={() => setShowCreateModal(false)}
                        onCreated={(newProject) =>
                            setProjects((prev) => [...prev, newProject])
                        }
                    />
                )}

                <div className="project-grid">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="project-card"
                            tabIndex={0}
                            role="button"
                            onClick={() => openProject(project.id)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                    event.preventDefault();
                                    openProject(project.id);
                                }
                            }}
                        >
                            <h3>{project.name}</h3>

                            <p>
                                {project.description || "No description provided."}
                            </p>

                            <div className="project-card-footer">
                                <span>Project #{project.id}</span>

                                {role === "ADMIN" && (
                                    <button
                                        type="button"
                                        className="danger-link"
                                        onClick={(event) =>
                                            handleDelete(event, project.id)
                                        }
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}