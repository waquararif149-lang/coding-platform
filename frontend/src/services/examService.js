import api from "./api";

// Student Endpoints
export const getStudentExams = async () => {
    const response = await api.get("/exams/my");
    return response.data;
};

export const getExamQuestions = async (examId) => {
    const response = await api.get(`/exams/${examId}/questions`);
    return response.data;
};

export const getStudentExamResult = async (examId) => {
    const response = await api.get(`/exams/${examId}/result`);
    return response.data;
};

export const getExamCompletionStatus = async (examId) => {
    const response = await api.get(`/exams/${examId}/status`);
    return response.data;
};

export const submitExam = async (examId) => {
    const response = await api.post(`/exams/${examId}/submit`);
    return response.data;
};

// Admin Endpoints
export const getAllExams = async () => {
    const response = await api.get("/exams");
    return response.data;
};

export const getExamById = async (id) => {
    const response = await api.get(`/exams/${id}`);
    return response.data;
};

export const createExam = async (examData) => {
    const response = await api.post("/exams", examData);
    return response.data;
};

export const updateExam = async (id, examData) => {
    const response = await api.patch(`/exams/${id}`, examData);
    return response.data;
};

export const deleteExam = async (id) => {
    const response = await api.delete(`/exams/${id}`);
    return response.data;
};

export const assignStudentToExam = async (examId, studentId) => {
    const response = await api.post(`/exams/${examId}/students`, { studentId });
    return response.data;
};

export const assignQuestionToExam = async (examId, questionId) => {
    const response = await api.post(`/exams/${examId}/questions`, { questionId });
    return response.data;
};
