import { ValidationErrorDetail } from "../exceptions/validation.exception";

export interface ApiResponseType<T = any>{
    success: boolean;
    data?: T;
    error?: {
        message: string;
        code?: string;
        validationErrors?: ValidationErrorDetail[]
    }
}