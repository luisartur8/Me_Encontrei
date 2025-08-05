import { User } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserInput, LoginInput } from "./authSchema";

// CONTROLLER
export interface IAuthController {
  register(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
  login(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
}

// SERVICE
export interface IAuthService {
  createUser(data: CreateUserInput): Promise<Omit<User, "password_hash">>;
  login(data: LoginInput, reply: FastifyReply): Promise<string>;
}