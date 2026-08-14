import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { getExamQuestions, getExamCompletionStatus, submitExam } from "../services/examService";
import { executeCode } from "../services/executionService";
import { submitCode } from "../services/submissionService";

function SolveExam() {
    const { examId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [exam, setExam] = useState(location.state?.exam || null);
    const [questions, setQuestions] = useState(location.state?.questions || []);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    const [language, setLanguage] = useState("python");
    const [code, setCode] = useState("");

    const [loading, setLoading] = useState(!location.state?.questions);
    const [running, setRunning] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submittingExam, setSubmittingExam] = useState(false);
    const [examCompleted, setExamCompleted] = useState(false);
    const [checkingCompletion, setCheckingCompletion] = useState(true);

    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    // Mapping language option to backend supported language
    const getBackendLanguage = (lang) => {
        if (lang === "c") return "cpp";
        return lang;
    };

    // Default code templates based on language
    const getDefaultCode = (lang, q) => {
        if (lang === "python") return `# Write your Python solution here\nimport sys\n\ndef main():\n    # Read input from stdin\n    pass\n\nif __name__ == "__main__":\n    main()\n`;
        if (lang === "javascript") return `// Write your JavaScript solution here\nconst fs = require('fs');\nconst input = fs.readFileSync('/dev/stdin', 'utf-8');\nconsole.log(input);\n`;
        if (lang === "java") return `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your code here\n    }\n}\n`;
        if (lang === "cpp" || lang === "c") return `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}\n`;
        return "";
    };

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await getExamQuestions(examId);
                const questionData = response.data || [];
                setQuestions(questionData);
                if (questionData.length > 0) {
                    setSelectedQuestion(questionData[0]);
                }
            } catch (err) {
                setError(err.message || "Unable to load exam questions");
            } finally {
                setLoading(false);
            }
        };

        if (questions.length === 0) {
            fetchQuestions();
        } else if (questions.length > 0) {
            setSelectedQuestion(questions[0]);
        }
    }, [examId]);

    // Check if exam is already completed
    useEffect(() => {
        const checkExamCompletion = async () => {
            try {
                const response = await getExamCompletionStatus(examId);
                setExamCompleted(response.data?.isCompleted || false);
            } catch (err) {
                console.error("Failed to check exam completion status:", err);
            } finally {
                setCheckingCompletion(false);
            }
        };

        if (examId) {
            checkExamCompletion();
        }
    }, [examId]);

    useEffect(() => {
        if (selectedQuestion) {
            setCode(getDefaultCode(language, selectedQuestion));
            setResult(null);
            setError("");
        }
    }, [selectedQuestion, language]);

    const handleRunCode = async () => {
        if (!selectedQuestion || !code.trim()) {
            setError("Please write some code before running.");
            return;
        }

        setRunning(true);
        setResult(null);
        setError("");

        try {
            const response = await executeCode({
                questionId: selectedQuestion._id,
                language: getBackendLanguage(language),
                code
            });

            setResult({
                type: "RUN",
                ...response.data
            });
        } catch (err) {
            setError(err.message || "Code execution failed.");
        } finally {
            setRunning(false);
        }
    };

    const handleSubmitCode = async () => {
        if (!selectedQuestion || !code.trim()) {
            setError("Please write some code before submitting.");
            return;
        }

        if (examCompleted) {
            setError("You have already submitted this exam. You cannot submit again.");
            return;
        }

        setSubmitting(true);
        setResult(null);
        setError("");

        try {
            const response = await submitCode({
                questionId: selectedQuestion._id,
                language: getBackendLanguage(language),
                code
            });

            setResult({
                type: "SUBMIT",
                ...response.data
            });
        } catch (err) {
            setError(err.message || "Code submission failed.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitExam = async () => {
        if (examCompleted) {
            setError("You have already submitted this exam.");
            return;
        }

        if (!window.confirm("Are you sure you want to submit the exam? You won't be able to take this exam again.")) {
            return;
        }

        setSubmittingExam(true);
        setError("");

        try {
            await submitExam(examId);
            setExamCompleted(true);
            setError("Exam submitted successfully! You will not be able to access this exam again.");
            // Optionally redirect after a delay
            setTimeout(() => {
                navigate("/student");
            }, 3000);
        } catch (err) {
            setError(err.message || "Failed to submit exam.");
        } finally {
            setSubmittingExam(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="solve-page">
                <div className="message-card">Loading questions...</div>
            </div>
        );
    }

    if (examCompleted) {
        return (
            <div className="solve-page" style={{ padding: "40px" }}>
                <div className="message-card" style={{ background: "#dcfce7", color: "#166534", border: "1px solid #86efac" }}>
                    <h2>✅ Exam Already Completed</h2>
                    <p>You have already submitted this exam. You cannot take this exam again.</p>
                    <p style={{ marginTop: "15px" }}>
                        <button className="secondary-btn" onClick={() => navigate("/student")}>
                            Back to Dashboard
                        </button>
                    </p>
                </div>
            </div>
        );
    }

    if (error && questions.length === 0) {
        return (
            <div className="solve-page" style={{ padding: "40px" }}>
                <div className="error-card">{error}</div>
                <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <button className="secondary-btn" onClick={() => navigate("/student")}>
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="solve-page">
            {/* HEADER */}
            <header className="solve-header">
                <div>
                    <h1>{exam?.title || "Coding Examination"}</h1>
                    <span>{questions.length} Question(s)</span>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button className="secondary-btn" onClick={() => navigate("/student")}>
                        Dashboard
                    </button>
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>

            {/* MAIN LAYOUT */}
            <main className="solve-layout">
                {/* LEFT SIDEBAR - QUESTIONS */}
                <aside className="question-sidebar">
                    <h2>Questions</h2>
                    {questions.map((q, index) => (
                        <button
                            key={q._id}
                            className={selectedQuestion?._id === q._id ? "question-item active" : "question-item"}
                            onClick={() => setSelectedQuestion(q)}
                        >
                            <span>{index + 1}</span>
                            <strong>{q.title}</strong>
                        </button>
                    ))}
                </aside>

                {/* MAIN CONTENT - CODING SECTION */}
                <section className="coding-section">
                    {selectedQuestion ? (
                        <>
                            <div className="question-description">
                                <h2>{selectedQuestion.title}</h2>
                                <p>{selectedQuestion.description}</p>

                                <div className="format-box">
                                    <strong>Input Format</strong>
                                    <p>{selectedQuestion.inputFormat}</p>
                                </div>

                                <div className="format-box">
                                    <strong>Output Format</strong>
                                    <p>{selectedQuestion.outputFormat}</p>
                                </div>

                                <div className="format-box">
                                    <strong>Constraints</strong>
                                    <p>{selectedQuestion.constraints}</p>
                                </div>
                            </div>

                            {/* EDITOR TOOLBAR */}
                            <div className="editor-toolbar">
                                <label style={{ color: "white", marginRight: "10px", fontSize: "14px", alignSelf: "center" }}>
                                    Language:
                                </label>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                >
                                    <option value="python">Python</option>
                                    <option value="javascript">JavaScript</option>
                                    <option value="java">Java</option>
                                    <option value="cpp">C++</option>
                                    <option value="c">C</option>
                                </select>
                            </div>

                            {/* MONACO EDITOR */}
                            <Editor
                                height="450px"
                                language={language === "cpp" || language === "c" ? "cpp" : language}
                                value={code}
                                onChange={(val) => setCode(val || "")}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true
                                }}
                            />

                            {/* ACTIONS */}
                            <div className="code-actions">
                                <button
                                    className="secondary-btn"
                                    onClick={handleRunCode}
                                    disabled={running || submitting || submittingExam}
                                >
                                    {running ? "Running..." : "Run Code"}
                                </button>

                                <button
                                    className="primary-btn"
                                    onClick={handleSubmitCode}
                                    disabled={running || submitting || submittingExam}
                                >
                                    {submitting ? "Submitting..." : "Submit Question"}
                                </button>

                                <button
                                    className="primary-btn"
                                    onClick={handleSubmitExam}
                                    disabled={running || submitting || submittingExam}
                                    style={{ background: "#059669" }}
                                >
                                    {submittingExam ? "Submitting..." : "Submit Exam"}
                                </button>
                            </div>

                            {/* RESULTS & ERRORS */}
                            {error && (
                                <div 
                                    className="error-card" 
                                    style={{ 
                                        marginTop: "15px",
                                        background: error.includes("successfully") ? "#dcfce7" : "#fee2e2",
                                        color: error.includes("successfully") ? "#166534" : "#991b1b",
                                        border: error.includes("successfully") ? "1px solid #86efac" : "1px solid #fca5a5"
                                    }}
                                >
                                    {error}
                                </div>
                            )}

                            {result && (
                                <div className="result-card" style={{ marginTop: "15px" }}>
                                    <h3>{result.type === "SUBMIT" ? "Submission Result" : "Execution Result"}</h3>
                                    <p><strong>Status:</strong> <span className={`status ${result.status?.toLowerCase()}`}>{result.status}</span></p>
                                    <p><strong>Total Tests:</strong> {result.totalTests}</p>
                                    <p><strong>Passed Tests:</strong> {result.passedTests}</p>

                                    {result.results && result.results.length > 0 && (
                                        <div style={{ marginTop: "15px" }}>
                                            <h4>Test Cases Output</h4>
                                            {result.results.map((tc, idx) => (
                                                <div key={idx} style={{ background: "#f8fafc", padding: "8px 12px", borderRadius: "6px", marginTop: "8px", border: "1px solid #e2e8f0" }}>
                                                    <p><strong>Test Case #{idx + 1}:</strong> {tc.passed ? "✅ Passed" : "❌ Failed"} ({tc.status})</p>
                                                    {!tc.isHidden && tc.actualOutput !== undefined && (
                                                        <p style={{ fontFamily: "monospace", fontSize: "13px", marginTop: "4px" }}>
                                                            Actual Output: {tc.actualOutput || "(empty)"}
                                                        </p>
                                                    )}
                                                    {tc.isHidden && (
                                                        <p style={{ fontSize: "12px", color: "#64748b" }}>[Hidden Test Case]</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="message-card">No question selected.</div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default SolveExam;