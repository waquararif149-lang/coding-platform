import examService from "./exam.service.js";

class ExamController {

    async createExam(req, res, next) {
        try {
            const exam = await examService.createExam(req.body);

            return res.status(201).json({
                success: true,
                data: exam
            });
        } catch (error) {
            next(error);
        }
    }

    async getExamById(req, res, next) {
        try {
            const exam = await examService.getExamById(
                req.params.id
            );

            return res.status(200).json({
                success: true,
                data: exam
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllExams(req, res, next) {
        try {
            const exams = await examService.getAllExams();

            return res.status(200).json({
                success: true,
                data: exams
            });
        } catch (error) {
            next(error);
        }
    }

    async updateExam(req, res, next) {
        try {
            const exam = await examService.updateExam(
                req.params.id,
                req.body
            );

            return res.status(200).json({
                success: true,
                data: exam
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteExam(req, res, next) {
        try {
            const exam = await examService.deleteExam(
                req.params.id
            );

            return res.status(200).json({
                success: true,
                data: exam
            });
        } catch (error) {
            next(error);
        }
    }

    async addStudent(req, res, next) {
        try {
            const exam = await examService.addStudent(
                req.params.examId,
                req.body.studentId
            );

            return res.status(200).json({
                success: true,
                data: exam
            });
        } catch (error) {
            next(error);
        }
    }

    async addQuestion(req, res, next) {
        try {
            const exam = await examService.addQuestion(
                req.params.examId,
                req.body.questionId
            );

            return res.status(200).json({
                success: true,
                data: exam
            });
        } catch (error) {
            next(error);
        }
    }

    async getStudentExams(req, res, next) {
        try {
            const exams = await examService.getStudentExams(
                req.userId
            );

            return res.status(200).json({
                success: true,
                data: exams
            });
        } catch (error) {
            next(error);
        }
    }

    async getExamQuestions(req, res, next) {
        try {
            const questions = await examService.getExamQuestions(
                req.params.examId,
                req.userId
            );

            return res.status(200).json({
                success: true,
                data: questions
            });
        } catch (error) {
            next(error);
        }
    }

    async getStudentExamResult(req, res, next) {

    try {

        const result =
            await examService.getStudentExamResult(
                req.params.id,
                req.user.userId
            );

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        next(error);
    }
    }

    async getExamCompletionStatus(req, res, next) {
        try {
            const isCompleted = 
                await examService.isExamCompleted(
                    req.params.examId,
                    req.userId
                );

            return res.status(200).json({
                success: true,
                data: {
                    isCompleted
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async submitExam(req, res, next) {
        try {
            const exam = await examService.submitExam(
                req.params.examId,
                req.userId
            );

            return res.status(200).json({
                success: true,
                message: "Exam submitted successfully",
                data: exam
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new ExamController();