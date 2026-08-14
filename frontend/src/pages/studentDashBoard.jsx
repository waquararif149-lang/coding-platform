import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentExams } from "../services/examService";

function StudentDashboard() {
    const navigate = useNavigate();

    const [exams, setExams] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                setUser(JSON.parse(userStr));
            } catch (e) {
                // ignore
            }
        }

        const fetchExams = async () => {
            try {
                const response = await getStudentExams();
                setExams(response.data || []);
            } catch (err) {
                setError(err.message || "Unable to load exams.");
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, []);

    const getExamStatus = (exam) => {
        const now = new Date();
        const start = new Date(exam.startTime);
        const end = new Date(exam.endTime);

        if (now < start) {
            return "UPCOMING";
        }
        if (now > end) {
            return "ENDED";
        }
        return "ACTIVE";
    };

    const handleExamClick = (exam) => {
        navigate(`/student/exam/${exam._id}`, {
            state: { exam }
        });
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div>
                    <h1>Student Dashboard</h1>
                    {user && <p>Welcome, <strong>{user.name}</strong> ({user.email})</p>}
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </header>

            <main className="dashboard-content">
                <div className="section-heading">
                    <h2>My Assigned Exams</h2>
                    <span>{exams.length} Exam(s)</span>
                </div>

                {loading && <div className="message-card">Loading exams...</div>}

                {error && <div className="error-card">{error}</div>}

                {!loading && !error && exams.length === 0 && (
                    <div className="message-card">
                        <h3>No exams assigned yet.</h3>
                        <p>You currently do not have any coding exams assigned to your account.</p>
                    </div>
                )}

                <div className="exam-grid">
                    {exams.map((exam) => {
                        const status = getExamStatus(exam);

                        return (
                            <div className="exam-card" key={exam._id}>
                                <div className="exam-card-top">
                                    <h3>{exam.title}</h3>
                                    <span className={`status ${status.toLowerCase()}`}>
                                        {status}
                                    </span>
                                </div>

                                <p className="exam-description">
                                    {exam.description || "No description provided."}
                                </p>

                                <div className="exam-info">
                                    <div>
                                        <span>Duration</span>
                                        <strong>{exam.duration} minute(s)</strong>
                                    </div>

                                    <div>
                                        <span>Questions</span>
                                        <strong>{exam.questions?.length || 0}</strong>
                                    </div>

                                    <div>
                                        <span>Start Time</span>
                                        <strong>{new Date(exam.startTime).toLocaleString()}</strong>
                                    </div>

                                    <div>
                                        <span>End Time</span>
                                        <strong>{new Date(exam.endTime).toLocaleString()}</strong>
                                    </div>
                                </div>

                                <button
                                    className="primary-btn"
                                    onClick={() => handleExamClick(exam)}
                                >
                                    {status === "ACTIVE" ? "Start Exam" : "View Exam"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}

export default StudentDashboard;