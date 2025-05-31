import fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { loggingHook } from "./hooks/logging";
import { setStartTimeHook } from "./hooks/setStartTime";
import { env } from "./env";
import userRoutes from "./users/userRoutes";
import { AppError } from "./common/AppError";

export const app = fastify();

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

app.setErrorHandler((err: FastifyError, _req: FastifyRequest, reply: FastifyReply) => {
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
})