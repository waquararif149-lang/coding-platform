import codingRepository from "./coding.repository.js";

class CodingService {

    async createQuestion(questionData) {
        return await codingRepository.createQuestion(questionData);
    }

    async getQuestion(questionId) {
        return await codingRepository.findQuestionById(questionId);
    }

    async getAllQuestions() {
        return await codingRepository.findAllQuestions();
    }

    async updateQuestion(questionId, questionData) {
        return await codingRepository.updateQuestion(
            questionId,
            questionData
        );
    }

    async deleteQuestion(questionId) {
        return await codingRepository.deleteQuestion(questionId);
    }
}

export default new CodingService();