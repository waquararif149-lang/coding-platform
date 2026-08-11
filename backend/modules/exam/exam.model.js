import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        questions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Question",
                required: true
            }
        ],

        assignedStudents: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        startTime: {
            type: Date,
            required: true
        },

        endTime: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Exam = mongoose.model("Exam", examSchema);

export default Exam;