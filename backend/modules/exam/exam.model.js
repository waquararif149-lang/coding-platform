import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
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

        duration: {
            type: Number,
            required: true,
            min: 1
        },

        startTime: {
            type: Date,
            required: true
        },

        endTime: {
            type: Date,
            required: true
        },

        students: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        questions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Question"
            }
        ]
    },
    {
        timestamps: true
    }
);

const Exam = mongoose.model("Exam", examSchema);

export default Exam;