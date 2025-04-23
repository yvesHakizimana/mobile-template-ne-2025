export class BaseException extends Error {
    constructor(
        message: string,
        public code?: string,
    ) {
        super(message);
        this.name = "BaseException"
    }
}