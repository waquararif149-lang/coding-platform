import express from "express";

import executionControler from "./execution.controler.js";
import authenticate from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/role.middleware.js";
import validate from "../../middlewares/validate.middleware.js";

import {
    executeCodeValidator
} from "./execution.validator.js";


const executionRouter = express.Router();


executionRouter.post(
    "/run",
    authenticate,
    authorize("STUDENT"),
    executeCodeValidator,
    validate,
    executionControler.executeCode.bind(executionControler)
);


export default executionRouter;