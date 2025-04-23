import { BadRequestException } from "./http.exception";

export interface ValidationErrorDetail {
    path: string;
    message: string;
    field: string;
    target: string;
}


export class ValidationException extends BadRequestException{
    public validationErrors: ValidationErrorDetail[];

    constructor(
        message = "Validation Failed.",
        validationErrors: ValidationErrorDetail[],
        code = "VALIDATION_ERROR"
    ){
      super(message, code)
      this.name = "ValidationException";
      this.validationErrors = validationErrors  
    }
}