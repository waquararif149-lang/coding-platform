import { body, param } from "express-validator";

export const createTestCaseValidator = [
    param("questionId")
        .isMongoId()
        .withMessage("Invalid question ID"),

    body("input")
        .trim()
        .notEmpty()
        .withMessage("Test case input is required"),

    body("expectedOutput")
        .trim()
        .notEmpty()
        .withMessage("Expected output is required"),

    body("isHidden")
        .isBoolean()
        .withMessage("isHidden must be a boolean")
];

export const updateTestCaseValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid test case ID"),

    body("input")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Input cannot be empty"),

    body("expectedOutput")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Expected output cannot be empty"),

    body("isHidden")
        .optional()
        .isBoolean()
        .withMessage("isHidden must be a boolean")
];

export const testCaseIdValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid test case ID")
];