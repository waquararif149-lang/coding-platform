import axios from "axios";

import testCaseRepository from "../testcase/testcase.repository.js";


const ALLOWED_LANGUAGES = [
    "python",
    "javascript",
    "java",
    "cpp"
];


class ExecutionService {

    async executeCode({
        language,
        code,
        stdin = ""
    }) {
        if (!language) {
            const error = new Error("Language is required");
            error.statusCode = 400;
            throw error;
        }

        if (!ALLOWED_LANGUAGES.includes(language)) {
            const error = new Error("Unsupported language");
            error.statusCode = 400;
            throw error;
        }

        if (!code || !code.trim()) {
            const error = new Error("Code is required");
            error.statusCode = 400;
            throw error;
        }

        if (typeof stdin === "string" && stdin.length > 10000) {
            const error = new Error("Input is too large");
            error.statusCode = 400;
            throw error;
        }


        try {
            const response = await axios.post(
                process.env.ONECOMPILER_API_URL,

                {
                    language,
                    stdin,
                    files: [
                        {
                            name: this.getFileName(language),
                            content: code
                        }
                    ]
                },

                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-API-Key": process.env.ONECOMPILER_API_KEY
                    }
                }
            );

            return response.data;
        } catch (error) {
            console.error(
                "OneCompiler execution error:",
                error.response?.data || error.message
            );

            const executionError = new Error(
                "Code execution service failed"
            );

            executionError.statusCode = 502;

            throw executionError;
        }
    }

    async executeQuestion({
        questionId,
        language,
        code
    }) {
        if (!questionId) {
            const error = new Error("Question ID is required");
            error.statusCode = 400;
            throw error;
        }

        const testCases = await testCaseRepository.findTestCasesByQuestionId(questionId);

        if (!testCases || testCases.length === 0) {
            const error = new Error("No test cases found for this question");
            error.statusCode = 404;
            throw error;
        }

        const results = [];

        for (const testCase of testCases) {
            const executionResult = await this.executeCode({
                language,
                code,
                stdin: testCase.input || ""
            });

            let status = "PASSED";
            let actualOutput = "";

            if (executionResult.exception) {
                status = "RUNTIME_ERROR";
            } else if (executionResult.stderr) {
                status = "COMPILATION_ERROR";
            } else {
                actualOutput = String(executionResult.stdout || "").trim();
                const expectedOutput = String(testCase.expectedOutput ?? "").trim();

                if (actualOutput !== expectedOutput) {
                    status = "WRONG_ANSWER";
                }
            }

            const normalizedResult = {
                testCaseId: testCase._id,
                status,
                passed: status === "PASSED",
                isHidden: Boolean(testCase.isHidden)
            };

            if (!testCase.isHidden) {
                normalizedResult.actualOutput = actualOutput;
            }

            results.push(normalizedResult);
        }

        const passedTests = results.filter(test => test.passed).length;

        let overallStatus = "ACCEPTED";

        if (results.some(test => test.status === "COMPILATION_ERROR")) {
            overallStatus = "COMPILATION_ERROR";
        } else if (results.some(test => test.status === "RUNTIME_ERROR")) {
            overallStatus = "RUNTIME_ERROR";
        } else if (passedTests !== results.length) {
            overallStatus = "WRONG_ANSWER";
        }

        return {
            totalTests: results.length,
            passedTests,
            allPassed: passedTests === results.length,
            status: overallStatus,
            results
        };
    }

    getFileName(language) {
        const extensions = {
            python: "main.py",
            javascript: "main.js",
            java: "Main.java",
            cpp: "main.cpp"
        };


        return extensions[language];
    }
}


export default new ExecutionService();