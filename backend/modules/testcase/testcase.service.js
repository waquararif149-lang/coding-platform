import testcaseRepository from "./testcase.repository.js";
import Question from "../coding/coding.model.js";

class TestCaseService {

    async createTestCase(questionId, testCaseData) {

        const question = await Question.findById(questionId);

        if (!question) {
            const error = new Error("Question not found");
            error.statusCode = 404;
            throw error;
        }

        return await testcaseRepository.createTestCase({
            ...testCaseData,
            questionId
        });
    }

    async getTestCasesByQuestion(questionId) {
        return await testcaseRepository.findTestCasesByQuestionId(
            questionId
        );
    }

    async getTestCaseById(testCaseId) {
        return await testcaseRepository.findTestCaseById(
            testCaseId
        );
    }

    async updateTestCase(testCaseId, testCaseData) {
        return await testcaseRepository.updateTestCase(
            testCaseId,
            testCaseData
        );
    }

    async deleteTestCase(testCaseId) {
        return await testcaseRepository.deleteTestCase(
            testCaseId
        );
    }
}

export default new TestCaseService();