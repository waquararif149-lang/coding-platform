import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllExams, createExam, updateExam, deleteExam } from "../services/examService";

function AdminExams() {
    const navigate = useNavigate();

    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // Modal state for Create / Edit
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExamId, setEditingExamId] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        duration: 60,
        startTime: "",
        endTime: ""
    });

    const fetchExams = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await getAllExams();
            setExams(res.data || []);
        } catch (err) {
            setError(err.message || "Failed to fetch exams");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    const openCreateModal = () => {
        setEditingExamId(null);
        const now = new Date();
        const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
        const twoHours = new Date(now.getTime() + 120 * 60 * 1000);

        setFormData({
            title: "",
            description: "",
            duration: 60,
            startTime: nextHour.toISOString().slice(0, 16),
            endTime: twoHours.toISOString().slice(0, 16)
        });
        setIsModalOpen(true);
    };

    const openEditModal = (exam) => {
        setEditingExamId(exam._id);
        setFormData({
            title: exam.title || "",
            description: exam.description || "",
            duration: exam.duration || 60,
            startTime: exam.startTime ? new Date(exam.startTime).toISOString().slice(0, 16) : "",
            endTime: exam.endTime ? new Date(exam.endTime).toISOString().slice(0, 16) : ""
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingExamId(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "duration" ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");

        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                duration: Number(formData.duration),
                startTime: new Date(formData.startTime).toISOString(),
                endTime: new Date(formData.endTime).toISOString()
            };

            if (editingExamId) {
                await updateExam(editingExamId, payload);
                setSuccessMsg("Exam updated successfully!");
            } else {
                await createExam(payload);
                setSuccessMsg("Exam created successfully!");
            }

            closeModal();
            fetchExams();
        } catch (err) {
            setError(err.message || "Operation failed.");
        }
    };

    const handleDelete = async (examId) => {
        if (!window.confirm("Are you sure you want to delete this exam?")) return;
        try {
            await deleteExam(examId);
            setSuccessMsg("Exam deleted successfully.");
            fetchExams();
        } catch (err) {
            setError(err.message || "Failed to delete exam.");
        }
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
                    <h1>Exam Management</h1>
                    <p>Create, update, and manage student coding examinations</p>
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
                    <h2>Exams List</h2>
                    <button className="primary-btn" style={{ width: "auto" }} onClick={openCreateModal}>
                        + Create Exam
                    </button>
                </div>

                {error && <div className="error-card" style={{ marginBottom: "20px" }}>{error}</div>}
                {successMsg && (
                    <div className="message-card" style={{ marginBottom: "20px", color: "#166534", backgroundColor: "#f0fdf4", borderColor: "#bbf7d0" }}>
                        {successMsg}
                    </div>
                )}

                {loading && <div className="message-card">Loading exams...</div>}

                {!loading && exams.length === 0 && (
                    <div className="message-card">
                        <h3>No exams found.</h3>
                        <p>Click "+ Create Exam" to add your first coding exam.</p>
                    </div>
                )}

                {!loading && exams.length > 0 && (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Duration</th>
                                    <th>Questions</th>
                                    <th>Students</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exams.map((exam) => (
                                    <tr key={exam._id}>
                                        <td>
                                            <strong>{exam.title}</strong>
                                            <p style={{ fontSize: "12px", color: "#64748b" }}>{exam.description}</p>
                                        </td>
                                        <td>{exam.duration} mins</td>
                                        <td>{exam.questions?.length || 0}</td>
                                        <td>{exam.students?.length || 0}</td>
                                        <td>{new Date(exam.startTime).toLocaleString()}</td>
                                        <td>{new Date(exam.endTime).toLocaleString()}</td>
                                        <td>
                                            <div style={{ display: "flex", gap: "6px" }}>
                                                <button
                                                    className="small-btn primary"
                                                    onClick={() => navigate(`/admin/exams/${exam._id}`)}
                                                >
                                                    Manage
                                                </button>
                                                <button
                                                    className="small-btn secondary"
                                                    onClick={() => openEditModal(exam)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="small-btn danger"
                                                    onClick={() => handleDelete(exam._id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* CREATE / EDIT MODAL */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{editingExamId ? "Edit Exam" : "Create New Exam"}</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Midterm Coding Assessment"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Brief exam instructions or guidelines"
                                    rows="3"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Duration (minutes)</label>
                                <input
                                    type="number"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    min="1"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Start Time</label>
                                <input
                                    type="datetime-local"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>End Time</label>
                                <input
                                    type="datetime-local"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "20px" }}>
                                <button type="button" className="secondary-btn" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="primary-btn" style={{ width: "auto" }}>
                                    {editingExamId ? "Update Exam" : "Create Exam"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminExams;
