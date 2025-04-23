import { NextFunction, Request, Response } from "express";
import { logger } from "../../core/config/logger";
import { ApiResponse } from "../../core/utils/api-response.util";
import { SingletonFactory } from "../../core/utils/singleton.util";
import { authService } from "./auth.service";

class AuthController extends SingletonFactory<AuthController>() {
    private constructor(){
        super()
    }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await authService.register(req.body);
            logger.info(`User ${user.email} registered successfully`);
            return ApiResponse.success(res, user)
        } catch(error){
            next(error)
        }
    }

    async login(req: Request, res: Response, next: NextFunction){
        try {
            const result = await authService.login(req.body)
            return ApiResponse.success(res, result)
        } catch(error) {
            next(error)
        }
    }

    async verifyAccount(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await authService.verifyAccount(req.body)
            return ApiResponse.success(res, result)
        } catch(error){
            next(error)
        }
    }

    async sendForgotOtpLink(req: Request, res: Response, next: NextFunction){
        try {
            const result = await authService.sendForgotPasswordOtp(req.body)
            return ApiResponse.success(res, result)
        } catch(error){
            next(error)
        }
    }

    async resetPassword(req: Request, res: Response, next: NextFunction){
        try {
            const result = await authService.resetPassword(req.body)
            return ApiResponse.success(res, result)
        } catch(error){
            next(error)
        }
    }
}

export const authController = AuthController.getInstance();