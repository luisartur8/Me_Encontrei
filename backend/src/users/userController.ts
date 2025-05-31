import { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";
import { UserService } from "./userService";
import { CreateUserInput, LoginInput } from "./userSchema";
import { IUserController, UpdateUserRequest, UserRole } from "./user.interfaces";

export class UserController implements IUserController {
    constructor(private readonly userService: UserService) { }

    async index(_req: FastifyRequest, reply: FastifyReply) {
        const user = await this.userService.getUsers();
        return reply.status(200).send({ user });
    }

    async show(req: FastifyRequest<{ Params: { id: string } } & RouteGenericInterface>, reply: FastifyReply) {
        const { id } = req.params;
        const user = await this.userService.getUserById(id);
        return reply.status(200).send({ user });
    }

    async store(req: FastifyRequest<{ Body: CreateUserInput }>, reply: FastifyReply) {
        const { username, email, password } = req.body;
        const user = await this.userService.createUser(username, email, password);
        return reply.status(201).send({ user });
    }

    async update(req: FastifyRequest<UpdateUserRequest>, reply: FastifyReply) {
        const { id } = req.params;
        const data = req.body;
        const isAdmin = (req.user as UserRole).role === 'ADMIN';
        const user = await this.userService.updateUserById(id, data, isAdmin);
        return reply.status(200).send({ user });
    }

    async delete(req: FastifyRequest<{ Params: { id: string } } & RouteGenericInterface>, reply: FastifyReply) {
        const { id } = req.params;
        await this.userService.deleteUserById(id);
        return reply.status(204).send();
    }

    async login(req: FastifyRequest<{ Body: LoginInput }>, reply: FastifyReply) {
        const { username, password } = req.body;
        const token = await this.userService.login(username, password, reply);
        return reply.status(200).send({ token });
    }
}