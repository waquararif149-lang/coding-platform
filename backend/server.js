import dotenv from "dotenv";
import app from "./app.js";
import connectDatabase from "./config/db.js";
dotenv.config();

const PORT=process.env.PORT || 5000;

await connectDatabase();

app.listen(PORT,()=>{
    console.log(`Server is running on Port ${PORT}`)
})
