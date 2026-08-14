import api from "./api";

export const executeCode = async ({ questionId, language, code }) => {
    const response = await api.post("/execution/run", {
        questionId,
        language,
        code
    });
    return response.data;
};
