import { Router } from "express";
import arcjetMiddleware from "../../core/middleware/rate-limit.middleware";
import { validateRequest } from "../../core/middleware/validation.middleware";
import { authController } from "./auth.controller";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema, verifyAccountSchema } from "./dtos.schema";

const router = Router();

router.use(arcjetMiddleware)

router.post("/register", 
    validateRequest(registerSchema) , 
    async ( req, res, next) => await authController.register(req, res, next))

router.post("/login", 
    validateRequest(loginSchema) , 
    async ( req, res, next) => await authController.login(req, res, next))    

router.patch('/verify-account', 
    validateRequest(verifyAccountSchema),
    async (req, res, next) => await authController.verifyAccount(req, res, next)
)

router.patch('/initiate-forgot-password', 
    validateRequest(forgotPasswordSchema),
    async (req, res, next) => await authController.sendForgotOtpLink(req, res, next)
)

router.patch('/reset-password',  
    validateRequest(resetPasswordSchema),
    async (req, res, next) => await authController.resetPassword(req, res, next)
)

export default router;