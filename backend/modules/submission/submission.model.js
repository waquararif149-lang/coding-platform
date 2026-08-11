import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        examId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exam",
            required: true
        },

        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            required: true
        },

        language: {
            type: String,
            enum: ["JAVASCRIPT", "PYTHON", "JAVA"],
            required: true
        },

        sourceCode: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "RUNNING",
                "ACCEPTED",
                "WRONG_ANSWER",
                "COMPILATION_ERROR",
                "RUNTIME_ERROR",
                "TIME_LIMIT_EXCEEDED",
                "MEMORY_LIMIT_EXCEEDED",
                "FAILED"
            ],
            default: "PENDING"
        },

        executionResult: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        },

        passedTests: {
            type: Number,
            default: 0
        },

        totalTests: {
            type: Number,
            default: 0
        },

        score: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;