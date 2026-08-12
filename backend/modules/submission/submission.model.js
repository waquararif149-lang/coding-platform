import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            required: true
        },

        language: {
            type: String,
            required: true,
            trim: true
        },

        code: {
            type: String,
            required: true
        },

        totalTests: {
            type: Number,
            required: true
        },

        passedTests: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: [
                "ACCEPTED",
                "WRONG_ANSWER",
                "RUNTIME_ERROR",
                "COMPILATION_ERROR"
            ],
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Submission = mongoose.model(
    "Submission",
    submissionSchema
);

export default Submission;