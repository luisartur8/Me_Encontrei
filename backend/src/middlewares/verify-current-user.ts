import { FastifyReply, FastifyRequest } from "fastify";

export async function VerifyCurrentUser(req: FastifyRequest, reply: FastifyReply) {
    const { id: userId, role } = req.user as { id: string, role: string }
    const { id } = req.params as { id: string }

    if (role !== 'admin' && userId !== id) {
        return reply.status(403).send({ error: 'Forbidden: Acess allowed only for the owner or admin' });
    }
}
