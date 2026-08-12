import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const testOneCompiler = async () => {
    try {
        const response = await axios.post(
            "https://api.onecompiler.com/v1/run",
            {
                language: "python",
                stdin: "",
                files: [
                    {
                        name: "main.py",
                        content: `
print("Hello from OneCompiler")
`
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

        console.log(response.data);

    } catch (error) {

        console.error(
            "OneCompiler Error:",
            error.response?.data || error.message
        );
    }
};

testOneCompiler();