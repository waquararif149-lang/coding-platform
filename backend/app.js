import express from "express";
import cors from "cors";
import helmet from "helmet";
import codingRouter from "./modules/coding/coding.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import authRouter from "./modules/auth/auth.routes.js";
import testcaseRouter from "./modules/testcase/testcase.routes.js";
import examRouter from "./modules/exam/exam.routes.js";


const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use("/api/questions",codingRouter);
app.use("/api/auth",authRouter);
app.use("/api/testcases",testcaseRouter);
app.use("/api/exams",examRouter);

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Coding platform API is running"
    });
});

app.use(errorMiddleware);

export default app;