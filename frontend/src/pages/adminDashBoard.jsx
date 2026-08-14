import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllExams } from "../services/examService";
import { getAllSubmissions } from "../services/submissionService";

function AdminDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({ examsCount: 0, submissionsCount: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                setUser(JSON.parse(userStr));
            } catch (e) {
                // ignore
            }
        }

        const fetchStats = async () => {
            try {
                const examsRes = await getAllExams();
                const subsRes = await getAllSubmissions();
                setStats({
                    examsCount: examsRes.data?.length || 0,
                    submissionsCount: subsRes.data?.length || 0
                });
            } catch (err) {
                console.error("Error loading dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div>
                    <h1>Admin Control Panel</h1>
                    {user && <p>Logged in as <strong>{user.name}</strong> ({user.email})</p>}
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </header>

            <main className="dashboard-content">
                <div className="section-heading">
                    <h2>Platform Overview</h2>
                    <span>Admin Mode</span>
                </div>

                <div className="admin-stats-grid">
                    <div className="stat-card">
                        <h3>Total Exams</h3>
                        <p className="stat-number">{loading ? "..." : stats.examsCount}</p>
                    </div>

                    <div className="stat-card">
                        <h3>Total Submissions</h3>
                        <p className="stat-number">{loading ? "..." : stats.submissionsCount}</p>
                    </div>
                </div>

                <div className="admin-sections-grid">
                    <div className="admin-nav-card" onClick={() => navigate("/admin/exams")}>
                        <div className="card-icon">📝</div>
                        <h3>Exam Management</h3>
                        <p>Create, edit, delete exams, assign students, and add questions.</p>
                        <button className="primary-btn">Manage Exams →</button>
                    </div>

                    <div className="admin-nav-card" onClick={() => navigate("/admin/submissions")}>
                        <div className="card-icon">📊</div>
                        <h3>Student Submissions</h3>
                        <p>View all submitted solutions, status, test results, and timelines.</p>
                        <button className="secondary-btn">View Submissions →</button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;
