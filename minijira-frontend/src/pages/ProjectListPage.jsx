import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProjects } from "../api/projectApi";
import { useAuth } from "../context/AuthContext";

export default function ProjectListPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { logoutUser, role, email } = useAuth();

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

    if (loading) {
        return (
            <div className="page-shell">
                <div className="container">
                    <p className="muted">Loading projects...</p>
                </div>
            </div>
        );
    }

    const openProject = (projectId) => {
        navigate(`/projects/${projectId}`);
    };

    return (
        <div className="page-shell">
            <div className="container">
                <header className="topbar">
                    <div className="topbar-brand">
                        <div className="brand-mark">M</div>
                        MiniJira
                    </div>

                    <span
                        title={email}
                        className="topbar-role"
                    >
                        {role}
                    </span>

                    <button
                        type="button"
                        className="logout-button"
                        onClick={logoutUser}
                    >
                        Log Out
                    </button>
                </header>

                <section className="page-heading">
                    <h1>Projects</h1>
                    <p>
                        Manage your projects and keep your team moving.
                    </p>
                </section>

                <div className="project-grid">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="project-card"
                            tabIndex={0}
                            role="button"
                            onClick={() => openProject(project.id)}
                            onKeyDown={(event) => {
                                if (
                                    event.key === "Enter" ||
                                    event.key === " "
                                ) {
                                    event.preventDefault();
                                    openProject(project.id);
                                }
                            }}
                        >
                            <h3>{project.name}</h3>

                            <p>
                                {project.description ||
                                    "No description provided."}
                            </p>

                            <div className="project-card-footer">
                                <span>
                                    Project #{project.id}
                                </span>

                                <span>
                                    View project →
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}