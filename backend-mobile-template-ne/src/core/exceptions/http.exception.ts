import { BaseException } from "./base.exception";

export class HttpException extends BaseException {
    constructor(
        message: string,
        public statusCode: number,
        code?: string
    ){
        super(message, code);
        this.name = "HttpException";
    }
}

export class BadRequestException extends HttpException {
    constructor(message = "Bad Request", code="BAD_REQUEST"){
        super(message, 400, code);
        this.name = "BadRequestException";
    }
}

export class UnauthorizedException extends HttpException {
    constructor(message = "Unauthorized", code="UNAUTHORIZED"){
        super(message, 401, code);
        this.name = "UnauthorizedException";
    }
}

export class ForbiddenException extends HttpException {
    constructor(message = "Forbidden", code="FORBIDDEN"){
        super(message, 403, code);
        this.name = "ForbiddenException";
    }
}

export class NotFoundException extends HttpException {
    constructor(message = "Bad Request", code="NOT_FOUND"){
        super(message, 404, code);
        this.name = "NotFoundException";
    }
}

export class ConflictException extends HttpException {
    constructor(message = "Conflict", code="ConflictException"){
        super(message, 409, code);
        this.name = "ConflictException";
    }
}

export class RateLimitException extends HttpException {
    constructor(message = "Too many requests", code="RATE_LIMIT_EXCEEDED"){
        super(message, 429, code);
        this.name = "RateLimitException";
    }
}

export class InternalSeverErrorException extends HttpException {
    constructor(message = "Internal Server Error", code="INTERNAL_SERVER_ERROR"){
        super(message, 500, code);
        this.name = "InternalServerErrorException";
    }
}