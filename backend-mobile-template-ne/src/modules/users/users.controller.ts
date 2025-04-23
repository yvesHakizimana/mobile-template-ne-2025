import { NextFunction, Request, Response } from "express";
import { SingletonFactory } from "../../core/utils/singleton.util";
import { userService } from "./users.service";
import { ApiResponse } from "../../core/utils/api-response.util";

class UserController extends SingletonFactory<UserController>() {
    private constructor(){
        super()
    }

    async getUserProfile(req: Request, res: Response, next: NextFunction){
        try {
            const result = await userService.getUserProfile(req.user.id);
            return ApiResponse.success(res, result)
        } catch(error){
            next(error)
        }
    }

    async updateUserProfile(req: Request, res: Response, next: NextFunction){
        try {
            const result = await userService.updateUserProfile(req.user.id, req.body);
            return ApiResponse.success(res, result)
        } catch(error){
            next(error)
        }
    }

    async changePassword(req: Request, res: Response, next: NextFunction){
        try {
            const {currentPassword, newPassword } = req.body;
            const result = await userService.changePassword(req.user.id, currentPassword, newPassword);
            return ApiResponse.success(res, result)
        } catch(error){

        }
    }
} 

export const userController = UserController.getInstance()