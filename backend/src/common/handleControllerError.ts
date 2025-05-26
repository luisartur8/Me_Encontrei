import { FastifyReply } from "fastify";
import { AppError } from "src/common/AppError";

export function handleControllerError(err: unknown, reply: FastifyReply) {
    if (err instanceof AppError) {
        return reply.status(err.statusCode).send({
            message: err.message,
            isOperational: err.isOperational,
            code: err.code,
            details: err.details,
        });
    }

    console.error(err);
    return reply.status(500).send({
        message: 'Internal server error',
        isOperational: false
    });
}
