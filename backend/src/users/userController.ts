import { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";
import { UserService } from "./userService";
import { CreateUserInput, LoginInput } from "./userSchema";
import { handleControllerError } from "src/common/handleControllerError";
import { IUserController, UpdateUserRequest } from "./user.interfaces";

export class UserController implements IUserController {
    constructor(private readonly userService: UserService) { }

    async index(_req: FastifyRequest, reply: FastifyReply) {
        try {
            const user = await this.userService.getUsers();
            return reply.status(200).send({ user });
        } catch (err) {
            return handleControllerError(err, reply);
        }
    }

    async show(req: FastifyRequest<{ Params: { id: string } } & RouteGenericInterface>, reply: FastifyReply) {
        try {
            const { id } = req.params;
            const user = await this.userService.getUserById(id);
            return reply.status(200).send({ user });
        } catch (err) {
            return handleControllerError(err, reply);
        }
    }

    async store(req: FastifyRequest<{ Body: CreateUserInput }>, reply: FastifyReply) {
        try {
            const { username, email, password } = req.body;
            const user = await this.userService.createUser(username, email, password);
            return reply.status(201).send({ user });
        } catch (err) {
            return handleControllerError(err, reply);
        }
    }

    // TODO: Fazer um update mais detalhado, por enquanto qualquer um pode mudar o id e o role para admin
    async update(req: FastifyRequest<UpdateUserRequest>, reply: FastifyReply) {
        try {
            const { id } = req.params;
            const data = req.body;
            const user = await this.userService.updateUserById(id, data);
            return reply.status(200).send({ user });
        } catch (err) {
            return handleControllerError(err, reply);
        }
    }

    async delete(req: FastifyRequest<{ Params: { id: string } } & RouteGenericInterface>, reply: FastifyReply) {
        try {
            const { id } = req.params;
            await this.userService.deleteUserById(id);

            return reply.status(204).send();
        } catch (err) {
            return handleControllerError(err, reply);
        }
    }

    async login(req: FastifyRequest<{ Body: LoginInput }>, reply: FastifyReply) {
        const { username, password } = req.body;

        try {
            const token = await this.userService.login(username, password, reply);
            return reply.status(200).send({ token });
        } catch (err) {
            return handleControllerError(err, reply)
        }
    }
}