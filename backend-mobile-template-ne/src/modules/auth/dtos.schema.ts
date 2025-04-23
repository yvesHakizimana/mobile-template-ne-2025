import { z } from "zod";

export const registerSchema = z.object({
    firstName: z.string().min(3).max(50),
    lastName: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(8).max(100),
})

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

export const verifyAccountSchema = z.object({
    email: z.string().email(),
    otp: z.string().length(6),
})

export const forgotPasswordSchema = z.object({
    email: z.string().email(),
})

export const resetPasswordSchema = z.object({
    email: z.string().email(),
    otp: z.string().length(6),
    newPassword: z.string().min(8).max(100),
})

