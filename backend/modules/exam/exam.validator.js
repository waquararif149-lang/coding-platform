import { body, param } from "express-validator";

export const createExamValidator = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Exam title is required"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Exam description is required"),

    body("duration")
        .isInt({ min: 1 })
        .withMessage("Duration must be at least 1 minute"),

    body("startTime")
        .isISO8601()
        .withMessage("Invalid start time"),

    body("endTime")
        .isISO8601()
        .withMessage("Invalid end time")
];

export const updateExamValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid exam ID"),

    body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty"),

    body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Description cannot be empty"),

    body("duration")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Duration must be at least 1 minute"),

    body("startTime")
        .optional()
        .isISO8601()
        .withMessage("Invalid start time"),

    body("endTime")
        .optional()
        .isISO8601()
        .withMessage("Invalid end time")
];

export const examIdValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid exam ID")
];

export const assignStudentValidator = [
    param("examId")
        .isMongoId()
        .withMessage("Invalid exam ID"),

    body("studentId")
        .isMongoId()
        .withMessage("Invalid student ID")
];

export const assignQuestionValidator = [
    param("examId")
        .isMongoId()
        .withMessage("Invalid exam ID"),

    body("questionId")
        .isMongoId()
        .withMessage("Invalid question ID")
];