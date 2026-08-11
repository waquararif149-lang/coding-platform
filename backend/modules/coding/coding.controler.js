import codingService from "./coding.service.js";

class CodingController {

    async createQuestion(req, res, next) {
        try {

            const question = await codingService.createQuestion(
                req.body
            );

            return res.status(201).json({
                success: true,
                data: question
            });

        } catch (error) {
            next(error);
        }
    }

    async getQuestion(req, res, next) {
        try {

            const question = await codingService.getQuestion(
                req.params.id
            );

            return res.status(200).json({
                success: true,
                data: question
            });

        } catch (error) {
            next(error);
        }
    }

    async getAllQuestions(req, res, next) {
        try {

            const questions = await codingService.getAllQuestions();

            return res.status(200).json({
                success: true,
                data: questions
            });

        } catch (error) {
            next(error);
        }
    }

    async updateQuestion(req, res, next) {
        try {

            const question = await codingService.updateQuestion(
                req.params.id,
                req.body
            );

            return res.status(200).json({
                success: true,
                data: question
            });

        } catch (error) {
            next(error);
        }
    }

    async deleteQuestion(req, res, next) {
        try {

            const question = await codingService.deleteQuestion(
                req.params.id
            );

            return res.status(200).json({
                success: true,
                data: question
            });

        } catch (error) {
            next(error);
        }
    }
}

export default new CodingController();