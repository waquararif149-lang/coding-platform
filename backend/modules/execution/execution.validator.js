import { body } from "express-validator";

const allowedLanguages = [
    "java",
    "python",
    "javascript",
    "cpp"
];

export const executeCodeValidator = [
    body("questionId")
        .trim()
        .notEmpty()
        .withMessage("Question ID is required")
        .isMongoId()
        .withMessage("Invalid question ID"),

    body("language")
        .trim()
        .notEmpty()
        .withMessage("Language is required")
        .isIn(allowedLanguages)
        .withMessage("Unsupported language"),

    body("code")
        .trim()
        .notEmpty()
        .withMessage("Code is required")
        .isLength({ max: 50000 })
        .withMessage("Code is too large")
];