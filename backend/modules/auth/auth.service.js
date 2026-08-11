import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../user/user.model.js";

class AuthService {

    async register(userData) {

        const { name, email, password } = userData;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const error = new Error("User already exists");
            error.statusCode = 409;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role:"STUDENT"
        });

        return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };
    }

    async login(email, password) {

        const user = await User
            .findOne({ email })
            .select("+password");

        if (!user) {
            const error = new Error("Invalid email or password");
            error.statusCode = 401;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            const error = new Error("Invalid email or password");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            {
                userId: user._id.toString(),
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1h"
            }
        );

        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }
}

export default new AuthService();