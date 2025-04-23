import { aj } from "../config/arcjet"
import { Request, Response, NextFunction } from "express"
import { ForbiddenException, RateLimitException } from "../exceptions/http.exception"
import { logger } from "../config/logger"


const arcjetMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const desicion = await aj.protect(req, {requested: 1})

        if(desicion.isDenied()){
            if(desicion.reason.isRateLimit()) throw new RateLimitException()
            if(desicion.reason.isBot()) throw new ForbiddenException("Bots are not permitted on our site.")

            throw new ForbiddenException()
        }

        next()
    } catch (error){
         logger.error(`Arcjet middleware error: ${error}`);
         next(error);
    }
}

export default arcjetMiddleware;