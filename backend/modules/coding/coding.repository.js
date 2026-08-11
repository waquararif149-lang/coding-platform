import Question from "./coding.model.js";

class CodingRepository {

    async createQuestion(questionData) {
        return await Question.create(questionData);
    }

    async findQuestionById(questionId) {
        return await Question.findById(questionId);
    }

    async findAllQuestions() {
        return await Question.find();
    }

    async updateQuestion(questionId, questionData) {
        return await Question.findByIdAndUpdate(
            questionId,
            questionData,
            {
                new: true,
                runValidators: true
            }
        );
    }

    async deleteQuestion(questionId) {
        return await Question.findByIdAndDelete(questionId);
    }
}

export default new CodingRepository();