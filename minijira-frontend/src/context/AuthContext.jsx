import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    let decoded = null;

    if (token) {
        try {
            decoded = jwtDecode(token);
        } catch (error) {
            console.error("Invalid JWT:", error);
            localStorage.removeItem("token");
            setToken(null);
        }
    }

    const role = decoded?.role ?? null;
    const email = decoded?.sub ?? null;
    const userId = decoded?.userId ?? null;

    const loginUser = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    const logoutUser = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                role,
                email,
                userId,
                loginUser,
                logoutUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);