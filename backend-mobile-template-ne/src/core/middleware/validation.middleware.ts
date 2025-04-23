import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import { ValidationException } from "../exceptions/validation.exception";

type ValidationTarget = "body" | "params" | "query" | "headers"

interface ValidationOptions {
    target?: ValidationTarget | ValidationTarget[];
    stripUnknown?: boolean;
}

const defaultOptions: ValidationOptions = {
    target: "body",
    stripUnknown: true
}

export function validateRequest(schema: z.Schema, options: ValidationOptions = defaultOptions){
    const targets = Array.isArray(options.target) ? options.target : [options.target || "body"];

    const stripUnknown = options.stripUnknown !== false;

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationErrors: Array<{
                path: string;
                message: string;
                field: string;
                target: string;
            }> = []

            for (const target of targets) {
                if (!req[target]) continue;

                try {
                    const parseResult  = await schema.parseAsync(req[target])

                    req[target] = parseResult;
                } catch(err){
                    if (err instanceof ZodError){
                        const errors = err.errors.map(zodError => {
                            const pathString = zodError.path.join('.');

                            // Get just the field name (last item in the path array)
                            const field = zodError.path.length > 0 ?
                                zodError.path[zodError.path.length - 1].toString() : target;

                            return {
                                path: pathString, 
                                field: field.toString(),
                                message: zodError.message,
                                target
                            }
                            
                        })

                        validationErrors.push(...errors)
                    } else {
                        throw err;
                    }
                }
            }

            if(validationErrors.length > 0)
                throw new ValidationException("Validation Failed", validationErrors)

            next()
        } catch(error){
            next(error)
        }
    }
}