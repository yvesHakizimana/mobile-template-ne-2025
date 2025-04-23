import { z } from "zod";
import { SingletonFactory } from "../../core/utils/singleton.util";
import { registerSchema } from "../auth/dtos.schema";
import { prismaClient } from "../../core/config/prisma.instance";
import { BadRequestException, ConflictException, NotFoundException } from "../../core/exceptions/http.exception";
import bcrypt from "bcrypt";
import { User } from "../../generated-prisma-client/prisma";

class UserService extends SingletonFactory<UserService>() {
    private constructor(){
        super()
    }

    async createUser(userData: z.infer<typeof registerSchema>): Promise<Partial<User>>{
        const {firstName, lastName, email, password} = userData
        const user = await prismaClient.user.findUnique({
            where: {email}
        })

        if(user)
            throw new ConflictException("User with this email already exists.")

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await prismaClient.user.create({
            data: {firstName, lastName, email, password: hashedPassword}
        })

        return {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt
        }
    }

    async getUserProfile(userId: string): Promise<Partial<User>>{
        const user = await prismaClient.user.findUnique({
            where: {id: userId},
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        })

        if(!user)
            throw new NotFoundException("User not found.")

        return user;
    }

    async updateUserProfile(userId: string, data: {firstName?: string, lastName?:  string}){
        await this.getUserProfile(userId)

        return prismaClient.user.update({
            where: {id: userId},
            data,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        })
    }

    async changePassword(userId: string, currentPassword: string, newPassword: string){
        const user = await prismaClient.user.findUnique({ where: {id: userId}})

        if(!user)
            throw new NotFoundException("User not found.")

        const isValidPassword = await bcrypt.compare(currentPassword, user.password)
        
        if(!isValidPassword) throw new BadRequestException("Invalid current password.")

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        
        await prismaClient.user.update({
            where: {id: userId},
            data: {password: hashedPassword}
        })

        return {message: "Password changed successfully."}
    }
}

export const userService = UserService.getInstance()
