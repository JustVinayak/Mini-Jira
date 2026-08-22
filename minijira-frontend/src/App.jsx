import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import ProjectListPage from "./pages/ProjectListPage";
import ProjectBoardPage from "./pages/ProjectBoardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import TeamPage from "./pages/TeamPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/team"
                    element={
                        <ProtectedRoute>
                            <TeamPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/team"
                    element={
                        <ProtectedRoute>
                            <TeamPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/projects"
                    element={
                        <ProtectedRoute>
                            <ProjectListPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/projects/:id"
                    element={
                        <ProtectedRoute>
                            <ProjectBoardPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;