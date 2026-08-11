import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema(
    {
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            required: true
        },

        input: {
            type: String,
            required: true
        },

        expectedOutput: {
            type: String,
            required: true
        },

        isHidden:{
            type:Boolean,
            required:true
        }
    },
    {
        timestamps: true
    }
);

const TestCase = mongoose.model("TestCase", testCaseSchema);

export default TestCase;