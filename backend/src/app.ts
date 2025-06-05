import fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { loggingHook } from "./hooks/logging";
import { setStartTimeHook } from "./hooks/setStartTime";
import { env } from "./env";
import userRoutes from "./users/userRoutes";
import { AppError } from "./common/AppError";
import { ZodError } from "zod";

export const app = fastify();

app.register(fastifyCors, {
    origin: env.FRONTEND_URL,
    credentials: true
});

app.register(fastifyJwt, {
    secret: env.JWT_SECRET
})

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Me Encontrei API',
            description: 'Documentação das rotas da API',
            version: '1.0.0',
        },
    },
})

app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'list',
        deepLinking: false,
    },
})

app.addHook('onRequest', setStartTimeHook);

app.addHook('onResponse', loggingHook);

app.register(userRoutes);

app.setErrorHandler((err: FastifyError | ZodError, _req: FastifyRequest, reply: FastifyReply) => {
    if (err instanceof AppError) {
        return reply.status(err.statusCode).send({
            message: err.message,
            isOperational: err.isOperational,
            code: err.code,
            details: err.details,
        });
    }

    if (err instanceof ZodError) {
        return reply.status(400).send({
            message: "Validation failed. Please check your input.",
            isOperational: true,
            code: "ZOD_VALIDATION_ERROR",
            details: err.errors.map((issue) => ({
                path: issue.path.join("."),
                message: issue.message,
                code: issue.code,
                expected: (issue as any).expected,
                received: (issue as any).received,
            })),
        });
    }

    console.error(err);
    return reply.status(500).send({
        message: 'Internal server error',
        isOperational: false
    });
})