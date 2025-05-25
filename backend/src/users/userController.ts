import { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "./userService";
import { CreateUserInput, LoginInput } from "./userSchema";
import { AppError } from "src/common/AppError";

export class UserController {
    constructor(private userService: UserService) { }

    async store(req: FastifyRequest<{ Body: CreateUserInput }>, reply: FastifyReply) {
        try {
            const user = await this.userService.createUser(req.body);

            return reply.status(201).send({ user })
        } catch (err) {
            if (err instanceof AppError) {
                return reply.status(err.statusCode).send({
                    message: err.message,
                    code: err.code,
                    details: err.details,
                });
            }

            console.error(err);
            return reply.status(500).send({
                message: 'Internal server error',
            });
        }
    }

    async index(req: FastifyRequest, reply: FastifyReply) {
        try {
            const user = await this.userService.getUsers();
            return reply.status(201).send({ user })
        } catch (err) {
            if (err instanceof AppError) {
                return reply.status(err.statusCode).send({
                    message: err.message,
                    code: err.code,
                    details: err.details,
                });
            }

            console.error(err);
            return reply.status(500).send({
                message: 'Internal server error',
            });
        }
    }

    // async show(req, reply) {
    //     // busca usuário por id
    // }

    // async update(req, reply) {
    //     // atualiza usuário
    // }

    // async delete(req, reply) {
    //     // deleta usuário
    // }

    async login(req: FastifyRequest<{ Body: LoginInput }>, reply: FastifyReply) {
        const { username, password } = req.body

        try {
            const token = await this.userService.login(username, password, reply);

            reply.status(200).send({ token });
        } catch (err) {
            if (err instanceof AppError) {
                return reply.status(err.statusCode).send({
                    message: err.message,
                    code: err.code,
                    details: err.details,
                });
            }

            console.error(err);
            return reply.status(500).send({
                message: 'Internal server error',
            });
        }
    }
}