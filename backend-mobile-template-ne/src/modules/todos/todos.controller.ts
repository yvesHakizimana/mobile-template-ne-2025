import { NextFunction, Request, Response } from "express";
import { SingletonFactory } from "../../core/utils/singleton.util";
import { todoService } from "./todos.service";
import { ApiResponse } from "../../core/utils/api-response.util";

class TodoController extends SingletonFactory<TodoController>(){
    private constructor(){
        super()
    }

    async createTodo(req: Request, res: Response, next: NextFunction){
        try {
            const result = await todoService.createTodo(req.user.id, req.body)
            return ApiResponse.success(res, result)
        } catch(error){
            next(error)
        }
    }

    async getAllTodos(req: Request, res: Response, next: NextFunction){
        try {
            const result = await todoService.getAllTodos(req.user.id)
            return ApiResponse.success(res, result)
        } catch(error){
            next(error)
        }
    }

    async getTodoById(req: Request, res: Response, next: NextFunction){
        try {
            const result = await todoService.getTodoById(req.user.id, req.params.id)
            return ApiResponse.success(res, result)
        } catch(error){
            next(error)
        }
    }


    async updateTodo(req: Request, res: Response, next: NextFunction){
        try {
            const result = await todoService.updateTodo(req.user.id, req.params.id, req.body)
            return ApiResponse.success(res, result)
        } catch(error){
            next(error)
        }
    }

    async deleteTodo(req: Request, res: Response, next: NextFunction){
        try {
            const result = await todoService.deleteTodo(req.user.id, req.params.id)
            return ApiResponse.success(res, result)
        } catch(error){
            next(error)
        }
    }


}

export const todoController = TodoController.getInstance()