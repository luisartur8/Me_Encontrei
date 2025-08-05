import { Prisma, Role, User } from "@prisma/client";
import { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";

// CONTROLLER
export interface IUserController {
    index(_req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
    show(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
    update(req: FastifyRequest<UpdateUserRequest>, reply: FastifyReply): Promise<FastifyReply>;
    delete(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
}

export interface UpdateUserRequest extends RouteGenericInterface {
    Params: { id: string };
    Body: {
        username?: string;
        email?: string;
        password?: string;
        created_at?: Date;
        role?: Role;
    };
}

export type UpdateUserData = Partial<Omit<User, 'id' | 'password_hash'>> & {
    password?: string;
};

export type UpdateUserDataWithHash = Omit<UpdateUserData, 'password'> & { password_hash?: string };

export interface UserRole {
    role: 'ADMIN' | 'USER';
}

// SERVICE
export interface IUserService {
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