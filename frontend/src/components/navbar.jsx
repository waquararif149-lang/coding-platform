import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <h2>Coding Platform</h2>
            </div>
            <div className="navbar-menu">
                {user && (
                    <>
                        <span className="user-name">Welcome, {user.name}</span>
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
