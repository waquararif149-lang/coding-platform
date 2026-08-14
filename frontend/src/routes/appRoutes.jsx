import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "../pages/login";
import StudentDashboard from "../pages/studentDashBoard";
import Exam from "../pages/exam";
import SolveExam from "../pages/solveExam";
import AdminDashboard from "../pages/adminDashBoard";
import AdminExams from "../pages/adminExams";
import AdminExamDetails from "../pages/adminExamDetails";
import AdminSubmissions from "../pages/adminSubmissions";
import ProtectedRoute from "../components/protectedRoute";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Route */}
                <Route path="/login" element={<Login />} />

                {/* Student Protected Routes */}
                <Route
                    path="/student"
                    element={
                        <ProtectedRoute
                            element={<StudentDashboard />}
                            requiredRole="STUDENT"
                        />
                    }
                />
                <Route
                    path="/student/exam/:examId"
                    element={
                        <ProtectedRoute
                            element={<Exam />}
                            requiredRole="STUDENT"
                        />
                    }
                />
                <Route
                    path="/student/exam/:examId/solve"
                    element={
                        <ProtectedRoute
                            element={<SolveExam />}
                            requiredRole="STUDENT"
                        />
                    }
                />

                {/* Admin Protected Routes */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute
                            element={<AdminDashboard />}
                            requiredRole="ADMIN"
                        />
                    }
                />
                <Route
                    path="/admin/exams"
                    element={
                        <ProtectedRoute
                            element={<AdminExams />}
                            requiredRole="ADMIN"
                        />
                    }
                />
                <Route
                    path="/admin/exams/:examId"
                    element={
                        <ProtectedRoute
                            element={<AdminExamDetails />}
                            requiredRole="ADMIN"
                        />
                    }
                />
                <Route
                    path="/admin/submissions"
                    element={
                        <ProtectedRoute
                            element={<AdminSubmissions />}
                            requiredRole="ADMIN"
                        />
                    }
                />

                {/* Fallback / Root Redirect */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;