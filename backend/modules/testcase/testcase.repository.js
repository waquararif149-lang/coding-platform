import TestCase from "./testcase.model.js";

class TestCaseRepository {

    async createTestCase(testCaseData) {
        return await TestCase.create(testCaseData);
    }

    async findTestCasesByQuestionId(questionId) {
        return await TestCase.find({ questionId });
    }

    async findTestCaseById(testCaseId) {
        return await TestCase.findById(testCaseId);
    }

    async updateTestCase(testCaseId, testCaseData) {
        return await TestCase.findByIdAndUpdate(
            testCaseId,
            testCaseData,
            {
                new: true,
                runValidators: true
            }
        );
    }

    async deleteTestCase(testCaseId) {
        return await TestCase.findByIdAndDelete(testCaseId);
    }
}

export default new TestCaseRepository();