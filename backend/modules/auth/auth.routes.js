import express from "express";

import authControler from "./auth.controler.js";

import validate from "../../middlewares/validate.middleware.js";

import {
    registerValidator,
    loginValidator
} from "./auth.validator.js";

const authRouter = express.Router();

authRouter.post(
    "/register",
    registerValidator,
    validate,
    authControler.register.bind(authControler)
);

authRouter.post(
    "/login",
    loginValidator,
    validate,
    authControler.login.bind(authControler)
);

export default authRouter;