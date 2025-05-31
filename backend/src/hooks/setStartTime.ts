import { FastifyReply, FastifyRequest } from "fastify";
import { env } from "src/env";

export async function setStartTimeHook(request: FastifyRequest, _reply: FastifyReply) {
    if (env.NODE_ENV === 'dev') {
        request.headers['x-start-time'] = Date.now().toString();
    }
}