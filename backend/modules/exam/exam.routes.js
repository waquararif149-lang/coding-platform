import express from "express";

import examContorler from "./exam.contorler.js";

import authenticate from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/role.middleware.js";
import validate from "../../middlewares/validate.middleware.js";

import {
    createExamValidator,
    updateExamValidator,
    examIdValidator,
    assignStudentValidator,
    assignQuestionValidator
} from "./exam.validator.js";

const examRouter = express.Router();


// ==================== STUDENT ====================

// Get exams assigned to logged-in student
examRouter.get(
    "/my",
    authenticate,
    authorize("STUDENT"),
    examContorler.getStudentExams.bind(examContorler)
);

examRouter.get(
    "/:id/result",
    authenticate,
    authorize("STUDENT"),
    examContorler.getStudentExamResult.bind(
        examContorler
    )
);

examRouter.get(
    "/:examId/questions",
    authenticate,
    authorize("STUDENT"),
    examContorler.getExamQuestions.bind(examContorler)
);


// ==================== ADMIN ====================

// Create exam
examRouter.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    createExamValidator,
    validate,
    examContorler.createExam.bind(examContorler)
);

// Get all exams
examRouter.get(
    "/",
    authenticate,
    authorize("ADMIN"),
    examContorler.getAllExams.bind(examContorler)
);

// Get exam by ID
examRouter.get(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    examIdValidator,
    validate,
    examContorler.getExamById.bind(examContorler)
);

// Update exam
examRouter.patch(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    updateExamValidator,
    validate,
    examContorler.updateExam.bind(examContorler)
);

// Delete exam
examRouter.delete(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    examIdValidator,
    validate,
    examContorler.deleteExam.bind(examContorler)
);

// Assign student
examRouter.post(
    "/:examId/students",
    authenticate,
    authorize("ADMIN"),
    assignStudentValidator,
    validate,
    examContorler.addStudent.bind(examContorler)
);

// Assign question
examRouter.post(
    "/:examId/questions",
    authenticate,
    authorize("ADMIN"),
    assignQuestionValidator,
    validate,
    examContorler.addQuestion.bind(examContorler)
);


export default examRouter;