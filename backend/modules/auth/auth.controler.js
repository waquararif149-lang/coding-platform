import authService from "./auth.service.js";

class AuthController {

    async register(req, res, next) {
        try {

            const user = await authService.register(req.body);

            return res.status(201).json({
                success: true,
                data: user
            });

        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {

            const result = await authService.login(
                req.body.email,
                req.body.password
            );

            return res.status(200).json({
                success: true,
                data: result
            });

        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();