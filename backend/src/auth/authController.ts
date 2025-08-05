import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "./authService";
import { IAuthController } from "./authInterfaces";
import { createUserSchema, loginSchema } from "./authSchema";

export class AuthController implements IAuthController {
    constructor(private readonly authService: AuthService) { }

    async register(req: FastifyRequest, reply: FastifyReply) {
        const data = createUserSchema.parse(req.body);
        const user = await this.authService.createUser(data);
        return reply.status(201).send({ user });
    }

    async login(req: FastifyRequest, reply: FastifyReply) {
        const data = loginSchema.parse(req.body);
        const token = await this.authService.login(data, reply);
        return reply.status(200).send({ token });
    }
}