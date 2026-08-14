import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getExamById, assignStudentToExam, assignQuestionToExam } from "../services/examService";
import { getAllQuestions, createQuestion } from "../services/questionService";

function AdminExamDetails() {
    const { examId } = useParams();
    const navigate = useNavigate();

    const [exam, setExam] = useState(null);
    const [allQuestions, setAllQuestions] = useState([]);
    const [selectedQuestionId, setSelectedQuestionId] = useState("");
    const [studentIdInput, setStudentIdInput] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // Create question modal state
    const [isCreateQModalOpen, setIsCreateQModalOpen] = useState(false);
    const [newQuestionData, setNewQuestionData] = useState({
        title: "",
        description: "",
        inputFormat: "",
        outputFormat: "",
        constraints: ""
    });

    const fetchExamData = async () => {
        setLoading(true);
        setError("");
        try {
            const examRes = await getExamById(examId);
            setExam(examRes.data);

            const questionsRes = await getAllQuestions();
            setAllQuestions(questionsRes.data || []);
        } catch (err) {
            setError(err.message || "Failed to load exam details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExamData();
    }, [examId]);

    const handleAssignStudent = async (e) => {
        e.preventDefault();
        if (!studentIdInput.trim()) return;

        setError("");
        setSuccessMsg("");
        try {
            await assignStudentToExam(examId, studentIdInput.trim());
            setSuccessMsg("Student assigned successfully!");
            setStudentIdInput("");
            fetchExamData();
        } catch (err) {
            setError(err.message || "Failed to assign student.");
        }
    };

    const handleAssignQuestion = async (e) => {
        e.preventDefault();
        if (!selectedQuestionId) return;

        setError("");
        setSuccessMsg("");
        try {
            await assignQuestionToExam(examId, selectedQuestionId);
            setSuccessMsg("Question assigned successfully!");
            setSelectedQuestionId("");
            fetchExamData();
        } catch (err) {
            setError(err.message || "Failed to assign question.");
        }
    };

    const handleCreateQuestionSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");

        try {
            const createdRes = await createQuestion(newQuestionData);
            const createdQ = createdRes.data;

            // Automatically assign created question to exam
            await assignQuestionToExam(examId, createdQ._id);

            setSuccessMsg("New question created and assigned to exam successfully!");
            setIsCreateQModalOpen(false);
            setNewQuestionData({
                title: "",
                description: "",
                inputFormat: "",
                outputFormat: "",
                constraints: ""
            });
            fetchExamData();
        } catch (err) {
            setError(err.message || "Failed to create question.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="dashboard">
                <main className="dashboard-content">
                    <div className="message-card">Loading exam details...</div>
                </main>
            </div>
        );
    }

    if (error && !exam) {
        return (
            <div className="dashboard">
                <main className="dashboard-content">
                    <div className="error-card">{error}</div>
                    <div style={{ marginTop: "20px" }}>
                        <button className="secondary-btn" onClick={() => navigate("/admin/exams")}>
                            Back to Exams
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div>
                    <h1>{exam?.title}</h1>
                    <p>Exam Details & Configuration</p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button className="secondary-btn" onClick={() => navigate("/admin/exams")}>
                        Back to Exams
                    </button>
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>

            <main className="dashboard-content">
                {error && <div className="error-card" style={{ marginBottom: "20px" }}>{error}</div>}
                {successMsg && (
                    <div className="message-card" style={{ marginBottom: "20px", color: "#166534", backgroundColor: "#f0fdf4", borderColor: "#bbf7d0" }}>
                        {successMsg}
                    </div>
                )}

                {/* EXAM INFO */}
                <div className="exam-card" style={{ marginBottom: "30px" }}>
                    <h3>Exam Details</h3>
                    <p className="exam-description">{exam?.description}</p>
                    <div className="exam-info" style={{ gridTemplateColumns: "repeat(4, 1fr)", display: "grid", gap: "15px" }}>
                        <div>
                            <span>Duration:</span>
                            <strong>{exam?.duration} mins</strong>
                        </div>
                        <div>
                            <span>Start Time:</span>
                            <strong>{new Date(exam?.startTime).toLocaleString()}</strong>
                        </div>
                        <div>
                            <span>End Time:</span>
                            <strong>{new Date(exam?.endTime).toLocaleString()}</strong>
                        </div>
                        <div>
                            <span>Exam ID:</span>
                            <strong style={{ fontSize: "12px", fontFamily: "monospace" }}>{exam?._id}</strong>
                        </div>
                    </div>
                </div>

                <div className="admin-manage-grid">
                    {/* ASSIGN QUESTIONS SECTION */}
                    <div className="admin-manage-card">
                        <h2>Assign Questions</h2>
                        <p style={{ color: "#64748b", marginBottom: "15px" }}>
                            Select an existing question or create a new one to add to this exam.
                        </p>

                        <form onSubmit={handleAssignQuestion} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                            <select
                                value={selectedQuestionId}
                                onChange={(e) => setSelectedQuestionId(e.target.value)}
                                style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                            >
                                <option value="">-- Select Question --</option>
                                {allQuestions.map((q) => (
                                    <option key={q._id} value={q._id}>
                                        {q.title}
                                    </option>
                                ))}
                            </select>
                            <button type="submit" className="primary-btn" style={{ width: "auto" }} disabled={!selectedQuestionId}>
                                Assign Question
                            </button>
                        </form>

                        <button
                            type="button"
                            className="secondary-btn"
                            style={{ marginBottom: "20px" }}
                            onClick={() => setIsCreateQModalOpen(true)}
                        >
                            + Create & Assign New Question
                        </button>

                        <h3>Assigned Questions ({exam?.questions?.length || 0})</h3>
                        {exam?.questions?.length === 0 ? (
                            <p style={{ color: "#94a3b8", marginTop: "10px" }}>No questions assigned yet.</p>
                        ) : (
                            <ul className="item-list">
                                {exam?.questions?.map((q, idx) => (
                                    <li key={q._id || idx}>
                                        <strong>{idx + 1}. {q.title || `Question ID: ${q}`}</strong>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* ASSIGN STUDENTS SECTION */}
                    <div className="admin-manage-card">
                        <h2>Assign Students</h2>
                        <p style={{ color: "#64748b", marginBottom: "15px" }}>
                            Enter student MongoDB User ID to grant exam access.
                        </p>

                        <form onSubmit={handleAssignStudent} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                            <input
                                type="text"
                                placeholder="Student MongoDB User ID"
                                value={studentIdInput}
                                onChange={(e) => setStudentIdInput(e.target.value)}
                                style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                                required
                            />
                            <button type="submit" className="primary-btn" style={{ width: "auto" }}>
                                Assign Student
                            </button>
                        </form>

                        <h3>Assigned Students ({exam?.students?.length || 0})</h3>
                        {exam?.students?.length === 0 ? (
                            <p style={{ color: "#94a3b8", marginTop: "10px" }}>No students assigned yet.</p>
                        ) : (
                            <ul className="item-list">
                                {exam?.students?.map((s, idx) => (
                                    <li key={s._id || idx}>
                                        <span style={{ fontFamily: "monospace" }}>{s._id || s}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </main>

            {/* CREATE QUESTION MODAL */}
            {isCreateQModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Create & Assign Question</h2>
                        <form onSubmit={handleCreateQuestionSubmit}>
                            <div className="form-group">
                                <label>Question Title</label>
                                <input
                                    type="text"
                                    value={newQuestionData.title}
                                    onChange={(e) => setNewQuestionData({ ...newQuestionData, title: e.target.value })}
                                    placeholder="e.g. Three Sum"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={newQuestionData.description}
                                    onChange={(e) => setNewQuestionData({ ...newQuestionData, description: e.target.value })}
                                    placeholder="Problem description"
                                    rows="3"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Input Format</label>
                                <textarea
                                    value={newQuestionData.inputFormat}
                                    onChange={(e) => setNewQuestionData({ ...newQuestionData, inputFormat: e.target.value })}
                                    placeholder="e.g. First line contains integer N"
                                    rows="2"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Output Format</label>
                                <textarea
                                    value={newQuestionData.outputFormat}
                                    onChange={(e) => setNewQuestionData({ ...newQuestionData, outputFormat: e.target.value })}
                                    placeholder="e.g. Print single integer"
                                    rows="2"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Constraints</label>
                                <textarea
                                    value={newQuestionData.constraints}
                                    onChange={(e) => setNewQuestionData({ ...newQuestionData, constraints: e.target.value })}
                                    placeholder="e.g. 1 <= N <= 10^5"
                                    rows="2"
                                    required
                                />
                            </div>

                            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "20px" }}>
                                <button type="button" className="secondary-btn" onClick={() => setIsCreateQModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="primary-btn" style={{ width: "auto" }}>
                                    Save & Assign
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminExamDetails;
