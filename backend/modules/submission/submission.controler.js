import submissionService from "./submission.service.js";

class SubmissionController {

    async submitCode(req, res, next) {

        try {

            const {
                questionId,
                language,
                code
            } = req.body;

            const result =
                await submissionService.submitCode({
                    userId: req.userId,
                    questionId,
                    language,
                    code
                });

            return res.status(201).json({
                success: true,
                data: result
            });

        } catch (error) {
            next(error);
        }
    }

    async getMySubmissions(req, res, next) {

        try {

            const submissions =
                await submissionService.getMySubmissions(
                    req.user.userId
                );

            return res.status(200).json({
                success: true,
                data: submissions
            });

        } catch (error) {
            next(error);
        }
    }


    async getSubmissionById(req, res, next) {

        try {

            const submission =
                await submissionService.getSubmissionById(
                    req.params.id,
                    req.user.userId
                );

            return res.status(200).json({
                success: true,
                data: submission
            });

        } catch (error) {
            next(error);
        }
    }

    async getAllSubmissions(req, res, next) {

        try {

            const submissions =
                await submissionService.getAllSubmissions();

            return res.status(200).json({
                success: true,
                data: submissions
            });

        } catch (error) {
            next(error);
        }
    }
}

export default new SubmissionController();