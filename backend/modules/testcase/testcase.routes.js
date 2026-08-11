import express from "express";

import testcaseControler from "./testcase.controler.js";

import authenticate from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/role.middleware.js";
import validate from "../../middlewares/validate.middleware.js";

import {
    createTestCaseValidator,
    updateTestCaseValidator,
    testCaseIdValidator
} from "./testcase.validator.js";

const testcaseRouter = express.Router();

testcaseRouter.post(
    "/questions/:questionId",
    authenticate,
    authorize("ADMIN"),
    createTestCaseValidator,
    validate,
    testcaseControler.createTestCase.bind(testcaseControler)
);

testcaseRouter.get(
    "/questions/:questionId",
    authenticate,
    authorize("ADMIN"),
    testcaseControler.getTestCasesByQuestion.bind(testcaseControler)
);

testcaseRouter.get(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    testCaseIdValidator,
    validate,
    testcaseControler.getTestCaseById.bind(testcaseControler)
);

testcaseRouter.patch(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    updateTestCaseValidator,
    validate,
    testcaseControler.updateTestCase.bind(testcaseControler)
);

testcaseRouter.delete(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    testCaseIdValidator,
    validate,
    testcaseControler.deleteTestCase.bind(testcaseControler)
);

export default testcaseRouter;