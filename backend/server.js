import dotenv from "dotenv";
import app from "./app.js";
import path from "path";
import { fileURLToPath } from "url";
import connectDatabase from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const PORT = process.env.PORT || 5000;

await connectDatabase();

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});
