import { FastifyReply, FastifyRequest } from "fastify";

export async function VerifyAdmin(req: FastifyRequest, reply: FastifyReply) {
    const { role } = req.user as { role: string }

    if (role !== 'ADMIN') {
        return reply.status(403).send({ error: 'Forbidden: Admins only' });
    }
}
