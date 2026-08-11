import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        inputFormat: {
            type: String,
            required: true,
            trim: true
        },

        outputFormat: {
            type: String,
            required: true,
            trim: true
        },

        constraints: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;