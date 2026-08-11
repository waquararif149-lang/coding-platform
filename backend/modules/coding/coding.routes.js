import express from "express";
import validate from "../../middlewares/validate.middleware.js";
import { createQuestionValidator,questionIdValidator,updateQuestionValidator } from "./coding.validator.js";
import authenticate from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/role.middleware.js";

import codingControler from "./coding.controler.js";

const codingRouter = express.Router();

codingRouter.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    createQuestionValidator,
    validate,
    codingControler.createQuestion.bind(codingControler)
);

codingRouter.get(
    "/",
    codingControler.getAllQuestions.bind(codingControler)
);

codingRouter.get(
    "/:id",
    questionIdValidator,
    validate,
    codingControler.getQuestion.bind(codingControler)
);

codingRouter.patch(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    questionIdValidator,
    updateQuestionValidator,
    validate,
    codingControler.updateQuestion.bind(codingControler)
);

codingRouter.delete(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    questionIdValidator,
    validate,
    codingControler.deleteQuestion.bind(codingControler)
);

export default codingRouter;