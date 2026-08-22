import { useEffect, useState } from "react";
import { getAllUsers, createUser } from "../api/userApi";
import { useAuth } from "../context/AuthContext";

export default function TeamPage() {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const { role: myRole } = useAuth();

    const loadUsers = async () => {
        try {
            const res = await getAllUsers();
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to load users:", err);
            setError("Failed to load users");
        }
    };

    useEffect(() => {
        if (myRole === "ADMIN") {
            loadUsers();
        }
    }, [myRole]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await createUser({
                name,
                email,
                password,
                role: "MEMBER",
            });

            setName("");
            setEmail("");
            setPassword("");

            await loadUsers();
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Failed to create user"
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (myRole !== "ADMIN") {
        return (
            <div className="page-shell">
                <div className="container">
                    <p className="muted">
                        Only Admins can manage the team.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-shell">
            <div className="container">
                <section className="page-heading">
                    <h1>Team</h1>
                    <p>
                        Create team members and view everyone in the system.
                    </p>
                </section>

                <form
                    className="inline-form"
                    onSubmit={handleSubmit}
                >
                    <input
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Temporary password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting ? "Creating..." : "Add Member"}
                    </button>
                </form>

                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}

                <div className="user-list">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="user-row"
                        >
                            <span className="user-name">
                                {user.name}
                            </span>

                            <span className="muted">
                                {user.email}
                            </span>

                            <span className="role-pill">
                                {user.role}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}