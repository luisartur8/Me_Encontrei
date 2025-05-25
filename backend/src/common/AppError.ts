export class AppError extends Error {
    public readonly statusCode: number;
    public readonly message: string;
    public readonly isOperational: boolean;
    public readonly code?: string;
    public readonly details?: any;

    constructor(
        message: string,
        statusCode = 400,
        options?: {
            isOperational?: boolean;
            code?: string;
            details?: any;
        }
    ) {
        super(message);

        this.statusCode = statusCode;
        this.message = message;
        this.isOperational = options?.isOperational ?? true;
        this.code = options?.code;
        this.details = options?.details;

        Error.captureStackTrace(this, this.constructor);
    }
}
