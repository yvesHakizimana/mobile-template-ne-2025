import { z } from "zod";

export const updateProfileSchema = z.object({
    firstName: z.string().min(3).max(50).optional(),
    lastName: z.string().min(3).max(50).optional(),
}).refine(data  => Object.keys(data).length > 0, {
    message: "At least one field must be provided."
})

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(8).max(50),
    newPassword: z.string().min(8).max(50),
}).refine(({currentPassword, newPassword}) => currentPassword !== newPassword, {
    message: "New password must be different from current password.",
    path: ["newPassword"]
})