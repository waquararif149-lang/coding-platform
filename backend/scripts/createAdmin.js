import "dotenv/config";
import bcrypt from "bcrypt";

// import connectDatabase from "../config/db.js";
// import User from "../modules/user/user.model.js";
import connectDatabase from "../config/db.js";
import User from "../modules/user/user.model.js";

const createAdmin = async () => {
    try {
        await connectDatabase();

        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!email || !password) {
            throw new Error(
                "ADMIN_EMAIL and ADMIN_PASSWORD are required"
            );
        }

        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const admin = await User.create({
            name: "Admin",
            email,
            password: hashedPassword,
            role: "ADMIN"
        });

        console.log("Admin created successfully");
        console.log("Admin ID:", admin._id);

        process.exit(0);

    } catch (error) {
        console.error("Failed to create admin:", error);
        process.exit(1);
    }
};

createAdmin();