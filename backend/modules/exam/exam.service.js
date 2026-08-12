import examRepository from "./exam.repository.js";
import User from "../user/user.model.js";
import Question from "../coding/coding.model.js";
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

        // Check student assignment
        const isStudentAssigned = exam.students.some(
            (id) => id.toString() === studentId.toString()
        );

        if (!isStudentAssigned) {
            const error = new Error(
                "You are not assigned to this exam"
            );

            error.statusCode = 403;
            throw error;
        }

        const currentTime = new Date();

        // Exam hasn't started
        if (currentTime < exam.startTime) {
            const error = new Error(
                "Exam has not started yet"
            );

            error.statusCode = 403;
            throw error;
        }

        // Exam has ended
        if (currentTime > exam.endTime) {
            const error = new Error(
                "Exam has already ended"
            );

            error.statusCode = 403;
            throw error;
        }

        return exam.questions;
    }
}

export default new ExamService();