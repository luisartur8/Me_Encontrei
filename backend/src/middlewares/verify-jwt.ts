import { FastifyReply, FastifyRequest } from "fastify";

export async function VerifyJWT(req: FastifyRequest, reply: FastifyReply) {
    try {
        await req.jwtVerify()
    } catch (err) {
        return reply.code(500).send({ message: "Unauthorized." })
    }
}