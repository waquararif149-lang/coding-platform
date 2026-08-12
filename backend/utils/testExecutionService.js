import executionService from "../modules/execution/execution.service.js";
import dotenv from "dotenv";

dotenv.config();

const testExecution = async () => {
    try {

        const result = await executionService.executeCode({
            language: "python",

            code: `
numbers = list(map(int, input().split()))
print(sum(numbers))
`,

            stdin: [
                "1 2 3",
                "10 20 30"
            ]
        });

        console.log("Execution Result:");
        console.log(result);

    } catch (error) {

        console.error(
            "Execution failed:",
            error.message
        );
    }
};

testExecution();