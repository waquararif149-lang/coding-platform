import { Navigate } from "react-router-dom";

function ProtectedRoute({ element, requiredRole }) {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
        return <Navigate to="/login" replace />;
    }

    try {
        const user = JSON.parse(userStr);
        
        if (requiredRole && user.role !== requiredRole) {
            if (user.role === "ADMIN") {
                return <Navigate to="/admin" replace />;
            }
            if (user.role === "STUDENT") {
                return <Navigate to="/student" replace />;
            }
            return <Navigate to="/login" replace />;
        }

        return element;
    } catch (error) {
        return <Navigate to="/login" replace />;
    }
}

export default ProtectedRoute;
