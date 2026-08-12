import Exam from "./exam.model.js";

class ExamRepository {

    async createExam(examData) {
        return await Exam.create(examData);
    }

    async findExamById(examId) {
        return await Exam.findById(examId);
    }

    async findAllExams() {
        return await Exam.find();
    }

    async updateExam(examId, examData) {
        return await Exam.findByIdAndUpdate(
            examId,
            examData,
            {
                new: true,
                runValidators: true
            }
        );
    }

    async deleteExam(examId) {
        return await Exam.findByIdAndDelete(examId);
    }

    async addStudent(examId, studentId) {
        return await Exam.findByIdAndUpdate(
            examId,
            {
                $addToSet: {
                    students: studentId
                }
            },
            {
                new: true
            }
        );
    }

    async addQuestion(examId, questionId) {
        return await Exam.findByIdAndUpdate(
            examId,
            {
                $addToSet: {
                    questions: questionId
                }
            },
            {
                new: true
            }
        );
    }

    async findExamsByStudent(studentId) {
        return await Exam.find(
            { students: studentId },
            {
                title: 1,
                description: 1,
                duration: 1,
                startTime: 1,
                endTime: 1
            }
        );
    }

    async findExamQuestions(examId) {
        return await Exam.findById(examId)
            .populate("questions");
    }
}

export default new ExamRepository();