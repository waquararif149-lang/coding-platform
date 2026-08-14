import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getExamQuestions } from "../services/examService";

function Exam() {
    const { examId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [exam, setExam] = useState(location.state?.exam || null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await getExamQuestions(examId);
                setQuestions(response.data || []);
            } catch (err) {
                // Captures "Exam has not started yet" or "Exam has already ended"
                setError(err.message || "Unable to access exam.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [examId]);

    const handleBack = () => {
        navigate("/student");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const isExamActive = () => {
        if (!exam) return true;
        const now = new Date();
        const start = new Date(exam.startTime);
        const end = new Date(exam.endTime);
        return now >= start && now <= end;
    };

    return (
        <div className="exam-container">
            <header className="exam-header">
                <div>
                    <h1>{exam?.title || "Exam Details"}</h1>
                    <p>{exam?.description || "Coding examination"}</p>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </header>

            <main className="exam-content">
                {loading && <div className="message-card">Loading exam details...</div>}

                {!loading && error && (
                    <div className="message-card error-card">
                        <h2>Exam Access Status</h2>
                        <p style={{ marginTop: "10px", fontSize: "16px" }}>{error}</p>
                        <div style={{ marginTop: "20px" }}>
                            <button className="secondary-btn" onClick={handleBack}>
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                )}

                {!loading && !error && (
                    <div className="exam-details">
                        <h2>Exam Overview</h2>

                        <div className="details-grid">
                            <div>
                                <span>Title:</span>
                                <strong>{exam?.title || "Exam"}</strong>
                            </div>

                            <div>
                                <span>Description:</span>
                                <strong>{exam?.description || "N/A"}</strong>
                            </div>

                            <div>
                                <span>Questions Count:</span>
                                <strong>{questions.length}</strong>
                            </div>

                            {exam?.duration && (
                                <div>
                                    <span>Duration:</span>
                                    <strong>{exam.duration} minute(s)</strong>
                                </div>
                            )}

                            {exam?.startTime && (
                                <div>
                                    <span>Start Time:</span>
                                    <strong>{new Date(exam.startTime).toLocaleString()}</strong>
                                </div>
                            )}

                            {exam?.endTime && (
                                <div>
                                    <span>End Time:</span>
                                    <strong>{new Date(exam.endTime).toLocaleString()}</strong>
                                </div>
                            )}
                        </div>

                        <div className="exam-actions">
                            <button
                                className="primary-btn"
                                onClick={() =>
                                    navigate(`/student/exam/${examId}/solve`, {
                                        state: { exam, questions }
                                    })
                                }
                                disabled={!isExamActive()}
                            >
                                Start Exam
                            </button>

                            <button className="secondary-btn" onClick={handleBack}>
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Exam;