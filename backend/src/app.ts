import fastify from "fastify";
import userRoutes from "./users/userRoutes";
import fastifyJwt from '@fastify/jwt';
import { env } from "./env";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

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

app.register(userRoutes);