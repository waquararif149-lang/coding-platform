import Submission from "./submission.model.js";

class SubmissionRepository {

    async createSubmission(data) {
        return await Submission.create(data);
    }

    async findSubmissionsByUserId(userId) {
        return await Submission.find({ userId })
            .populate("questionId", "title")
            .sort({ createdAt: -1 });
    }

    async findSubmissionById(submissionId) {
        return await Submission.findById(submissionId)
            .populate("questionId", "title")
    }

    async findAllSubmissions() {
        return await Submission.find()
            .populate("userId", "name email")
            .populate("questionId", "title")
            .sort({ createdAt: -1 });
    }

    async findSubmissionsByUserAndQuestions(userId, questionIds) {

        return await Submission.find({
            userId,
            questionId: { $in: questionIds }
        })
            .sort({ createdAt: -1 });
    }
}

export default new SubmissionRepository();