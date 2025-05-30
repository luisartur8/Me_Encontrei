import { Prisma, User } from "@prisma/client";
import { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";
import { CreateUserInput, LoginInput } from "./userSchema";

// CONTROLLER
export interface IUserController {
    index(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
    show(req: FastifyRequest<{ Params: { id: string } } & RouteGenericInterface>, reply: FastifyReply): Promise<FastifyReply>;
    store(req: FastifyRequest<{ Body: CreateUserInput }>, reply: FastifyReply): Promise<FastifyReply>;
    update(req: FastifyRequest<UpdateUserRequest>, reply: FastifyReply): Promise<FastifyReply>;
    delete(req: FastifyRequest<{ Params: { id: string } } & RouteGenericInterface>, reply: FastifyReply): Promise<FastifyReply>;
    login(req: FastifyRequest<{ Body: LoginInput }>, reply: FastifyReply): Promise<FastifyReply>;
}

export interface UpdateUserRequest extends RouteGenericInterface {
    Params: { id: string };
    Body: Partial<User>;
}

export interface UserRole {
  role: 'ADMIN' | 'USER';
}

// SERVICE
export interface IUserService {
    createUser(username: string, email: string, password: string): Promise<Omit<User, "password_hash">>;
    login(username: string, password: string, reply: FastifyReply): Promise<string>;
    findUserByUsername(username: string): Promise<User | null>;
    getUsers(): Promise<Omit<User, "password_hash">[]>;
    getUserById(id: string): Promise<Omit<User, "password_hash"> | null>;
    updateUserById(id: string, data: Partial<User>, isAdmin: boolean): Promise<Omit<User, "password_hash">>;
    deleteUserById(id: string): Promise<void>;
}

// REPOSITORY
export interface IUserRepository {
    create(data: Prisma.UserCreateInput): Promise<User>;
    findByUsername(username: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findUserById(id: string): Promise<User | null>;
    findAllUsers(): Promise<Omit<User, "password_hash">[]>;
    updateUserById(id: string, updateData: Partial<User>): Promise<User>;
    deleteUserById(id: string): Promise<void>;
}