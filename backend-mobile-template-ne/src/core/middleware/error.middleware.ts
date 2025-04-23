import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextFunction, Request, Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import { logger } from "../config/logger";
import { ConflictException, HttpException, InternalSeverErrorException, NotFoundException, UnauthorizedException } from "../exceptions/http.exception";
import { ApiResponse } from "../utils/api-response.util";

export const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(`${error.name}: ${error.message}`, {
        stack: error.stack,
        path: req.path,
        method: req.method,
    });

    // Handle know HTTP exception
    if(error instanceof HttpException)
        return ApiResponse.error(res, error);

    // Handle Jwt token expiration errors.
    if(error instanceof TokenExpiredError){
        return ApiResponse.error(res, new UnauthorizedException("Jwt token expired."))
    }

    // Handle Known Prisma Exceptions.
    if (error instanceof PrismaClientKnownRequestError ){
        if (error.code === "P2002")
            return ApiResponse.error(res, new ConflictException("A record with this value already exists"));
        if (error.code === "P2025")
            return ApiResponse.error(res, new NotFoundException("Record requested not found."));
    }

    // Fallback for hanlding internal server errors.
    return ApiResponse.error(res, new InternalSeverErrorException(error.message || "Internal Server Error"));
}