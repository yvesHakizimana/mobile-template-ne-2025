import bcrypt from "bcrypt";
import { isValid, z } from "zod";
import { logger } from "../../core/config/logger";
import { prismaClient } from "../../core/config/prisma.instance";
import { redisClient } from "../../core/config/redis.instance";
import { BadRequestException } from "../../core/exceptions/http.exception";
import { SingletonFactory } from "../../core/utils/singleton.util";
import { emailService } from "../email/email.service";
import { userService } from "../users/users.service";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema, verifyAccountSchema } from "./dtos.schema";
import { JwtTokenUtil } from "../../core/utils/jwt.token.util";

type OTPREASON = "VERIFY_ACCOUNT" | "RESET_PASSWORD"

class AuthService extends SingletonFactory<AuthService>() {
    private constructor(){
        super()
    }

    async register(userData: z.infer<typeof registerSchema>){
        const createdUser = await userService.createUser(userData)
        const otpToSend = this.generateOtp()
        await this.storeOtp("VERIFY_ACCOUNT", otpToSend, createdUser.email!)
        await emailService.sendEmail(createdUser.email!, "Verify your account", "verify-account", {
            name: createdUser.firstName,
            otp: otpToSend
        })     
        return createdUser;
    }


    async login(loginData: z.infer<typeof loginSchema>){
        const {email, password} = loginData
        const user = await prismaClient.user.findUnique({
            where: {email}
        })

        if(!user)
            throw new BadRequestException("Invalid email or password.")

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!isPasswordValid)
            throw new BadRequestException("Invalid email or password.")

        if(!user.verified)
            throw new BadRequestException("You are not allowed to login until you verify your account.")

        const accessToken = JwtTokenUtil.generateAccessToken(user.id)

        return {accessToken}
    }


    async verifyAccount({email, otp}: z.infer<typeof verifyAccountSchema>){
        
        const key = `otp-VERIFY_ACCOUNT:${email}:${otp}`

        const otpFromDb = await redisClient.get(key)

        if(!otpFromDb)
            throw new BadRequestException("Invalid email or otp.")

        const user = await prismaClient.user.findUnique({
            where: {email}
        })

        if(!user)
            throw new BadRequestException("Invalid email or otp.")

        if(user.verified)
            throw new BadRequestException("The account is already verified.")

        await prismaClient.user.update({
            where: {email}, 
            data: {verified: true}
        })

        try {
            await redisClient.del(key)
            logger.info("Deleted successfully the otp key from the datbase")
        } catch(error){
            logger.error("Unable to delete the otp key from the redis database", error)
        }

        logger.info("The account was activated and verified successfully.")
        
        return {
            message: "Account was activated successfully"
        }
    }

    async sendForgotPasswordOtp({email}: z.infer<typeof forgotPasswordSchema>){
        console.log(email)
        const user = await prismaClient.user.findUnique({
            where: {email}
        })
        console.log(user)

        if(!user){
            return {message: "If your email is registered, you will receive an otp at your email."}
        }

        const otpToSend = this.generateOtp()

        await emailService.sendEmail(user.email, "Reset your password", "reset-password", {
            name: user.firstName,
            otp: otpToSend
        })

        await this.storeOtp("RESET_PASSWORD", otpToSend, email)

        return {message: "If your email is registered, you will receiver an otp at your email."}
    }

    async resetPassword({email, otp, newPassword}: z.infer<typeof resetPasswordSchema>){
        const key = `otp-RESET_PASSWORD:${email}:${otp}`

        const otpFromDb = await redisClient.get(key)

        if(!otpFromDb)
            throw new BadRequestException("Invalid email or otp.")

        const user = await prismaClient.user.findUnique({
            where: {email}
        })

        if(!user)
            throw new BadRequestException("Invalid email or otp.")


        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await prismaClient.user.update({
            where: {email}, 
            data: {password: hashedPassword}
        })

        try {
            await redisClient.del(key)
            logger.info("Deleted successfully the otp key from the datbase")
        } catch(error){
            logger.error("Unable to delete the reset password otp key from the redis database", error)
        }

        logger.info("The password was updated successfully.")
        
        return {
            message: "Password was updated successfully"
        }
    }

    private generateOtp(){
        const otp = Math.floor(100000 + Math.random() * 900000)
        return otp
    }

    private async storeOtp(otpReason: OTPREASON, otp: number, email: string){
        const key = `otp-${otpReason}:${email}:${otp}`
        try {
            await redisClient.setex(key, 60 * 10, otp)
            logger.info(`Stored the otp successfully for this email, ${email}`)
        } catch(error){
            logger.info("Failed to store the otp in redis instance.", error)
        }  
    }
}

export const authService = AuthService.getInstance()