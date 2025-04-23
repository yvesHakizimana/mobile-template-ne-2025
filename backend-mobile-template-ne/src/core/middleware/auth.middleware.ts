import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/http.exception";
import { JwtTokenUtil } from "../utils/jwt.token.util";

declare global {
    namespace Express {
        interface Request {
            user: {id: string;}
        }
    }
}


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader)
            throw new UnauthorizedException("Authorization header is missing.")

        const token = authHeader.split(" ")[1];
        if (!token)
            throw new UnauthorizedException("Bearer token is missing.")
        
        const decoded = JwtTokenUtil.verifyToken(token)
        req.user = {id: decoded.userId}
        next()
    } catch(error){
        next(error)
    }
}