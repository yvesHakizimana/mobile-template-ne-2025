import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/env";


interface JwtPayload {
    userId: string;
}

export class JwtTokenUtil  {
    static generateAccessToken(userId: string){
        return jwt.sign({userId}, ACCESS_TOKEN_SECRET!, {
            expiresIn: "1hr"
        })
    }

    static verifyToken(token: string){
        return jwt.verify(token, ACCESS_TOKEN_SECRET!) as JwtPayload
    }
}