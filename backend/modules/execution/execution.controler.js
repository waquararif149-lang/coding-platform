import executionService from "./execution.service.js";
import examService from "../exam/exam.service.js";

class ExecutionController {

    async executeCode(req, res, next) {

        try {

            const {
                questionId,
                language,
                code
            } = req.body;

            await examService.validateStudentQuestionAccess(
                req.user.userId,
                questionId
            );

            const result =
                await executionService.executeQuestion({
                    questionId,
                    language,
                    code
                });

            return res.status(200).json({
                success: true,
                data: result
            });

        } catch (error) {

            next(error);
        }
    }
}

export default new ExecutionController();