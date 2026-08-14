import api from "./api";

export const submitCode = async ({ questionId, language, code }) => {
    const response = await api.post("/submissions", {
        questionId,
        language,
        code
    });
    return response.data;
};

export const getMySubmissions = async () => {
    const response = await api.get("/submissions/my");
    return response.data;
};

export const getAllSubmissions = async () => {
    const response = await api.get("/submissions");
    return response.data;
};

export const getSubmissionById = async (id) => {
    const response = await api.get(`/submissions/${id}`);
    return response.data;
};
