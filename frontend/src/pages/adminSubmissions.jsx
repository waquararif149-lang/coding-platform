import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllSubmissions } from "../services/submissionService";

function AdminSubmissions() {
    const navigate = useNavigate();

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchSubmissions = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await getAllSubmissions();
            setSubmissions(res.data || []);
        } catch (err) {
            setError(err.message || "Failed to fetch submissions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
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
                    <h1>Student Submissions</h1>
                    <p>Review student code submissions across all exams</p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button className="secondary-btn" onClick={() => navigate("/admin")}>
                        Admin Dashboard
                    </button>
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>

            <main className="dashboard-content">
                <div className="section-heading">
                    <h2>Submissions History</h2>
                    <span>{submissions.length} Total Submission(s)</span>
                </div>

                {error && <div className="error-card" style={{ marginBottom: "20px" }}>{error}</div>}

                {loading && <div className="message-card">Loading submissions...</div>}

                {!loading && submissions.length === 0 && (
                    <div className="message-card">
                        <h3>No submissions recorded yet.</h3>
                        <p>Submissions will appear here once students submit solutions to exam questions.</p>
                    </div>
                )}

                {!loading && submissions.length > 0 && (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Question</th>
                                    <th>Language</th>
                                    <th>Status</th>
                                    <th>Passed Tests</th>
                                    <th>Submission Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map((sub) => (
                                    <tr key={sub._id}>
                                        <td>
                                            <strong>{sub.userId?.name || "Student"}</strong>
                                            <p style={{ fontSize: "12px", color: "#64748b" }}>{sub.userId?.email || sub.userId}</p>
                                        </td>
                                        <td>
                                            <strong>{sub.questionId?.title || "Question"}</strong>
                                        </td>
                                        <td>
                                            <span className="lang-badge">{sub.language}</span>
                                        </td>
                                        <td>
                                            <span className={`status ${sub.status?.toLowerCase()}`}>
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td>
                                            <strong>{sub.passedTests} / {sub.totalTests}</strong>
                                        </td>
                                        <td>{new Date(sub.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminSubmissions;
