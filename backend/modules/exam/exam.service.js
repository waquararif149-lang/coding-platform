import examRepository from "./exam.repository.js";
import User from "../user/user.model.js";
import Question from "../coding/coding.model.js";
import submissionRepository from "../submission/submission.repository.js";
class ExamService {

    async createExam(examData) {

        const {
            startTime,
            endTime
        } = examData;

        if (new Date(startTime) >= new Date(endTime)) {
            const error = new Error(
                "Start time must be before end time"
            );

            error.statusCode = 400;
            throw error;
        }

        return await examRepository.createExam(examData);
    }

    async getExamById(examId) {

        const exam = await examRepository.findExamById(examId);

        if (!exam) {
            const error = new Error("Exam not found");

            error.statusCode = 404;
            throw error;
        }

        return exam;
    }

    async getAllExams() {
        return await examRepository.findAllExams();
    }

    async updateExam(examId, examData) {

        const exam = await examRepository.findExamById(examId);

        if (!exam) {
            const error = new Error("Exam not found");

            error.statusCode = 404;
            throw error;
        }

        if (examData.startTime && examData.endTime) {

            if (
                new Date(examData.startTime) >=
                new Date(examData.endTime)
            ) {
                const error = new Error(
                    "Start time must be before end time"
                );

                error.statusCode = 400;
                throw error;
            }
        }

        return await examRepository.updateExam(
            examId,
            examData
        );
    }

    async deleteExam(examId) {

        const exam = await examRepository.findExamById(examId);

        if (!exam) {
            const error = new Error("Exam not found");

            error.statusCode = 404;
            throw error;
        }

        return await examRepository.deleteExam(examId);
    }

    async addStudent(examId, studentId) {

        const exam = await examRepository.findExamById(examId);

        if (!exam) {
            const error = new Error("Exam not found");

            error.statusCode = 404;
            throw error;
        }

        const student = await User.findById(studentId);

        if (!student) {
            const error = new Error("Student not found");

            error.statusCode = 404;
            throw error;
        }

        if (student.role !== "STUDENT") {
            const error = new Error(
                "Only students can be assigned to an exam"
            );

            error.statusCode = 400;
            throw error;
        }

        return await examRepository.addStudent(
            examId,
            studentId
        );
    }

    async addQuestion(examId, questionId) {

        const exam = await examRepository.findExamById(examId);

        if (!exam) {
            const error = new Error("Exam not found");

            error.statusCode = 404;
            throw error;
        }

        const question = await Question.findById(questionId);

        if (!question) {
            const error = new Error("Question not found");

            error.statusCode = 404;
            throw error;
        }

        return await examRepository.addQuestion(
            examId,
            questionId
        );
    }

    async getStudentExams(studentId) {
        return await examRepository.findExamsByStudent(
            studentId
        );
    }

    async getExamQuestions(examId, studentId) {

        const exam = await examRepository.findExamQuestions(examId);

        if (!exam) {
            const error = new Error("Exam not found");
            error.statusCode = 404;
            throw error;
        }

        await this.validateExamAccess(exam, studentId);

        return exam.questions;
    }

    async validateStudentQuestionAccess(studentId, questionId) {

        const exam =
            await examRepository.findExamForStudentAndQuestion(
                studentId,
                questionId
            );

        if (!exam) {
            const error = new Error(
                "You are not assigned to this question"
            );

            error.statusCode = 403;
            throw error;
        }

        await this.validateExamAccess(exam, studentId);

        return exam;
    }

    async validateExamAccess(exam, studentId) {

        const isStudentAssigned = exam.students.some(
            id => id.toString() === studentId.toString()
        );

        if (!isStudentAssigned) {
            const error = new Error(
                "You are not assigned to this exam"
            );

            error.statusCode = 403;
            throw error;
        }

        const currentTime = new Date();

        if (currentTime < exam.startTime) {
            const error = new Error(
                "Exam has not started yet"
            );

            error.statusCode = 403;
            throw error;
        }

        if (currentTime > exam.endTime) {
            const error = new Error(
                "Exam has already ended"
            );

            error.statusCode = 403;
            throw error;
        }

        return exam;
    }

    async getStudentExamResult(examId, studentId) {

        const exam =
            await examRepository.findExamQuestions(examId);

        if (!exam) {
            const error = new Error("Exam not found");
            error.statusCode = 404;
            throw error;
        }

        // Check student assignment
        const isStudentAssigned = exam.students.some(
            id => id.toString() === studentId.toString()
        );

        if (!isStudentAssigned) {
            const error = new Error(
                "You are not assigned to this exam"
            );

            error.statusCode = 403;
            throw error;
        }

        const questionIds = exam.questions.map(
            question => question._id
        );

        const submissions =
            await submissionRepository
                .findSubmissionsByUserAndQuestions(
                    studentId,
                    questionIds
                );

        // Keep only the latest submission
        // for each question
        const latestSubmissions = new Map();

        for (const submission of submissions) {

            const questionId =
                submission.questionId._id
                    ? submission.questionId._id.toString()
                    : submission.questionId.toString();

            if (!latestSubmissions.has(questionId)) {
                latestSubmissions.set(
                    questionId,
                    submission
                );
            }
        }

        const totalQuestions =
            exam.questions.length;

        const attemptedQuestions =
            latestSubmissions.size;

        const acceptedQuestions =
            [...latestSubmissions.values()]
                .filter(
                    submission =>
                        submission.status === "ACCEPTED"
                )
                .length;

        return {
            examId: exam._id,

            totalQuestions,

            attemptedQuestions,

            acceptedQuestions,

            score: acceptedQuestions,

            percentage:
                totalQuestions === 0
                    ? 0
                    : Number(
                        (
                            acceptedQuestions /
                            totalQuestions
                        ) * 100
                    ).toFixed(2)
        };
    }

    async isExamCompleted(examId, studentId) {

        const exam = 
            await examRepository.findExamById(examId);

        if (!exam) {
            const error = new Error("Exam not found");
            error.statusCode = 404;
            throw error;
        }

        const isCompleted = exam.completedBy.some(
            item => item.userId.toString() === studentId.toString()
        );

        return isCompleted;
    }

    async submitExam(examId, studentId) {
        const exam = 
            await examRepository.findExamById(examId);

        if (!exam) {
            const error = new Error("Exam not found");
            error.statusCode = 404;
            throw error;
        }

        const isCompleted = exam.completedBy.some(
            item => item.userId.toString() === studentId.toString()
        );

        if (isCompleted) {
            const error = new Error(
                "You have already submitted this exam. You cannot submit again."
            );
            error.statusCode = 400;
            throw error;
        }

        const isStudentAssigned = exam.students.some(
            id => id.toString() === studentId.toString()
        );

        if (!isStudentAssigned) {
            const error = new Error(
                "You are not assigned to this exam"
            );
            error.statusCode = 403;
            throw error;
        }

        exam.completedBy.push({
            userId: studentId,
            completedAt: new Date()
        });

        return await examRepository.updateExam(
            examId,
            {
                completedBy: exam.completedBy
            }
        );
    }
}

export default new ExamService();