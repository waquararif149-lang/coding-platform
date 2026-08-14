import submissionRepository from "./submission.repository.js";

import executionService from "../execution/execution.service.js";
import examService from "../exam/exam.service.js";
import examRepository from "../exam/exam.repository.js";


class SubmissionService {

    async submitCode({

        userId,

        questionId,

        language,

        code

    }) {

        // Get the exam that contains this question
        const exam = await examRepository.findExamForStudentAndQuestion(
            userId,
            questionId
        );

        if (exam) {
            // Check if exam is already completed
            const isCompleted = exam.completedBy.some(
                item => item.userId.toString() === userId.toString()
            );

            if (isCompleted) {
                const error = new Error(
                    "You have already submitted this exam. You cannot submit again."
                );
                error.statusCode = 400;
                throw error;
            }
        }

        await examService.validateStudentQuestionAccess(
            userId,
            questionId
        );

        const executionResult =
            await executionService.executeQuestion({

                questionId,

                language,

                code
            });

        const submission =
            await submissionRepository.createSubmission({

                userId,

                questionId,

                language,

                code,

                totalTests:
                    executionResult.totalTests,

                passedTests:
                    executionResult.passedTests,

                status:
                    executionResult.status
            });

        return {

            submissionId:
                submission._id,

            totalTests:
                executionResult.totalTests,

            passedTests:
                executionResult.passedTests,

            status:
                executionResult.status
        };
    }

    async getMySubmissions(userId) {

        return await submissionRepository
            .findSubmissionsByUserId(userId);
    }


    async getSubmissionById(submissionId, userId) {

        const submission =
            await submissionRepository
                .findSubmissionById(submissionId);

        if (!submission) {
            const error = new Error("Submission not found");
            error.statusCode = 404;
            throw error;
        }

        // Student can only see their own submission
        if (
            submission.userId.toString() !==
            userId.toString()
        ) {
            const error = new Error(
                "You are not allowed to view this submission"
            );

            error.statusCode = 403;
            throw error;
        }

        return submission;
    }

    async getAllSubmissions() {

        return await submissionRepository
            .findAllSubmissions();
    }
}


export default new SubmissionService();