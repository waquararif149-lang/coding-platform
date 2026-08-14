import express from "express";

import submissionControler from "./submission.controler.js";
import authenticate from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/role.middleware.js";
import validate from "../../middlewares/validate.middleware.js";

import {
    submitCodeValidator
} from "./submission.validator.js";


const submissionRouter = express.Router();

// Student routes

// Get my submissions
submissionRouter.get(
    "/my",
    authenticate,
    authorize("STUDENT"),
    submissionControler.getMySubmissions.bind(
        submissionControler
    )
);


// Submit code
submissionRouter.post(
    "/",
    authenticate,
    authorize("STUDENT"),
    submitCodeValidator,
    validate,
    submissionControler.submitCode.bind(
        submissionControler
    )
);

// Admin routes

// Get all submissions
submissionRouter.get(
    "/",
    authenticate,
    authorize("ADMIN"),
    submissionControler.getAllSubmissions.bind(
        submissionControler
    )
);

// Get submission by ID
submissionRouter.get(
    "/:id",
    authenticate,
    authorize("STUDENT"),
    submissionControler.getSubmissionById.bind(
        submissionControler
    )
);


export default submissionRouter;