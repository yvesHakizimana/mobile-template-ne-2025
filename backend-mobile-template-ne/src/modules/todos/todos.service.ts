import { z } from "zod";
import { prismaClient } from "../../core/config/prisma.instance";
import { NotFoundException } from "../../core/exceptions/http.exception";
import { SingletonFactory } from "../../core/utils/singleton.util";
import { createTodoSchema, updateTodoSchema } from "./dtos.schema";

class TodoService extends SingletonFactory<TodoService>() {
    private constructor (){
        super()
    }

    async createTodo(userId: string, createTodoData: z.infer<typeof createTodoSchema>){
        const todo = await prismaClient.todo.create({
            data: {
                ...createTodoData,
                userId
            }
        })

        return todo
    } 

    async getAllTodos(userId: string){
        const todos = await prismaClient.todo.findMany({
            where: {userId},
            orderBy: {createdAt: 'desc'}
        })

        return todos
    }

    async getTodoById(userId: string, todoId: string){
        const todo = await prismaClient.todo.findFirst({
            where: {id: todoId, userId}
        })
        if(!todo)
            throw new NotFoundException("Todo not found.")
        return todo;
    }

    async updateTodo(userId: string, todoId: string, updateTodoData: z.infer<typeof updateTodoSchema>){
        await this.getTodoById(userId, todoId)

        return await prismaClient.todo.update({
            where: {id: todoId, userId},
            data: updateTodoData
        })

        
    }

    async deleteTodo(userId: string, todoId: string){
        await this.getTodoById(userId, todoId)

        await prismaClient.todo.delete({
            where: {id: todoId, userId}
        })

        return {message: "Todo delected successfully"}
    }
}

export const todoService = TodoService.getInstance()