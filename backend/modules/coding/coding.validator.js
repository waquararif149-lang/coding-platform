import { body, param } from "express-validator";

export const createQuestionValidator = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 200 })
        .withMessage("Title must not exceed 200 characters"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required"),

    body("inputFormat")
        .trim()
        .notEmpty()
        .withMessage("Input format is required"),

    body("outputFormat")
        .trim()
        .notEmpty()
        .withMessage("Output format is required"),

    body("constraints")
        .trim()
        .notEmpty()
        .withMessage("Constraints are required")
];

export const updateQuestionValidator = [
    body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty")
        .isLength({ max: 200 })
        .withMessage("Title must not exceed 200 characters"),

    body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Description cannot be empty"),

    body("inputFormat")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Input format cannot be empty"),

    body("outputFormat")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Output format cannot be empty"),

    body("constraints")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Constraints cannot be empty")
];

export const questionIdValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid question ID")
];