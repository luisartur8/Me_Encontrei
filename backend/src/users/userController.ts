import { FastifyReply, FastifyRequest } from "fastify";
import { IUserController, UpdateUserRequest, UserRole } from "./userInterfaces";
import { createUserSchema, idSchema, loginSchema } from "./userSchema";
import { UserService } from "./userService";

export class UserController implements IUserController {
    constructor(private readonly userService: UserService) { }

    async index(_req: FastifyRequest, reply: FastifyReply) {
        const user = await this.userService.getUsers();
        return reply.status(200).send({ user });
    }

    async show(req: FastifyRequest, reply: FastifyReply) {
        const { id } = idSchema.parse(req.params);
        const user = await this.userService.getUserById(id);
        return reply.status(200).send({ user });
    }

    async store(req: FastifyRequest, reply: FastifyReply) {
        const data = createUserSchema.parse(req.body);
        const user = await this.userService.createUser(data);
        return reply.status(201).send({ user });
    }

    async update(req: FastifyRequest<UpdateUserRequest>, reply: FastifyReply) {
        const { id } = req.params;
        const data = req.body;
        const isAdmin = (req.user as UserRole).role === 'ADMIN';
        const user = await this.userService.updateUserById(id, data, isAdmin);
        return reply.status(200).send({ user });
    }

    async delete(req: FastifyRequest, reply: FastifyReply) {
        const { id } = idSchema.parse(req.params);
        await this.userService.deleteUserById(id);
        return reply.status(204).send();
    }

    async login(req: FastifyRequest, reply: FastifyReply) {
        const data = loginSchema.parse(req.body);
        const token = await this.userService.login(data, reply);
        return reply.status(200).send({ token });
    }
}