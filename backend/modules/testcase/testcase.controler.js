import testcaseService from "./testcase.service.js";

class TestCaseController {

    async createTestCase(req, res, next) {
        try {

            const testCase = await testcaseService.createTestCase(
                req.params.questionId,
                req.body
            );

            return res.status(201).json({
                success: true,
                data: testCase
            });

        } catch (error) {
            next(error);
        }
    }

    async getTestCasesByQuestion(req, res, next) {
        try {

            const testCases =
                await testcaseService.getTestCasesByQuestion(
                    req.params.questionId
                );

            return res.status(200).json({
                success: true,
                data: testCases
            });

        } catch (error) {
            next(error);
        }
    }

    async getTestCaseById(req, res, next) {
        try {

            const testCase =
                await testcaseService.getTestCaseById(
                    req.params.id
                );

            return res.status(200).json({
                success: true,
                data: testCase
            });

        } catch (error) {
            next(error);
        }
    }

    async updateTestCase(req, res, next) {
        try {

            const testCase =
                await testcaseService.updateTestCase(
                    req.params.id,
                    req.body
                );

            return res.status(200).json({
                success: true,
                data: testCase
            });

        } catch (error) {
            next(error);
        }
    }

    async deleteTestCase(req, res, next) {
        try {

            const testCase =
                await testcaseService.deleteTestCase(
                    req.params.id
                );

            return res.status(200).json({
                success: true,
                data: testCase
            });

        } catch (error) {
            next(error);
        }
    }
}

export default new TestCaseController();