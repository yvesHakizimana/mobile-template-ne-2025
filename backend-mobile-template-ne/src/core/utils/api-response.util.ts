import { Response } from "express";
import { ApiResponseType } from "../types/api-response.type";
import { HttpException } from "../exceptions/http.exception";
import { ValidationException } from "../exceptions/validation.exception";

export class ApiResponse {
  static success<T>(res: Response, data: T, statusCode = 200) {
    const response: ApiResponseType<T> = {
      success: true,
      data
    };
    
    res.status(statusCode).json(response);
  }
  
  static error<T>(res: Response, exception: HttpException) {
    const { message, statusCode, code } = exception;
    
    const response: ApiResponseType<T> = {
      success: false,
      error: {
        message,
        code
      }
    };
    
    // Add validation errors if this is a ValidationException
    if (exception instanceof ValidationException) {
      response.error!.validationErrors = exception.validationErrors;
    }
    
    res.status(statusCode).json(response);
  }
}